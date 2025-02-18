"""Pydantic models for data validation and serialization."""

from pydantic import BaseModel
from typing import List


class WordSuggestion(BaseModel):
    """Model representing a word prefix and its corresponding suggestions."""
    prefix: str
    suggestions: List[str]
