// prisma/seed-quiz-fixed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎓 Seeding comprehensive quiz questions...')
  
  try {
    // 1. First, find the ecommerce store project
    const project = await prisma.projectTemplate.findUnique({
      where: { slug: 'ecommerce-store' },
      include: { steps: { orderBy: { order: 'asc' } } }
    })
    
    if (!project) {
      console.log('❌ E-commerce store project not found!')
      console.log('Available projects:')
      const allProjects = await prisma.projectTemplate.findMany({
        select: { id: true, title: true, slug: true }
      })
      console.log(allProjects)
      return
    }
    
    console.log(`✅ Found: ${project.title}`)
    console.log(`📝 Steps found: ${project.steps.length}`)
    
    // 2. Clear existing questions for this project's steps
    const stepIds = project.steps.map(step => step.id)
    const deletedCount = await prisma.quizQuestion.deleteMany({
      where: { stepId: { in: stepIds } }
    })
    console.log(`🗑️ Cleared ${deletedCount.count} old questions`)
    
    // 3. Define comprehensive questions for each step
    const stepQuestions = [
      {
        stepTitle: 'Project Setup',
        questions: [
          {
            question: 'What is the main purpose of the Prisma ORM in this project?',
            options: [
              'To handle CSS styling',
              'To manage database operations and schema',
              'To create React components',
              'To deploy the application'
            ],
            correctIndex: 1,
            explanation: 'Prisma is an ORM (Object-Relational Mapping) tool that helps manage database schema, migrations, and queries.',
            difficulty: 'easy'
          },
          {
            question: 'Which command initializes a new Next.js project with TypeScript?',
            options: [
              'npm create next-app@latest --typescript',
              'npx create-react-app --typescript',
              'npm init next-app --ts',
              'npx create-next-app@latest --typescript'
            ],
            correctIndex: 3,
            explanation: 'npx create-next-app@latest --typescript creates a new Next.js project with TypeScript configured.',
            difficulty: 'easy'
          },
          {
            question: 'What should be included in the .gitignore file for a Next.js project?',
            options: [
              'node_modules/, .env, .next/',
              'src/, public/, pages/',
              'package.json, package-lock.json',
              'components/, lib/, styles/'
            ],
            correctIndex: 0,
            explanation: 'node_modules/, .env, and .next/ should be ignored as they contain dependencies, environment variables, and build outputs.',
            difficulty: 'medium'
          },
          {
            question: 'Why do we use TypeScript in this project?',
            options: [
              'It makes the app run faster',
              'It provides static type checking and better developer experience',
              'It reduces bundle size',
              'It automatically writes code for us'
            ],
            correctIndex: 1,
            explanation: 'TypeScript catches type errors during development, provides better IDE support, and improves code maintainability.',
            difficulty: 'medium'
          },
          {
            question: 'What is the purpose of the package.json file?',
            options: [
              'It defines HTML structure',
              'It contains project metadata and dependencies',
              'It stores database credentials',
              'It configures the web server'
            ],
            correctIndex: 1,
            explanation: 'package.json contains project metadata, scripts, and dependencies required for the application.',
            difficulty: 'easy'
          }
        ]
      },
      {
        stepTitle: 'Database Design',
        questions: [
          {
            question: 'What is a Prisma schema file used for?',
            options: [
              'Defining API routes',
              'Describing database models and relationships',
              'Configuring CSS styles',
              'Setting up authentication'
            ],
            correctIndex: 1,
            explanation: 'The Prisma schema (schema.prisma) defines database models, fields, types, and relationships.',
            difficulty: 'easy'
          },
          {
            question: 'Which Prisma command generates the Prisma Client?',
            options: [
              'prisma generate',
              'prisma migrate',
              'prisma db push',
              'prisma studio'
            ],
            correctIndex: 0,
            explanation: 'prisma generate creates the Prisma Client based on your schema.prisma file.',
            difficulty: 'easy'
          },
          {
            question: 'What is the difference between @id and @unique in Prisma?',
            options: [
              '@id is for primary keys, @unique is for unique constraints',
              '@id is for foreign keys, @unique is for primary keys',
              'They are interchangeable',
              '@id is for timestamps, @unique is for indexes'
            ],
            correctIndex: 0,
            explanation: '@id defines the primary key (must be unique and required), @unique creates a unique constraint on a field.',
            difficulty: 'medium'
          },
          {
            question: 'How do you define a one-to-many relationship in Prisma?',
            options: [
              'User Post[]',
              'User Post?',
              'User posts Post[]',
              'User posts Post?'
            ],
            correctIndex: 2,
            explanation: 'User posts Post[] defines a one-to-many relationship where one User can have many Posts.',
            difficulty: 'medium'
          },
          {
            question: 'What does prisma migrate dev do?',
            options: [
              'Deletes the database',
              'Creates and applies database migrations',
              'Generates TypeScript types',
              'Runs the application'
            ],
            correctIndex: 1,
            explanation: 'prisma migrate dev creates migration files and applies them to the database while tracking changes.',
            difficulty: 'medium'
          }
        ]
      },
      {
        stepTitle: 'API Routes',
        questions: [
          {
            question: 'Where do API routes live in a Next.js app?',
            options: [
              'app/api/ directory',
              'pages/api/ directory',
              'Either app/api/ or pages/api/ depending on App Router or Pages Router',
              'src/api/ directory'
            ],
            correctIndex: 2,
            explanation: 'In App Router: app/api/, in Pages Router: pages/api/. This project uses App Router.',
            difficulty: 'medium'
          },
          {
            question: 'What HTTP method should be used for creating data?',
            options: [
              'GET',
              'POST',
              'PUT',
              'DELETE'
            ],
            correctIndex: 1,
            explanation: 'POST is used for creating new resources, following REST conventions.',
            difficulty: 'easy'
          },
          {
            question: 'How do you handle errors in Next.js API routes?',
            options: [
              'Return NextResponse.json() with appropriate status codes',
              'Use console.error() only',
              'Throw exceptions and let Next.js handle them',
              'Ignore errors'
            ],
            correctIndex: 0,
            explanation: 'Return proper HTTP responses with status codes and error messages using NextResponse.json().',
            difficulty: 'medium'
          },
          {
            question: 'What is the purpose of NextRequest in API routes?',
            options: [
              'To style components',
              'To handle incoming HTTP requests',
              'To connect to databases',
              'To manage state'
            ],
            correctIndex: 1,
            explanation: 'NextRequest extends the standard Request object with Next.js-specific features.',
            difficulty: 'medium'
          },
          {
            question: 'How do you parse JSON body in an API route?',
            options: [
              'await request.text()',
              'await request.json()',
              'JSON.parse(request.body)',
              'request.body.json()'
            ],
            correctIndex: 1,
            explanation: 'await request.json() parses the JSON body of the incoming request.',
            difficulty: 'easy'
          }
        ]
      },
      {
        stepTitle: 'UI Components',
        questions: [
          {
            question: 'What is a React component?',
            options: [
              'A database table',
              'A reusable piece of UI',
              'An API endpoint',
              'A CSS file'
            ],
            correctIndex: 1,
            explanation: 'A React component is a reusable UI building block that can accept props and manage state.',
            difficulty: 'easy'
          },
          {
            question: 'What is the difference between server and client components in Next.js?',
            options: [
              'Server components render on server, client components render on client',
              'Server components are faster',
              'Client components can\'t use hooks',
              'There is no difference'
            ],
            correctIndex: 0,
            explanation: 'Server components render on the server (no client JavaScript), client components render on the client and can use React hooks.',
            difficulty: 'medium'
          },
          {
            question: 'What does "use client" directive do?',
            options: [
              'Makes a component a client component',
              'Connects to a database',
              'Adds authentication',
              'Improves performance'
            ],
            correctIndex: 0,
            explanation: '"use client" marks a component as a client component that can use React hooks and browser APIs.',
            difficulty: 'easy'
          },
          {
            question: 'How do you pass data from parent to child component?',
            options: [
              'Using state',
              'Using props',
              'Using context',
              'Using refs'
            ],
            correctIndex: 1,
            explanation: 'Props are used to pass data from parent to child components.',
            difficulty: 'easy'
          },
          {
            question: 'What is Tailwind CSS?',
            options: [
              'A JavaScript framework',
              'A utility-first CSS framework',
              'A database',
              'An API library'
            ],
            correctIndex: 1,
            explanation: 'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes.',
            difficulty: 'easy'
          }
        ]
      },
      {
        stepTitle: 'Authentication',
        questions: [
          {
            question: 'What is NextAuth.js used for?',
            options: [
              'Database management',
              'Authentication and authorization',
              'CSS styling',
              'API routing'
            ],
            correctIndex: 1,
            explanation: 'NextAuth.js is a complete authentication solution for Next.js applications.',
            difficulty: 'easy'
          },
          {
            question: 'What are authentication providers?',
            options: [
              'CSS frameworks',
              'Services that handle user authentication (Google, GitHub, etc.)',
              'Database types',
              'API endpoints'
            ],
            correctIndex: 1,
            explanation: 'Providers are services that handle user authentication, like Google, GitHub, or credentials.',
            difficulty: 'medium'
          },
          {
            question: 'Where should you store session tokens?',
            options: [
              'In localStorage',
              'In HTTP-only cookies',
              'In URL parameters',
              'In global state'
            ],
            correctIndex: 1,
            explanation: 'HTTP-only cookies are secure for storing session tokens as they are not accessible via JavaScript.',
            difficulty: 'medium'
          },
          {
            question: 'What is the purpose of middleware in NextAuth?',
            options: [
              'To style components',
              'To protect routes and handle authentication checks',
              'To connect to databases',
              'To generate TypeScript types'
            ],
            correctIndex: 1,
            explanation: 'Middleware can protect routes and check authentication status before allowing access.',
            difficulty: 'medium'
          },
          {
            question: 'How do you get the current user session in a component?',
            options: [
              'useSession() hook',
              'getServerSession() function',
              'Both A and B',
              'LocalStorage.getItem("user")'
            ],
            correctIndex: 2,
            explanation: 'useSession() in client components, getServerSession() in server components or API routes.',
            difficulty: 'medium'
          }
        ]
      },
      {
        stepTitle: 'E-commerce Features',
        questions: [
          {
            question: 'What is a shopping cart in e-commerce?',
            options: [
              'A database table',
              'A temporary storage for items before purchase',
              'A payment processor',
              'A user profile'
            ],
            correctIndex: 1,
            explanation: 'A shopping cart temporarily holds items a user wants to purchase before checkout.',
            difficulty: 'easy'
          },
          {
            question: 'How would you implement a shopping cart in React?',
            options: [
              'Using localStorage or context API',
              'Using database only',
              'Using CSS animations',
              'Using API routes only'
            ],
            correctIndex: 0,
            explanation: 'Shopping cart state can be managed with React context or localStorage for persistence.',
            difficulty: 'medium'
          },
          {
            question: 'What is Stripe used for?',
            options: [
              'Database management',
              'Payment processing',
              'CSS styling',
              'Authentication'
            ],
            correctIndex: 1,
            explanation: 'Stripe is a payment processing platform for handling online payments.',
            difficulty: 'easy'
          },
          {
            question: 'What are product variants?',
            options: [
              'Different versions of a product (size, color, etc.)',
              'Different product categories',
              'Different shipping methods',
              'Different payment options'
            ],
            correctIndex: 0,
            explanation: 'Product variants are different versions of the same product (e.g., different sizes, colors).',
            difficulty: 'medium'
          },
          {
            question: 'How do you handle inventory management?',
            options: [
              'Track stock levels in database',
              'Use cookies',
              'Hardcode quantities',
              'Ignore inventory'
            ],
            correctIndex: 0,
            explanation: 'Inventory should be tracked in the database with stock levels that update with purchases.',
            difficulty: 'medium'
          }
        ]
      },
      {
        stepTitle: 'Deployment',
        questions: [
          {
            question: 'What is Vercel?',
            options: [
              'A database',
              'A deployment platform for Next.js apps',
              'A CSS framework',
              'A payment processor'
            ],
            correctIndex: 1,
            explanation: 'Vercel is a cloud platform for deploying Next.js applications with excellent integration.',
            difficulty: 'easy'
          },
          {
            question: 'What should be configured before deployment?',
            options: [
              'Environment variables',
              'Database connection',
              'Both A and B',
              'Nothing special'
            ],
            correctIndex: 2,
            explanation: 'Both environment variables and database connections must be configured for production.',
            difficulty: 'easy'
          },
          {
            question: 'What is the purpose of a .env.production file?',
            options: [
              'To store development environment variables',
              'To store production environment variables',
              'To store test data',
              'To store CSS variables'
            ],
            correctIndex: 1,
            explanation: '.env.production contains environment variables specific to the production environment.',
            difficulty: 'medium'
          },
          {
            question: 'How do you deploy a Next.js app to Vercel?',
            options: [
              'Connect GitHub repository to Vercel',
              'Use Vercel CLI',
              'Both A and B',
              'Manually upload files'
            ],
            correctIndex: 2,
            explanation: 'You can deploy via GitHub integration or using the Vercel CLI command: vercel --prod',
            difficulty: 'medium'
          },
          {
            question: 'What should you monitor after deployment?',
            options: [
              'Performance metrics',
              'Error logs',
              'User analytics',
              'All of the above'
            ],
            correctIndex: 3,
            explanation: 'Monitor performance, errors, and user behavior to ensure the application is running smoothly.',
            difficulty: 'medium'
          }
        ]
      }
    ]

    // 4. Seed questions for each step
    let totalSeeded = 0
    
    for (let i = 0; i < project.steps.length; i++) {
      const step = project.steps[i]
      const stepQuestionsData = stepQuestions[i]
      
      if (!stepQuestionsData) {
        console.log(`⚠️ No questions defined for step ${i + 1}: ${step.title}`)
        continue
      }
      
      console.log(`\n📋 Step ${step.order}: ${step.title}`)
      
      // Verify step exists and has correct ID
      console.log(`   Step ID: ${step.id}`)
      
      for (let qIndex = 0; qIndex < stepQuestionsData.questions.length; qIndex++) {
        const q = stepQuestionsData.questions[qIndex]
        
        try {
          await prisma.quizQuestion.create({
            data: {
              stepId: step.id,  // Use the actual step ID from database
              question: q.question,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
              order: qIndex + 1,
              difficulty: q.difficulty as any
            }
          })
          totalSeeded++
          console.log(`   ✅ Question ${qIndex + 1}: ${q.question.substring(0, 50)}...`)
        } catch (error: any) {
          console.log(`   ❌ Failed to create question ${qIndex + 1}:`, error.message)
          
          // Log more details for debugging
          console.log('   Step ID:', step.id)
          console.log('   Step exists in DB?', !!step)
          
          // Verify step exists by querying it
          const stepExists = await prisma.projectStep.findUnique({
            where: { id: step.id }
          })
          console.log('   Step verified:', stepExists ? 'Yes' : 'No')
        }
      }
    }
    
    console.log(`\n🎉 Seeded ${totalSeeded} questions successfully!`)
    
    // 5. Verify the seeding
    const verifyQuestions = await prisma.quizQuestion.findMany({
      where: { stepId: { in: stepIds } },
      include: { step: true }
    })
    
    console.log(`\n📊 Verification:`)
    console.log(`   Total questions in database: ${verifyQuestions.length}`)
    
    // Group by step
    const questionsByStep = verifyQuestions.reduce((acc, q) => {
      const stepName = q.step?.title || 'Unknown'
      acc[stepName] = (acc[stepName] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    for (const [stepName, count] of Object.entries(questionsByStep)) {
      console.log(`   ${stepName}: ${count} questions`)
    }
    
  } catch (error: any) {
    console.error('❌ Error during seeding:', error)
    console.error('Stack:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
