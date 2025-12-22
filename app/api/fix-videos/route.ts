import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Update Weather App videos
    const weatherProject = await prisma.projectTemplate.findUnique({
      where: { slug: 'weather-app' },
      include: { steps: true }
    })

    if (weatherProject) {
      const weatherVideos = [
        'https://www.youtube.com/embed/MIYQR-Ybrn4', // Step 1: API Setup
        'https://www.youtube.com/embed/MIYQR-Ybrn4', // Step 2: Fetch Data
        'https://www.youtube.com/embed/MIYQR-Ybrn4', // Step 3: Display
        'https://www.youtube.com/embed/MIYQR-Ybrn4', // Step 4: Forecast
        'https://www.youtube.com/embed/MIYQR-Ybrn4', // Step 5: Geolocation
        'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 6: Deploy
      ]

      for (let i = 0; i < weatherProject.steps.length; i++) {
        await prisma.step.update({
          where: { id: weatherProject.steps[i].id },
          data: { videoUrl: weatherVideos[i] }
        })
      }
    }

    // Update Social Dashboard videos
    const socialProject = await prisma.projectTemplate.findUnique({
      where: { slug: 'social-dashboard' },
      include: { steps: true }
    })

    if (socialProject) {
      const socialVideos = [
        'https://www.youtube.com/embed/RebA5J-rlwg', // Step 1: Database
        'https://www.youtube.com/embed/1MTyCvS05V4', // Step 2: Auth
        'https://www.youtube.com/embed/AS79oJ3Fcf0', // Step 3: Posts
        'https://www.youtube.com/embed/NZKUirTtxcg', // Step 4: Feed
        'https://www.youtube.com/embed/NZKUirTtxcg', // Step 5: Likes
        'https://www.youtube.com/embed/NZKUirTtxcg', // Step 6: Real-time
        'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 7: Deploy
      ]

      for (let i = 0; i < socialProject.steps.length; i++) {
        await prisma.step.update({
          where: { id: socialProject.steps[i].id },
          data: { videoUrl: socialVideos[i] }
        })
      }
    }

    // Update Recipe Finder videos
    const recipeProject = await prisma.projectTemplate.findUnique({
      where: { slug: 'recipe-finder' },
      include: { steps: true }
    })

    if (recipeProject) {
      const recipeVideos = [
        'https://www.youtube.com/embed/xc4uOzlndAk', // Step 1: API
        'https://www.youtube.com/embed/xc4uOzlndAk', // Step 2: Search
        'https://www.youtube.com/embed/xc4uOzlndAk', // Step 3: Details
        'https://www.youtube.com/embed/AUOzvFzdIk4', // Step 4: Favorites
        'https://www.youtube.com/embed/hQAHSlTtcmY', // Step 5: Meal Plan
        'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 6: Deploy
      ]

      for (let i = 0; i < recipeProject.steps.length; i++) {
        await prisma.step.update({
          where: { id: recipeProject.steps[i].id },
          data: { videoUrl: recipeVideos[i] }
        })
      }
    }

    // Update Portfolio videos
    const portfolioProject = await prisma.projectTemplate.findUnique({
      where: { slug: 'portfolio-builder' },
      include: { steps: true }
    })

    if (portfolioProject) {
      const portfolioVideos = [
        'https://www.youtube.com/embed/ZVnjOPwW4ZA', // Step 1: Setup
        'https://www.youtube.com/embed/ZjAqacIC_3c', // Step 2: Pages
        'https://www.youtube.com/embed/J_0SBJMxmcw', // Step 3: MDX
        'https://www.youtube.com/embed/VSB2h7mVhPg', // Step 4: Gallery
        'https://www.youtube.com/embed/dFQiiOiIiUA', // Step 5: Contact
        'https://www.youtube.com/embed/2HBIzEx6IZA'  // Step 6: Deploy
      ]

      for (let i = 0; i < portfolioProject.steps.length; i++) {
        await prisma.step.update({
          where: { id: portfolioProject.steps[i].id },
          data: { videoUrl: portfolioVideos[i] }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: '✅ Fixed all video URLs!'
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
