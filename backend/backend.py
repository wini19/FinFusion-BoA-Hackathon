
from fastapi import FastAPI
from typing import Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Stub data for API metadata
api_metadata = {
    "getUser": {
        "path": "/user",
        "method": "GET",
        "params": ["userId"],
        "response": {"name": "string", "email": "string"},
        "tags": ["user", "profile"]
    },
    "createUser": {
        "path": "/user",
        "method": "POST",
        "params": ["name", "email"],
        "response": {"userId": "string"},
        "tags": ["user", "creation"]
    },
    "updateProfile": {
        "path": "/user/profile",
        "method": "PUT",
        "params": ["userId", "profileData"],
        "response": {"status": "string"},
        "tags": ["user", "profile"]
    },
    "getProfile": {
        "path": "/user/profile",
        "method": "GET",
        "params": ["userId"],
        "response": {"profileData": "object"},
        "tags": ["user", "profile"]
    }
}

# Stub data for API usage
api_usage = {
    "getUser": {"calls": 1200, "consumers": 5},
    "createUser": {"calls": 950, "consumers": 4},
    "updateProfile": {"calls": 2046, "consumers": 6},
    "getProfile": {"calls": 2009, "consumers": 6}
}

@app.get("/api/usage")
def get_usage():
    return api_usage

@app.get("/api/fingerprint/{api_name}")
def get_fingerprint(api_name: str):
    return api_metadata.get(api_name, {"error": "API not found"})

@app.get("/api/similarity")
def get_similarity():
    # Convert metadata to text for vectorization
    corpus = []
    api_names = []
    for name, meta in api_metadata.items():
        text = f"{meta['path']} {meta['method']} {' '.join(meta['params'])} {' '.join(meta['tags'])} {' '.join(meta['response'].keys())}"
        corpus.append(text)
        api_names.append(name)

    # Compute TF-IDF vectors and cosine similarity
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)
    similarity_matrix = cosine_similarity(tfidf_matrix)

    # Format result as a dictionary
    result = {}
    for i, api1 in enumerate(api_names):
        result[api1] = {}
        for j, api2 in enumerate(api_names):
            result[api1][api2] = round(float(similarity_matrix[i][j]), 2)

    return result
