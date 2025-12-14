// components/ResumeProfileForm.tsx (client component)
"use client"

import { useState, useEffect } from 'react'

export default function ResumeProfileForm() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    professionalSummary: '',
    workExperience: [],
    education: [],
    certifications: [],
    skills: [],
    languages: []
  })
  
  // Load existing profile on mount
  useEffect(() => {
    loadProfile()
  }, [])
  
  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/resume/profile')
      if (response.ok) {
        const data = await response.json()
        if (data) {
          setFormData(prev => ({ ...prev, ...data }))
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setMessage(null)
      
      const response = await fetch('/api/resume/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Resume profile saved successfully!'
        })
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Failed to save profile'
        })
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Please try again.'
      })
    } finally {
      setSaving(false)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({ ...prev, [field]: items }))
  }
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Message display */}
      {message && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {/* Your existing form fields here */}
      {/* Add onChange handlers to connect them */}
      {/* Example: */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="+1 (555) 123-4567"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          name="professionalSummary"
          value={formData.professionalSummary}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border border-gray-300 rounded-lg"
          placeholder="Brief overview of your professional background and goals..."
        />
      </div>
      
      {/* Add similar fields for all your form elements */}
      
      <div className="pt-6 border-t">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Resume Profile'}
        </button>
        
        <button
          type="button"
          onClick={loadProfile}
          className="ml-4 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
        >
          Reset to Saved
        </button>
      </div>
    </form>
  )
}
