import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.resumeProfile.findUnique({
      where: { userId: session.user.id },
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const profile = await prisma.resumeProfile.upsert({
      where: { userId: session.user.id },
      update: {
        phone: data.phone,
        location: data.location,
        website: data.website,
        linkedin: data.linkedin,
        github: data.github,
        professionalSummary: data.professionalSummary,
        workExperience: data.workExperience,
        education: data.education,
        certifications: data.certifications,
        skills: data.skills,
        languages: data.languages,
      },
      create: {
        userId: session.user.id,
        phone: data.phone,
        location: data.location,
        website: data.website,
        linkedin: data.linkedin,
        github: data.github,
        professionalSummary: data.professionalSummary,
        workExperience: data.workExperience,
        education: data.education,
        certifications: data.certifications,
        skills: data.skills,
        languages: data.languages,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Save profile error:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}
