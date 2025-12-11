import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const existingProject = await prisma.projectTemplate.findUnique({
      where: { slug: 'ecommerce-store' },
      include: { steps: true }
    })

    let projectId: string

    if (!existingProject) {
      const newProject = await prisma.projectTemplate.create({
        data: {
          slug: 'ecommerce-store',
          title: 'Build an E-commerce Store',
          description: 'Create a full-stack e-commerce platform with product listings, shopping cart, and checkout functionality.',
          difficulty: 'intermediate',
          timeEstimate: '25-30 hours',
          technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
          resumeImpact: 5,
          category: 'Full-Stack'
        }
      })
      projectId = newProject.id
    } else {
      projectId = existingProject.id
    }

    await prisma.step.deleteMany({
      where: { projectTemplateId: projectId }
    })

    const stepData = [
      {
        projectTemplateId: projectId,
        order: 1,
        title: 'Project Setup & Database Schema',
        description: 'Initialize your Next.js project and set up the database schema for products, users, and orders.',
        estimatedTime: '2-3 hours',
        videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg',
        hints: [
          { level: 1, content: 'Make sure Node.js is installed (v18 or higher)', unlockMinutes: 5 },
          { level: 2, content: 'Use npx to ensure latest create-next-app version', unlockMinutes: 10 },
          { level: 3, content: 'Run "npx prisma generate" after creating schema', unlockMinutes: 15 }
        ],
        codeSnippets: [
          { language: 'bash', code: 'npx create-next-app@latest ecommerce-store\ncd ecommerce-store\nnpm install @prisma/client stripe @stripe/stripe-js\nnpx prisma init' },
          { language: 'prisma', code: 'model Product {\n  id          String   @id @default(cuid())\n  name        String\n  description String\n  price       Decimal  @db.Decimal(10, 2)\n  imageUrl    String\n  stock       Int\n  category    String\n  createdAt   DateTime @default(now())\n}' }
        ],
        pitfalls: ['Add DATABASE_URL to .env', 'Run prisma generate', 'Use Decimal for money']
      },
      {
        projectTemplateId: projectId,
        order: 2,
        title: 'Product Catalog Page',
        description: 'Build a responsive product grid.',
        estimatedTime: '3-4 hours',
        videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs',
        hints: [
          { level: 1, content: 'Use async/await in server components', unlockMinutes: 5 },
          { level: 2, content: 'Add loading.tsx for loading states', unlockMinutes: 10 }
        ],
        codeSnippets: [
          { language: 'typescript', code: 'const products = await prisma.product.findMany()' }
        ],
        pitfalls: ['Handle empty list', 'Add error boundaries']
      },
      {
        projectTemplateId: projectId,
        order: 3,
        title: 'Shopping Cart',
        description: 'Add cart functionality.',
        estimatedTime: '4-5 hours',
        videoUrl: 'https://www.youtube.com/embed/lATafp15HWA',
        hints: [
          { level: 1, content: 'Consider using Zustand for state', unlockMinutes: 5 },
          { level: 2, content: 'Persist to localStorage', unlockMinutes: 10 }
        ],
        codeSnippets: [
          { language: 'typescript', code: 'export const useCart = create((set) => ({ items: [] }))' }
        ],
        pitfalls: ['Validate cart on checkout', 'Handle quantity limits']
      },
      {
        projectTemplateId: projectId,
        order: 4,
        title: 'Stripe Integration',
        description: 'Set up payments.',
        estimatedTime: '5-6 hours',
        videoUrl: 'https://www.youtube.com/embed/1r-F3FIONl8',
        hints: [
          { level: 1, content: 'Get test keys from Stripe', unlockMinutes: 5 },
          { level: 2, content: 'Never expose secret keys', unlockMinutes: 10 }
        ],
        codeSnippets: [
          { language: 'typescript', code: 'const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)' }
        ],
        pitfalls: ['Use test cards', 'Handle webhooks']
      },
      {
        projectTemplateId: projectId,
        order: 5,
        title: 'Admin Dashboard',
        description: 'Manage orders.',
        estimatedTime: '6-7 hours',
        videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
        codeSnippets: [
          { language: 'typescript', code: 'const orders = await prisma.order.findMany()' }
        ],
        pitfalls: ['Add auth middleware', 'Role-based access']
      },
      {
        projectTemplateId: projectId,
        order: 6,
        title: 'Search & Filter',
        description: 'Add search.',
        estimatedTime: '3-4 hours',
        videoUrl: 'https://www.youtube.com/embed/mZvKPtH9Fzo',
        codeSnippets: [
          { language: 'typescript', code: 'where: { name: { contains: query } }' }
        ],
        pitfalls: ['Use URL params', 'Add debouncing']
      },
      {
        projectTemplateId: projectId,
        order: 7,
        title: 'Deploy to Vercel',
        description: 'Production deployment.',
        estimatedTime: '2-3 hours',
        videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA',
        codeSnippets: [
          { language: 'bash', code: 'vercel --prod' }
        ],
        pitfalls: ['Set environment variables', 'Configure CORS']
      }
    ]

    const createdSteps = []
    for (const step of stepData) {
      const created = await prisma.step.create({ data: step })
      createdSteps.push(created)
    }

    return NextResponse.json({
      success: true,
      message: '✅ Seeded with working video URLs!',
      projectId,
      stepsCreated: createdSteps.length
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}