from sentence_transformers import SentenceTransformer


class EmbeddingProvider:
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        raise NotImplementedError

    def embed_query(self, text: str) -> list[float]:
        raise NotImplementedError


class LocalEmbeddingProvider(EmbeddingProvider):
    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    ):
        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        embeddings = self.model.encode(
            texts,
            convert_to_numpy=True
        )
        return embeddings.tolist()

    def embed_query(self, text: str) -> list[float]:
        embedding = self.model.encode(
            text,
            convert_to_numpy=True
        )
        return embedding.tolist()


if __name__ == "__main__":
    provider = LocalEmbeddingProvider()

    test_text = "BIS certification requirements"
    vector = provider.embed_query(test_text)

    print("Local embedding model loaded successfully!")
    print("Embedding dimensions:", len(vector))