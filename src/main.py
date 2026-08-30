from fastapi import FastAPI
from pydantic import BaseModel

from VectorStore import semantic_search

app = FastAPI(title="BIS RAG API")


class QueryRequest(BaseModel):
    query: str


@app.get("/")
def home():
    return {
        "message": "BIS RAG API is running successfully!"
    }


@app.post("/search")
def search_bis(request: QueryRequest):

    results = semantic_search(request.query, top_k=3)

    return {
    "query": request.query,
    "answer": [
        {
            "standard_number": r["metadata"].get("standard_number"),
            "title": r["metadata"].get("title"),
            "category": r["metadata"].get("category"),
            "source_url": r["metadata"].get("source_url")
        }
        for r in results
    ]
}