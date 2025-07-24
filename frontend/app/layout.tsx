import "./globals.css"
import { ReactNode } from "react"
import Navbar from "../components/Navbar"

export const metadata = {
  title: "Synthesis",
  description: "An AI-powered tool to store, summarize, and search articles."
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-serif bg-gray-300 text-gray-900">
        <header className="flex justify-between items-center px-6 py-4 bg-white border-b">
          <h1 className="text-2xl font-semibold">
            📚 Synthesis
          </h1>
          <Navbar />
        </header>
        <main className="flex-1 px-6 py-4 flex justify-center">
          <div className="w-full max-w-4xl mt-6">{children}</div>
        </main>
        <footer className="px-6 py-4 text-center text-sm text-gray-500 border-t">
          Synthesis by Nathan Zhou
        </footer>
      </body>
    </html>
  )
}