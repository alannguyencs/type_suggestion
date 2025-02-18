"""
FastAPI backend server for word suggestion application.

This module implements a web server that provides real-time word suggestions
as users type. It combines a global dictionary of words with personalized
keywords learned from user input. The suggestions are delivered via WebSocket
connections, enabling instant feedback.
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request


from backend.suggestions import get_suggestions, WORDS_DICTIONARY
from backend.personalization import (
    detect_new_keywords,
    add_personal_keywords,
    get_personal_keywords,
)


app = FastAPI()

# Mount static files
app.mount("/static", StaticFiles(directory="backend/static"), name="static")
templates = Jinja2Templates(directory="backend/templates")


@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """Render and return the main application page."""
    return templates.TemplateResponse("index.html", {"request": request})


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """Handle WebSocket connections and provide real-time word suggestions.
    
    The full input text is received so that completed words can be detected for
    personalization. Meanwhile, suggestions are based on only the last token.
    """
    await websocket.accept()
    try:
        while True:
            # Receive the full text from the client.
            message = await websocket.receive_text()

            # Update personal keywords by checking for fully-typed words.
            new_words = detect_new_keywords(message)
            if new_words:
                add_personal_keywords(new_words)

            # Determine the current prefix:
            # If the message ends with a space, the user has finished a word.
            # Otherwise, use the last token as the prefix.
            tokens = message.split()
            prefix = tokens[-1] if tokens and not message.endswith(" ") else ""

            # Gather all words: global dictionary plus personal keywords.
            all_words = set(WORDS_DICTIONARY) | set(get_personal_keywords())

            # Get suggestions based on the current prefix.
            suggestions = get_suggestions(prefix=prefix, words_list=list(all_words))

            # Send suggestions back to the client.
            await websocket.send_json({"suggestions": suggestions})
    except WebSocketDisconnect:
        print("Client disconnected")
