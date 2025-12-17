import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { stepId, projectId } = await req.json()
    
    console.log('[MARK COMPLETE] stepId:', stepId, 'projectId:', projectId)

    // 1. Find the project and step
    const project = await prisma.projectTemplate.findUnique({
      where: { id: projectId },
      include: { steps: true }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // 2. Find or create StartedProject
    let startedProject = await prisma.startedProject.findFirst({
      where: {
        userId: session.user.id,
        projectTemplateId: projectId
      }
    })

    if (!startedProject) {
      console.log('[MARK COMPLETE] Creating new StartedProject...')
      startedProject = await prisma.startedProject.create({
        data: {
          userId: session.user.id,
          projectTemplateId: projectId,
          progress: 0,
          completedSteps: [],
          status: 'in-progress'
        }
      })
    }

    // 3. Add step to completedSteps if not already there
    const completedSteps = startedProject.completedSteps || []
    if (!completedSteps.includes(stepId)) {
      completedSteps.push(stepId)
    }

    // 4. Calculate progress
    const progress = Math.round((completedSteps.length / project.steps.length) * 100)
    const isComplete = progress >= 100

    console.log('[MARK COMPLETE] Progress:', progress, '% | Completed:', completedSteps.length, '/', project.steps.length)

    // 5. Update progress and check for certificate eligibility
    const updatedProject = await prisma.startedProject.update({
      where: { id: startedProject.id },
      data: {
        completedSteps,
        progress,
        status: isComplete ? 'completed' : 'in-progress',
        certificateEligible: isComplete,
        certificateIssuedAt: isComplete ? new Date() : null
      }
    })

    console.log('[MARK COMPLETE] Certificate eligible:', updatedProject.certificateEligible)

    // 6. Award points (50 per step)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        points: { increment: 50 }
      }
    })

    return NextResponse.json({
      success: true,
      progress,
      certificateEligible: isComplete,
      completedSteps: completedSteps.length
    })

  } catch (error) {
    console.error('[MARK COMPLETE] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
