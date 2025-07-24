import { Article, ArticlePreview, NewArticleInput } from "../lib/types"

const BASE_URL = "http://localhost:8000"

/** Makes an API request interacting with backend, handles errors, and returns response. */
async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options)
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Error ${res.status}: ${errorText}`)
    }
    return await res.json()
  } catch (err) {
    console.error("API error:", err)
    throw err
  }
}

/** Fetches a list of article previews. */
export async function listArticles() {
  return apiRequest<{ articles: ArticlePreview[] }>(`${BASE_URL}/articles`)
}

/** Fetches a single article by id. */
export async function fetchArticle(id: number) {
  return apiRequest<Article>(`${BASE_URL}/article/${id}`)
}

/** Submits a new article for summarization. */
export async function submitArticle(input: NewArticleInput) {
  return apiRequest<Article>(`${BASE_URL}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  })
}

/** Updates an existing article with new summary, quotes, and topics. */
export async function updateArticle(id: number, input: { summary: string; quotes: string; topics: string }) {
  return apiRequest<Article>(`${BASE_URL}/article/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  })
}

/** Deletes an article by id. */
export async function deleteArticle(id: number) {
  return apiRequest<void>(`${BASE_URL}/article/${id}`, { method: "DELETE" })
}

/** Deletes all articles. */
export async function deleteAllArticles() {
  return apiRequest<void>(`${BASE_URL}/articles`, { method: "DELETE" })
}

/** Sends a research query and returns the response and article ids. */
export async function researchQuery(query: string) {
  return apiRequest<{ response: string; ids: number[] }>(`${BASE_URL}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  })
}