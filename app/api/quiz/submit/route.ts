import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { stepId, answers, score } = data
    const passed = score >= 80

    // Save quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        stepId,
        answers,
        score,
        passed,
        timeSpentSeconds: 300,
        attemptNumber: 1
      }
    })

    // If passed, update progress and mark step as completed
    if (passed) {
      console.log("[QUIZ] Step passed, updating progress...")
      
      // Find the project for this step
      const step = await prisma.step.findUnique({
        where: { id: stepId },
        include: { projectTemplate: true }
      })
      
      if (!step?.projectTemplate) {
        throw new Error("Step or project not found")
      }
      
      const project = step.projectTemplate
      const userId = session.user.id
      
      // Ensure StartedProject exists
      const startedProject = await prisma.startedProject.upsert({
        where: {
          userId_projectId: {
            userId,
            projectId: project.id
          }
        },
        update: {},
        create: {
          userId,
          projectId: project.id,
          progress: 0,
          certificateEligible: false
        }
      })
      
      // Mark step as completed
      try {
        await prisma.stepCompletion.upsert({
          where: {
            userId_stepId: {
              userId,
              stepId
            }
          },
          update: {},
          create: {
            userId,
            stepId
          }
        })
        console.log("[QUIZ] StepCompletion created/updated")
      } catch (error) {
        console.error("[QUIZ] StepCompletion error:", error)
      }
      
      // Calculate progress
      const completedSteps = await prisma.stepCompletion.count({
        where: {
          userId,
          step: { projectTemplateId: project.id }
        }
      })
      
      const totalSteps = await prisma.step.count({
        where: { projectTemplateId: project.id }
      })
      
      const newProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
      console.log(`[QUIZ] Progress: ${completedSteps}/${totalSteps} = ${newProgress}%`)
      
      // Update progress
      await prisma.startedProject.update({
        where: { id: startedProject.id },
        data: { progress: newProgress }
      })
      
      // Award certificate at 100%
      if (newProgress === 100) {
        await prisma.startedProject.update({
          where: { id: startedProject.id },
          data: {
            certificateEligible: true,
            certificateIssuedAt: new Date()
          }
        })
        console.log("[QUIZ] 🎉 CERTIFICATE AWARDED!")
      }
      
      // Award points
      await prisma.user.update({
        where: { id: userId },
        data: { totalPoints: { increment: 50 } }
      })
    }

    return NextResponse.json({
      success: true,
      quizAttempt,
      pointsAwarded: passed ? 50 : 0
    })

  } catch (error) {
    console.error("[QUIZ] API error:", error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
