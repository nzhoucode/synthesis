# 📚 Synthesis

Synthesis is a full-stack web app tool to **store, summarize, and search articles** using AI-powered semantic search and summarization. It features a FastAPI backend, a Next.js/React frontend, and a PostgreSQL relational/vector database.

## Features

- **Add articles** with metadata and full content
- **Automatic summarization** and extraction of quotes/topics using Llama 3
- **Semantic search agent** using an agentic RAG pipeline and vector embedding similarity search recommendation system to answer research questions with sources from your saved articles
- **Edit and delete** articles and generated fields
- **Fast, modern UI** built with Next.js, Tailwind CSS, and React

## Architecture

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** FastAPI (Python), LangChain, Ollama (Llama 3)
- **Database:** PostgreSQL with pgvector extension
- **Embeddings:** Sentence Transformers (`all-mpnet-base-v2`)
- **Containerization:** Docker Compose for all services

## Getting Started

### Prerequisites

- Docker & Docker Compose
- (Optional) Node.js and Python for local development

### Quick Start (Docker Compose)

1. **Clone the repo:**
   ```sh
   git clone https://github.com/nzhoucode/synthesis.git
   cd synthesis
   ```

2. **Start all services:**
   ```sh
   docker compose up --build
   ```

   This will start:
   - Backend (FastAPI)
   - Frontend (Next.js)
   - PostgreSQL with pgvector
   - Ollama (Llama 3 model)

3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8000](http://localhost:8000/docs)

### Local Development

- **Frontend:**  
  ```sh
  cd frontend
  npm install
  npm run dev
  ```
- **Backend:**  
  ```sh
  cd backend
  pip install -r requirements.txt
  uvicorn app.main:app --reload
  ```

## Configuration

- Environment variables are set in `backend/.env`
- Docker Compose config: `compose.yaml`

## File Structure

- `frontend` — Next.js app
- `backend` — FastAPI app
- `compose.yaml` — Docker Compose config
- `Dockerfile.pgvector` — Custom PostgreSQL with pgvector
- `llama3.sh` — Ollama model setup script

## License

MIT

---