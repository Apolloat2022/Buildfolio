import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany()
  
  console.log(`Found ${users.length} users`)
  
  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalPoints: user.totalPoints ?? 0,
        currentStreak: user.currentStreak ?? 0,
        longestStreak: user.longestStreak ?? 0,
        level: user.level ?? 1,
        lastActiveDate: user.lastActiveDate ?? null
      }
    })
    console.log(`✅ Fixed user: ${user.email || user.id}`)
  }
  
  console.log('✅ All users updated!')
}

main()
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })