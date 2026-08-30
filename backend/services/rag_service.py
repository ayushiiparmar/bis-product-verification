from src.VectorStore import semantic_search


def get_rag_context(query: str, top_k: int = 3) -> list:
    """Retrieve relevant BIS knowledge for a query."""

    results = semantic_search(query, top_k=top_k)

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
