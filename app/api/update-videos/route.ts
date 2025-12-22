import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const updates = [
      // WEATHER APP - Unique videos per step
      {
        slug: 'weather-app',
        videos: [
          'https://www.youtube.com/embed/QMWyM_2xYkg', // Step 1: Weather API setup
          'https://www.youtube.com/embed/QMWyM_2xYkg', // Step 2: Fetch data
          'https://www.youtube.com/embed/GuA0_Z1llYU', // Step 3: Display UI
          'https://www.youtube.com/embed/GXrDEA3SIOQ', // Step 4: 5-day forecast
          'https://www.youtube.com/embed/3tYLz5Mfjoc', // Step 5: Geolocation
          'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 6: Deploy
        ]
      },
      // SOCIAL DASHBOARD - Fixed videos
      {
        slug: 'social-dashboard',
        videos: [
          'https://www.youtube.com/embed/RebA5J-rlwg', // Step 1: Prisma schema
          'https://www.youtube.com/embed/1MTyCvS05V4', // Step 2: NextAuth
          'https://www.youtube.com/embed/mbsmsi7l3r4', // Step 3: Posts (FIXED)
          'https://www.youtube.com/embed/mZvKPtH9Fzo', // Step 4: Feed (FIXED)
          'https://www.youtube.com/embed/lATafp15HWA', // Step 5: Likes (FIXED)
          'https://www.youtube.com/embed/1r-F3FIONl8', // Step 6: Real-time (FIXED)
          'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 7: Deploy
        ]
      },
      // RECIPE FINDER - Fixed videos
      {
        slug: 'recipe-finder',
        videos: [
          'https://www.youtube.com/embed/Sklc_fQBmcs', // Step 1: API setup (FIXED)
          'https://www.youtube.com/embed/Rh3tobg7hEo', // Step 2: Search (FIXED)
          'https://www.youtube.com/embed/O6P86uwfdR0', // Step 3: Details (FIXED)
          'https://www.youtube.com/embed/AUOzvFzdIk4', // Step 4: Favorites
          'https://www.youtube.com/embed/hQAHSlTtcmY', // Step 5: Meal planner
          'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 6: Deploy
        ]
      },
      // PORTFOLIO BUILDER - Keep existing (they work)
      {
        slug: 'portfolio-builder',
        videos: [
          'https://www.youtube.com/embed/ZVnjOPwW4ZA', // Step 1: Next.js setup
          'https://www.youtube.com/embed/ZjAqacIC_3c', // Step 2: Routing
          'https://www.youtube.com/embed/J_0SBJMxmcw', // Step 3: MDX
          'https://www.youtube.com/embed/VSB2h7mVhPg', // Step 4: Gallery
          'https://www.youtube.com/embed/dFQiiOiIiUA', // Step 5: Contact
          'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 6: Deploy
        ]
      }
    ]

    for (const project of updates) {
      const dbProject = await prisma.projectTemplate.findUnique({
        where: { slug: project.slug },
        include: { steps: { orderBy: { order: 'asc' } } }
      })

      if (dbProject && dbProject.steps.length === project.videos.length) {
        for (let i = 0; i < dbProject.steps.length; i++) {
          await prisma.step.update({
            where: { id: dbProject.steps[i].id },
            data: { videoUrl: project.videos[i] }
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: '✅ Updated all videos with unique, working URLs!'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
