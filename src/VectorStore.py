import json
from pathlib import Path

import faiss
from sentence_transformers import SentenceTransformer


# --------------------------------------------------
# 1. Find project folders
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = BASE_DIR / "data" / "bis_standards.json"
INDEX_FILE = BASE_DIR / "data" / "bis_index.faiss"
DOCUMENTS_FILE = BASE_DIR / "data" / "bis_documents.json"


# --------------------------------------------------
# 2. Check dataset
# --------------------------------------------------

if not DATA_FILE.exists():
    raise FileNotFoundError(
        f"BIS dataset not found at:\n{DATA_FILE}"
    )

print("Loading BIS dataset...")


# --------------------------------------------------
# 3. Load BIS dataset
# --------------------------------------------------

with open(DATA_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)


# --------------------------------------------------
# 4. Prepare documents
# --------------------------------------------------

documents = []


# Standards
for item in data.get("standards", []):

    text = (
        f"Product: {item.get('product_category', '')}\n"
        f"Standard Number: {item.get('standard_number', '')}\n"
        f"Title: {item.get('title', '')}\n"
        f"Description: {item.get('description', '')}\n"
        f"Applicability: {item.get('applicability', '')}\n"
        f"Certification Scheme: {item.get('certification_scheme', '')}\n"
        f"Notes: {item.get('notes', '')}"
    )

    documents.append({
        "text": text,
        "metadata": item
    })


# Services
for item in data.get("services", []):

    text = (
        f"Service: {item.get('service_name', '')}\n"
        f"Service Type: {item.get('service_type', '')}\n"
        f"Description: {item.get('description', '')}\n"
        f"User Need: {item.get('user_need_supported', '')}\n"
        f"Notes: {item.get('notes', '')}"
    )

    documents.append({
        "text": text,
        "metadata": item
    })


if not documents:
    raise ValueError("No documents found in bis_standards.json")


print(f"Total documents prepared: {len(documents)}")


# --------------------------------------------------
# 5. Load embedding model
# --------------------------------------------------

print("Loading embedding model...")

model = SentenceTransformer("all-MiniLM-L6-v2")


# --------------------------------------------------
# 6. Create embeddings
# --------------------------------------------------

print("Creating embeddings...")

texts = [doc["text"] for doc in documents]

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

faiss.write_index(index, str(INDEX_FILE))


# --------------------------------------------------
# 9. Save document metadata
# --------------------------------------------------

with open(DOCUMENTS_FILE, "w", encoding="utf-8") as f:
    json.dump(
        documents,
        f,
        ensure_ascii=False,
        indent=2
    )


# --------------------------------------------------
# 10. Final output
# --------------------------------------------------

print()
print("======================================")
print("Vector store created successfully!")
print("======================================")
print(f"Documents indexed : {len(documents)}")
print(f"Embedding dimension: {dimension}")
print(f"FAISS index        : {INDEX_FILE}")
print(f"Documents metadata : {DOCUMENTS_FILE}")

# 8. Semantic retrieval function
def semantic_search(query, top_k=5):
    query_embedding = model.encode(
        [query],
        convert_to_numpy=True
    )

    distances, indices = index.search(query_embedding, top_k)

    results = []

    for distance, idx in zip(distances[0], indices[0]):
        if idx == -1:
            continue

        results.append({
            "text": documents[idx]["text"],
            "metadata": documents[idx]["metadata"],
            "distance": float(distance)
        })

    return results
