import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const projects = [
      {
        slug: 'todo-app',
        title: 'Build a Todo App',
        description: 'Create a task management app with React, TypeScript, and local storage.',
        difficulty: 'beginner',
        timeEstimate: '8-10 hours',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        resumeImpact: 3,
        category: 'Frontend',
        steps: [
          {
            order: 1,
            title: 'Project Setup',
            description: 'Initialize React app with TypeScript',
            estimatedTime: '1-2 hours',
            videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
            hints: [
              { level: 1, content: 'Use Vite for faster builds', unlockMinutes: 5 },
              { level: 2, content: 'Install Tailwind CSS for styling', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'bash', code: 'npm create vite@latest todo-app -- --template react-ts\ncd todo-app\nnpm install\nnpm install -D tailwindcss postcss autoprefixer\nnpx tailwindcss init -p' }
            ],
            pitfalls: ['Configure Tailwind in tailwind.config.js', 'Add Tailwind directives to index.css']
          },
          {
            order: 2,
            title: 'Todo Components',
            description: 'Create TodoItem and TodoList components',
            estimatedTime: '2-3 hours',
            videoUrl: 'https://www.youtube.com/embed/Rh3tobg7hEo',
            hints: [
              { level: 1, content: 'Create a types.ts file for TypeScript interfaces', unlockMinutes: 5 },
              { level: 2, content: 'Use props destructuring in components', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'interface Todo {\n  id: string\n  text: string\n  completed: boolean\n  createdAt: Date\n}' },
              { language: 'tsx', code: 'export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {\n  return (\n    <div className=\"flex items-center gap-2 p-4 border rounded\">\n      <input type=\"checkbox\" checked={todo.completed} onChange={() => onToggle(todo.id)} />\n      <span className={todo.completed ? \"line-through\" : \"\"}>{todo.text}</span>\n      <button onClick={() => onDelete(todo.id)}>Delete</button>\n    </div>\n  )\n}' }
            ],
            pitfalls: ['Add unique keys when mapping todos', 'Handle empty todo list state']
          },
          {
            order: 3,
            title: 'State Management',
            description: 'Add CRUD operations with useState',
            estimatedTime: '2-3 hours',
            videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0',
            hints: [
              { level: 1, content: 'Use useState to manage todo list', unlockMinutes: 5 },
              { level: 2, content: 'Generate unique IDs with crypto.randomUUID()', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const [todos, setTodos] = useState<Todo[]>([])\n\nconst addTodo = (text: string) => {\n  const newTodo: Todo = {\n    id: crypto.randomUUID(),\n    text,\n    completed: false,\n    createdAt: new Date()\n  }\n  setTodos([...todos, newTodo])\n}' }
            ],
            pitfalls: ['Validate input before adding', 'Use functional updates for state']
          },
          {
            order: 4,
            title: 'Local Storage',
            description: 'Persist todos to localStorage',
            estimatedTime: '1-2 hours',
            videoUrl: 'https://www.youtube.com/embed/AUOzvFzdIk4',
            hints: [
              { level: 1, content: 'Use useEffect to sync with localStorage', unlockMinutes: 5 },
              { level: 2, content: 'Handle JSON parsing errors', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'useEffect(() => {\n  const stored = localStorage.getItem(\"todos\")\n  if (stored) {\n    setTodos(JSON.parse(stored))\n  }\n}, [])\n\nuseEffect(() => {\n  localStorage.setItem(\"todos\", JSON.stringify(todos))\n}, [todos])' }
            ],
            pitfalls: ['Check if localStorage is available', 'Handle quota exceeded errors']
          },
          {
            order: 5,
            title: 'Filters & Sorting',
            description: 'Add filter options (All/Active/Completed)',
            estimatedTime: '1-2 hours',
            videoUrl: 'https://www.youtube.com/embed/hQAHSlTtcmY',
            hints: [
              { level: 1, content: 'Use state for active filter', unlockMinutes: 5 },
              { level: 2, content: 'Filter before mapping todos', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const filteredTodos = todos.filter(todo => {\n  if (filter === \"active\") return !todo.completed\n  if (filter === \"completed\") return todo.completed\n  return true\n})' }
            ],
            pitfalls: ['Use radio buttons or tabs for filters', 'Show count of active todos']
          },
          {
            order: 6,
            title: 'Polish & Deploy',
            description: 'Add animations and deploy to Vercel',
            estimatedTime: '1-2 hours',
            videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA',
            hints: [
              { level: 1, content: 'Test production build locally first', unlockMinutes: 5 },
              { level: 2, content: 'Add loading states for better UX', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'bash', code: 'npm run build\nnpm install -g vercel\nvercel --prod' }
            ],
            pitfalls: ['Test build locally first', 'Add meta tags for SEO']
          }
        ]
      },
      {
        slug: 'weather-app',
        title: 'Build a Weather App',
        description: 'Create a weather dashboard with real-time data from OpenWeather API.',
        difficulty: 'beginner',
        timeEstimate: '10-12 hours',
        technologies: ['React', 'TypeScript', 'API'],
        resumeImpact: 3,
        category: 'Frontend',
        steps: [
          {
            order: 1,
            title: 'API Setup',
            description: 'Get OpenWeather API key',
            estimatedTime: '1 hour',
            videoUrl: 'https://www.youtube.com/embed/MIYQR-Ybrn4',
            hints: [
              { level: 1, content: 'Sign up at openweathermap.org', unlockMinutes: 5 },
              { level: 2, content: 'Free tier allows 60 calls/minute', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const API_KEY = import.meta.env.VITE_WEATHER_API_KEY\nconst BASE_URL = \"https://api.openweathermap.org/data/2.5\"' }
            ],
            pitfalls: ['Store API key in .env file', 'Add .env to .gitignore']
          },
          {
            order: 2,
            title: 'Fetch Weather Data',
            description: 'Call OpenWeather API',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/QMWyM_2xYkg',
            hints: [
              { level: 1, content: 'Use async/await for API calls', unlockMinutes: 5 },
              { level: 2, content: 'Add loading and error states', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const fetchWeather = async (city: string) => {\n  const response = await fetch(\/weather?q=\&appid=\&units=metric)\n  if (!response.ok) throw new Error(\"City not found\")\n  return response.json()\n}' }
            ],
            pitfalls: ['Handle network errors', 'Validate city input', 'Show user-friendly error messages']
          },
          {
            order: 3,
            title: 'Display Weather',
            description: 'Show weather information with icons',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/GuA0_Z1llYU',
            hints: [
              { level: 1, content: 'Use OpenWeather icon URLs', unlockMinutes: 5 },
              { level: 2, content: 'Format temperature with toFixed(1)', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'tsx', code: '<div className=\"weather-card\">\n  <h2>{weather.name}</h2>\n  <img src={http://openweathermap.org/img/wn/\@2x.png} />\n  <p>{weather.main.temp}°C</p>\n  <p>{weather.weather[0].description}</p>\n</div>' }
            ],
            pitfalls: ['Convert Kelvin to Celsius if needed', 'Format temperature with 1 decimal', 'Capitalize description']
          },
          {
            order: 4,
            title: '5-Day Forecast',
            description: 'Add extended forecast',
            estimatedTime: '2-3 hours',
            videoUrl: 'https://www.youtube.com/embed/GXrDEA3SIOQ',
            hints: [
              { level: 1, content: 'Use forecast endpoint', unlockMinutes: 5 },
              { level: 2, content: 'Group data by day', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const forecast = await fetch(\/forecast?q=\&appid=\&units=metric).then(r => r.json())' }
            ],
            pitfalls: ['Group forecast by day', 'Show min/max temperatures', 'Handle timezone differences']
          },
          {
            order: 5,
            title: 'Geolocation',
            description: 'Get user location automatically',
            estimatedTime: '1-2 hours',
            videoUrl: 'https://www.youtube.com/embed/3tYLz5Mfjoc',
            hints: [
              { level: 1, content: 'Use navigator.geolocation API', unlockMinutes: 5 },
              { level: 2, content: 'Handle permission denial gracefully', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'navigator.geolocation.getCurrentPosition((position) => {\n  const { latitude, longitude } = position.coords\n  fetchWeatherByCoords(latitude, longitude)\n})' }
            ],
            pitfalls: ['Handle permission denial', 'Provide fallback city', 'Show loading during geolocation']
          },
          {
            order: 6,
            title: 'Deploy',
            description: 'Deploy to Vercel',
            estimatedTime: '1 hour',
            videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA',
            hints: [
              { level: 1, content: 'Add environment variables in Vercel', unlockMinutes: 5 }
            ],
            codeSnippets: [
              { language: 'bash', code: 'vercel --prod' }
            ],
            pitfalls: ['Add API key to Vercel env vars', 'Test in production mode']
          }
        ]
      },
      {
        slug: 'social-dashboard',
        title: 'Build a Social Dashboard',
        description: 'Create a social feed with posts, likes, and comments.',
        difficulty: 'intermediate',
        timeEstimate: '20-25 hours',
        technologies: ['Next.js', 'Prisma', 'PostgreSQL'],
        resumeImpact: 4,
        category: 'Full-Stack',
        steps: [
          {
            order: 1,
            title: 'Database Schema',
            description: 'Design Prisma schema',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/RebA5J-rlwg',
            hints: [
              { level: 1, content: 'Model User, Post, Comment, Like', unlockMinutes: 5 },
              { level: 2, content: 'Add relations between models', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'prisma', code: 'model Post {\n  id        String   @id @default(cuid())\n  content   String   @db.Text\n  authorId  String\n  author    User     @relation(fields: [authorId], references: [id])\n  likes     Like[]\n  comments  Comment[]\n  createdAt DateTime @default(now())\n}' }
            ],
            pitfalls: ['Add indexes on foreign keys', 'Use @db.Text for long content', 'Define cascade deletes']
          },
          {
            order: 2,
            title: 'Authentication',
            description: 'Add NextAuth.js',
            estimatedTime: '4-5 hours',
            videoUrl: 'https://www.youtube.com/embed/1MTyCvS05V4',
            hints: [
              { level: 1, content: 'Install next-auth and adapter', unlockMinutes: 5 },
              { level: 2, content: 'Configure OAuth providers', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'export const authOptions = {\n  providers: [GoogleProvider({\n    clientId: process.env.GOOGLE_CLIENT_ID!,\n    clientSecret: process.env.GOOGLE_CLIENT_SECRET!\n  })],\n  adapter: PrismaAdapter(prisma)\n}' }
            ],
            pitfalls: ['Configure OAuth redirect URLs', 'Set up database adapter', 'Add session strategy']
          },
          {
            order: 3,
            title: 'Create Posts',
            description: 'Build post creation form',
            estimatedTime: '5-6 hours',
            videoUrl: 'https://www.youtube.com/embed/AS79oJ3Fcf0',
            hints: [
              { level: 1, content: 'Use Server Actions for mutations', unlockMinutes: 5 },
              { level: 2, content: 'Add optimistic updates', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const post = await prisma.post.create({\n  data: {\n    content,\n    authorId: session.user.id\n  }\n})' }
            ],
            pitfalls: ['Validate content length', 'Check authentication', 'Sanitize user input']
          },
          {
            order: 4,
            title: 'Feed & Pagination',
            description: 'Display post feed with infinite scroll',
            estimatedTime: '4-5 hours',
            videoUrl: 'https://www.youtube.com/embed/NZKUirTtxcg',
            hints: [
              { level: 1, content: 'Use cursor-based pagination', unlockMinutes: 5 },
              { level: 2, content: 'Include author and counts', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const posts = await prisma.post.findMany({\n  take: 10,\n  skip: cursor,\n  include: { author: true, _count: { select: { likes: true, comments: true } } },\n  orderBy: { createdAt: \"desc\" }\n})' }
            ],
            pitfalls: ['Use cursor-based pagination', 'Optimize queries with select', 'Add loading states']
          },
          {
            order: 5,
            title: 'Likes & Comments',
            description: 'Add interaction features',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/5Ri6CUiJmHo',
            hints: [
              { level: 1, content: 'Use unique constraint for likes', unlockMinutes: 5 },
              { level: 2, content: 'Implement optimistic updates', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'await prisma.like.create({\n  data: { postId, userId }\n})' }
            ],
            pitfalls: ['Prevent duplicate likes', 'Handle optimistic updates', 'Update counts efficiently']
          },
          {
            order: 6,
            title: 'Real-time Updates',
            description: 'Add live updates with polling',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/djMy4QsPWiI',
            hints: [
              { level: 1, content: 'Use SWR or React Query', unlockMinutes: 5 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const { data } = useSWR(\"/api/posts\", fetcher, { refreshInterval: 3000 })' }
            ],
            pitfalls: ['Balance refresh rate', 'Handle stale data', 'Add revalidation']
          },
          {
            order: 7,
            title: 'Deploy',
            description: 'Deploy to Vercel with Postgres',
            estimatedTime: '2-3 hours',
            videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA',
            codeSnippets: [
              { language: 'bash', code: 'vercel --prod' }
            ],
            pitfalls: ['Set DATABASE_URL', 'Run migrations', 'Configure OAuth']
          }
        ]
      },
      {
        slug: 'recipe-finder',
        title: 'Build a Recipe Finder',
        description: 'Search recipes and create meal plans using Spoonacular API.',
        difficulty: 'beginner',
        timeEstimate: '12-15 hours',
        technologies: ['React', 'API', 'TypeScript'],
        resumeImpact: 3,
        category: 'Frontend',
        steps: [
          {
            order: 1,
            title: 'API Setup',
            description: 'Get Spoonacular API key',
            estimatedTime: '1-2 hours',
            videoUrl: 'https://www.youtube.com/embed/5Ri6CUiJmHo',
            hints: [
              { level: 1, content: 'Free tier: 150 requests/day', unlockMinutes: 5 },
              { level: 2, content: 'Read API documentation', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY\nconst BASE_URL = \"https://api.spoonacular.com/recipes\"' }
            ],
            pitfalls: ['Rate limit your requests', 'Cache API responses', 'Handle API errors']
          },
          {
            order: 2,
            title: 'Recipe Search',
            description: 'Implement search with filters',
            estimatedTime: '4-5 hours',
            videoUrl: 'https://www.youtube.com/embed/xc4uOzlndAk',
            hints: [
              { level: 1, content: 'Use complexSearch endpoint', unlockMinutes: 5 },
              { level: 2, content: 'Add diet and cuisine filters', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const searchRecipes = async (query: string, diet?: string) => {\n  const params = new URLSearchParams({ apiKey: API_KEY, query, diet: diet || \"\" })\n  return fetch(\/complexSearch?\).then(r => r.json())\n}' }
            ],
            pitfalls: ['Debounce search input', 'Handle empty results', 'Show loading states']
          },
          {
            order: 3,
            title: 'Recipe Details',
            description: 'Show full recipe with instructions',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/opikz5x_1ak',
            hints: [
              { level: 1, content: 'Fetch recipe by ID', unlockMinutes: 5 },
              { level: 2, content: 'Display ingredients and steps', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const recipe = await fetch(\/\/information?apiKey=\).then(r => r.json())' }
            ],
            pitfalls: ['Parse HTML in instructions', 'Display nutritional info', 'Handle missing data']
          },
          {
            order: 4,
            title: 'Favorites',
            description: 'Save favorite recipes',
            estimatedTime: '2-3 hours',
            videoUrl: 'https://www.youtube.com/embed/AUOzvFzdIk4',
            hints: [
              { level: 1, content: 'Use localStorage for persistence', unlockMinutes: 5 },
              { level: 2, content: 'Create favorites page', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const favorites = JSON.parse(localStorage.getItem(\"favorites\") || \"[]\")' }
            ],
            pitfalls: ['Check localStorage limits', 'Add remove functionality', 'Handle duplicates']
          },
          {
            order: 5,
            title: 'Meal Planner',
            description: 'Create weekly meal plan',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/hQAHSlTtcmY',
            hints: [
              { level: 1, content: 'Create calendar-like interface', unlockMinutes: 5 },
              { level: 2, content: 'Allow drag-and-drop', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'interface MealPlan {\n  [day: string]: { breakfast?: Recipe, lunch?: Recipe, dinner?: Recipe }\n}' }
            ],
            pitfalls: ['Persist meal plan', 'Generate shopping list', 'Handle conflicts']
          },
          {
            order: 6,
            title: 'Deploy',
            description: 'Deploy to Vercel',
            estimatedTime: '1 hour',
            videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA',
            codeSnippets: [
              { language: 'bash', code: 'vercel --prod' }
            ],
            pitfalls: ['Add API key to env', 'Test production build']
          }
        ]
      },
      {
        slug: 'portfolio-builder',
        title: 'Build a Portfolio Website',
        description: 'Create a professional portfolio with projects and blog.',
        difficulty: 'beginner',
        timeEstimate: '15-18 hours',
        technologies: ['Next.js', 'MDX', 'Tailwind'],
        resumeImpact: 5,
        category: 'Frontend',
        steps: [
          {
            order: 1,
            title: 'Next.js Setup',
            description: 'Initialize Next.js with App Router',
            estimatedTime: '2-3 hours',
            videoUrl: 'https://www.youtube.com/embed/ZVnjOPwW4ZA',
            hints: [
              { level: 1, content: 'Use App Router for better features', unlockMinutes: 5 },
              { level: 2, content: 'Install Tailwind during setup', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'bash', code: 'npx create-next-app@latest portfolio --typescript --tailwind --app' }
            ],
            pitfalls: ['Configure metadata for SEO', 'Set up fonts properly', 'Create layout structure']
          },
          {
            order: 2,
            title: 'Pages & Routing',
            description: 'Create About, Projects, Blog pages',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/ZjAqacIC_3c',
            hints: [
              { level: 1, content: 'Use file-based routing', unlockMinutes: 5 },
              { level: 2, content: 'Create shared layout', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'export default function About() {\n  return (\n    <section className=\"max-w-4xl mx-auto py-12\">\n      <h1 className=\"text-4xl font-bold mb-6\">About Me</h1>\n      <p>Your story here...</p>\n    </section>\n  )\n}' }
            ],
            pitfalls: ['Use layout.tsx for shared UI', 'Add navigation component', 'Handle active links']
          },
          {
            order: 3,
            title: 'MDX Blog',
            description: 'Set up MDX for blog posts',
            estimatedTime: '4-5 hours',
            videoUrl: 'https://www.youtube.com/embed/J_0SBJMxmcw',
            hints: [
              { level: 1, content: 'Install @next/mdx', unlockMinutes: 5 },
              { level: 2, content: 'Configure MDX in next.config', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'javascript', code: 'import createMDX from \"@next/mdx\"\n\nconst withMDX = createMDX()\n\nexport default withMDX(nextConfig)' }
            ],
            pitfalls: ['Add frontmatter parsing', 'Create blog post template', 'Handle code syntax highlighting']
          },
          {
            order: 4,
            title: 'Project Gallery',
            description: 'Showcase projects with images',
            estimatedTime: '3-4 hours',
            videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg',
            hints: [
              { level: 1, content: 'Use next/image for optimization', unlockMinutes: 5 },
              { level: 2, content: 'Create project cards', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: 'const projects = [\n  { \n    title: \"E-commerce Store\", \n    image: \"/projects/ecommerce.png\", \n    tech: [\"Next.js\", \"Stripe\"],\n    link: \"https://example.com\"\n  }\n]' }
            ],
            pitfalls: ['Optimize images with next/image', 'Add filtering by tech', 'Include live demo links']
          },
          {
            order: 5,
            title: 'Contact Form',
            description: 'Add contact form with validation',
            estimatedTime: '2-3 hours',
            videoUrl: 'https://www.youtube.com/embed/dFQiiOiIiUA',
            hints: [
              { level: 1, content: 'Use Server Actions', unlockMinutes: 5 },
              { level: 2, content: 'Add email service (Resend)', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'typescript', code: '"use server"\n\nexport async function sendEmail(formData: FormData) {\n  const email = formData.get(\"email\")\n  const message = formData.get(\"message\")\n  // Send email using Resend\n}' }
            ],
            pitfalls: ['Validate email format', 'Add spam protection', 'Show success message']
          },
          {
            order: 6,
            title: 'Deploy & Analytics',
            description: 'Deploy to Vercel with analytics',
            estimatedTime: '1-2 hours',
            videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA',
            hints: [
              { level: 1, content: 'Connect GitHub to Vercel', unlockMinutes: 5 },
              { level: 2, content: 'Enable Vercel Analytics', unlockMinutes: 10 }
            ],
            codeSnippets: [
              { language: 'bash', code: 'git push origin main\n# Auto-deploys via Vercel' }
            ],
            pitfalls: ['Set up custom domain', 'Add Vercel Analytics', 'Configure OG images', 'Test on mobile']
          }
        ]
      }
    ]

    for (const project of projects) {
      const existingProject = await prisma.projectTemplate.findUnique({
        where: { slug: project.slug }
      })

      if (existingProject) {
        // Update project and delete old steps
        await prisma.projectTemplate.update({
          where: { slug: project.slug },
          data: {
            title: project.title,
            description: project.description,
            difficulty: project.difficulty,
            timeEstimate: project.timeEstimate,
            technologies: project.technologies,
            resumeImpact: project.resumeImpact,
            category: project.category
          }
        })

        await prisma.step.deleteMany({
          where: { projectTemplateId: existingProject.id }
        })

        // Create new steps
        for (const step of project.steps) {
          await prisma.step.create({
            data: {
              ...step,
              projectTemplateId: existingProject.id
            }
          })
        }
      } else {
        // Create new project with steps
        await prisma.projectTemplate.create({
          data: {
            slug: project.slug,
            title: project.title,
            description: project.description,
            difficulty: project.difficulty,
            timeEstimate: project.timeEstimate,
            technologies: project.technologies,
            resumeImpact: project.resumeImpact,
            category: project.category,
            steps: {
              create: project.steps
            }
          }
        })
      }
    }

    const total = await prisma.projectTemplate.count()
    return NextResponse.json({
      success: true,
      message: '✅ All 5 projects seeded with videos, code snippets, and hints!',
      count: total
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
