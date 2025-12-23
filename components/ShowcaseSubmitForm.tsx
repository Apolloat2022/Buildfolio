'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Link as LinkIcon, Github, Tag, FolderOpen } from 'lucide-react'

export default function ShowcaseSubmitForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    projectSlug: '',
    title: '',
    description: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    tags: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)

      const response = await fetch('/api/showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags
        })
      })

      if (response.ok) {
        router.push('/showcase')
      } else {
        alert('Failed to submit project. Please try again.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Failed to submit project.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-8 border-b pb-4">
        <FolderOpen className="w-8 h-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
      </div>

      {/* Project Slug Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Which tutorial did you complete? *
        </label>
        <select
          required
          value={formData.projectSlug}
          onChange={(e) => setFormData({ ...formData, projectSlug: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all appearance-none bg-white"
        >
          <option value="">Select a project...</option>
          <option value="ecommerce-store">1. Modern E-commerce Store</option>
          <option value="todo-app">2. Professional Todo App</option>
          <option value="weather-app">3. Dynamic Weather App</option>
          <option value="social-dashboard">4. Social Media Dashboard</option>
          <option value="recipe-finder">5. Recipe Finder App</option>
          <option value="portfolio-builder">6. AI Portfolio Builder</option>
        </select>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Project Title *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. My Custom E-commerce Store"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="What features did you add? What was the hardest part?"
          rows={4}
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Github className="w-4 h-4" /> GitHub Repository
          </label>
          <input
            type="url"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            placeholder="https://github.com/..."
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Live URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Live Demo URL
          </label>
          <input
            type="url"
            value={formData.liveUrl}
            onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            placeholder="https://your-app.vercel.app"
            className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Screenshot URL */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4" /> Screenshot URL (Imgur)
        </label>
        <input
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://imgur.com/your-image.png"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Tags */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4" /> Tags (comma separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="nextjs, tailwind, prisma"
          className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || !formData.projectSlug || !formData.title}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? 'Creating Post...' : 'Publish to Showcase'}
      </button>
    </form>
  )
}