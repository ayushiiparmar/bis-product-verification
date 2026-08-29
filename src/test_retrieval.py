from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer
import json


# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

INDEX_FILE = BASE_DIR / "data" / "bis_index.faiss"
DOCUMENTS_FILE = BASE_DIR / "data" / "bis_documents.json"


# Check files
if not INDEX_FILE.exists():
    raise FileNotFoundError(f"FAISS index not found:\n{INDEX_FILE}")

if not DOCUMENTS_FILE.exists():
    raise FileNotFoundError(f"Documents file not found:\n{DOCUMENTS_FILE}")


# Load vector index
print("Loading FAISS index...")
index = faiss.read_index(str(INDEX_FILE))


# Load documents
print("Loading documents...")

with open(DOCUMENTS_FILE, "r", encoding="utf-8") as f:
    documents = json.load(f)


# Load embedding model
print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")


# Test query
query = "What BIS standard applies to mobile phones?"

print()
print(f"Query: {query}")
print()


# Create query embedding
query_embedding = model.encode(
    [query],
    convert_to_numpy=True
)


# Search top 3 results
distances, indices = index.search(query_embedding, 3)


# Display results
print("Top Retrieved Results:")
print("======================")

for rank, (distance, idx) in enumerate(
    zip(distances[0], indices[0]), start=1
):

    document = documents[idx]

    print()
    print(f"Result {rank}")
    print(f"Distance: {distance:.4f}")
    print(document["text"])

    metadata = document.get("metadata", {})

    print(f"Source: {metadata.get('source_url', 'N/A')}")


print()
print("======================")
print("Retrieval test completed successfully!")