// test-api-direct.js - Direct API test
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDirectAPI() {
  try {
    console.log('🔍 DIRECT API TEST\n')
    
    // 1. Get a real step with questions
    const stepWithQuestions = await prisma.step.findFirst({
      where: {
        quizQuestions: {
          some: {}  // Has at least one question
        }
      },
      select: {
        id: true,
        title: true,
        projectTemplate: {
          select: {
            title: true,
            slug: true
          }
        },
        quizQuestions: {
          select: {
            id: true,
            question: true
          },
          take: 2
        }
      }
    })
    
    if (!stepWithQuestions) {
      console.log('❌ No steps with quiz questions found!')
      return
    }
    
    console.log('✅ Found step with questions:')
    console.log(`   Project: ${stepWithQuestions.projectTemplate.title}`)
    console.log(`   Step: ${stepWithQuestions.title}`)
    console.log(`   Step ID: ${stepWithQuestions.id}`)
    console.log(`   Questions: ${stepWithQuestions.quizQuestions.length}`)
    
    // 2. Test the API endpoint programmatically
    console.log('\n🔧 Simulating API call...')
    
    // Simulate what the API does
    const simulatedQuestions = await prisma.quizQuestion.findMany({
      where: { stepId: stepWithQuestions.id },
      orderBy: { order: 'asc' }
    })
    
    console.log(`   Simulated API returns: ${simulatedQuestions.length} questions`)
    console.log(`   Format check: ${Array.isArray(simulatedQuestions) ? '✅ Array' : '❌ Not array'}`)
    
    // 3. Also test a step WITHOUT questions
    const stepWithoutQuestions = await prisma.step.findFirst({
      where: {
        quizQuestions: {
          none: {}  // No questions
        }
      },
      select: {
        id: true,
        title: true
      }
    })
    
    if (stepWithoutQuestions) {
      console.log('\n🔍 Testing step WITHOUT questions:')
      console.log(`   Step: ${stepWithoutQuestions.title}`)
      console.log(`   Step ID: ${stepWithoutQuestions.id}`)
      
      const emptyResult = await prisma.quizQuestion.findMany({
        where: { stepId: stepWithoutQuestions.id }
      })
      
      console.log(`   Questions found: ${emptyResult.length} (should be 0)`)
    }
    
    // 4. Check ALL steps for ecommerce-store
    console.log('\n📊 CHECKING E-COMMERCE STORE STEPS:')
    
    const ecommerceSteps = await prisma.step.findMany({
      where: {
        projectTemplate: {
          slug: 'ecommerce-store'
        }
      },
      include: {
        quizQuestions: true
      },
      orderBy: { order: 'asc' }
    })
    
    console.log(`   Total steps: ${ecommerceSteps.length}`)
    
    ecommerceSteps.forEach((step, index) => {
      const status = step.quizQuestions.length > 0 ? '✅' : '❌'
      console.log(`   ${status} Step ${step.order}: ${step.quizQuestions.length} questions`)
    })
    
  } catch (error) {
    console.error('Test error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDirectAPI()
