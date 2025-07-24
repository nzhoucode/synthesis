"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

/** Renders a navbar for different sections of the app. */
export default function Navbar() {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `hover:underline transition-all duration-150 ${
      pathname === path ? "underline" : ""
    }`

  return (
    <nav className="space-x-6 text-lg">
      <Link href="/" className={linkClass("/")}>Articles</Link>
      <Link href="/new" className={linkClass("/new")}>Add Article</Link>
      <Link href="/research" className={linkClass("/research")}>Research Agent</Link>
    </nav>
  )
}