import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testConnection() {
  console.log('🔗 Testing database connection...')
  
  try {
    // Test basic connection
    console.log('1. Testing Prisma connection...')
    await prisma.$connect()
    console.log('✅ Prisma connected successfully')
    
    // Count projects
    const projectCount = await prisma.projectTemplate.count()
    console.log(`✅ Found ${projectCount} projects`)
    
    // Get weather app
    const weatherApp = await prisma.projectTemplate.findUnique({
      where: { slug: 'weather-app' },
      include: { steps: true }
    })
    
    if (weatherApp) {
      console.log(`✅ Weather App: "${weatherApp.title}"`)
      console.log(`   Steps: ${weatherApp.steps.length}`)
      console.log(`   Category: ${weatherApp.category || 'none'}`)
    } else {
      console.log('❌ Weather App not found')
    }
    
    console.log('\n🎉 Database test complete!')
    
  } catch (error: any) {
    console.error('\n❌ DATABASE ERROR:', error.message)
    console.log('\n📋 Check these:')
    console.log('1. Your .env file DATABASE_URL')
    console.log('2. Run: npx prisma generate')
    console.log('3. Make sure Neon DB is running')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
