"Module Suggestion"

WORDS_DICTIONARY = [
    "apple", "application", "appreciate",
    "banana", "band", "bandana",
    "cat", "caterpillar",
    "dog", "dodge",
    "elephant", "fish", "zebra"
]


def get_suggestions(prefix: str, words_list=None, limit: int = 5):
    """
    Return up to `limit` suggestions that start with `prefix` from
    `words_list` (only suggestions longer than prefix).
    """
    if words_list is None:
        words_list = WORDS_DICTIONARY

    prefix_lower = prefix.lower()
    suggestions = [
        word for word in words_list
        if word.lower().startswith(prefix_lower) and len(word) > len(prefix)
    ]
    return suggestions[:limit]
