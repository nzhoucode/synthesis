from langchain_postgres import PGEngine, PGVectorStore
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
from copy import deepcopy
from dotenv import load_dotenv

vectorstore: PGVectorStore = None

async def init_vectorstore():
    global vectorstore
    load_dotenv()
    DB_URL = os.getenv("POSTGRES_VEC_URL")

    engine = PGEngine.from_connection_string(DB_URL)

    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-mpnet-base-v2",  # 768 dim
        encode_kwargs={"normalize_embeddings": True}
    )

    vectorstore = await PGVectorStore.create(
        engine=engine,
        table_name="chunks",
        embedding_service=embedding_model,
        embedding_column="embedding",
        content_column="content",
        metadata_json_column="metadata"
    )

async def add_vec(text: str, metadata: dict):
    splitter = RecursiveCharacterTextSplitter(chunk_size=384, chunk_overlap=64)
    chunks = splitter.split_text(text)
    doc_id = metadata["id"]
    docs = []

    for i, chunk in enumerate(chunks):
        chunk_meta = deepcopy(metadata)
        chunk_meta["chunk_id"] = f"{doc_id}.{i+1}"
        docs.append(Document(page_content=chunk, metadata=chunk_meta))

    await vectorstore.aadd_documents(docs)

async def search(query: str, k: int = 5):
    return await vectorstore.asimilarity_search(query, k=k)

async def delete_vec(id: int):
    await vectorstore.adelete(filter={"id": str(id)})

async def delete_all_vec():
    await vectorstore.adelete()
