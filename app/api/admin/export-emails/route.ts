import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()
  
  if (session?.user?.email !== 'revanaglobal@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') || 'all'

  let whereClause: any = {}

  // Filter logic for targeted campaigns
  if (filter === 'free-users') {
    // Users on free plan (no subscription or FREE plan)
    whereClause = {
      OR: [
        { subscriptions: { none: {} } },
        { subscriptions: { some: { plan: 'FREE' } } }
      ]
    }
  } else if (filter === 'active-free') {
    // Free users who are actively using the platform
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    whereClause = {
      lastActiveDate: { gte: thirtyDaysAgo },
      OR: [
        { subscriptions: { none: {} } },
        { subscriptions: { some: { plan: 'FREE' } } }
      ]
    }
  } else if (filter === 'completed-projects') {
    // Users who completed at least one project (ready for upgrade)
    whereClause = {
      startedProjects: {
        some: { status: 'completed' }
      }
    }
  } else if (filter === 'trial-ending') {
    // Users with trial ending soon (if you add trials)
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    
    whereClause = {
      subscriptions: {
        some: {
          status: 'TRIAL',
          expiresAt: { lte: sevenDaysFromNow }
        }
      }
    }
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    include: {
      startedProjects: true,
      subscriptions: true,
      resumeProfile: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  // Build CSV for email marketing
  const csvRows = []
  
  csvRows.push([
    'Email',
    'Name',
    'Subscription',
    'Projects Completed',
    'Engagement Score',
    'Joined Date',
    'Last Active',
  ].join(','))

  users.forEach(user => {
    const projectsCompleted = user.startedProjects.filter(p => p.status === 'completed').length
    const engagementScore = user.totalPoints // Higher points = more engaged
    const subscription = user.subscriptions[0]
    
    csvRows.push([
      user.email || '',
      `"${user.name || ''}"`,
      subscription?.plan || 'FREE',
      projectsCompleted,
      engagementScore,
      new Date(user.createdAt).toLocaleDateString(),
      user.lastActiveDate ? new Date(user.lastActiveDate).toLocaleDateString() : 'Never',
    ].join(','))
  })

  const csv = csvRows.join('\n')
  const filename = `buildfolio-emails-${filter}-${new Date().toISOString().split('T')[0]}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
