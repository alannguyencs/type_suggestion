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

function updateSuggestions(suggestions) {
    currentSuggestions = suggestions;
    currentSelectionIndex = -1; // reset

    suggestionsList.innerHTML = "";
    suggestions.forEach((word, i) => {
        const item = document.createElement("li");
        item.textContent = word;

        // Handle clicks
        item.addEventListener("click", () => {
            inputField.value = word;
            suggestionsList.innerHTML = "";
            currentSuggestions = [];
            currentSelectionIndex = -1;
        });

        suggestionsList.appendChild(item);
    });
}

// Highlight the currently selected suggestion
function highlightSuggestion(index) {
    // Remove highlight from all <li>
    [...suggestionsList.querySelectorAll("li")].forEach((li, i) => {
        li.classList.toggle("selected", i === index);
    });
}

// Keydown listener for keyboard navigation
inputField.addEventListener("keydown", event => {
    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (currentSelectionIndex < currentSuggestions.length - 1) {
            currentSelectionIndex++;
            highlightSuggestion(currentSelectionIndex);
        }
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (currentSelectionIndex === -1) {
            // If no selection, jump to last suggestion
            currentSelectionIndex = currentSuggestions.length - 1;
        } else if (currentSelectionIndex > 0) {
            currentSelectionIndex--;
        }
        highlightSuggestion(currentSelectionIndex);
    } else if (event.key === "Enter") {
        if (currentSelectionIndex >= 0 &&
            currentSelectionIndex < currentSuggestions.length) {
            // User presses Enter on a highlighted suggestion
            const chosenWord = currentSuggestions[currentSelectionIndex];
            inputField.value = chosenWord;
            // Clear suggestions and reset selection
            suggestionsList.innerHTML = "";
            currentSuggestions = [];
            currentSelectionIndex = -1;
        }
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

inputField.addEventListener("input", function () {
    const text = inputField.value;
    socket.send(text);
}); 