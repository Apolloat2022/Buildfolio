// Add this script to your resume-profile page
// Save as: app/dashboard/resume-profile/page.jsx or .tsx

"use client"

import { useState, useEffect } from 'react'

export default function ResumeProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  
  // Form state - ADD ALL YOUR FORM FIELDS HERE
  const [formData, setFormData] = useState({
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    professionalSummary: '',
    // For array fields that user types comma-separated
    skillsInput: '',
    languagesInput: ''
  })
  
  // Load profile on page load
  useEffect(() => {
    fetchProfile()
  }, [])
  
  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/resume/profile')
      const data = await res.json()
      
      if (res.ok && data) {
        // Set form fields from fetched data
        setFormData({
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          linkedin: data.linkedin || '',
          github: data.github || '',
          professionalSummary: data.professionalSummary || '',
          skillsInput: Array.isArray(data.skills) ? data.skills.join(', ') : '',
          languagesInput: Array.isArray(data.languages) ? data.languages.join(', ') : ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    
    try {
      // Convert comma-separated strings to arrays
      const dataToSend = {
        ...formData,
        skills: formData.skillsInput.split(',').map(s => s.trim()).filter(s => s),
        languages: formData.languagesInput.split(',').map(l => l.trim()).filter(l => l)
      }
      
      // Remove the input fields from the data
      delete dataToSend.skillsInput
      delete dataToSend.languagesInput
      
      const res = await fetch('/api/resume/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      })
      
      const result = await res.json()
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile saved successfully!' })
        // Refresh to show updated data (including auto-added certs)
        setTimeout(() => fetchProfile(), 1000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Save failed' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setSaving(false)
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Resume Profile</h1>
      <p className="text-gray-600 mb-8">Complete your profile to generate a comprehensive resume</p>
      
      {message && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {/* YOUR EXISTING FORM - ADD onChange AND value PROPS */}
      <form onSubmit={handleSubmit}>
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (City, State)</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="San Francisco, CA"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://yourportfolio.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://linkedin.com/in/yourname"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg"
                placeholder="https://github.com/yourusername"
              />
            </div>
          </div>
        </div>
        
        {/* Professional Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
          <textarea
            name="professionalSummary"
            value={formData.professionalSummary}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Brief overview of your professional background and goals..."
          />
        </div>
        
        {/* Additional Skills */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Additional Skills</h2>
          <p className="text-gray-600 text-sm mb-3">List additional skills not covered in projects (comma-separated)</p>
          <input
            type="text"
            name="skillsInput"
            value={formData.skillsInput}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Project Management, Agile, Public Speaking, UI/UX Design"
          />
        </div>
        
        {/* Languages */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold mb-4">Languages</h2>
          <p className="text-gray-600 text-sm mb-3">List languages and proficiency (comma-separated)</p>
          <input
            type="text"
            name="languagesInput"
            value={formData.languagesInput}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="English (Native), Spanish (Fluent), French (Conversational)"
          />
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={fetchProfile}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
          >
            Reset Form
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Resume Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
