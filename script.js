function checkInput() {
    const input = document.getElementById("searchBox").value.toLowerCase().trim();

    // Hide all sections first
    document.getElementById("ai-notes").style.display = "none";
    document.getElementById("ds-notes").style.display = "none";
    document.getElementById("ml-notes").style.display = "none";

    // Show only the matching section
    if (input === "ai" || input === "artificial intelligence") {
        document.getElementById("ai-notes").style.display = "block";
    } else if (input === "data science") {
        document.getElementById("ds-notes").style.display = "block";
    } else if (input === "machine learning") {
        document.getElementById("ml-notes").style.display = "block";
    } else {
        alert("Keyword not recognized. Try 'ai', 'data science', or 'machine learning'.");
    }
}
document.querySelector('.button').addEventListener('keyup', (event) => {
    if (event.key === "Enter") {
        const input = document
		.getElementById('searchBox')
		.value.toLowerCase()
		.trim();

	// Hide all sections first
	document.getElementById('ai-notes').style.display = 'none';
	document.getElementById('ds-notes').style.display = 'none';
	document.getElementById('ml-notes').style.display = 'none';

	// Show only the matching section
	if (input === 'ai' || input === 'artificial intelligence') {
		document.getElementById('ai-notes').style.display = 'block';
	} else if (input === 'data science') {
		document.getElementById('ds-notes').style.display = 'block';
	} else if (input === 'machine learning') {
		document.getElementById('ml-notes').style.display = 'block';
	} else {
		alert(
			"Keyword not recognized. Try 'ai', 'data science', or 'machine learning'."
		);
	}
    }
})