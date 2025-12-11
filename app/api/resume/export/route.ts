import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { renderToStream } from '@react-pdf/renderer'
import ResumePDF from '@/components/ResumePDF'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch user's completed projects
    const startedProjects = await prisma.startedProject.findMany({
      where: {
        userId: session.user.id,
        status: 'completed',
        progress: 100,
      },
      include: {
        projectTemplate: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    // Prepare data for PDF
    const completedProjects = startedProjects.map((sp) => ({
      id: sp.id,
      title: sp.projectTemplate.title,
      description: sp.projectTemplate.description,
      technologies: sp.projectTemplate.technologies,
      githubUrl: null, // Can be enhanced to pull from showcase
      liveUrl: null, // Can be enhanced to pull from showcase
      completedAt: sp.completedAt || new Date(),
      difficulty: sp.projectTemplate.difficulty,
      timeEstimate: sp.projectTemplate.timeEstimate,
    }))

    // Calculate stats
    const allTechnologies = new Set<string>()
    let totalHours = 0

    completedProjects.forEach((project) => {
      project.technologies.forEach((tech) => allTechnologies.add(tech))
      
      // Parse time estimate (e.g., "10-15 hours" -> 12.5)
      if (project.timeEstimate) {
        const match = project.timeEstimate.match(/(\d+)-(\d+)/)
        if (match) {
          const avg = (parseInt(match[1]) + parseInt(match[2])) / 2
          totalHours += avg
        }
      }
    })

    const resumeData = {
      user: {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      },
      completedProjects,
      stats: {
        totalProjects: completedProjects.length,
        totalHours: Math.round(totalHours),
        technologiesLearned: Array.from(allTechnologies),
      },
    }

    // Generate PDF
    const stream = await renderToStream(<ResumePDF data={resumeData} />)

    // Return PDF as download
    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="resume-${session.user.name || 'portfolio'}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Resume export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate resume' },
      { status: 500 }
    )
  }
}