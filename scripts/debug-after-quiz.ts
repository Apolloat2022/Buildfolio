import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function debug() {
  console.log('\n🔍 POST-QUIZ DEBUG\n')
  
  // 1. Check quiz attempts
  const attempts = await prisma.quizAttempt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { step: true }
  })
  
  console.log('📝 Recent Quiz Attempts:')
  attempts.forEach(a => {
    console.log(`  - ${a.step.title}`)
    console.log(`    Score: ${a.score}% | Passed: ${a.passed ? '✅' : '❌'}`)
    console.log(`    Time: ${a.createdAt.toLocaleString()}`)
  })
  
  // 2. Check user progress
  const user = await prisma.user.findFirst({
    include: {
      startedProjects: {
        include: {
          projectTemplate: { include: { steps: true } }
        }
      }
    }
  })
  
  if (user) {
    console.log(`\n👤 User: ${user.email}`)
    console.log(`🎯 Points: ${user.points}`)
    
    if (user.startedProjects.length > 0) {
      const sp = user.startedProjects[0]
      console.log(`\n📦 Started Project: ${sp.projectTemplate.title}`)
      console.log(`   Progress: ${sp.progress}%`)
      console.log(`   Completed Steps: ${sp.completedSteps.length}`)
      console.log(`   Step IDs: ${sp.completedSteps.join(', ') || 'NONE'}`)
      console.log(`   Total Steps: ${sp.projectTemplate.steps.length}`)
    } else {
      console.log(`\n❌ NO STARTED PROJECT RECORD!`)
      console.log(`   This is the problem!`)
    }
  }
}

debug().then(() => process.exit(0))
