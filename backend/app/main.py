from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from app.chains.summarizer import get_summary
from app.chains.agent import get_research
from app.db.relational import init_db, close_db, save, get_all, get_article, update_article, delete_article, delete_all_rel
from app.db.vector import init_vectorstore, add_vec, delete_vec, delete_all_vec

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await init_vectorstore()
    yield
    await close_db()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
async def ping():
    return {"status": "ok"}

class Article(BaseModel):
    title: str
    content: str
    author: str
    source: str
    date: str
    link: str

class Query(BaseModel):
    query: str

class Update(BaseModel):
    summary: str
    quotes: str
    topics: str

@app.post("/summarize")
async def summarize(input: Article):
    text = f"{input.title}\n\n{input.content}"
    summary, quotes, topics = await get_summary(text)
    id = await save(input, summary, quotes, topics)
    await add_vec(input.content, metadata={
        "id": str(id),
        "title": input.title,
        "author": input.author,
        "source": input.source,
        "date": input.date
    })
    return {"summary": summary, "quotes": quotes, "topics": topics}

@app.get("/articles")
async def list():
    rows = await get_all()
    return {
        "articles": [
            {
                "id": row["id"],
                "title": row["title"],
                "author": row["author"],
                "source": row["source"],
                "date": row["date"],
                "link": row["link"],
                "topics": row["topics"].split(",") if row["topics"] else []
            }
            for row in rows
        ]
    }

@app.get("/article/{id}")
async def info(id: int):
    row = await get_article(id)
    if not row:
        raise HTTPException(status_code=404, detail="Article not found")
    return {
        "id": row["id"],
        "title": row["title"],
        "content": row["content"],
        "author": row["author"],
        "source": row["source"],
        "date": row["date"],
        "link": row["link"],
        "summary": row["summary"],
        "quotes": row["quotes"].split("\n") if row["quotes"] else [],
        "topics": row["topics"].split(",") if row["topics"] else []
    }

@app.put("/article/{id}")
async def update(id: int, input: Update):
    await update_article(id, input.summary, input.quotes, input.topics)
    return {"message": "Article updated"}

@app.delete("/article/{id}")
async def delete(id: int):
    await delete_article(id)
    await delete_vec(id)
    return {"message": "Article deleted"}

@app.delete("/articles")
async def delete_all():
    await delete_all_rel()
    await delete_all_vec()
    return {"message": "All articles deleted"}

@app.post("/research")
async def research(input: Query):
    return await get_research(input.query)