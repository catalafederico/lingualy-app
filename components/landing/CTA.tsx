"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="py-20 md:py-28 bg-orange-100 dark:bg-orange-900">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Ready to Inspire Your Students?
        </h2>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Join thousands of educators using Lingualy to spark curiosity and creativity in the classroom.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <Input placeholder="Enter your email" className="h-12 px-4" />
          <Button className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Get Started Free
          </Button>
        </div>
      </div>
    </section>
  )
}