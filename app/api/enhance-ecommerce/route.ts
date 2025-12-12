import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const project = await prisma.projectTemplate.findUnique({
      where: { slug: 'ecommerce-store' }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await prisma.step.deleteMany({
      where: { projectTemplateId: project.id }
    })

    const enhancedSteps = [
      {
        projectTemplateId: project.id,
        order: 1,
        title: 'Project Setup & Database Schema',
        description: 'Initialize your Next.js project with TypeScript, install all dependencies, and create a comprehensive database schema with Prisma ORM.',
        estimatedTime: '2-3 hours',
        estimatedMinutes: 150,
        videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg',
        hints: [
          { level: 1, content: '✅ Quick Check: Verify Node.js version with "node -v". Need v18 or higher for Next.js 14.', unlockMinutes: 3 },
          { level: 2, content: '💡 Pro Tip: Use "npx" instead of global installs to always get the latest create-next-app version.', unlockMinutes: 7 },
          { level: 3, content: '🗄️ Database Setup: Get free PostgreSQL from Neon.tech. Copy connection string to .env as DATABASE_URL.', unlockMinutes: 12 },
          { level: 4, content: '⚡ Must Run: After updating schema.prisma, always run "npx prisma generate" to update your Prisma Client.', unlockMinutes: 18 },
          { level: 5, content: '🎯 Success Check: Run "npx prisma studio" to open visual database browser at localhost:5555', unlockMinutes: 25 }
        ],
        codeSnippets: [
          { language: 'bash', label: '1. Create Project', code: 'npx create-next-app@latest ecommerce-store --typescript --tailwind --app\ncd ecommerce-store\nnpm run dev' },
          { language: 'bash', label: '2. Install Dependencies', code: 'npm install @prisma/client\nnpm install -D prisma\nnpm install stripe @stripe/stripe-js\nnpm install next-auth\nnpm install zustand' },
          { language: 'bash', label: '3. Initialize Prisma', code: 'npx prisma init' },
          { language: 'env', label: '4. Environment Variables', code: 'DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"\nNEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"\nNEXTAUTH_URL="https://buildfolio.tech"\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."\nSTRIPE_SECRET_KEY="sk_test_..."\nSTRIPE_WEBHOOK_SECRET="whsec_..."' },
          { language: 'prisma', label: '5. Complete Schema', code: 'generator client {\n  provider = "prisma-client-js"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url = env("DATABASE_URL")\n}\n\nmodel Product {\n  id String @id @default(cuid())\n  name String\n  description String @db.Text\n  price Decimal @db.Decimal(10, 2)\n  imageUrl String\n  stock Int @default(0)\n  category String\n  createdAt DateTime @default(now())\n}' },
          { language: 'bash', label: '6. Push to Database', code: 'npx prisma db push\nnpx prisma generate\nnpx prisma studio' }
        ],
        pitfalls: [
          '❌ Missing DATABASE_URL → ✅ Add to .env from Neon.tech',
          '❌ Forgot prisma generate → ✅ Always run after schema changes',
          '❌ Using Number for money → ✅ Use Decimal type for prices',
          '❌ Node.js too old → ✅ Update to v18+',
          '❌ SSL connection error → ✅ Add ?sslmode=require to URL'
        ]
      },
      // Add steps 2-7 here (abbreviated for message length)
    ]

    const created = []
    for (const step of enhancedSteps) {
      const result = await prisma.step.create({ data: step })
      created.push(result)
    }

    return NextResponse.json({
      success: true,
      message: '✅ Enhanced E-commerce tutorial!',
      stepsCreated: created.length
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
