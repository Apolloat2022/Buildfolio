import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ResumeProfileForm from '@/components/ResumeProfileForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function ResumeProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const profile = await prisma.resumeProfile.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resume Profile</h1>
          <p className="text-gray-600 mt-2">
            Complete your profile to generate a comprehensive resume
          </p>
        </div>

        <ResumeProfileForm initialData={profile} />
      </div>
    </div>
  )
}
