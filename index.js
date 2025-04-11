import { review } from './JS/reviews.js';

let id = 0;
let currentQuizTopic = '';
let quizQuestions = [];
let currentQuestionIndex = 0;

// function updateReview() {
// 	id = Math.abs(id);
// 	if ((id + 1) % 2 === 0) {
// 		id = 1;
// 	} else {
// 		id = 2;
// 	}
// 	const curr_review = document.querySelector('.person-review');
// 	const curr_desc = document.querySelector('.feature-desc');
// 	const currentReview = review.find((r) => r.id === id);
// 	if (!currentReview) return;
// 	curr_review.innerHTML = `${currentReview.review}`;
// }

// function updateReviewRight() {
// 	id = Math.abs(id);
// 	if ((id+1) % 2 === 0) {
// 		id = 1;
// 	} else {
// 		id = 2;	
// 	}
// 	const curr_review = document.querySelector('.person-review');
// 	const curr_desc = document.querySelector('.feature-desc');
// 	const currentReview = review.find((r) => r.id === id);
// 	if (!currentReview) return;
// 	curr_review.innerHTML = `${currentReview.review}`;
// 	curr_desc.innerHTML = `${currentReview.desc}`;
// }

// function updateReviewLeft() {
// 	id = Math.abs(id);
// 	if ((id - 1) % 2 === 0) {
// 		id = 1;
// 	} else {
// 		id = 2;
// 	}
// 	const curr_review = document.querySelector('.person-review');
// 	const curr_desc = document.querySelector('.feature-desc');
// 	const currentReview = review.find((r) => r.id === id);
// 	if (!currentReview) return;
// 	curr_review.innerHTML = `${currentReview.review}`;
// 	curr_desc.innerHTML = `${currentReview.desc}`;
// }

// const leftShift = document.querySelector('.left-arrow');

// // leftShift.addEventListener('click', () => {
// // 	updateReviewLeft();
// // 	clearInterval(Intervalid);
// // 	autoChangeReview();
// // })

// const rightShift = document.querySelector('.right-arrow');

// // rightShift.addEventListener('click', () => {
// // 	updateReviewRight();
// // 	clearInterval(Intervalid);
// // 	autoChangeReview();
// // })

// let Intervalid;




// Event listener to trigger AI tutor when button is clicked
document.querySelector('.line-hover').addEventListener('mouseenter', () => {
	const element = document.querySelector('.lines-1');
	element.classList.remove('light');
	element.classList.add('dark');
	const element1 = document.querySelector('.lines-2');
	element1.classList.remove('light');
	element1.classList.add('dark');
	const circle = document.querySelector('.circle');
	circle.classList.remove('light-circle');
	circle.classList.add('dark-circle');
});
document.querySelector('.line-hover').addEventListener('mouseleave', () => {
	const element = document.querySelector('.lines-1');
	element.classList.add('light');
	element.classList.remove('dark');
	const element1 = document.querySelector('.lines-2');
	element1.classList.add('light');
	element1.classList.remove('dark');
	const circle = document.querySelector('.circle');
	circle.classList.add('light-circle');
    circle.classList.remove('dark-circle');
    
});
document.querySelector('.line-hover-2').addEventListener('mouseenter', () => {
	const element = document.querySelector('.lines-3');
	element.classList.remove('light');
	element.classList.add('dark');
	const element1 = document.querySelector('.lines-4');
	element1.classList.remove('light');
	element1.classList.add('dark');
	const circle = document.querySelector('.circle-1');
	circle.classList.remove('light-circle');
	circle.classList.add('dark-circle');
});
document.querySelector('.line-hover-2').addEventListener('mouseleave', () => {
	const element = document.querySelector('.lines-3');
	element.classList.add('light');
	element.classList.remove('dark');
	const element1 = document.querySelector('.lines-4');
	element1.classList.add('light');
	element1.classList.remove('dark');
	const circle = document.querySelector('.circle-1');
	circle.classList.add('light-circle');
	circle.classList.remove('dark-circle');
});
document.querySelector('.line-hover-3').addEventListener('mouseenter', () => {
	const element = document.querySelector('.lines-5');
	element.classList.remove('light');
	element.classList.add('dark');
	const element1 = document.querySelector('.lines-6');
	element1.classList.remove('light');
	element1.classList.add('dark');
	const circle = document.querySelector('.circle-2');
	circle.classList.remove('light-circle');
	circle.classList.add('dark-circle');
});
document.querySelector('.line-hover-3').addEventListener('mouseleave', () => {
	const element = document.querySelector('.lines-5');
	element.classList.add('light');
	element.classList.remove('dark');
	const element1 = document.querySelector('.lines-6');
	element1.classList.add('light');
	element1.classList.remove('dark');
	const circle = document.querySelector('.circle-2');
	circle.classList.add('light-circle');
	circle.classList.remove('dark-circle');
});
// document.getElementById('generate-tutor').addEventListener('click', aiTutor);
const apiKey = 'AIzaSyAgpU5TcQv5lOmI_U_wXlOryGxH5v9swDI'; // Replace this with your Gemini API key
const youtubeApiKey = 'AIzaSyC-cfIjxZZhpwSCU5CaXsuwPRlxgj0dCxE'; // Replace with your YouTube API key
// Function to call Gemini API and get content based on the prompt
async function getAIResponse(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }],
                    },
                ],
            }),
        });

        if (response.status === 429) {
            console.log("Rate limit hit. Retrying...");
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
            return getAIResponse(prompt); // Retry the request
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';

    } catch (error) {
        console.error('Error generating content:', error);
        return 'Error generating content. Please try again.';
    }
}

// Function to process the input and map abbreviations to full forms (e.g., AIML -> Artificial Intelligence and Machine Learning)
function processInput(input) {
    const inputLower = input.toLowerCase();
    
    // Check if input matches an abbreviation and return the full form
    const abbreviationMap = {
        'AIML': 'Artificial Intelligence and Machine Learning',
        'AI': 'Artificial Intelligence',
        'ML': 'Machine Learning',
        'DL': 'Deep Learning',
        'NLP': 'Natural Language Processing',
    };
    
    for (const abbreviation in abbreviationMap) {
        if (inputLower.includes(abbreviation.toLowerCase())) {
            return abbreviationMap[abbreviation];
        }
    }

    // If no abbreviation found, return the input as is
    return input;
}

// Function to detect and process the type of input (learning roadmap, question, quiz)
function detectInputType(input) {return 'quiz';}

// Function to fetch multiple quiz questions
async function getQuizQuestions() {
    const aiResponse = await getAIResponse(`
        You are an AI tutor. Provide multiple multiple-choice questions for the topic "${currentQuizTopic}".
        Provide at least 5 questions, each with four options labeled A-D, and the correct answer.
        Respond ONLY with raw JSON (no markdown or code formatting). DO NOT include triple backticks or \`\\\`json. Like:
        {
            "questions": [
                {
                    "question": "Question 1 text?",
                    "options": {
                        "A": "Option A",
                        "B": "Option B",
                        "C": "Option C",
                        "D": "Option D"
                    },
                    "answer": "A"
                },
                ...
            ]
        }
    `);
    const parsedResponse = JSON.parse(aiResponse);
    quizQuestions = parsedResponse.questions || [];
    currentQuestionIndex = 0;
    handleQuizResponse(quizQuestions[currentQuestionIndex]);
}

// Main function to handle AI tutor functionality
async function aiTutor() {
    let prompt = document.getElementById('prompt').value; // Get the user input from a text field

    // Process input to map abbreviations to full forms (e.g., AIML -> Artificial Intelligence and Machine Learning)
    prompt = processInput(prompt);
    currentQuizTopic = prompt;

    // Fetch multiple quiz questions
    getQuizQuestions();
}

function handleQuizResponse(quiz) {
    const quizContainer = document.getElementById('response');

    // Clear any existing content before updating with the new question and options
    quizContainer.innerHTML = `
        <div class="quiz-question">${quiz.question}</div>
        <div class="quiz-options">
            <label><input type="radio" name="quiz-option" value="A" class="option-a" /> ${quiz.options.A}</label><br>
            <label><input type="radio" name="quiz-option" value="B" class="option-b" /> ${quiz.options.B}</label><br>
            <label><input type="radio" name="quiz-option" value="C" class="option-c" /> ${quiz.options.C}</label><br>
            <label><input type="radio" name="quiz-option" value="D" class="option-d" /> ${quiz.options.D}</label><br>
        </div>
        <button id="next-question">Next</button>
        <div id="quiz-feedback"></div>
    `;

    document.getElementById('next-question').addEventListener(
        'click',
        () => {
            const selected = document.querySelector(
                'input[name="quiz-option"]:checked'
            );
            const feedback = document.getElementById('quiz-feedback');
            if (!selected) {
                feedback.innerText = 'Please select an option.';
                return;
            }

            if (selected.value === quiz.answer) {
                feedback.innerText = 'Correct!';
                // Move to the next question if answer is correct
                setTimeout(() => {
                    currentQuestionIndex++;
                    if (currentQuestionIndex < quizQuestions.length) {
                        handleQuizResponse(quizQuestions[currentQuestionIndex]);
                    } else {
                        feedback.innerText = 'You have completed all the questions!';
                    }
                }, 2000);
            } else {
                feedback.innerText = `Incorrect. The correct answer is ${quiz.answer}`;
            }
        }
    );
}
