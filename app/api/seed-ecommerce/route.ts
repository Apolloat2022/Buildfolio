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
        codeSnippets: [
          { language: 'bash', code: 'npx create-next-app@latest ecommerce-store\ncd ecommerce-store\nnpm install @prisma/client stripe' },
          { language: 'prisma', code: 'model Product {\n  id String @id @default(cuid())\n  name String\n  price Decimal\n}' }
        ],
        pitfalls: ['Add DATABASE_URL to .env', 'Run prisma generate']
      },
      {
        projectTemplateId: projectId,
        order: 2,
        title: 'Product Catalog Page',
        description: 'Build a responsive product grid.',
        estimatedTime: '3-4 hours',
        codeSnippets: [
          { language: 'typescript', code: 'const products = await prisma.product.findMany()' }
        ],
        pitfalls: ['Handle loading states']
      },
      {
        projectTemplateId: projectId,
        order: 3,
        title: 'Shopping Cart',
        description: 'Add cart functionality.',
        estimatedTime: '4-5 hours',
        codeSnippets: [
          { language: 'typescript', code: 'export const useCart = create((set) => ({ items: [] }))' }
        ],
        pitfalls: ['Persist to localStorage']
      },
      {
        projectTemplateId: projectId,
        order: 4,
        title: 'Stripe Integration',
        description: 'Set up payments.',
        estimatedTime: '5-6 hours',
        codeSnippets: [
          { language: 'typescript', code: 'const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)' }
        ],
        pitfalls: ['Never expose secret keys']
      },
      {
        projectTemplateId: projectId,
        order: 5,
        title: 'Admin Dashboard',
        description: 'Manage orders.',
        estimatedTime: '6-7 hours',
        codeSnippets: [
          { language: 'typescript', code: 'const orders = await prisma.order.findMany()' }
        ],
        pitfalls: ['Add auth middleware']
      },
      {
        projectTemplateId: projectId,
        order: 6,
        title: 'Search & Filter',
        description: 'Add search.',
        estimatedTime: '3-4 hours',
        codeSnippets: [
          { language: 'typescript', code: 'where: { name: { contains: query } }' }
        ],
        pitfalls: ['Use URL params']
      },
      {
        projectTemplateId: projectId,
        order: 7,
        title: 'Deploy to Vercel',
        description: 'Production deployment.',
        estimatedTime: '2-3 hours',
        codeSnippets: [
          { language: 'bash', code: 'vercel --prod' }
        ],
        pitfalls: ['Set environment variables']
      }
    ]

    const createdSteps = []
    for (const step of stepData) {
      const created = await prisma.step.create({ data: step })
      createdSteps.push(created)
    }

    return NextResponse.json({
      success: true,
      message: '✅ Seeded successfully!',
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