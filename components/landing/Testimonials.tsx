"use client"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "High School English Teacher",
    text: "Lingualy has completely transformed my teaching approach. The resources are top-notch and my students love them!",
  },
  {
    name: "Carlos Ramirez",
    role: "ESL Instructor",
    text: "Finally a platform that truly understands the needs of English teachers. Lingualy is a game-changer!",
  },
  {
    name: "Emily Chen",
    role: "Elementary Teacher",
    text: "The interactive worksheets and creative lesson plans have saved me hours every week. Highly recommended!",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-amber-50 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">What Teachers Are Saying</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Hear from real educators using Lingualy in their classrooms.
          </p>
        </div>
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border border-amber-100 dark:border-gray-700"
            >
              <p className="text-gray-700 dark:text-gray-300 italic">“{t.text}”</p>
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                <strong className="text-amber-600 dark:text-amber-400">{t.name}</strong> — {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}