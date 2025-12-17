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

    // 1. Save quiz attempt
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

    // 2. ONLY IF PASSED: Update progress
    if (passed) {
      console.log('🎯 Quiz passed! Updating progress for step:', stepId)
      
      // Find the project for this step
      const step = await prisma.step.findUnique({
        where: { id: stepId },
        include: { projectTemplate: true }
      })
      
      if (step?.projectTemplate) {
        const project = step.projectTemplate
        
        // Ensure StartedProject exists
        const startedProject = await prisma.startedProject.upsert({
          where: {
            userId_projectId: {
              userId: session.user.id,
              projectId: project.id
            }
          },
          update: {},
          create: {
            userId: session.user.id,
            projectId: project.id,
            progress: 0,
            certificateEligible: false
          }
        })
        
        // Mark step as completed
        await prisma.stepCompletion.upsert({
          where: {
            userId_stepId: {
              userId: session.user.id,
              stepId: stepId
            }
          },
          update: {},
          create: {
            userId: session.user.id,
            stepId: stepId
          }
        })
        
        // Calculate progress
        const completedSteps = await prisma.stepCompletion.count({
          where: {
            userId: session.user.id,
            step: { projectTemplateId: project.id }
          }
        })
        
        const totalSteps = await prisma.step.count({
          where: { projectTemplateId: project.id }
        })
        
        const newProgress = Math.round((completedSteps / totalSteps) * 100)
        console.log(`📊 Progress: ${completedSteps}/${totalSteps} = ${newProgress}%`)
        
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
          console.log('🎉 CERTIFICATE AWARDED!')
        }
      }
      
      // Award points
      await prisma.user.update({
        where: { id: session.user.id },
        data: { totalPoints: { increment: 50 } }
      })
    }

    return NextResponse.json({
      success: true,
      quizAttempt,
      pointsAwarded: passed ? 50 : 0
    })

  } catch (error) {
    console.error('Quiz submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}