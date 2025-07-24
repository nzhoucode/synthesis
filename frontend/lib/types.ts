export interface Article {
  id: number
  title: string
  author: string
  source: string
  date: string
  link: string
  content: string
  summary: string
  quotes: string[]
  topics: string[]
}

export interface ArticlePreview {
  id: number
  title: string
  author: string
  source: string
  date: string
  link: string
  topics: string[]
}

export interface NewArticleInput {
  title: string
  author: string
  source: string
  date: string
  link: string
  content: string
}