"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { researchQuery, fetchArticle } from "../../lib/api"
import ArticleCard from "../../components/ArticleCard"
import LoadingModal from "../../components/LoadingModal"
import { ArticlePreview } from "../../lib/types"

/** Renders the research page where users can search their articles. */
export default function ResearchPage() {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState("")
  const [sources, setSources] = useState<ArticlePreview[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setAnswer("")
    setSources([])
    try {
      const res = await researchQuery(query)
      setAnswer(res.response)
      const articles = await Promise.all(res.ids.map(fetchArticle))
      setSources(articles)
    } catch (err) {
      console.error("Failed to get response from agent:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {loading && <LoadingModal />}
      <h1 className="text-2xl font-semibold mb-2">Search Your Articles</h1>
      <hr className="mb-4 border-gray-300" />

      <form onSubmit={handleSearch} className="space-y-4 mb-6">
        <textarea
          className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring focus:border-gray-500"
          rows={5}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="What is the meaning of life?"
        />
        <button
          type="submit"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Submit
        </button>
      </form>

      {answer && (
        <div className="mb-8">
          <div className="bg-gray-100 p-4 rounded prose">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <div>
          <h2 className="text-2xl mb-2">Sources</h2>
          <div className="space-y-4">
            {sources.map(article => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}