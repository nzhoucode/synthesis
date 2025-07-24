import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()
DB_URL = os.getenv("POSTGRES_URL")
pool = None

async def init_db():
    global pool
    pool = await asyncpg.create_pool(dsn=DB_URL)

    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS articles (
                id SERIAL PRIMARY KEY,
                title TEXT,
                content TEXT,
                author TEXT,
                source TEXT,
                date TEXT,
                link TEXT,
                summary TEXT,
                quotes TEXT,
                topics TEXT
            );
            CREATE EXTENSION IF NOT EXISTS vector;
            CREATE TABLE IF NOT EXISTS chunks (
                langchain_id UUID PRIMARY KEY,
                content TEXT NOT NULL,
                metadata JSONB,
                embedding VECTOR(768) NOT NULL
            );               
        """)

async def close_db():
    global pool
    if pool:
        await pool.close()

async def save(article, summary: str, quotes: str, topics: str) -> int:
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO articles (title, content, author, source, date, link, summary, quotes, topics)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        """,
            article.title,
            article.content,
            article.author,
            article.source,
            article.date,
            article.link,
            summary,
            quotes,
            topics
        )
        return row["id"]


async def get_all():
    async with pool.acquire() as conn:
        return await conn.fetch("""
            SELECT id, title, author, source, date, link, topics
            FROM articles
            ORDER BY id DESC
        """)

async def get_article(id: int):
    async with pool.acquire() as conn:
        return await conn.fetchrow("SELECT * FROM articles WHERE id = $1", id)

async def update_article(id: int, summary: str, quotes: str, topics: str):
    async with pool.acquire() as conn:
        await conn.execute("""
            UPDATE articles SET summary = $1, quotes = $2, topics = $3
            WHERE id = $4
        """, summary, quotes, topics, id)

async def delete_article(id: int):
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM articles WHERE id = $1", id)

async def delete_all_rel():
    async with pool.acquire() as conn:
        await conn.execute("DELETE FROM articles")