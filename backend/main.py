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
    """Handle WebSocket connections and provide real-time word suggestions."""
    await websocket.accept()
    try:
        while True:
            # 1. Receive user input from the WebSocket
            message = await websocket.receive_text()
            
            # 2. Detect & store any newly mentioned personalized keywords
            new_words = detect_new_keywords(message)
            if new_words:
                add_personal_keywords(new_words)
            
            # 3. Gather all words: global dictionary + personal keywords
            all_words = set(WORDS_DICTIONARY) | set(get_personal_keywords())

            # 4. Get suggestions for the typed prefix
            #    (Here, we interpret the "message" itself as a prefix. 
            #     If you want a different logic, adjust accordingly.)
            suggestions = get_suggestions(
                prefix=message,
                words_list=list(all_words)
            )

            # 5. Send suggestions back to the client
            await websocket.send_json({"suggestions": suggestions})
    except WebSocketDisconnect:
        print("Client disconnected")
