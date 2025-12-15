// check-all-projects.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkAllProjects() {
  try {
    console.log('📊 CHECKING ALL PROJECTS\n')
    
    // 1. Get all projects
    const allProjects = await prisma.projectTemplate.findMany({
      include: {
        steps: {
          include: {
            quizQuestions: true
          }
        }
      }
    })
    
    console.log(`Total Projects: ${allProjects.length}`)
    console.log('='.repeat(50))
    
    // 2. Show each project's quiz status
    allProjects.forEach((project, index) => {
      const totalSteps = project.steps.length
      const stepsWithQuestions = project.steps.filter(step => step.quizQuestions.length > 0)
      const totalQuestions = project.steps.reduce((sum, step) => sum + step.quizQuestions.length, 0)
      
      console.log(`\n${index + 1}. ${project.title}`)
      console.log(`   Slug: ${project.slug}`)
      console.log(`   Steps: ${totalSteps}`)
      console.log(`   Steps with questions: ${stepsWithQuestions.length}`)
      console.log(`   Total questions: ${totalQuestions}`)
      
      // Show step details if missing questions
      project.steps.forEach((step, stepIndex) => {
        if (step.quizQuestions.length === 0) {
          console.log(`   ❌ Step ${stepIndex + 1}: "${step.title}" - NO QUESTIONS`)
        }
      })
    })
    
    console.log('\n' + '='.repeat(50))
    
    // 3. Grand total
    const grandTotalQuestions = allProjects.reduce(
      (sum, project) => sum + project.steps.reduce((s, step) => s + step.quizQuestions.length, 0), 
      0
    )
    
    console.log(`\n📈 GRAND TOTAL: ${grandTotalQuestions} quiz questions across ${allProjects.length} projects`)
    
    // 4. Check which projects have "Mark Complete" button
    console.log('\n🔍 Projects missing quiz questions:')
    allProjects.forEach(project => {
      const hasAllQuestions = project.steps.every(step => step.quizQuestions.length > 0)
      if (!hasAllQuestions) {
        console.log(`   ❌ ${project.title} - Missing quiz questions on some steps`)
      }
    })
    
  } catch (error) {
    console.error('Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAllProjects()
