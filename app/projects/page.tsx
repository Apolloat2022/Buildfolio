// app/projects/page.tsx
import { prisma } from '@/lib/prisma'
import ProjectsGrid from '@/components/ProjectsGrid'

export default async function ProjectsPage() {
  const projects = await prisma.projectTemplate.findMany({
    orderBy: { resumeImpact: 'desc' },
    include: {
      steps: true,
    }
  })

  const transformedProjects = projects.map(project => ({
    ...project,
    description: project.description || '',
    timeEstimate: project.timeEstimate || '',
    resumeImpact: project.resumeImpact || 0,
    category: project.category || '',
    technologies: project.technologies || [],
    steps: project.steps || [],
  }))

  // Get unique difficulties and technologies for filters
  const difficulties = [...new Set(projects.map(p => p.difficulty))]
  const allTechnologies = [...new Set(projects.flatMap(p => p.technologies || []))]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Catalog</h1>
          <p className="text-gray-600 text-lg">
            Browse {transformedProjects.length} resume-worthy projects to build your portfolio
          </p>
        </div>
        
        <ProjectsGrid 
          projects={transformedProjects}
          difficulties={difficulties}
          technologies={allTechnologies}
        />
      </div>
    </div>
  )
}
