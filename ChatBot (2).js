const apiKey = 'AIzaSyAgpU5TcQv5lOmI_U_wXlOryGxH5v9swDI'; // Gemini API Key

async function aiTutor() {
    const inputField = document.getElementById('prompt');
    const textOutput = document.getElementById('textOutput');
    const imageOutput = document.getElementById('imageOutput');

    let topic = inputField.value.trim();
    topic = processInput(topic);

    const prompt = `You're a helpful study assistant. Create detailed, well-structured, and easy-to-revise notes about the topic: "${topic}". Use bullet points, headings, and simple language.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                }),
            }
        );

        const data = await response.json();
        const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No notes generated.";

        textOutput.innerHTML = formatAIResponse(aiText);

        const videos = await fetchYouTubeVideos(topic);
        if (videos.length > 0) {
            let videoHTML = '';
            videos.forEach(video => {
                videoHTML += `
                    <a href="${video.url}" target="_blank">
                        <img src="${video.thumbnail}" alt="${video.title}" style="width: 240px; height: 180px; margin-right: 10px;" />
                    </a>
                `;
            });
            imageOutput.innerHTML = videoHTML;
        } else {
            imageOutput.innerHTML = 'No video recommendations found.';
        }

    } catch (error) {
        console.error("API call failed:", error);
        textOutput.innerHTML = "Something went wrong. Please try again later.";
    }
}

function formatAIResponse(response) {
    return response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

function processInput(input) {
    const map = {
        AIML: 'Artificial Intelligence and Machine Learning',
        AI: 'Artificial Intelligence',
        ML: 'Machine Learning',
        DL: 'Deep Learning',
        NLP: 'Natural Language Processing',
    };

    for (const key in map) {
        if (input.toUpperCase().includes(key)) {
            return map[key];
        }
    }

    return input;
}

document.getElementById('sendInput').addEventListener('click', aiTutor);
