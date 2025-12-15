// check-ecommerce-quiz.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkEcommerceQuiz() {
  try {
    console.log('🔍 CHECKING E-COMMERCE STORE QUIZ STATUS\n')
    
    // Find the ecommerce store project
    const project = await prisma.projectTemplate.findUnique({
      where: { slug: 'ecommerce-store' },
      include: {
        steps: {
          include: {
            quizQuestions: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    })
    
    if (!project) {
      console.log('❌ E-commerce store project not found!')
      return
    }
    
    console.log(`📦 Project: ${project.title}`)
    console.log(`   Slug: ${project.slug}`)
    console.log(`   Steps: ${project.steps.length}\n`)
    
    // Check each step
    project.steps.forEach((step, index) => {
      console.log(`Step ${step.order}: ${step.title}`)
      console.log(`   Questions: ${step.quizQuestions.length}`)
      
      if (step.quizQuestions.length > 0) {
        console.log(`   ✅ Ready for quizzes`)
        // Show first question as example
        console.log(`   Sample: "${step.quizQuestions[0].question.substring(0, 60)}..."`)
      } else {
        console.log(`   ❌ NO QUIZ QUESTIONS!`)
      }
      console.log('')
    })
    
    // Total questions
    const totalQuestions = project.steps.reduce(
      (sum, step) => sum + step.quizQuestions.length, 0
    )
    console.log(`📊 TOTAL QUESTIONS: ${totalQuestions}`)
    
    if (totalQuestions === 0) {
      console.log('\n🚨 CRITICAL: No quiz questions found!')
      console.log('   This causes the strobe effect - modal opens but has no data')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEcommerceQuiz()
