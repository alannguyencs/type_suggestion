# Word Suggestion Chat Application

This project is a real-time word suggestion application that offers word completions
as the user types. It combines a global dictionary of words with personalized
keywords learned from user input, to generate relevant suggestions on the fly.
By leveraging WebSocket connections, suggestions are delivered instantly, while the
application personalizes the suggestions over time as the user continues to type.

## Key Features

- **Real-Time Suggestions:** Uses WebSocket to deliver word suggestions as users type.
- **Personalized Dictionary:** Completes full words are added to a personal dictionary,
  which is then used along with a global dictionary for future suggestions.
- **Global and Personalized Data Sources:** Merges a static global list of words with user-
  specific keywords to provide refined suggestions.
- **Interactive Client Experience:** The front-end (built using JavaScript) updates the UI
  dynamically, allowing keyboard navigation and mouse clicks to select suggestions.

## Key Techniques

- **FastAPI & Uvicorn:** The backend is built with FastAPI. Uvicorn is used as the ASGI
  server to run the application in development mode with autoreload.
- **Asynchronous Communication:** The project utilizes Python's `async`/`await` syntax to
  enable asynchronous WebSocket communication.
- **WebSocket Protocol:** Implements bi-directional communication between the client and the
  server, ensuring low latency for real-time suggestions.
- **Personalization Logic:** Processes entire input messages to detect fully typed words,
  which are then added to a personalized dictionary, ensuring improved suggestions
  over time.
- **Client-Side DOM Manipulation:** JavaScript handles the creation, updating, and
  selection of suggestion elements in the DOM.

## Project Structure

```
backend/
├── main.py # FastAPI backend server and WebSocket endpoint
├── personalization.py # Handling user-specific keyword extraction and storage
├── suggestions.py # Generating word suggestions from global and personal dictionaries
├── templates/
│ └── index.html # Main HTML page for the application
└── static/
├── app.js # Client-side JavaScript for WebSocket communication and UI updates
└── style.css # Styling for the application
```

## How to Run

1. **Clone the Repository:**

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Setup a Virtual Environment:**

   Make sure you have Python 3.10 or higher installed.

   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies:**

   Install the required packages. For example, you can use pip to install
   FastAPI and Uvicorn:

   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application:**

   Start the server using Uvicorn:

   ```bash
   uvicorn backend.main:app --reload
   ```

   The application will be running at [http://localhost:8000](http://localhost:8000).

5. **Open in Browser:**

   Navigate to [http://localhost:8000](http://localhost:8000) in your web browser
   to start using the application.

## Usage

- **Typing & Suggestions:** Start typing words in the input field. Suggestions based on
  a global dictionary and your personalized keywords will appear dynamically.
- **Selecting Suggestions:** Use the arrow keys to navigate through the suggestions and
  hit Enter to select one, or simply click on a suggestion. When a suggestion is selected,
  it is appended with a trailing space and added to your personal dictionary.
- **Real-Time Updates:** As you complete words (indicated by a trailing space), they are
  detected and stored, refining future suggestions.

## License

This project is available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/) for the backend.
- Real-time communication powered by WebSocket.
- Client-side interactions handled using plain JavaScript.
