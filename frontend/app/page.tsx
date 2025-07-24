"use client"

import { useEffect, useState } from "react"
import { listArticles, deleteAllArticles } from "../lib/api"
import { ArticlePreview } from "../lib/types"
import ArticleCard from "../components/ArticleCard"
import LoadingModal from "../components/LoadingModal"

/** Renders the main homepage with a list of all articles. */
export default function HomePage() {
  const [articles, setArticles] = useState<ArticlePreview[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const res = await listArticles()
      setArticles(res.articles)
    }
    fetchData()
  }, [])

  async function handleDeleteAll() {
    const confirmed = confirm("Delete all articles?")
    if (!confirmed) return
    setLoading(true)
    await deleteAllArticles()
    setArticles([])
    setLoading(false)
  }

  const moveArticle = (fromIndex: number, toIndex: number) => {
    if (!articles) return
    const updated = [...articles]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setArticles(updated)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">
        Your Articles {articles && `(${articles.length})`}
      </h1>
      <hr className="mb-4 border-gray-300" />

      {articles === null ? (
        <p className="text-gray-500">Loading...</p>
      ) : articles.length === 0 ? (
        <p className="text-gray-500">No articles yet.</p>
      ) : (
        <>
          <div className="grid gap-4 mb-6">
            {articles.map((article, index) => (
              <div key={article.id} className="relative group">
                {index > 0 && (
                  <button
                    onClick={() => moveArticle(index, index - 1)}
                    className="absolute left-[-28px] top-2 text-sm text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    ↑
                  </button>
                )}
                {index < articles.length - 1 && (
                  <button
                    onClick={() => moveArticle(index, index + 1)}
                    className="absolute left-[-28px] top-8 text-sm text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition"
                  >
                    ↓
                  </button>
                )}
                <ArticleCard {...article} />
              </div>
            ))}
          </div>
          <button
            className="bg-red-400 hover:bg-red-500 transition text-white px-4 py-2 rounded"
            onClick={handleDeleteAll}
          >
            Delete All Articles
          </button>
        </>
      )}

      {loading && <LoadingModal />}
    </div>
  )
}