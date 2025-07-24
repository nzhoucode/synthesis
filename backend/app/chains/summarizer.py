from langchain.prompts import PromptTemplate
from langchain.schema import Document
from langchain.chains.summarize import load_summarize_chain
import asyncio
from app.models.llm import load

llm = load()

async def get_summary(text: str):
    summary_prompt = PromptTemplate.from_template(
        "You are a research and news article analyzer tasked with summarizing complex information clearly.\n"
        "Summarize the article below in one concise paragraph (3-5 sentences), focusing only on the most essential ideas and findings.\n"
        "Do NOT use bullet points, headings, or an introduction like 'Here is a summary.'\n\n"
        "Article:\n"
        "{page_content}\n\n"
        "Summary:"
    )
    quotes_prompt = PromptTemplate.from_template(
        "You are a research and news article analyzer tasked with extracting important evidence.\n"
        "From the article below, extract 3 impactful, directly citable sections (1-3 sentences each).\n"
        "Do NOT include quotation marks or an introduction like 'Here are 3 sections'.\n"
        "Respond with each section separated by a blank line.\n\n"
        "Article:\n"
        "{page_content}\n\n"
        "Sections:"
    )
    topics_prompt = PromptTemplate.from_template(
        "You are a research and news article analyzer tasked with identifying topics or themes."
        "List 3 concise, relevant topics that describe what the following article is about. "
        "Respond with a comma-separated list only, NOT a sentence.\n\n"
        "Article:\n"
        "{page_content}\n\n"
        "Topics:"
    )

    doc = Document(page_content=text)
    
    async def run_chain(prompt):
        chain = load_summarize_chain(
            llm,
            chain_type="stuff",
            prompt=prompt,
            document_variable_name="page_content"
        )
        result = await chain.ainvoke([doc])
        if isinstance(result, dict):
            return result.get("output_text", "")
        return result
    
    summary, quotes, topics = await asyncio.gather(
        run_chain(summary_prompt),
        run_chain(quotes_prompt),
        run_chain(topics_prompt)
    )

    return summary.strip(), quotes.strip(), topics.strip()
