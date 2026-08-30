import json
from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer


# --------------------------------------------------
# 1. Project paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = BASE_DIR / "Data" / "bis_rag_chunks.jsonl"
INDEX_FILE = BASE_DIR / "Data" / "bis_index.faiss"
DOCUMENTS_FILE = BASE_DIR / "Data" / "bis_documents.json"


# --------------------------------------------------
# 2. Check RAG dataset
# --------------------------------------------------

if not DATA_FILE.exists():
    raise FileNotFoundError(
        f"BIS RAG dataset not found at:\n{DATA_FILE}"
    )

print("Loading BIS RAG dataset...")

# --------------------------------------------------
# 3. Load RAG chunks
# --------------------------------------------------

with open(DATA_FILE, "r", encoding="utf-8") as f:
    documents = json.load(f)


if not documents:
    raise ValueError("No RAG chunks found in bis_rag_chunks.jsonl")


print(f"Total RAG chunks loaded: {len(documents)}")


# --------------------------------------------------
# 4. Prepare text for embeddings
# --------------------------------------------------

texts = []

for chunk in documents:

    text = chunk.get("text", "")

    if not text:
        continue

    texts.append(text)


if not texts:
    raise ValueError("No valid text found in RAG chunks")


print(f"Texts prepared for embedding: {len(texts)}")


# --------------------------------------------------
# 5. Load embedding model
# --------------------------------------------------

print("Loading embedding model...")

model = SentenceTransformer(
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

print("Embedding model loaded successfully!")


# --------------------------------------------------
# 6. Create embeddings
# --------------------------------------------------

print("Creating embeddings...")

embeddings = model.encode(
    texts,
    convert_to_numpy=True,
    show_progress_bar=True
)


# --------------------------------------------------
# 7. Create FAISS index
# --------------------------------------------------

print("Creating FAISS vector index...")

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(embeddings)


# --------------------------------------------------
# 8. Save FAISS index
# --------------------------------------------------

faiss.write_index(
    index,
    str(INDEX_FILE)
)


# --------------------------------------------------
# 9. Save chunk metadata
# --------------------------------------------------

with open(DOCUMENTS_FILE, "w", encoding="utf-8") as f:

    json.dump(
        documents,
        f,
        ensure_ascii=False,
        indent=2
    )


# --------------------------------------------------
# 10. Semantic search
# --------------------------------------------------

def semantic_search(query, top_k=5):

    query_embedding = model.encode(
        [query],
        convert_to_numpy=True
    )

    distances, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for distance, idx in zip(
        distances[0],
        indices[0]
    ):

        if idx == -1:
            continue

        chunk = documents[idx]

        results.append({
            "chunk_id": chunk.get("chunk_id"),
            "text": chunk.get("text"),
            "metadata": {
                "document_id": chunk.get("document_id"),
                "standard_number": chunk.get("standard_number"),
                "title": chunk.get("title"),
                "category": chunk.get("category"),
                "section": chunk.get("section"),
                "subsection": chunk.get("subsection"),
                "clause": chunk.get("clause"),
                "page_start": chunk.get("page_start"),
                "page_end": chunk.get("page_end"),
                "source_name": chunk.get("source_name"),
                "source_url": chunk.get("source_url"),
                "document_version": chunk.get("document_version"),
                "extraction_method": chunk.get("extraction_method")
            },
            "distance": float(distance)
        })

    return results


# --------------------------------------------------
# 11. Test retrieval
# --------------------------------------------------

if __name__ == "__main__":

    print()
    print("======================================")
    print("Vector store created successfully!")
    print("======================================")

    print(f"Chunks indexed      : {len(texts)}")
    print(f"Embedding dimension : {dimension}")
    print(f"FAISS index         : {INDEX_FILE}")
    print(f"Metadata file       : {DOCUMENTS_FILE}")

    print()
    print("Testing semantic search...")

    results = semantic_search(
        "What BIS standard is mapped to mobile phones?",
        top_k=5
    )

    print()
    print("Top retrieval results:")

    for result in results:

        print("--------------------------------------")

        print(
            "Chunk ID:",
            result["chunk_id"]
        )

        print(
            "Standard:",
            result["metadata"]["standard_number"]
        )

        print(
            "Source:",
            result["metadata"]["source_url"]
        )

        print(
            "Distance:",
            result["distance"]
        )