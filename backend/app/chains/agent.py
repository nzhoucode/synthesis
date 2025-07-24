from langchain_core.messages import HumanMessage
from app.db.vector import search
from app.models.llm import load

llm = load()

# Rewrite the query to be more search-friendly
async def rewrite_query(original_query: str):
    prompt = (
        "You are a helpful assistant. Rewrite the user's question to optimize it for a semantic search over articles.\n"
        "Only respond with the improved query, nothing else.\n"
        f"Original question: {original_query}\n"
        "Improved search query:"
    )
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    return response.content.strip()

# Perform vector search
async def retrieve_docs(query: str):
    return await search(query)

# Build prompt from retrieved chunks
def build_context_prompt(query: str, docs):
    relevant = "\n\n".join(
        [f"Article Chunk {i + 1}:\n{doc.page_content}" for i, doc in enumerate(docs)]
    )
    return (
        "You are a researcher.\n"
        "Using the following article chunks, write a clear, informative markdown report that answers the question.\n" 
        "Do not cite chunk numbers or sources.\n"
        f"Question: {query}\n\n"
        f"{relevant}"
    )

# Generate an answer
async def generate_answer(prompt: str):
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    return response.content.strip()

# Critique the answer
async def critique_answer(question: str, answer: str):
    prompt = (
        "You are a critical reviewer. Evaluate the following answer to a research question.\n"
        "If the answer lacks evidence, is vague, or misses the point, reply with a suggested follow-up search query.\n"
        "If the answer is complete and well-supported, reply with only one word: 'ACCEPT'.\n\n"
        f"Question: {question}\n\n"
        f"Answer:\n{answer}\n"
    )
    response = await llm.ainvoke([HumanMessage(content=prompt)])
    return response.content.strip()

# Agentic RAG pipeline function
async def get_research(query: str, max_loops: int = 3):
    answer = "No results found."
    seen_articles = set()
    seen_chunks = set()
    all_docs = []
    current_query = await rewrite_query(query)
    for i in range(max_loops):
        docs = await retrieve_docs(current_query)
        new_docs = []
        for doc in docs:
            chunk_id = doc.metadata.get("chunk_id")
            article_id = doc.metadata.get("id")
            if chunk_id and chunk_id not in seen_chunks:
                seen_chunks.add(chunk_id)
                new_docs.append(doc)
                if article_id:
                    seen_articles.add(article_id)
        if i > 0 and not new_docs:
            break
        all_docs.extend(new_docs)

        prompt = build_context_prompt(query, all_docs)
        answer = await generate_answer(prompt)

        critique = await critique_answer(query, answer)
        if not critique:
            break
        if critique.strip().upper() == "ACCEPT":
            return {"response": answer, "ids": list(seen_articles)}
        else:
            current_query = await rewrite_query(critique)

    return {"response": answer, "ids": list(seen_articles)}
