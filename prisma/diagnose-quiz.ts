// prisma/diagnose-quiz.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function diagnose() {
  console.log('🔍 DIAGNOSING QUIZ DATABASE STATE\n')
  
  try {
    // 1. Check all projects
    console.log('📦 ALL PROJECTS:')
    const projects = await prisma.projectTemplate.findMany({
      select: { id: true, title: true, slug: true }
    })
    projects.forEach(p => {
      console.log(`   ${p.slug}: ${p.title} (ID: ${p.id})`)
    })
    
    // 2. Check ecommerce store specifically
    console.log('\n🎯 E-COMMERCE STORE DETAILS:')
    const ecommerce = await prisma.projectTemplate.findUnique({
      where: { slug: 'ecommerce-store' },
      include: { 
        steps: { 
          select: { id: true, title: true, order: true },
          orderBy: { order: 'asc' }
        }
      }
    })
    
    if (!ecommerce) {
      console.log('❌ E-commerce store not found!')
      console.log('Available slugs:', projects.map(p => p.slug))
      return
    }
    
    console.log(`✅ Found: ${ecommerce.title}`)
    console.log(`   ID: ${ecommerce.id}`)
    console.log(`   Steps: ${ecommerce.steps.length}`)
    
    ecommerce.steps.forEach(step => {
      console.log(`   Step ${step.order}: ${step.title} (ID: ${step.id})`)
    })
    
    // 3. Check existing quiz questions
    console.log('\n❓ EXISTING QUIZ QUESTIONS:')
    const allQuestions = await prisma.quizQuestion.findMany({
      include: { step: { select: { title: true } } }
    })
    
    console.log(`   Total questions in DB: ${allQuestions.length}`)
    
    if (allQuestions.length > 0) {
      const questionsByStep = allQuestions.reduce((acc, q) => {
        const stepName = q.step?.title || 'Unknown'
        acc[stepName] = (acc[stepName] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      for (const [stepName, count] of Object.entries(questionsByStep)) {
        console.log(`   ${stepName}: ${count} questions`)
      }
    }
    
    // 4. Check foreign key relationships
    console.log('\n🔗 FOREIGN KEY CHECK:')
    const stepIds = ecommerce.steps.map(s => s.id)
    const questionsForSteps = await prisma.quizQuestion.findMany({
      where: { stepId: { in: stepIds } }
    })
    
    console.log(`   Questions linked to ecommerce steps: ${questionsForSteps.length}`)
    
    // 5. Step-by-step verification
    console.log('\n✅ STEP-BY-STEP VERIFICATION:')
    for (const step of ecommerce.steps) {
      const stepExists = await prisma.projectStep.findUnique({
        where: { id: step.id }
      })
      console.log(`   Step "${step.title}": ${stepExists ? '✅ Exists in DB' : '❌ NOT FOUND'}`)
    }
    
  } catch (error: any) {
    console.error('Diagnostic error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

diagnose()
