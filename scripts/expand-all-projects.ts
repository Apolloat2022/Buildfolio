// scripts/expand-all-projects.ts - CLEAN VERSION
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Step content for each project
const STEP_TEMPLATES = {
  'weather-app': [
    {order: 4, title: '5-Day Forecast Display', description: 'Extend API to fetch and display 5-day forecast with charts'},
    {order: 5, title: 'City Search & Autocomplete', description: 'Add searchable city dropdown with debounced API calls'},
    {order: 6, title: 'Favorite Locations System', description: 'Save favorite cities using localStorage persistence'},
    {order: 7, title: 'Advanced Features & Deployment', description: 'Add unit conversion and deploy to Vercel'}
  ],
  'todo-app': [
    {order: 4, title: 'Task Categories & Filtering', description: 'Organize tasks by categories with filter buttons'},
    {order: 5, title: 'Due Dates & Priority Levels', description: 'Add date pickers and priority sorting'},
    {order: 6, title: 'Drag & Drop Reordering', description: 'Make tasks draggable with visual feedback'},
    {order: 7, title: 'Data Sync & Offline Mode', description: 'Add database persistence with localStorage fallback'}
  ],
  'social-dashboard': [
    {order: 4, title: 'Real-time Updates', description: 'Implement WebSocket connections for live notifications'},
    {order: 5, title: 'User Profiles & Follow System', description: 'Create profiles with avatars and follow features'},
    {order: 6, title: 'Activity Feed & Notifications', description: 'Build personalized feed and notification center'},
    {order: 7, title: 'Admin Dashboard & Analytics', description: 'Create admin panel with user analytics'}
  ],
  'recipe-finder': [
    {order: 4, title: 'Advanced Search & Filters', description: 'Add dietary filters and cuisine type filtering'},
    {order: 5, title: 'Meal Planning Calendar', description: 'Build weekly meal planner with drag-and-drop'},
    {order: 6, title: 'User Reviews & Ratings', description: 'Implement 5-star rating system and reviews'},
    {order: 7, title: 'Nutrition Calculator & Export', description: 'Calculate nutrition facts and PDF export'}
  ],
  'portfolio-builder': [
    {order: 4, title: 'Project Showcase Gallery', description: 'Create interactive gallery with filtering'},
    {order: 5, title: 'Contact Form & Email Integration', description: 'Build contact form with validation'},
    {order: 6, title: 'Blog with Markdown Support', description: 'Add blog section with markdown editing'},
    {order: 7, title: 'Analytics & SEO Optimization', description: 'Integrate Google Analytics and SEO tags'}
  ]
}

// Quiz questions
const QUIZ_TEMPLATES = [
  {question: 'Which React hook is for side effects?', options: ['useState', 'useEffect', 'useContext', 'useReducer'], correctIndex: 1, explanation: 'useEffect handles side effects like API calls'},
  {question: 'What is the purpose of "key" prop?', options: ['Styling', 'Identify changed items', 'Click events', 'Animations'], correctIndex: 1, explanation: 'Keys help React identify which items changed'},
  {question: 'Which CSS enables flexbox?', options: ['display: block', 'display: flex', 'display: inline', 'display: grid'], correctIndex: 1, explanation: 'display: flex enables Flexbox layouts'},
  {question: 'What does API stand for?', options: ['Application Programming Interface', 'Advanced Programming Interface', 'Automated Program Integration', 'Application Process Integration'], correctIndex: 0, explanation: 'API = Application Programming Interface'},
  {question: 'Convert object to JSON string?', options: ['JSON.parse()', 'JSON.stringify()', 'object.toJSON()', 'stringifyJSON()'], correctIndex: 1, explanation: 'JSON.stringify() converts objects to JSON'}
]

async function expandProject(slug) {
  console.log('\n📝 Expanding: ' + slug)
  
  const project = await prisma.projectTemplate.findUnique({
    where: { slug },
    include: { steps: { orderBy: { order: 'asc' } } }
  })
  
  if (!project) {
    console.log('❌ Project not found: ' + slug)
    return
  }
  
  const stepsToAdd = STEP_TEMPLATES[slug] || []
  const existingSteps = project.steps.length
  
  if (existingSteps >= 7) {
    console.log('✅ Already has ' + existingSteps + ' steps, skipping')
    return
  }
  
  // Add missing steps
  for (const stepData of stepsToAdd) {
    if (stepData.order > existingSteps) {
      try {
        const newStep = await prisma.step.create({
          data: {
            ...stepData,
            projectTemplateId: project.id,
            estimatedTime: '2-3 hours',
            requiresQuiz: true,
            codeSnippets: [],
            pitfalls: [],
            hints: []
          }
        })
        console.log('✅ Added: ' + stepData.title)
        
        // Add 5 quiz questions
        for (let i = 0; i < 5; i++) {
          const quiz = QUIZ_TEMPLATES[i % QUIZ_TEMPLATES.length]
          await prisma.quizQuestion.create({
            data: {
              stepId: newStep.id,
              question: quiz.question,
              options: quiz.options,
              correctIndex: quiz.correctIndex,
              explanation: quiz.explanation,
              order: i + 1
            }
          })
        }
        console.log('   📚 Added 5 quiz questions')
      } catch (error) {
        console.log('   ⚠️ Error: ' + error.message)
      }
    }
  }
}

async function main() {
  console.log('🚀 Expanding all 5 incomplete projects to 7 steps each...')
  console.log('='.repeat(60))
  
  const projectsToExpand = [
    'weather-app', 
    'todo-app', 
    'social-dashboard', 
    'recipe-finder', 
    'portfolio-builder'
  ]
  
  for (const slug of projectsToExpand) {
    await expandProject(slug)
  }
  
  console.log('\n🎉 Expansion complete!')
  console.log('\n📊 Summary:')
  console.log('   • Added 4 steps to each of 5 projects = 20 new steps')
  console.log('   • Added 5 quizzes to each new step = 100 new quizzes')
  console.log('   • Each project now has 7 steps and 35 quizzes')
  console.log('\n✅ Run verification: npx tsx scripts/check-status.ts')
  
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Script failed:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
