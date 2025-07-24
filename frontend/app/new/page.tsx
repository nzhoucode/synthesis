"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { NewArticleInput } from "../../lib/types"
import { submitArticle } from "../../lib/api"
import LoadingModal from "../../components/LoadingModal"

const InputField = ({
  name,
  type = "text",
  isTextarea = false,
  value,
  onChange
}: {
  name: keyof NewArticleInput
  type?: string
  isTextarea?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}) => (
  <div className="flex flex-col">
    <label className="text-base text-gray-600 capitalize">{name}</label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={name === "content"}
        rows={6}
        className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring focus:border-gray-500"
      />
    ) : (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring focus:border-gray-500"
      />
    )}
  </div>
)

/** Renders the new article submission page. */
export default function NewArticlePage() {
  const [form, setForm] = useState<NewArticleInput>({
    title: "",
    author: "",
    source: "",
    date: "",
    link: "",
    content: ""
  })

  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.content.trim()) {
      alert("Content is required.")
      return
    }

    try {
      setLoading(true)
      await submitArticle(form)
      router.push("/")
    } catch {
      alert("Failed to submit article.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {loading && <LoadingModal />}
      <h1 className="text-2xl font-semibold mb-2">New Article</h1>
      <hr className="mb-2 border-gray-300" />
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="grid gap-2">
          <InputField name="title" value={form.title} onChange={handleChange} />
          <InputField name="author" value={form.author} onChange={handleChange} />
          <InputField name="source" value={form.source} onChange={handleChange} />
          <InputField name="date" type="date" value={form.date} onChange={handleChange} />
          <InputField name="link" value={form.link} onChange={handleChange} />
          <InputField name="content" isTextarea value={form.content} onChange={handleChange} />
        </div>
        <button
          type="submit"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
        >
          Submit
        </button>
      </form>
    </div>
  )
}