// get-step-ids.js
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
          select: { title: true, slug: true }
        },
        quizQuestions: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: 'desc' }
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
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

getStepIds()
