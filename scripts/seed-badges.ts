// scripts/seed-badges.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const badges = [
    {
      name: 'First Step',
      description: 'Complete your first tutorial step',
      icon: '🎯',
      criteria: JSON.stringify({ type: 'points', value: 50 }),
      points: 50
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      criteria: JSON.stringify({ type: 'streak', value: 7 }),
      points: 200
    },
    {
      name: 'Project Master',
      description: 'Complete 3 full projects',
      icon: '👨‍💻',
      criteria: JSON.stringify({ type: 'projects', value: 3 }),
      points: 1000
    },
    {
      name: 'Fast Learner',
      description: 'Reach level 5',
      icon: '⚡',
      criteria: JSON.stringify({ type: 'points', value: 5000 }),
      points: 500
    },
    {
      name: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: '👑',
      criteria: JSON.stringify({ type: 'streak', value: 30 }),
      points: 1000
    }
  ]

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge
    })
  }

  console.log('✅ Badges seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())