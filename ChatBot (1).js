function formatAIResponse(response) {
    // Convert Phase headings
    response = response.replace(/Phase (\d+):/g, '<h3>Phase $1:</h3>');

    // Convert **bold** to <strong>
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert _italic_ to <em>
    response = response.replace(/_(.*?)_/g, '<em>$1</em>');

    // Convert bullet points
    response = response.replace(/(^|\n)- (.*?)(?=\n|$)/g, '$1<ul><li>$2</li></ul>');

    // Convert ordered lists
    response = response.replace(/(^|\n)\d+\.\s(.*?)(?=\n|$)/g, '$1<ol><li>$2</li></ol>');

    // Convert line breaks to <br> for visual spacing
    response = response.replace(/\n/g, '<br>');

    return response;
}

window.addEventListener("DOMContentLoaded", () => {
    const sendInput = document.getElementById("sendInput");
    sendInput.addEventListener("click", async () => {
        const userPrompt = document.getElementById("prompt").value;
        const apiKey = 'AIzaSyAgpU5TcQv5lOmI_U_wXlOryGxH5v9swDI';

        try {
            const response = await fetch(
                'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=' + apiKey,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: userPrompt }] }]
                    })
                }
            );

            const data = await response.json();
            const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
            aiTutor(aiText);
        } catch (error) {
            console.error("API call failed:", error);
            aiTutor("Something went wrong. Please try again later.");
        }
    });
});

function aiTutor(response) {
    const outputBox = document.getElementById("textOutput");
    if (!outputBox) {
        console.error("textOutput element not found.");
        return;
    }
    outputBox.innerHTML = formatAIResponse(response);
}
