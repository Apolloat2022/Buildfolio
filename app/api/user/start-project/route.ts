import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await req.json()

    // Check if already started
    const existing = await prisma.startedProject.findFirst({
      where: {
        userId: session.user.id,
        projectTemplateId: projectId
      }
    })

    if (existing) {
      return NextResponse.json({ message: 'Already started', project: existing })
    }

    // Create new started project
    const startedProject = await prisma.startedProject.create({
      data: {
        userId: session.user.id,
        projectTemplateId: projectId,
        progress: 0,
        completedSteps: [],
        status: 'in-progress'
      }
    })

    return NextResponse.json({ success: true, project: startedProject })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
