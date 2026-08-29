from VectorStore import semantic_search

query = "Does a microwave oven need BIS certification?"

results = semantic_search(query, top_k=3)

print("\n--- Semantic Search Results ---\n")

for i, result in enumerate(results, start=1):
    print(f"Result {i}")
    print("Distance:", result["distance"])
    print("Product:", result["metadata"].get("product_category", ""))
    print("Standard:", result["metadata"].get("standard_number", ""))
    print("Title:", result["metadata"].get("title", ""))
    print("Source:", result["metadata"].get("source_url", ""))
    print()