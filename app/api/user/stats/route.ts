// app/api/user/stats/route.ts
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        badges: {
          include: { badge: true }
        },
        startedProjects: {
          where: { progress: 100 }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      currentStreak: user.currentStreak || 0,
      longestStreak: user.longestStreak || 0,
      totalPoints: user.totalPoints || 0,
      level: user.level || 1,
      completedProjects: user.startedProjects.length,
      badges: user.badges.map(ub => ({
        id: ub.badge.id,
        name: ub.badge.name,
        icon: ub.badge.icon,
        unlockedAt: ub.unlockedAt
      }))
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 })
  }
}