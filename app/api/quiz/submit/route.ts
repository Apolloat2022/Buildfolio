// app/api/quiz/submit/route.ts - UPDATED VERSION
import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stepId, answers, score, passed } = body

    if (!stepId || !answers || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        stepId,
        answers,
        score,
        passed,
        timeSpentSeconds: 300, // Default 5 minutes
        attemptNumber: 1
      }
    })
    // ========== ADD PROGRESS TRACKING CODE ==========
    if (passed) {
      console.log("Quiz passed! Updating progress...")
      
      try {
        // 1. Find the project for this step
        const step = await prisma.step.findUnique({
          where: { id: stepId },
          include: { projectTemplate: true }
        })
        
        if (step?.projectTemplate) {
          console.log("Found project: " + step.projectTemplate.title)
          
          // 2. Create or find StartedProject
          const startedProject = await prisma.startedProject.upsert({
            where: {
              userId_projectId: {
                userId: session.user.id,
                projectId: step.projectTemplate.id
              }
            },
            update: {},
            create: {
              userId: session.user.id,
              projectId: step.projectTemplate.id,
              progress: 0,
              certificateEligible: false
            }
          })
          
          console.log("StartedProject ID: " + startedProject.id)
          
          // 3. Mark step as completed
          try {
            await prisma.stepCompletion.create({
              data: {
                userId: session.user.id,
                stepId: stepId
              }
            })
            console.log("Step marked as completed")
          } catch (error) {
            console.log("StepCompletion error: " + error.message)
          }
          // 4. Calculate progress
          // Count completed steps from quiz attempts
          const completedSteps = await prisma.quizAttempt.count({
            where: {
              userId: session.user.id,
              passed: true,
              step: { projectTemplateId: step.projectTemplate.id }
            },
            distinct: ["stepId"]
          })
          
          const totalSteps = await prisma.step.count({
            where: { projectTemplateId: step.projectTemplate.id }
          })
          
          const newProgress = Math.round((completedSteps / totalSteps) * 100)
          console.log("Progress: " + completedSteps + "/" + totalSteps + " = " + newProgress + "%")
          
          // 5. Update progress
          await prisma.startedProject.update({
            where: { id: startedProject.id },
            data: { progress: newProgress }
          })
          
          // 6. Award certificate at 100%
          if (newProgress === 100) {
            await prisma.startedProject.update({
              where: { id: startedProject.id },
              data: {
                certificateEligible: true,
                certificateIssuedAt: new Date()
              }
            })
            console.log("🎉 CERTIFICATE AWARDED!")
          }
          // 4. Calculate progress
          // Count completed steps from quiz attempts
          const completedSteps = await prisma.quizAttempt.count({
            where: {
              userId: session.user.id,
              passed: true,
              step: { projectTemplateId: step.projectTemplate.id }
            },
            distinct: ["stepId"]
          })
          
          const totalSteps = await prisma.step.count({
            where: { projectTemplateId: step.projectTemplate.id }
          })
          
          const newProgress = Math.round((completedSteps / totalSteps) * 100)
          console.log("Progress: " + completedSteps + "/" + totalSteps + " = " + newProgress + "%")
          
          // 5. Update progress
          await prisma.startedProject.update({
            where: { id: startedProject.id },
            data: { progress: newProgress }
          })
          
          // 6. Award certificate at 100%
          if (newProgress === 100) {
            await prisma.startedProject.update({
              where: { id: startedProject.id },
              data: {
                certificateEligible: true,
                certificateIssuedAt: new Date()
              }
            })
            console.log("🎉 CERTIFICATE AWARDED!")
          }
          
          // 4. Calculate progress
          // Count completed steps from quiz attempts
          const completedSteps = await prisma.quizAttempt.count({
            where: {
              userId: session.user.id,
              passed: true,
              step: { projectTemplateId: step.projectTemplate.id }
            },
            distinct: ["stepId"]
          })
          
          const totalSteps = await prisma.step.count({
            where: { projectTemplateId: step.projectTemplate.id }
          })
          
          const newProgress = Math.round((completedSteps / totalSteps) * 100)
          console.log("Progress: " + completedSteps + "/" + totalSteps + " = " + newProgress + "%")
          
          // 5. Update progress
          await prisma.startedProject.update({
            where: { id: startedProject.id },
            data: { progress: newProgress }
          })
          
          // 6. Award certificate at 100%
          if (newProgress === 100) {
            await prisma.startedProject.update({
              where: { id: startedProject.id },
              data: {
                certificateEligible: true,
                certificateIssuedAt: new Date()
              }
            })
            console.log("🎉 CERTIFICATE AWARDED!")
          }
        }
      } catch (error) {
        console.error("Progress update error:", error)
      }
    }
    // ========== END PROGRESS TRACKING CODE ==========
    

    // ===== ADDED CODE STARTS HERE =====
    if (passed) {
      // Mark step as completed for this user
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
      });

      // Find which project this step belongs to
      const stepWithProject = await prisma.step.findUnique({
        where: { id: stepId },
        include: { projectTemplate: true }
      });

      if (stepWithProject?.projectTemplate) {
        // Find or create StartedProject record
        const startedProject = await prisma.startedProject.upsert({
          where: {
            userId_projectId: {
              userId: session.user.id,
              projectId: stepWithProject.projectTemplate.id
            }
          },
          update: {},
          create: {
            userId: session.user.id,
            projectId: stepWithProject.projectTemplate.id,
            progress: 0,
            certificateEligible: false
          }
        });

        // Calculate new progress
        const totalSteps = await prisma.step.count({
          where: { projectTemplateId: stepWithProject.projectTemplate.id }
        });

        const completedSteps = await prisma.stepCompletion.count({
          where: {
            userId: session.user.id,
            step: { projectTemplateId: stepWithProject.projectTemplate.id }
          }
        });

        const newProgress = Math.round((completedSteps / totalSteps) * 100);
        
        // Update progress
        await prisma.startedProject.update({
          where: { id: startedProject.id },
          data: { progress: newProgress }
        });

        // Check for certificate eligibility
        if (newProgress === 100) {
          await prisma.startedProject.update({
            where: { id: startedProject.id },
            data: {
              certificateEligible: true,
              certificateIssuedAt: new Date()
            }
          });
        }
      }
    }
    // ===== ADDED CODE ENDS HERE =====

    // Award points for passing quiz (your existing code)
    if (passed) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          totalPoints: { increment: 50 }
        }
      })
    }

    return NextResponse.json({
      success: true,
      quizAttempt,
      pointsAwarded: passed ? 50 : 0
    })

  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}
