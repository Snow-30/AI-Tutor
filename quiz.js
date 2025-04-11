let quizQuestions = [];
let currentQuestionIndex = 0;
let currentQuizTopic = '';

document.getElementById('generate-tutor').addEventListener('click', aiTutor);

const apiKey = ''; // Replace with your Gemini API key

async function getAIResponse(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (response.status === 429) {
            console.log("Rate limit hit. Retrying...");
            await new Promise(resolve => setTimeout(resolve, 5000));
            return getAIResponse(prompt); // Retry
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    } catch (error) {
        console.error('Error generating content:', error);
        return 'Error generating content. Please try again.';
    }
}

function processInput(input) {
    const map = {
        'AIML': 'Artificial Intelligence and Machine Learning',
        'AI': 'Artificial Intelligence',
        'ML': 'Machine Learning',
        'DL': 'Deep Learning',
        'NLP': 'Natural Language Processing',
    };
    for (const abbr in map) {
        if (input.toUpperCase().includes(abbr)) return map[abbr];
    }
    return input;
}

async function getQuizQuestions() {
    const aiResponse = await getAIResponse(`
        You are an AI tutor. Provide 5 multiple-choice questions for the topic "${currentQuizTopic}".
        Return ONLY pure JSON. No markdown. No \`\`\`. Format:
        {
            "questions": [
                {
                    "question": "What is ...?",
                    "options": {
                        "A": "Option A",
                        "B": "Option B",
                        "C": "Option C",
                        "D": "Option D"
                    },
                    "answer": "A"
                }
            ]
        }
    `);

    try {
        const cleaned = aiResponse.replace(/```json|```/g, '').trim();
        console.log("Cleaned response:", cleaned);
        const parsedResponse = JSON.parse(cleaned);
        quizQuestions = parsedResponse.questions || [];
        currentQuestionIndex = 0;
        handleQuizResponse(quizQuestions[currentQuestionIndex]);
    } catch (e) {
        document.getElementById('response').innerText = "⚠️ Error parsing AI response. Try again.";
        console.error("Failed to parse response: ", aiResponse);
    }
}

async function aiTutor() {
    let prompt = document.getElementById('prompt').value;
    prompt = processInput(prompt);
    currentQuizTopic = prompt;

    document.getElementById('response').innerText = "⏳ Generating quiz...";
    await getQuizQuestions();
}

function handleQuizResponse(quiz) {
    const quizContainer = document.getElementById('response');

    quizContainer.innerHTML = `
        <div class="quiz-question">${quiz.question}</div>
        <div class="quiz-options">
            <label><input type="radio" name="quiz-option" class="opt" value="A" /> A: ${quiz.options.A}</label><br>
            <label><input type="radio" name="quiz-option" class="opt" value="B" /> B: ${quiz.options.B}</label><br>
            <label><input type="radio" name="quiz-option" class="opt" value="C" /> C: ${quiz.options.C}</label><br>
            <label><input type="radio" name="quiz-option" class="opt" value="D" /> D: ${quiz.options.D}</label><br>
        </div>
        <button id="next-question">Next</button>
        <div class="quiz-completion">
            <div id="quiz-feedback" style="margin-top: 10px; font-weight: bold;"></div>
            <div class="certificate-download" id="certificate"></div>
        </div>
    `;
    document.querySelectorAll(".opt");
    document.getElementById('next-question').addEventListener('click', () => {
        const selected = document.querySelector('input[name="quiz-option"]:checked');
        const feedback = document.getElementById('quiz-feedback');
        const certificate = document.getElementById('certificate');
        if (!selected) {
            feedback.innerText = 'Please select an option.';
            return;
        }

        if (selected.value === quiz.answer) {
            feedback.innerText = '✅ Correct!';
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < quizQuestions.length) {
                    handleQuizResponse(quizQuestions[currentQuestionIndex]);
                } else {
                    feedback.innerText = '🎉 You completed the quiz!';
                    certificate.innerHTML = '<button>Claim your certificate</button>';
                }
            }, 1500);
        } else {
            feedback.innerText = `❌ Incorrect. The correct answer is ${quiz.answer}`;
        }
    });
    // const url = './certificate.jpeg';
    // const filename = 'Snow-certificate.pdf';
    document.querySelector('.certificate-download').addEventListener('click', () => {
        function downloadFile(url, filename) {
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	// Example usage:
	downloadFile('https://ibb.co/GQzn3jxy', 'Snow-certificate.pdf');
    })
}
