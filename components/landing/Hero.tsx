"use client"

import { ArrowRight, Award, CheckCircle, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 dark:bg-amber-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 dark:bg-orange-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 dark:bg-yellow-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="container relative px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_500px] lg:gap-16 xl:grid-cols-[1fr_600px] items-center">
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-full text-sm font-medium w-fit">
              <Award className="h-4 w-4" />
              Trusted by 50,000+ Teachers
            </div>
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl xl:text-7xl/none text-gray-900 dark:text-gray-100">
                Transform Your
                <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  English Teaching
                </span>
                Journey
              </h1>
              <p className="max-w-[600px] text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed">
                Access thousands of premium lesson plans, interactive worksheets, and teaching resources crafted by
                expert educators. Make every lesson engaging and impactful.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6 group text-white"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="border-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 text-lg px-8 py-6 group border-amber-200 dark:border-amber-700"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Resources</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Teachers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-3xl blur-3xl opacity-30"></div>
            <Image
              src="/placeholder.svg?height=500&width=600"
              width="600"
              height="500"
              alt="English teaching materials and resources"
              className="relative mx-auto rounded-3xl object-cover shadow-2xl border-8 border-white dark:border-gray-700"
            />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">Instant Access</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Download immediately</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}