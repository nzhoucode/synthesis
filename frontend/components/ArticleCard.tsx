"use client"

import { useRouter } from "next/navigation"
import { ArticlePreview } from "../lib/types"

/** Renders a clickable card with an article preview. */
export default function ArticleCard(props: ArticlePreview) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/article/${props.id}`)
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4 mb-1 shadow-md hover:shadow-lg cursor-pointer"
      role="button"
      aria-label={`View article: ${props.title}`}
      onClick={handleCardClick}
    >
      <h3 className="font-semibold text-xl">{props.title}</h3>
      <a
        href={props.link}
        title={props.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 underline mt-1 block"
        onClick={(e) => e.stopPropagation()}
      >
        {props.link}
      </a>
      <p className="text-gray-600">
        {props.author} · {props.source} · {props.date}
      </p>
      <p className="mt-1 text-gray-700 italic">
        {props.topics.join(", ")}
      </p>
    </div>
  )
}