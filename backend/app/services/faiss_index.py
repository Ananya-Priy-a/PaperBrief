import faiss
import numpy as np


def build_faiss_index(embeddings: np.ndarray):
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings))
    return index


def search_faiss(index, query_vec: np.ndarray, k: int = 5):
    D, I = index.search(np.array(query_vec), k)
    return I[0]
