const inputValue = JSON.parse(localStorage.getItem('inputItem')) || 'NULL';
if (inputValue) {
    console.log(inputValue);
}

const apiKey = 'AIzaSyAgpU5TcQv5lOmI_U_wXlOryGxH5v9swDI'; // Replace this with your Gemini API key
const youtubeApiKey = 'AIzaSyDR4WRVN9Rv0p6oMpNCQ7NfYPvAcPuxDFs'; // Replace with your YouTube API key

// Function to format AI response for better readability
function formatAIResponse(response) {
    // Bold text properly using <strong> for **text**
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // This will convert **bold text** into <strong>bold text</strong>

    // Add structure for phases and learning roadmap
    response = response.replace(/Phase (\d+):/g, '<h3>$1:</h3>'); // Converts Phase X into a heading

    // Properly format numbered lists, keeping numbers in front of text
    response = response.replace(/(\d+\.)\s+([^\n]+)/g, '<p><strong>$1</strong> $2</p>'); // This will place the number in front of the text without breaking it onto a new line

    // Properly handle ordered lists (1., 2., 3., etc.) with <ol> and <li>
    response = response.replace(/(\d+\.)\s/g, '<ol><li>').replace(/\n/g, '</li></ol>'); // Replace number list and add <ol> tags

    // Replace bullet points with <ul> and <li>
    response = response.replace(/- /g, '<ul><li>').replace(/\n/g, '</li></ul>'); // Convert each line starting with "-" to list items

    return response;
}

// Function to format and generate roadmap (flowchart style)
function generateRoadmap(response) {
    let roadmapHTML = '';

    // Split the response into phases and steps
    const phases = response.split('Phase');
    phases.shift(); // Remove the first empty element from the split result

    // Loop through each phase and create minimal text for flowchart
    phases.forEach((phase, index) => {
        const phaseNumber = phase.match(/\d+/)[0]; // Extract phase number
        const phaseName = `Phase ${phaseNumber}`;
        const phaseContent = phase.replace(phaseNumber, '').trim(); // Remove phase number from content

        // Limit the number of steps by selecting only the first 2 steps or truncating text
        const steps = phaseContent.split('\n').filter(line => line.trim() !== ''); // Split steps by new lines
        const limitedSteps = steps.slice(0, 2); // Show only the first 2 steps

        roadmapHTML += `
            <div class="phase">
                <div class="phase-name">${phaseName}</div>
                <div class="steps">${generateLimitedSteps(limitedSteps)}</div>
            </div>
            ${index < phases.length - 1 ? '<div class="arrow">➡</div>' : ''}
        `;
    });

    return roadmapHTML;
}

// Function to generate limited steps within each phase
function generateLimitedSteps(steps) {
    let stepsHTML = '';
    steps.forEach(step => {
        stepsHTML += `<div class="step">${step.trim()}</div>`;
    });

    return stepsHTML;
}

// Function to generate steps within each phase
function generateSteps(content) {
    let stepsHTML = '';
    const steps = content.split('\n').filter(line => line.trim() !== ''); // Split steps by new lines

    steps.forEach(step => {
        stepsHTML += `<div class="step">${step.trim()}</div>`;
    });

    return stepsHTML;
}

// Function to call Gemini API and get content based on the prompt
document.getElementById('sendInput').addEventListener('click', async () => {
    const inputField = document.querySelector('.userInput');
    const inputValue = inputField.value; // Get the input value

    if (inputValue.trim() !== '') {
        await aiTutor(); // Call the aiTutor function to process the input
        inputField.value = ''; // Clear the input field
    }
});

// Add event listener for Enter key to send input
document.querySelector('.userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('sendInput').click(); // Trigger the send button click
        document.querySelector('.userInput').value = ''; // Clear the input field after sending
    }
});

// Function to generate the roadmap and insert content into the #roadmapOutput div
async function aiTutor() {
    let prompt = document.getElementById('prompt').value; // Get the user input from a text field

    // Process input to map abbreviations to full forms (e.g., AIML -> Artificial Intelligence and Machine Learning)
    prompt = processInput(prompt);

    // Determine the type of input (roadmap or question)
    const inputType = detectInputType(prompt);
    let aiResponse = '';
    let videoRecommendations = [];

    // Based on detected input type, generate appropriate prompt for Gemini
    if (inputType === 'roadmap') {
        aiResponse = await getAIResponse(`
            You're a friendly and knowledgeable tutor. For the topic "${prompt}", please provide:
            1. A well-structured and easy-to-follow learning roadmap.
            2. A brief and engaging summary anyone can understand.
        `);

        // Log the response to ensure it's populated
        console.log("AI Response for Roadmap:", aiResponse);

        // Generate roadmap content separately
        const roadmapOutput = document.getElementById('roadmapOutput');

        // Check if AI response contains expected "Phase" structure
        if (aiResponse.includes('Phase')) {
            const roadmapContent = generateRoadmap(aiResponse);
            roadmapOutput.innerHTML = roadmapContent;
            console.log("Generated Roadmap HTML:", roadmapContent);
        } else {
            roadmapOutput.innerHTML = 'Roadmap format not recognized. Please try a different prompt.';
            console.warn("AI Response missing 'Phase' keyword:", aiResponse);
        }
    } else if (inputType === 'question') {
        aiResponse = await getAIResponse(`
            You're a helpful tutor who explains things in a simple, clear, and friendly way. Answer this question:
            "${prompt}"
            Feel free to use analogies or short examples if it helps make the answer more human and relatable."
        `);
    }

    // Format the AI response for better readability
    aiResponse = formatAIResponse(aiResponse);

    // Fetch YouTube videos related to the topic
    videoRecommendations = await fetchYouTubeVideos(prompt);

    // Display the response from Gemini in the text field
    const textOutput = document.getElementById('textOutput');
    textOutput.innerHTML = aiResponse;

    // Display video thumbnails in the image field
    const imageOutput = document.getElementById('imageOutput');
    if (videoRecommendations.length > 0) {
        let imagesHTML = '';
        videoRecommendations.forEach((video) => {
            imagesHTML += `
            <a href="${video.url}" target="_blank">
                <img src="${video.thumbnail}" alt="${video.title}" style="width: 240px; height: 180px; margin-right: 10px;" />
            </a>
            `;
        });
        imageOutput.innerHTML = imagesHTML;
    } else {
        imageOutput.innerHTML = 'No video recommendations found for this topic.';
    }
}

async function getAIResponse(prompt) {
	try {
		const output = await fetch(
			`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					contents: [
						{
							parts: [
								{
									text: prompt,
								},
							],
						},
					],
				}),
			}
		);

		const data = await output.json();
		console.log("Raw Gemini response:", data);

		return (
			data.candidates?.[0]?.content?.parts?.[0]?.text ||
			'No response from Gemini.'
		);
	} catch (error) {
		console.error('Error generating content:', error);
		return 'Error generating content. Please try again.';
	}
}

// Function to fetch YouTube videos related to a given topic with thumbnails
async function fetchYouTubeVideos(topic) {
	try {
		const output = await fetch(
			`https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&q=${topic}&part=snippet&type=video&maxResults=3` // Set maxResults to 3
		);
		const data = await output.json();

		return data.items.map((item) => ({
			title: item.snippet.title,
			url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
			thumbnail: item.snippet.thumbnails.medium.url, // Fetching the medium thumbnail
		}));
	} catch (error) {
		console.error('Error fetching YouTube videos:', error);
		return [];
	}
}

// Function to process the input and map abbreviations to full forms (e.g., AIML -> Artificial Intelligence and Machine Learning)
function processInput(input) {
	const inputLower = input.toLowerCase();

	// Check if input matches an abbreviation and return the full form
	const abbreviationMap = {
		AIML: 'Artificial Intelligence and Machine Learning',
		AI: 'Artificial Intelligence',
		ML: 'Machine Learning',
		DL: 'Deep Learning',
		NLP: 'Natural Language Processing',
	};

	for (const abbreviation in abbreviationMap) {
		if (inputLower.includes(abbreviation.toLowerCase())) {
			return abbreviationMap[abbreviation];
		}
	}

	// If no abbreviation found, return the input as is
	return input;
}

// Function to detect and process the type of input (learning roadmap, question)
function detectInputType(input) {
	const roadmapKeywords = ['roadmap', 'learn', 'learning', 'study'];
	const questionKeywords = ['what', 'how', 'why', 'explain'];

	// Check for roadmap request
	if (
		roadmapKeywords.some((keyword) =>
			input.toLowerCase().includes(keyword)
		)
	) {
		return 'roadmap';
	}

	// Check for question
	if (
		questionKeywords.some((keyword) =>
			input.toLowerCase().includes(keyword)
		)
	) {
		return 'question';
	}

	// Default to roadmap if no specific keywords match
	return 'roadmap';
}
