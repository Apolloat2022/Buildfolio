// get-step-ids-fixed.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function getStepIds() {
  try {
    // Get steps from different projects
    const steps = await prisma.step.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        order: true,
        projectTemplate: {
          select: {
            title: true,
            slug: true
          }
        },
        quizQuestions: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        order: 'asc'  // Use 'order' field instead of 'createdAt'
      },
      where: {
        projectTemplate: {
          slug: 'ecommerce-store'  // Start with e-commerce store
        }
      }
    })
    
    console.log('🔍 STEP IDs FOR TESTING:')
    console.log('='.repeat(60))
    
    steps.forEach((step, index) => {
      console.log(`\n${index + 1}. ${step.projectTemplate.title} - Step ${step.order}`)
      console.log(`   Title: ${step.title}`)
      console.log(`   Step ID: ${step.id}`)
      console.log(`   Has questions: ${step.quizQuestions.length > 0 ? '✅ Yes' : '❌ No'}`)
      console.log(`   Project slug: ${step.projectTemplate.slug}`)
    })
    
    console.log('\n' + '='.repeat(60))
    console.log('\n📋 COPY THESE STEP IDs FOR TESTING:')
    steps.forEach(step => {
      console.log(`"${step.id}", // ${step.projectTemplate.title} - Step ${step.order}`)
    })
    
    // Also get steps WITHOUT questions for debugging
    console.log('\n🔍 STEPS WITHOUT QUIZ QUESTIONS:')
    const stepsWithoutQuestions = await prisma.step.findMany({
      where: {
        quizQuestions: {
          none: {}  // No quiz questions
        }
      },
      select: {
        id: true,
        title: true,
        order: true,
        projectTemplate: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      take: 5
    })
    
    if (stepsWithoutQuestions.length > 0) {
      console.log(`Found ${stepsWithoutQuestions.length} steps without quiz questions:`)
      stepsWithoutQuestions.forEach(step => {
        console.log(`  ❌ ${step.projectTemplate.title} - Step ${step.order}: "${step.title}"`)
      })
    } else {
      console.log('✅ All checked steps have quiz questions')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getStepIds()
