// scripts/check-status.ts - SAFE READ-ONLY DIAGNOSTIC TOOL
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('📊 CURRENT PROJECT STATUS:')
  console.log('='.repeat(50))
  
  // Get all projects with their steps
  const projects = await prisma.projectTemplate.findMany({
    include: {
      steps: { 
        orderBy: { order: 'asc' },
        include: {
          _count: {
            select: { quizQuestions: true }
          }
        }
      }
    },
    orderBy: { title: 'asc' }
  })
  
  for (const p of projects) {
    // Calculate total quiz questions across all steps
    const totalQuizQuestions = p.steps.reduce((sum, step) => sum + step._count.quizQuestions, 0)
    
    console.log(`\n📱 ${p.title} (${p.slug}):`)
    console.log(`   Steps: ${p.steps.length}/7`)
    console.log(`   Quizzes: ${totalQuizQuestions}/35`)
    console.log(`   Status: ${p.steps.length === 7 ? '✅' : '❌'}`)
    
    // Show step-by-step quiz count for debugging
    if (p.steps.length > 0) {
      console.log(`   Step details:`)
      p.steps.forEach(step => {
        console.log(`     Step ${step.order}: ${step._count.quizQuestions} quizzes`)
      })
    }
  }
  
  const totalSteps = projects.reduce((sum, p) => sum + p.steps.length, 0)
  const totalQuizzes = projects.reduce((sum, p) => 
    sum + p.steps.reduce((stepSum, step) => stepSum + step._count.quizQuestions, 0), 0)
  
  console.log(`\n📈 TOTALS:`)
  console.log(`   Projects: ${projects.length}`)
  console.log(`   Steps: ${totalSteps}/42 (need 7×6=42)`)
  console.log(`   Quizzes: ${totalQuizzes}/210 (need 35×6=210)`)
  
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
