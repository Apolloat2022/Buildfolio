'use client'

import { useState } from 'react'
import { Briefcase, GraduationCap, Award, Plus, Trash2, Save } from 'lucide-react'

interface WorkExperience {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

interface Education {
  school: string
  degree: string
  field: string
  year: string
  description: string
}

interface Certification {
  name: string
  issuer: string
  date: string
  url: string
}

export default function ResumeProfileForm({ initialData }: { initialData?: any }) {
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    website: initialData?.website || '',
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
    professionalSummary: initialData?.professionalSummary || '',
    workExperience: initialData?.workExperience || [],
    education: initialData?.education || [],
    certifications: initialData?.certifications || [],
    skills: initialData?.skills || '',
    languages: initialData?.languages?.join(', ') || '',
  })

  const [workExp, setWorkExp] = useState<WorkExperience[]>(
    initialData?.workExperience || []
  )
  const [education, setEducation] = useState<Education[]>(
    initialData?.education || []
  )
  const [certs, setCerts] = useState<Certification[]>(
    initialData?.certifications || []
  )

  const addWorkExperience = () => {
    setWorkExp([
      ...workExp,
      { company: '', position: '', startDate: '', endDate: '', description: '' },
    ])
  }

  const addEducation = () => {
    setEducation([
      ...education,
      { school: '', degree: '', field: '', year: '', description: '' },
    ])
  }

  const addCertification = () => {
    setCerts([...certs, { name: '', issuer: '', date: '', url: '' }])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/resume/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profile,
          workExperience: workExp,
          education,
          certifications: certs,
          languages: profile.languages.split(',').map((l: string) => l.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) throw new Error('Failed to save')
      
      alert('Resume profile saved successfully!')
    } catch (error) {
      alert('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Resume Profile</h2>

        {/* Contact Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="text"
              placeholder="Location (City, State)"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="url"
              placeholder="Website"
              value={profile.website}
              onChange={(e) => setProfile({ ...profile, website: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="url"
              placeholder="LinkedIn URL"
              value={profile.linkedin}
              onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="url"
              placeholder="GitHub URL"
              value={profile.github}
              onChange={(e) => setProfile({ ...profile, github: e.target.value })}
              className="border rounded-lg px-4 py-2 md:col-span-2"
            />
          </div>
        </div>

        {/* Professional Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Professional Summary</h3>
          <textarea
            placeholder="Brief overview of your professional background and goals..."
            value={profile.professionalSummary}
            onChange={(e) =>
              setProfile({ ...profile, professionalSummary: e.target.value })
            }
            className="w-full border rounded-lg px-4 py-2 h-32"
          />
        </div>

        {/* Work Experience */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Work Experience
            </h3>
            <button
              onClick={addWorkExperience}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Experience
            </button>
          </div>

          {workExp.map((exp, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => {
                    const updated = [...workExp]
                    updated[index].company = e.target.value
                    setWorkExp(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={exp.position}
                  onChange={(e) => {
                    const updated = [...workExp]
                    updated[index].position = e.target.value
                    setWorkExp(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="month"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) => {
                    const updated = [...workExp]
                    updated[index].startDate = e.target.value
                    setWorkExp(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="month"
                  placeholder="End Date (or 'Present')"
                  value={exp.endDate}
                  onChange={(e) => {
                    const updated = [...workExp]
                    updated[index].endDate = e.target.value
                    setWorkExp(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
              </div>
              <textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => {
                  const updated = [...workExp]
                  updated[index].description = e.target.value
                  setWorkExp(updated)
                }}
                className="w-full border rounded-lg px-4 py-2 h-24 mb-2"
              />
              <button
                onClick={() => setWorkExp(workExp.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Education
            </h3>
            <button
              onClick={addEducation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Education
            </button>
          </div>

          {education.map((edu, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="School/University"
                  value={edu.school}
                  onChange={(e) => {
                    const updated = [...education]
                    updated[index].school = e.target.value
                    setEducation(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => {
                    const updated = [...education]
                    updated[index].degree = e.target.value
                    setEducation(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Field of Study"
                  value={edu.field}
                  onChange={(e) => {
                    const updated = [...education]
                    updated[index].field = e.target.value
                    setEducation(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Year (e.g., 2020)"
                  value={edu.year}
                  onChange={(e) => {
                    const updated = [...education]
                    updated[index].year = e.target.value
                    setEducation(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
              </div>
              <textarea
                placeholder="Additional details (GPA, honors, relevant coursework...)"
                value={edu.description}
                onChange={(e) => {
                  const updated = [...education]
                  updated[index].description = e.target.value
                  setEducation(updated)
                }}
                className="w-full border rounded-lg px-4 py-2 h-20 mb-2"
              />
              <button
                onClick={() => setEducation(education.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Award className="w-5 h-5" />
              Certifications
            </h3>
            <button
              onClick={addCertification}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          </div>

          {certs.map((cert, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Certification Name"
                  value={cert.name}
                  onChange={(e) => {
                    const updated = [...certs]
                    updated[index].name = e.target.value
                    setCerts(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="text"
                  placeholder="Issuing Organization"
                  value={cert.issuer}
                  onChange={(e) => {
                    const updated = [...certs]
                    updated[index].issuer = e.target.value
                    setCerts(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="month"
                  placeholder="Date Obtained"
                  value={cert.date}
                  onChange={(e) => {
                    const updated = [...certs]
                    updated[index].date = e.target.value
                    setCerts(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
                <input
                  type="url"
                  placeholder="Credential URL (optional)"
                  value={cert.url}
                  onChange={(e) => {
                    const updated = [...certs]
                    updated[index].url = e.target.value
                    setCerts(updated)
                  }}
                  className="border rounded-lg px-4 py-2"
                />
              </div>
              <button
                onClick={() => setCerts(certs.filter((_, i) => i !== index))}
                className="text-red-600 hover:text-red-800 flex items-center gap-2 mt-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Additional Skills */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Additional Skills</h3>
          <textarea
            placeholder="List additional skills not covered in projects (e.g., Project Management, Agile, Public Speaking, etc.)"
            value={profile.skills}
            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
            className="w-full border rounded-lg px-4 py-2 h-24"
          />
        </div>

        {/* Languages */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Languages</h3>
          <input
            type="text"
            placeholder="e.g., English (Native), Spanish (Fluent), French (Conversational)"
            value={profile.languages}
            onChange={(e) => setProfile({ ...profile, languages: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Resume Profile'}
        </button>
      </div>
    </div>
  )
}

