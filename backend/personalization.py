"""Module for managing user-specific keyword personalization."""

import re

PERSONAL_KEYWORDS = set()


def detect_new_keywords(message: str):
    """
    Naively extract words from the user's message. Any alphanumeric
    string is considered a "word". Return a set of new words not yet in
    PERSONAL_KEYWORDS.
    """
    tokens = re.findall(r"[a-zA-Z0-9]+", message)
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
