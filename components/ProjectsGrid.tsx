"use client"
import { useState, useMemo } from 'react'
import ProjectCard from './ProjectCard'

interface Project {
  id: string
  slug: string
  title: string
  description: string
  difficulty: string
  timeEstimate: string
  technologies: string[]
  resumeImpact: number
  category: string
  steps: any[]
}

interface ProjectsGridProps {
  projects: Project[]
  difficulties: string[]
  technologies: string[]
}

export default function ProjectsGrid({ projects, difficulties, technologies }: ProjectsGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedTech, setSelectedTech] = useState('all')

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
        project.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      
      const matchesTech = selectedTech === 'all' || 
        project.technologies.some(tech => tech.toLowerCase() === selectedTech.toLowerCase())
      
      return matchesSearch && matchesDifficulty && matchesTech
    })
  }, [projects, searchQuery, selectedDifficulty, selectedTech])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedDifficulty('all')
    setSelectedTech('all')
  }

  const activeFiltersCount = 
    (selectedDifficulty !== 'all' ? 1 : 0) + 
    (selectedTech !== 'all' ? 1 : 0) + 
    (searchQuery !== '' ? 1 : 0)

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Projects
            </label>
            <input
              type="text"
              placeholder="Search by name or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff.toLowerCase()}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {/* Technology Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technology
            </label>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Technologies</option>
              {technologies.map(tech => (
                <option key={tech} value={tech.toLowerCase()}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters & Clear */}
        {activeFiltersCount > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {filteredProjects.length} of {projects.length} projects
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
              </span>
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects found matching your filters.</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}
