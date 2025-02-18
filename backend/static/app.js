const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const webSocketUrl = protocol + window.location.host + "/ws";
const socket = new WebSocket(webSocketUrl);

const inputField = document.getElementById("messageInput");
const suggestionsList = document.getElementById("suggestions");

// Track current selection state
let currentSelectionIndex = -1;
let currentSuggestions = [];

socket.onopen = function () {
    console.log("WebSocket connection established");
};

// Replace only the last word in the input field with the chosen word,
// appending a trailing space so the word is considered complete.
function updateInputField(chosenWord) {
    const text = inputField.value;
    const lastSpace = text.lastIndexOf(" ");
    let newText = "";
    if (lastSpace === -1) {
        newText = chosenWord + " ";
    } else {
        newText = text.substring(0, lastSpace + 1) + chosenWord + " ";
    }
    inputField.value = newText;
}

// Update suggestions list, only showing full words that extend the current
// prefix.
function updateSuggestions(suggestions) {
    const text = inputField.value;
    const words = text.split(/\s+/);
    const prefix = words[words.length - 1];

    if (prefix === "") {
        suggestionsList.innerHTML = "";
        currentSuggestions = [];
        currentSelectionIndex = -1;
        return;
    }

    const filtered = suggestions.filter(
        (word) => word.length > prefix.length
    );

    currentSuggestions = filtered;
    currentSelectionIndex = -1;

    suggestionsList.innerHTML = "";
    filtered.forEach((word) => {
        const item = document.createElement("li");
        item.textContent = word;
        item.addEventListener("click", () => {
            updateInputField(word);
            suggestionsList.innerHTML = "";
            currentSuggestions = [];
            currentSelectionIndex = -1;
        });
        suggestionsList.appendChild(item);
    });
}

// Highlight the currently selected suggestion.
function highlightSuggestion(index) {
    [...suggestionsList.querySelectorAll("li")].forEach((li, i) => {
        li.classList.toggle("selected", i === index);
    });
}

// Keydown listener for keyboard navigation.
inputField.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (currentSelectionIndex < currentSuggestions.length - 1) {
            currentSelectionIndex++;
            highlightSuggestion(currentSelectionIndex);
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (currentSelectionIndex === -1) {
            currentSelectionIndex = currentSuggestions.length - 1;
        } else if (currentSelectionIndex > 0) {
            currentSelectionIndex--;
        }
        highlightSuggestion(currentSelectionIndex);
    } else if (event.key === "Enter") {
        if (
            currentSelectionIndex >= 0 &&
            currentSelectionIndex < currentSuggestions.length
        ) {
            const chosenWord = currentSuggestions[currentSelectionIndex];
            updateInputField(chosenWord);
            suggestionsList.innerHTML = "";
            currentSuggestions = [];
            currentSelectionIndex = -1;
            event.preventDefault();
        }
    }
});

// When the input field changes, send the full content to the server.
inputField.addEventListener("input", function () {
    const text = inputField.value;
    if (text.length > 0) {
        socket.send(text);
    } else {
        suggestionsList.innerHTML = "";
        currentSuggestions = [];
        currentSelectionIndex = -1;
    }
});

socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const suggestions = data.suggestions || [];
    updateSuggestions(suggestions);
};

socket.onclose = function () {
    console.log("WebSocket connection closed");
}; 
