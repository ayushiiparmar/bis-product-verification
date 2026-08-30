from VectorStore import semantic_search


def retrieve_context(query, top_k=3):
    results = semantic_search(query, top_k=top_k)

    context = []

    for result in results:
        context.append({
            "chunk_id": result["chunk_id"],
            "text": result["text"],
            "source_url": result["metadata"]["source_url"]
        })

    return context


if __name__ == "__main__":

    query = "What BIS standard is mapped to mobile phones?"

    results = retrieve_context(query)

    print("\n===== RETRIEVED CONTEXT =====")

    for i, result in enumerate(results, start=1):

        print(f"\nResult {i}")
        print("Chunk ID:", result["chunk_id"])
        print("Text:", result["text"])
        print("Source URL:", result["source_url"])