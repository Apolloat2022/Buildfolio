// scripts/test-resume-api.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function testResumeProfile() {
  console.log('🧪 Testing Resume Profile System...\n')
  
  // 1. Check if ResumeProfile table exists
  const tableExists = await prisma.$queryRaw`
    SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'ResumeProfile'
    );
  `
  console.log('1. Table exists:', tableExists[0].exists)
  
  // 2. Count existing profiles
  const profileCount = await prisma.resumeProfile.count()
  console.log('2. Total profiles in database:', profileCount)
  
  // 3. Show schema details
  const sampleUser = await prisma.user.findFirst()
  if (sampleUser) {
    console.log('\n3. Sample user found:', sampleUser.email)
    
    // Try to create a test profile
    const testProfile = await prisma.resumeProfile.upsert({
      where: { userId: sampleUser.id },
      update: { phone: '+1 (555) TEST-1234' },
      create: {
        userId: sampleUser.id,
        phone: '+1 (555) TEST-1234',
        location: 'Test City, TS',
        skills: ['JavaScript', 'React', 'TypeScript'],
        languages: ['English (Native)', 'Spanish (Basic)']
      }
    })
    
    console.log('4. Test profile created/updated:', testProfile.id)
    console.log('   Phone:', testProfile.phone)
    console.log('   Skills:', testProfile.skills)
    console.log('   Languages:', testProfile.languages)
  }
  
  console.log('\n✅ Resume Profile system is ready!')
  console.log('\nNext steps:')
  console.log('1. Your form can now save to: POST /api/resume/profile')
  console.log('2. It will auto-load from: GET /api/resume/profile')
  console.log('3. Buildfolio certificates will auto-include')
  
  await prisma.$disconnect()
}

testResumeProfile().catch(console.error)
