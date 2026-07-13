import numpy as np
from rank_bm25 import BM25Okapi


def build_bm25_index(chunks):
    tokenized = [chunk.split() for chunk in chunks]
    return BM25Okapi(tokenized)


def search_bm25(bm25: BM25Okapi, query: str, k: int = 5):
    tokenized_query = query.split()
    scores = bm25.get_scores(tokenized_query)
    return np.argsort(scores)[::-1][:k]
