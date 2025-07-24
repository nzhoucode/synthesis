"use client"

import { useEffect, useState } from "react"
import { fetchArticle, updateArticle, deleteArticle } from "../../../lib/api"
import { useParams, useRouter } from "next/navigation"
import { Article } from "../../../lib/types"
import LoadingModal from "../../../components/LoadingModal"

/** Renders the article detail page where users can view a full article and edit. */
export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchArticle(Number(id)).then(setArticle)
  }, [id])

  async function handleSave() {
    if (!article) return
    setLoading(true)
    await updateArticle(article.id, {
      summary: article.summary,
      quotes: article.quotes.join("\n"),
      topics: article.topics.join(","),
    })
    setLoading(false)
  }

  async function handleDelete() {
    if (!article) return
    const confirmed = confirm("Delete this article?")
    if (!confirmed) return
    setLoading(true)
    await deleteArticle(article.id)
    setLoading(false)
    router.push("/")
  }

  if (!article) return <p>Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{article.title}</h1>
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-700 underline mb-2 block"
      >
        {article.link}
      </a>
      <p className="text-gray-700 mb-4">
        {article.author} • {article.source} • {new Date(article.date).toLocaleDateString()}
      </p>
      <p className="mb-6 whitespace-pre-wrap">{article.content}</p>

      <div className="space-y-4 mb-6">
        <div className="flex flex-col">
          <label className="text-gray-700">Summary</label>
          <textarea
            value={article.summary}
            onChange={(e) => setArticle({ ...article, summary: e.target.value })}
            className="w-full border p-2 rounded h-40"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Quotes</label>
          <textarea
            value={article.quotes.join("\n")}
            onChange={(e) =>
              setArticle({ ...article, quotes: e.target.value.split("\n") })
            }
            className="w-full border p-2 rounded h-40"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-gray-700">Topics</label>
          <textarea
            value={article.topics.join(",")}
            onChange={(e) =>
              setArticle({ ...article, topics: e.target.value.split(",").map((s) => s.trim()) })
            }
            className="w-full border p-2 rounded h-10"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button className="bg-gray-500 hover:bg-gray-600 transition text-white px-4 py-2 rounded" onClick={handleSave}>
          Save Edits
        </button>
        <button className="bg-red-400 hover:bg-red-500 transition text-white px-4 py-2 rounded" onClick={handleDelete}>
          Delete Article
        </button>
      </div>

      {loading && <LoadingModal />}
    </div>
  )
}