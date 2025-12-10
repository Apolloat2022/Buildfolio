// lib/gamification.ts
import { prisma } from '@/lib/prisma'

export async function updateUserStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastActiveDate: true, currentStreak: true, longestStreak: true }
  })

  if (!user) return

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null
  lastActive?.setHours(0, 0, 0, 0)

  let newStreak = user.currentStreak
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (!lastActive) {
    newStreak = 1
  } else if (lastActive.getTime() === yesterday.getTime()) {
    newStreak += 1
  } else if (lastActive.getTime() < yesterday.getTime()) {
    newStreak = 1
  }

  const newLongestStreak = Math.max(newStreak, user.longestStreak || 0)

  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: new Date()
    }
  })

  return { currentStreak: newStreak, longestStreak: newLongestStreak }
}

export async function awardPoints(userId: string, points: number, reason: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { totalPoints: true, level: true }
  })

  if (!user) return

  const newPoints = user.totalPoints + points
  const newLevel = Math.floor(newPoints / 1000) + 1

  await prisma.user.update({
    where: { id: userId },
    data: {
      totalPoints: newPoints,
      level: newLevel
    }
  })

  // Create achievement record
  await prisma.achievement.create({
    data: {
      userId,
      title: reason,
      description: `Earned ${points} points`,
      points,
      icon: '⭐'
    }
  })

  // Check for new badges
  await checkAndAwardBadges(userId)

  return { newPoints, newLevel, leveledUp: newLevel > user.level }
}

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: true,
      startedProjects: true
    }
  })

  if (!user) return

  const badges = await prisma.badge.findMany()
  const newBadges = []

  for (const badge of badges) {
    const alreadyHas = user.badges.some(ub => ub.badgeId === badge.id)
    if (alreadyHas) continue

    const criteria = JSON.parse(badge.criteria)
    let shouldAward = false

    switch (criteria.type) {
      case 'streak':
        shouldAward = user.currentStreak >= criteria.value
        break
      case 'projects':
        shouldAward = user.startedProjects.filter(p => p.progress === 100).length >= criteria.value
        break
      case 'points':
        shouldAward = user.totalPoints >= criteria.value
        break
    }

    if (shouldAward) {
      await prisma.userBadge.create({
        data: { userId: user.id, badgeId: badge.id }
      })
      newBadges.push(badge)
    }
  }

  return newBadges
}