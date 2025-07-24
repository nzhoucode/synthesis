import os
from langchain_ollama import ChatOllama

def load():
    return ChatOllama(
        model="llama3",
        temperature=0.05,
        base_url=os.getenv("OLLAMA_BASE_URL")
    )