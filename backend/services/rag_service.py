from src.VectorStore import semantic_search


def get_rag_context(query: str, top_k: int = 3) -> list:
    """Retrieve relevant BIS knowledge for a query."""

    results = semantic_search(query, top_k=top_k)

    # Prefer exact BIS standard matches when a standard number
    # is present in the query.
    import re

    match = re.search(r"\bIS\s*[:\-]?\s*(\d+)", query, re.IGNORECASE)

    if match:
        standard_digits = match.group(1)

        exact_matches = []

        for result in results:
            standard = result.get("metadata", {}).get("standard_number") or ""

            if re.search(
                rf"\bIS\s*[:\-]?\s*{standard_digits}\b",
                standard,
                re.IGNORECASE
            ):
                exact_matches.append(result)

        if exact_matches:
            results = exact_matches[:top_k]

    context = []

    for result in results:
        context.append({
            "chunk_id": result.get("chunk_id"),
            "text": result.get("text"),
            "standard_number": result.get("metadata", {}).get("standard_number"),
            "title": result.get("metadata", {}).get("title"),
            "category": result.get("metadata", {}).get("category"),
            "source_url": result.get("metadata", {}).get("source_url"),
            "distance": result.get("distance")
        })

    return context
