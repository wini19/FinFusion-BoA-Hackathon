from fastapi import FastAPI
from typing import List, Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Stub data for API metadata
api_metadata = {
    "getUser": {
        "path": "/user",
        "method": "GET",
        "params": ["userId"],
        "responseSchema": {"name": "string", "email": "string"},
        "tags": ["user", "profile"],
        "version": "v1"
    },
    "createUser": {
        "path": "/user",
        "method": "POST",
        "params": ["name", "email"],
        "responseSchema": {"userId": "string"},
        "tags": ["user", "creation"],
        "version": "v1"
    },
    "updateProfile": {
        "path": "/user/profile",
        "method": "PUT",
        "params": ["userId", "profileData"],
        "responseSchema": {"status": "string"},
        "tags": ["user", "profile", "update"],
        "version": "v1"
    },
    "getProfile": {
        "path": "/user/profile",
        "method": "GET",
        "params": ["userId"],
        "responseSchema": {"profileData": "object"},
        "tags": ["user", "profile"],
        "version": "v1"
    }
}

# Stub data for usage
api_usage = {
    "getUser": {"calls": 1000, "consumers": 3},
    "createUser": {"calls": 500, "consumers": 2},
    "updateProfile": {"calls": 10, "consumers": 4},
    "getProfile": {"calls": 700, "consumers": 1}
}

@app.get("/api/usage")
def get_api_usage():
    result = []
    for api_name, usage in api_usage.items():
        calls = usage["calls"]
        consumers = usage["consumers"]
        impact_score = calls * 0.7 + consumers * 0.3
        result.append({
            "apiName": api_name,
            "calls": calls,
            "consumers": consumers,
            "impactScore": round(impact_score, 2)
        })
    return result

@app.get("/api/fingerprint/{api_name}")
def get_fingerprint(api_name: str):
    return api_metadata.get(api_name, {})

@app.get("/api/similarityChecker")
def get_similarity():
    threshold = 0.8
    fingerprints = []
    api_names = []
    for name, meta in api_metadata.items():
        vector_str = f"{meta['path']} {meta['method']} {' '.join(meta['params'])} {' '.join(meta['tags'])} {str(meta['responseSchema'])}"
        fingerprints.append(vector_str)
        api_names.append(name)

    tfidf = TfidfVectorizer().fit_transform(fingerprints)
    similarity_matrix = cosine_similarity(tfidf)

    result = []
    for i in range(len(api_names)):
        similar_apis = []
        for j in range(len(api_names)):
            if i != j and similarity_matrix[i][j] >= threshold:
                similar_apis.append({
                    "apiName": api_names[j],
                    "similarity": round(similarity_matrix[i][j], 2)
                })
        if similar_apis:
            result.append({
                "apiName": api_names[i],
                "similarApis": similar_apis
            })
    return result
