"use client"

import { BookOpen, Lightbulb, Users } from "lucide-react"

export default function Features() {
  return (
    <section className="py-16 sm:py-20 md:py-28 bg-white dark:bg-gray-900">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Why Teachers Love Lingualy
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Designed to make your classroom experience more engaging and effective.
          </p>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="text-center px-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Curriculum-Aligned</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Our resources are built to align with national standards and best practices.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Creative Lessons</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Explore interactive and innovative content that keeps students motivated.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Community Support</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join a vibrant community of educators sharing best practices and resources.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}