// prisma/check-migration.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkMigration() {
  console.log('🔄 Checking database migration state...\n')
  
  try {
    // Check if we can connect
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check project templates table
    const projectCount = await prisma.projectTemplate.count()
    console.log(`📁 Project templates: ${projectCount}`)
    
    // Check project steps table
    const stepCount = await prisma.projectStep.count()
    console.log(`📝 Project steps: ${stepCount}`)
    
    // Check quiz questions table
    const quizCount = await prisma.quizQuestion.count()
    console.log(`❓ Quiz questions: ${quizCount}`)
    
    // Show sample data
    if (projectCount > 0) {
      console.log('\n📋 Sample project:')
      const sample = await prisma.projectTemplate.findFirst({
        include: { steps: true }
      })
      console.log(JSON.stringify(sample, null, 2))
    }
    
  } catch (error: any) {
    console.error('❌ Database error:', error.message)
    
    if (error.code === 'P1001') {
      console.log('💡 Database may not be running or configured correctly')
      console.log('Run: npx prisma generate')
      console.log('Then: npx prisma db push')
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkMigration()
