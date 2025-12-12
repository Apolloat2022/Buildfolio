import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function check() {
  const questions = await prisma.quizQuestion.findMany({
    include: { step: true }
  })
  
  console.log(`Total quiz questions: ${questions.length}`)
  
  if (questions.length > 0) {
    console.log('\nQuestions by step:')
    const byStep = questions.reduce((acc, q) => {
      const stepOrder = q.step.order
      acc[stepOrder] = (acc[stepOrder] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    
    Object.entries(byStep).forEach(([step, count]) => {
      console.log(`  Step ${step}: ${count} questions`)
    })
    
    // Show a sample stepId
    console.log(`\nSample stepId: ${questions[0].stepId}`)
  } else {
    console.log('❌ No quiz questions found!')
  }
}

check()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
