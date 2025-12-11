import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await auth()
  
  if (session?.user?.email !== 'revanaglobal@gmail.com') {
    redirect('/')
  }

  const stats = await prisma.$transaction([
    prisma.user.count(),
    prisma.startedProject.count(),
    prisma.startedProject.count({ where: { status: 'completed' } }),
    prisma.showcase.count(),
    prisma.resumeProfile.count(),
  ])

  const recentUsers = await prisma.user.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      totalPoints: true,
      level: true,
      _count: {
        select: {
          startedProjects: true,
          showcases: true,
        }
      }
    }
  })

  const projectStats = await prisma.startedProject.groupBy({
    by: ['status'],
    _count: true,
  })

  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Control Panel</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <Link
              href="/admin/emails"
              className="flex flex-col items-center gap-2 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100"
            >
              <span className="text-4xl">??</span>
              <span className="font-bold">View All Emails</span>
            </Link>

            
              href="/api/admin/export"
              className="flex flex-col items-center gap-2 p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100"
            >
              <span className="text-4xl">??</span>
              <span className="font-bold">Export All Users</span>
            </a>

            
              href="/api/admin/export-emails?filter=free-users"
              className="flex flex-col items-center gap-2 p-6 bg-purple-50 border-2 border-purple-200 rounded-lg hover:bg-purple-100"
            >
              <span className="text-4xl">??</span>
              <span className="font-bold">Export Free Users</span>
            </a>

          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-3xl font-bold">{stats[0]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Projects Started</div>
            <div className="text-3xl font-bold">{stats[1]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Projects Completed</div>
            <div className="text-3xl font-bold">{stats[2]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Showcases</div>
            <div className="text-3xl font-bold">{stats[3]}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600">Resume Profiles</div>
            <div className="text-3xl font-bold">{stats[4]}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Project Status</h2>
          {projectStats.map((stat) => (
            <div key={stat.status} className="flex justify-between">
              <span>{stat.status}:</span>
              <span>{stat._count}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Users</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Level</th>
                <th className="text-left p-2">Points</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.level}</td>
                  <td className="p-2">{user.totalPoints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
