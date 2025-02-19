/* 
 * Create the proper protocol for WebSocket connection. Use 'wss://' 
 * if served over HTTPS, else use 'ws://'.
 */
const isSecure =
    window.location.protocol === "https:"; // Check if connection is secure
const protocol = isSecure ? "wss://" : "ws://";

/*
 * Construct the full WebSocket URL with the chosen protocol, the
 * current host, and the "/ws" endpoint on the server.
 */
const webSocketUrl =
    protocol + window.location.host + "/ws";

/*
 * Initialize a new WebSocket instance. This object sets up a 
 * two-way communication channel with the server.
 */
const socket = new WebSocket(webSocketUrl);

/* 
 * Get references to the Document Object Model (DOM) elements.
 * It represents the page so that programs can change the document structure, style, and content.
 * These nodes are used for input and displaying suggestions.
 */
const inputField = document.getElementById("messageInput");
const suggestionsList =
    document.getElementById("suggestions");

/*
 * These variables track the state of current suggestions and
 * the selected suggestion index, aiding in UI updates.
 */
let currentSelectionIndex = -1;
let currentSuggestions = [];

/*
 * Set the WebSocket 'onopen' event handler.
 * This function triggers when the WebSocket connection is open.
 */
socket.onopen = function () {
    console.log("WebSocket connection established");
};

/*
 * Update the input field by replacing only the last word with the
 * chosen suggestion. Although this function is a UI helper, it is
 * triggered by suggestions received via WebSocket.
 */
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

/*
 * Update the suggestions list based on the server response.
 * The server sends a list of suggestions over the WebSocket, and this
 * function filters and displays only those words that extend the 
 * current prefix entered by the user.
 */
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

    const filtered = suggestions.filter((word) =>
        word.length > prefix.length);
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

/*
 * Highlight the currently selected suggestion.
 * This UI helper function visually marks a suggestion, which
 * improves keyboard navigation in the suggestions list.
 */
function highlightSuggestion(index) {
    [...suggestionsList.querySelectorAll("li")].forEach((li, i) => {
        li.classList.toggle("selected", i === index);
    });
}

/*
 * Listen for keydown events on the input field.
 * This section handles keyboard navigation (using arrow keys)
 * and selection (via Enter) in the suggestions list.
 */
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
            const chosenWord =
                currentSuggestions[currentSelectionIndex];
            updateInputField(chosenWord);
            suggestionsList.innerHTML = "";
            currentSuggestions = [];
            currentSelectionIndex = -1;
            event.preventDefault();
        }
    }
});

/*
 * Listen for any input changes in the input field.
 * When the user types, the current text is sent to the server over
 * the WebSocket connection using socket.send. This sends the
 * complete text to get back updated suggestions in real time.
 */
inputField.addEventListener("input", function () {
    const text = inputField.value;
    if (text.length > 0) {
        socket.send(text); // Send current text to server via WebSocket
    } else {
        suggestionsList.innerHTML = "";
        currentSuggestions = [];
        currentSelectionIndex = -1;
    }
});

/*
 * Set the WebSocket 'onmessage' event handler.
 * This function is triggered when the server sends a message
 * (typically a list of suggestions in JSON format). The data is
 * parsed and used to update the suggestions list.
 */
socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    const suggestions = data.suggestions || [];
    updateSuggestions(suggestions);
};

/*
 * Set the WebSocket 'onclose' event handler.
 * This function is executed when the WebSocket connection 
 * is closed, either intentionally or due to network issues.
 */
socket.onclose = function () {
    console.log("WebSocket connection closed");
}; 
