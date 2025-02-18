"""Module for managing user-specific keyword personalization."""

import re

PERSONAL_KEYWORDS = set()


def detect_new_keywords(message: str):
    """
    Naively extract words from the user's message. Any alphanumeric
    string is considered a "word". Return a set of new full words (i.e.,
    words that the user has finished typing, as indicated by a trailing
    whitespace) not yet in PERSONAL_KEYWORDS.
    """
    tokens = re.findall(r"[a-zA-Z0-9]+", message)
    # If the message does not end with a space, assume that the last token
    # is incomplete.
    if message and not message[-1].isspace() and tokens:
        tokens = tokens[:-1]

    new_words = set()
    for token in tokens:
        lower_token = token.lower()
        if lower_token not in PERSONAL_KEYWORDS:
            new_words.add(lower_token)
    return new_words


def add_personal_keywords(new_words):
    """
    Add a set of words into PERSONAL_KEYWORDS.
    """
    PERSONAL_KEYWORDS.update(new_words)


def get_personal_keywords():
    """
    Return the current set of personal keywords as a list.
    """
    return list(PERSONAL_KEYWORDS) 
