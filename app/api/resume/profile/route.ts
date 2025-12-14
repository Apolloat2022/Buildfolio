// app/api/resume/profile/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const data = await req.json()
    
    // Get user's Buildfolio certificates to auto-include
    const userCertificates = await prisma.startedProject.findMany({
      where: {
        userId: session.user.id,
        certificateEligible: true,
        certificateIssuedAt: { not: null }
      },
      include: {
        projectTemplate: true
      }
    })
    
    // Format Buildfolio certificates
    const buildfolioCerts = userCertificates.map(uc => ({
      name: uc.projectTemplate.title + ' Certificate',
      issuer: 'Buildfolio',
      date: uc.certificateIssuedAt?.toISOString().split('T')[0],
      credentialId: `BF-${uc.id.slice(0, 8).toUpperCase()}`,
      credentialUrl: `https://buildfolio.tech/certificates?project=${uc.projectTemplate.slug}`
    }))
    
    // Combine with user-submitted certifications
    const userCerts = Array.isArray(data.certifications) ? data.certifications : []
    const allCertifications = [...buildfolioCerts, ...userCerts]
    
    // Handle skills - ensure it's an array
    const skills = Array.isArray(data.skills) ? data.skills : 
                  typeof data.skills === 'string' ? [data.skills] : []
    
    // Handle languages - ensure it's an array
    const languages = Array.isArray(data.languages) ? data.languages : 
                     typeof data.languages === 'string' ? [data.languages] : []
    
    // Prepare update data
    const updateData = {
      ...data,
      skills,
      languages,
      certifications: allCertifications
    }
    
    // Upsert (update or create) resume profile
    const resumeProfile = await prisma.resumeProfile.upsert({
      where: { userId: session.user.id },
      update: {
        ...updateData,
        updatedAt: new Date()
      },
      create: {
        userId: session.user.id,
        ...updateData
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Resume profile saved successfully',
      data: resumeProfile 
    })
    
  } catch (error) {
    console.error('Resume profile save error:', error)
    return NextResponse.json({ 
      error: 'Failed to save resume profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const profile = await prisma.resumeProfile.findUnique({
      where: { userId: session.user.id }
    })
    
    // If no profile exists, return empty object
    return NextResponse.json(profile || {})
    
  } catch (error) {
    console.error('Resume profile fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch resume profile',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
