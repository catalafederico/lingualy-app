"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 px-4 py-10">
      <div className="container mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Lingualy. All rights reserved.
        <div className="mt-2">
          <Link href="/privacy" className="hover:text-amber-600">Privacy</Link> ·
          <Link href="/terms" className="hover:text-amber-600 ml-1">Terms</Link>
        </div>
      </div>
    </footer>
  )
}