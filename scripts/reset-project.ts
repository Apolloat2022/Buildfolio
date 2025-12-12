import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function reset() {
  const userId = 'cmj35wqyk000041uchedxvsm3'
  
  console.log('🔄 Resetting E-commerce project...')
  
  // Delete all quiz attempts
  const project = await prisma.startedProject.findFirst({
    where: {
      userId,
      projectTemplate: { slug: 'ecommerce-store' }
    },
    include: {
      projectTemplate: {
        include: { steps: true }
      }
    }
  })
  
  if (!project) {
    console.log('❌ Project not found')
    return
  }
  
  const stepIds = project.projectTemplate.steps.map(s => s.id)
  
  await prisma.quizAttempt.deleteMany({
    where: {
      userId,
      stepId: { in: stepIds }
    }
  })
  
  console.log('✅ Deleted quiz attempts')
  
  // Reset project progress
  await prisma.startedProject.update({
    where: { id: project.id },
    data: {
      progress: 0,
      completedSteps: [],
      status: 'in-progress',
      certificateEligible: false,
      certificateIssuedAt: null,
      githubRepoUrl: null,
      showcaseSubmitted: false,
      adminReviewed: false,
      timeSpentMinutes: 0
    }
  })
  
  console.log('✅ Reset project to 0%')
  console.log('\n📋 Testing Instructions:')
  console.log('1. Go to: https://buildfolio.tech/projects/ecommerce-store')
  console.log('2. Complete all 7 steps (pass the quizzes)')
  console.log('3. At 100%, you should see certificate button')
  console.log('4. Click it to download certificate')
}

reset()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
