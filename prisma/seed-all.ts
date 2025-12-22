
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Project Definitions
const PROJECTS = [
  {
    slug: 'ecommerce-store',
    title: 'Build a Modern E-commerce Store',
    description: 'Create a full-stack e-commerce platform with product listings, shopping cart, and checkout functionality.',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
    emoji: '🛒'
  },
  {
    slug: 'todo-app',
    title: 'Advanced Task Manager',
    description: 'Build a production-ready task management app with drag-and-drop, categories, and progress tracking.',
    technologies: ['Next.js', 'React DnD', 'Prisma', 'Auth.js', 'Tailwind'],
    emoji: '✅'
  },
  {
    slug: 'weather-app',
    title: 'Real-time Weather Dashboard',
    description: 'Create a beautiful weather dashboard using external APIs, geolocation, and dynamic charts.',
    technologies: ['Next.js', 'OpenWeather API', 'Recharts', 'Geocoding', 'Tailwind'],
    emoji: '☀️'
  },
  {
    slug: 'social-dashboard',
    title: 'Social Analytics Dashboard',
    description: 'Build a comprehensive analytics dashboard with data visualization, dark mode, and export capabilities.',
    technologies: ['Next.js', 'Tremor', 'Postgres', 'Data Viz', 'Tailwind'],
    emoji: '📊'
  },
  {
    slug: 'recipe-finder',
    title: 'AI Recipe Finder',
    description: 'Create a smart recipe search engine that generates meal plans using AI.',
    technologies: ['Next.js', 'OpenAI API', 'Framer Motion', 'Postgres', 'Tailwind'],
    emoji: '🍳'
  },
  {
    slug: 'portfolio-builder',
    title: 'Developer Portfolio Builder',
    description: 'Build a dynamic portfolio generator that connects to GitHub and LinkedIn.',
    technologies: ['Next.js', 'GitHub API', 'PDF Generation', 'Markdown', 'Tailwind'],
    emoji: '💼'
  }
]

// Specific Steps for Each Project
const PROJECT_CONTENT: Record<string, any[]> = {
  'ecommerce-store': [
    {
      order: 1,
      title: 'Project Setup & Authentication',
      description: 'Initialize the project with proper structure and user authentication.',
      codeSnippets: [
        { language: 'bash', code: 'npx create-next-app@latest ecommerce-store --typescript --tailwind --app' },
        { language: 'typescript', code: '// app/auth.ts\nimport { NextAuth } from "next-auth"\nimport GitHubProvider from "next-auth/providers/github"' }
      ],
      hints: [
        { level: 1, content: 'Ensure you have a GitHub OAuth app created', unlockMinutes: 5 },
        { level: 2, content: 'Set NEXTAUTH_SECRET to a random string', unlockMinutes: 10 }
      ],
      pitfalls: ['Forgetting to set NEXTAUTH_SECRET', 'Not configuring GitHub OAuth app correctly'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg'
    },
    {
      order: 2,
      title: 'Database Schema & Product Models',
      description: 'Design the database schema for products, categories, and user carts.',
      codeSnippets: [
        { language: 'prisma', code: 'model Product {\n  id String @id @default(cuid())\n  name String\n  price Decimal\n  description String?\n  category String\n  images String[]\n}' }
      ],
      hints: [
        { level: 1, content: 'Use "Decimal" type for currency to avoid float errors', unlockMinutes: 5 }
      ],
      pitfalls: ['Not adding proper indexes', 'Forgetting decimal precision for prices'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/lATafp15HWA'
    },
    {
      order: 3,
      title: 'Product Listing & UI Components',
      description: 'Build the product grid, filters, and shopping cart UI.',
      codeSnippets: [
        { language: 'typescript', code: '// components/ProductGrid.tsx\nconst ProductGrid = ({ products }) => {\n  return (\n    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">\n      {products.map(product => (\n        <ProductCard key={product.id} product={product} />\n      ))}\n    </div>\n  )\n}' }
      ],
      hints: [
        { level: 1, content: 'Use CSS Grid for responsive layouts', unlockMinutes: 10 }
      ],
      pitfalls: ['Not making components responsive', 'Forgetting loading states'],
      estimatedTime: '4 hours',
      videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs'
    },
    {
      order: 4,
      title: 'Shopping Cart & State Management',
      description: 'Implement cart functionality with proper state management.',
      codeSnippets: [
        { language: 'typescript', code: '// store/cart-store.ts\nimport { create } from "zustand";\n\ninterface CartStore {\n  items: CartItem[];\n  addItem: (product: Product) => void;\n  removeItem: (id: string) => void;\n}' }
      ],
      hints: [
        { level: 1, content: 'Zustand is simpler than Redux for this use case', unlockMinutes: 5 },
        { level: 2, content: 'Persist cart to localStorage using "persist" middleware', unlockMinutes: 15 }
      ],
      pitfalls: ['Not persisting cart state', 'Forgetting to validate cart items'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4'
    },
    {
      order: 5,
      title: 'Checkout & Payment Integration',
      description: 'Integrate Stripe for secure payment processing.',
      codeSnippets: [
        { language: 'typescript', code: '// app/api/checkout/route.ts\nimport Stripe from "stripe";\n\nconst stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);' }
      ],
      hints: [
        { level: 1, content: 'Use Stripe Webhooks to confirm payment success', unlockMinutes: 10 }
      ],
      pitfalls: ['Not handling webhooks', 'Exposing secret keys'],
      estimatedTime: '4 hours',
      videoUrl: 'https://www.youtube.com/embed/1r-F3FIONl8'
    },
    {
      order: 6,
      title: 'Order Management & Admin Panel',
      description: 'Build order tracking and admin functionality.',
      codeSnippets: [
        { language: 'typescript', code: '// app/admin/orders/page.tsx\nconst OrdersPage = () => {\n  const orders = await prisma.order.findMany({\n    include: { user: true, items: true }\n  });\n}' }
      ],
      hints: [
        { level: 1, content: 'Secure admin routes with middleware', unlockMinutes: 5 }
      ],
      pitfalls: ['Not adding authentication checks', 'Forgetting pagination'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/mZvKPtH9Fzo'
    },
    {
      order: 7,
      title: 'Deployment & Performance Optimization',
      description: 'Deploy to production and optimize performance.',
      codeSnippets: [
        { language: 'bash', code: 'vercel deploy --prod' },
        { language: 'typescript', code: '// app/page.tsx\nexport const dynamic = "force-dynamic";' }
      ],
      hints: [
        { level: 1, content: 'Set all environment variables in Vercel dashboard', unlockMinutes: 5 }
      ],
      pitfalls: ['Not setting environment variables', 'Forgetting to build before deploy'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA'
    }
  ],
  'todo-app': [
    {
      order: 1,
      title: 'Project Setup & Tailwind Config',
      description: 'Initialize Next.js and configure Tailwind for a clean UI.',
      codeSnippets: [
        { language: 'bash', code: 'npx create-next-app@latest todo-app --typescript --tailwind --app' },
        { language: 'bash', code: 'npm install @heroicons/react clsx tailwind-merge' }
      ],
      hints: [
        { level: 1, content: 'Install @heroicons/react for nice icons', unlockMinutes: 5 },
        { level: 2, content: 'Use `clsx` and `tailwind-merge` for conditional class names', unlockMinutes: 10 }
      ],
      pitfalls: ['Ignoring standard folder structure', 'Not configuring Tailwind plugins if needed'],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg'
    },
    {
      order: 2,
      title: 'Database & Todo Model',
      description: 'Define the Todo schema with priority and status fields.',
      codeSnippets: [
        { language: 'prisma', code: 'model Todo {\n  id String @id @default(cuid())\n  content String\n  completed Boolean @default(false)\n  priority String @default("medium") // low, medium, high\n  dueDate DateTime?\n  tags String[]\n  userId String\n  createdAt DateTime @default(now())\n}' }
      ],
      hints: [
        { level: 1, content: 'Add an index on userId for faster queries', unlockMinutes: 5 },
        { level: 2, content: 'Use enums for Priority if you want type safety in DB', unlockMinutes: 15 }
      ],
      pitfalls: ['Not making userId mandatory', ' forgetting to migrate after schema changes'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/lATafp15HWA'
    },
    {
      order: 3,
      title: 'Server Actions for CRUD',
      description: 'Use Next.js Server Actions to create, read, update, and delete todos.',
      codeSnippets: [
        { language: 'typescript', code: '// app/actions.ts\n"use server"\nimport { revalidatePath } from "next/cache"\n\nexport async function createTodo(formData: FormData) {\n  const content = formData.get("content")\n  await prisma.todo.create({ data: { content, userId: "..." } })\n  revalidatePath("/todos")\n}' }
      ],
      hints: [
        { level: 1, content: 'Server Actions simplify data mutation significantly', unlockMinutes: 5 },
        { level: 2, content: 'Use `useFormStatus` to show pending states', unlockMinutes: 10 }
      ],
      pitfalls: ['Not validating input on the server', 'Forgetting `use server` directive'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs'
    },
    {
      order: 4,
      title: 'Drag and Drop Interface',
      description: 'Implement drag-and-drop ordering using @hello-pangea/dnd.',
      codeSnippets: [
        { language: 'bash', code: 'npm install @hello-pangea/dnd' },
        { language: 'tsx', code: '<DragDropContext onDragEnd={handleDragEnd}>\n  <Droppable droppableId="todos">\n    {(provided) => (\n      <div {...provided.droppableProps} ref={provided.innerRef}>\n        {todos.map((todo, index) => (\n          <Draggable key={todo.id} draggableId={todo.id} index={index}>\n            {(provided) => (\n              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>\n                {todo.content}\n              </div>\n            )}\n          </Draggable>\n        ))}\n        {provided.placeholder}\n      </div>\n    )}\n  </Droppable>\n</DragDropContext>' }
      ],
      hints: [
        { level: 1, content: 'Remember to disable Strict Mode for DnD in Next.js', unlockMinutes: 15 },
        { level: 2, content: 'Store the order index in the database for persistence', unlockMinutes: 30 }
      ],
      pitfalls: ['Complex reordering logic in database', 'Hydration errors with DnD libraries'],
      estimatedTime: '5 hours',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4'
    },
    {
      order: 5,
      title: 'Filtering & Sorting',
      description: 'Add ability to filter by status and sort by priority.',
      codeSnippets: [
        { language: 'typescript', code: '// hooks/useTodos.ts\nconst filteredTodos = useMemo(() => {\n  return todos.filter(t => {\n    if (filter === "active") return !t.completed\n    if (filter === "completed") return t.completed\n    return true\n  }).sort((a, b) => priorityMap[a.priority] - priorityMap[b.priority])\n}, [todos, filter])' }
      ],
      hints: [
        { level: 1, content: 'Do generic filtering on client side for small lists', unlockMinutes: 5 },
        { level: 2, content: 'Use URL search params to persist filter state', unlockMinutes: 15 }
      ],
      pitfalls: ['Over-fetching data', 'Complex sorts causing render lag'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/mZvKPtH9Fzo'
    },
    {
      order: 6,
      title: 'Deployment',
      description: 'Deploy the task manager to Vercel.',
      codeSnippets: [
        { language: 'bash', code: 'vercel --prod' },
        { language: 'typescript', code: '// prisma/schema.prisma\n// Ensure output is defined\ngenerator client {\n  provider = "prisma-client-js"\n}' }
      ],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA'
    }
  ],
  'weather-app': [
    {
      order: 1,
      title: 'Setup & API Keys',
      description: 'Get API keys from OpenWeatherMap and set up environment variables.',
      codeSnippets: [
        { language: 'bash', code: '# .env.local\nNEXT_PUBLIC_WEATHER_API_KEY=your_key_here\nNEXT_PUBLIC_GEO_API_URL=http://api.openweathermap.org/geo/1.0/direct' },
        { language: 'typescript', code: '// types/weather.ts\nexport interface WeatherData {\n  current: { temp: number; weather: { description: string }[] };\n  daily: { dt: number; temp: { min: number; max: number } }[];\n}' }
      ],
      hints: [
        { level: 1, content: 'OpenWeatherMap One Call API 3.0 is recommended', unlockMinutes: 5 },
        { level: 2, content: 'Store types in a separate file for reuse', unlockMinutes: 10 }
      ],
      pitfalls: ['Exposing secret keys (use NEXT_PUBLIC only if necessary)', 'Not adding .env to .gitignore'],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg'
    },
    {
      order: 2,
      title: 'Location Services',
      description: 'Implement browser geolocation to find user city.',
      codeSnippets: [
        { language: 'typescript', code: '// hooks/useLocation.ts\nconst [location, setLocation] = useState<{lat: number, lon: number} | null>(null);\n\nuseEffect(() => {\n  if ("geolocation" in navigator) {\n    navigator.geolocation.getCurrentPosition((pos) => {\n       setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });\n    });\n  }\n}, []);' }
      ],
      hints: [
        { level: 1, content: 'Handle permission denied errors gracefully', unlockMinutes: 10 },
        { level: 2, content: 'Provide a manual city search as a fallback', unlockMinutes: 20 }
      ],
      pitfalls: ['Not handling loading states while locating', 'Browser privacy settings blocking location'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs'
    },
    {
      order: 3,
      title: 'Weather Service Integration',
      description: 'Create a service to fetch current weather and forecast.',
      codeSnippets: [
        { language: 'typescript', code: 'export async function getForecast(lat: number, lon: number) {\n  const res = await fetch(\n    `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,\n    { next: { revalidate: 3600 } } // Cache for 1 hour\n  )\n  if (!res.ok) throw new Error("Weather fetch failed")\n  return res.json()\n}' }
      ],
      hints: [
        { level: 1, content: 'Use "units=metric" or "imperial" based on preference', unlockMinutes: 5 },
        { level: 2, content: 'Use Next.js fetch caching to avoid hitting API limits', unlockMinutes: 15 }
      ],
      pitfalls: ['Not caching API responses', 'Rate limiting issues'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/1r-F3FIONl8'
    },
    {
      order: 4,
      title: 'Dynamic UI & Charts',
      description: 'Display temperature trends using Recharts.',
      codeSnippets: [
        { language: 'bash', code: 'npm install recharts' },
        { language: 'tsx', code: '<ResponsiveContainer width="100%" height={300}>\n  <AreaChart data={forecast}>\n    <defs>\n      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">\n        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>\n        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>\n      </linearGradient>\n    </defs>\n    <XAxis dataKey="time" />\n    <YAxis />\n    <Tooltip />\n    <Area type="monotone" dataKey="temp" stroke="#8884d8" fillOpacity={1} fill="url(#colorTemp)" />\n  </AreaChart>\n</ResponsiveContainer>' }
      ],
      hints: [
        { level: 1, content: 'Format X-axis ticks to show time clearly (e.g., "Mon", "Tue")', unlockMinutes: 10 },
        { level: 2, content: 'Use ResponsiveContainer to make charts resize automatically', unlockMinutes: 20 }
      ],
      pitfalls: ['Charts not being responsive', 'Hydration mismatch on dates'],
      estimatedTime: '4 hours',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4'
    },
    {
      order: 5,
      title: 'Favorites & Search',
      description: 'Allow users to search cities and save favorites to DB.',
      codeSnippets: [
        { language: 'prisma', code: 'model WeatherLocation {\n  id String @id @default(cuid())\n  city String\n  lat Float\n  lon Float\n  userId String\n  createdAt DateTime @default(now())\n  \n  @@unique([userId, city])\n}' }
      ],
      hints: [
        { level: 1, content: 'Use the Geocoding API for city search', unlockMinutes: 5 }
      ],
      pitfalls: ['Duplicate favorites', 'Case sensitivity in city names'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/mZvKPtH9Fzo'
    },
    {
      order: 6,
      title: 'Deployment',
      description: 'Deploy to Vercel.',
      codeSnippets: [
        { language: 'bash', code: 'vercel' }
      ],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA'
    }
  ],
  'social-dashboard': [
    {
      order: 1,
      title: 'Setup & Tremor UI',
      description: 'Install Next.js and Tremor for dashboard components.',
      codeSnippets: [
        { language: 'bash', code: 'npm install @tremor/react @headlessui/react @heroicons/react' },
        { language: 'javascript', code: '// tailwind.config.js\n// Add Tremor content paths\ncontent: [\n  "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",\n  "./app/**/*.{js,ts,jsx,tsx}",\n]' }
      ],
      hints: [
        { level: 1, content: 'Tremor requires Tailwind CSS plugin configuration', unlockMinutes: 5 },
        { level: 2, content: 'Check Tremor docs for custom color palettes', unlockMinutes: 10 }
      ],
      pitfalls: ['Missing Tailwind content config for Tremor', 'Not installing peer dependencies like HeadlessUI'],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg'
    },
    {
      order: 2,
      title: 'Database Schema',
      description: 'Design schema for Posts, Users, and Comments.',
      codeSnippets: [
        { language: 'prisma', code: 'model Post {\n  id String @id @default(cuid())\n  content String\n  likes Int @default(0)\n  createdAt DateTime @default(now())\n  userId String\n  user User @relation(fields: [userId], references: [id])\n  comments Comment[]\n}' }
      ],
      hints: [
        { level: 1, content: 'Use @relation to link Post to User', unlockMinutes: 5 },
        { level: 2, content: 'Add CASCADE delete to remove comments when post is deleted', unlockMinutes: 15 }
      ],
      pitfalls: ['Circular dependencies in relations', 'Forgeting foreign keys'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/lATafp15HWA'
    },
    {
      order: 3,
      title: 'Dashboard Layout',
      description: 'Create a responsive sidebar and layout shell.',
      codeSnippets: [
        { language: 'tsx', code: '<div className="flex h-screen bg-gray-50">\n  <Sidebar className="hidden md:flex w-64 flex-col fixed inset-y-0" />\n  <div className="md:pl-64 flex flex-col flex-1">\n    <main className="flex-1 py-6 px-4 sm:px-6">{children}</main>\n  </div>\n</div>' }
      ],
      hints: [
        { level: 1, content: 'Use "hidden md:flex" to toggle sidebar on mobile', unlockMinutes: 10 },
        { level: 2, content: 'Use a dynamic Mobile Menu using Headless UI Dialog', unlockMinutes: 30 }
      ],
      pitfalls: ['Layout breaking on small screens', 'Scrollbars executing improperly'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs'
    },
    {
      order: 4,
      title: 'Data Visualization',
      description: 'Visualize user engagement with Bar and Donut charts.',
      codeSnippets: [
        { language: 'tsx', code: 'import { Card, Title, DonutChart } from "@tremor/react";\n\n<Card>\n  <Title>Sales by City</Title>\n  <DonutChart\n    className="mt-6"\n    data={sales}\n    category="sales"\n    index="name"\n    colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}\n  />\n</Card>' }
      ],
      hints: [
        { level: 1, content: 'Pass data directly from server components for performance', unlockMinutes: 5 },
        { level: 2, content: 'Tremor charts auto-size, wrap them in a container with height', unlockMinutes: 15 }
      ],
      pitfalls: ['Hydration mismatches with charts', 'Not importing styles'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4'
    },
    {
      order: 5,
      title: 'Activity Feed',
      description: 'Performant list of recent activities/posts.',
      codeSnippets: [
        { language: 'typescript', code: 'const posts = await prisma.post.findMany({\n  take: 20,\n  orderBy: { createdAt: "desc" },\n  include: { user: true, _count: { select: { comments: true } } }\n})' }
      ],
      hints: [
        { level: 1, content: 'Implement infinite scroll or pagination', unlockMinutes: 15 },
        { level: 2, content: 'Use `_count` to fetch relation counts efficiently', unlockMinutes: 20 }
      ],
      pitfalls: ['Loading huge lists at once', 'N+1 Query problems (use specific includes)'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/1r-F3FIONl8'
    },
    {
      order: 6,
      title: 'Export & Reporting',
      description: 'Allow users to export data as CSV.',
      codeSnippets: [
        { language: 'typescript', code: 'const convertToCSV = (data) => {\n  const headers = Object.keys(data[0]).join(",");\n  const rows = data.map(obj => Object.values(obj).join(",")).join("\\n");\n  return `${headers}\\n${rows}`;\n}' }
      ],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/mZvKPtH9Fzo'
    }
  ],
  'recipe-finder': [
    {
      order: 1,
      title: 'Setup & API',
      description: 'Initialize project and choose a Recipe API (or mock data).',
      codeSnippets: [
        { language: 'bash', code: 'npx create-next-app@latest recipe-finder' },
        { language: 'typescript', code: '// types/recipe.ts\nexport interface Recipe {\n  id: string;\n  title: string;\n  image: string;\n  extendedIngredients: { original: string }[];\n}' }
      ],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg'
    },
    {
      order: 2,
      title: 'Search Interface',
      description: 'Build a robust search bar with filters.',
      codeSnippets: [
        { language: 'tsx', code: 'const [query, setQuery] = useState("");\nconst debouncedQuery = useDebounce(query, 500);\n\nuseEffect(() => {\n  if (debouncedQuery) searchRecipes(debouncedQuery);\n}, [debouncedQuery]);' }
      ],
      hints: [
        { level: 1, content: 'Debounce search input to avoid too many API calls', unlockMinutes: 10 },
        { level: 2, content: 'Create a custom hook `useDebounce` for reusability', unlockMinutes: 20 }
      ],
      pitfalls: ['Uncontrolled vs Controlled inputs', 'Spamming the API with every keystroke'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs'
    },
    {
      order: 3,
      title: 'Recipe & Ingredients Model',
      description: 'Schema for storing recipes and user meal plans.',
      codeSnippets: [
        { language: 'prisma', code: 'model Recipe {\n  id String @id @default(cuid())\n  title String\n  ingredients Json\n  instructions String @db.Text\n  cookingTime Int\n  difficulty String @default("medium")\n  user User? @relation(fields: [userId], references: [id])\n  userId String?\n}' }
      ],
      hints: [
        { level: 1, content: 'Store ingredients as a JSON array for flexibility', unlockMinutes: 5 },
        { level: 2, content: 'Use the `Text` type for long instructions', unlockMinutes: 10 }
      ],
      pitfalls: ['Complex relational tables for ingredients vs JSON', 'Limit on standard String length (191 chars) in some DBs'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/lATafp15HWA'
    },
    {
      order: 4,
      title: 'Recipe Card & Details',
      description: 'Beautiful card components using Framer Motion.',
      codeSnippets: [
        { language: 'bash', code: 'npm install framer-motion' },
        { language: 'tsx', code: '<motion.div \n  initial={{ opacity: 0, y: 20 }}\n  animate={{ opacity: 1, y: 0 }}\n  whileHover={{ scale: 1.05 }}\n  transition={{ duration: 0.3 }}\n>\n  <Card />\n</motion.div>' }
      ],
      hints: [
        { level: 1, content: 'Use layoutId for shared element transitions', unlockMinutes: 20 },
        { level: 2, content: 'Use Next/Image for optimized image loading', unlockMinutes: 30 }
      ],
      pitfalls: ['Heavy images slowing down grid', 'Layout shifts (CLS)'],
      estimatedTime: '4 hours',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4'
    },
    {
      order: 5,
      title: 'Favorites & Meal Planner',
      description: 'Save recipes to user profile.',
      codeSnippets: [
        { language: 'typescript', code: 'await prisma.user.update({\n  where: { id: userId },\n  data: { savedRecipes: { connect: { id: recipeId } } }\n})' }
      ],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/1r-F3FIONl8'
    },
    {
      order: 6,
      title: 'Deploy',
      description: 'Production deployment.',
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA'
    }
  ],
  'portfolio-builder': [
    {
      order: 1,
      title: 'Setup & GitHub API',
      description: 'Configure Next.js and GitHub Octokit.',
      codeSnippets: [
        { language: 'bash', code: 'npm install @octokit/rest' },
        { language: 'javascript', code: '// lib/github.ts\nimport { Octokit } from "@octokit/rest";\n\nexport const octokit = new Octokit({\n  auth: process.env.GITHUB_TOKEN\n});' }
      ],
      hints: [
        { level: 1, content: 'Create a flexible GitHub client wrapper', unlockMinutes: 5 },
        { level: 2, content: 'Use Personal Access Tokens (PAT) for higher rate limits', unlockMinutes: 10 }
      ],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/VSB2h7mVhPg'
    },
    {
      order: 2,
      title: 'Portfolio Data Model',
      description: 'Schema to store profile info, skills, and selected projects.',
      codeSnippets: [
        { language: 'prisma', code: 'model Profile {\n  id String @id @default(cuid())\n  bio String @db.Text\n  skills String[]\n  githubUsername String\n  socialLinks Json?\n  userId String @unique\n  user User @relation(fields: [userId], references: [id])\n}' }
      ],
      hints: [
        { level: 1, content: 'Allow optional fields for flexibility', unlockMinutes: 5 },
        { level: 2, content: 'Store complex nested data (like social links) as JSON', unlockMinutes: 15 }
      ],
      pitfalls: ['Strict validation blocking user entry', 'Not escaping markdown content'],
      estimatedTime: '2 hours',
      videoUrl: 'https://www.youtube.com/embed/lATafp15HWA'
    },
    {
      order: 3,
      title: 'Fetching Repositories',
      description: 'Fetch and display user repositories from GitHub.',
      codeSnippets: [
        { language: 'typescript', code: 'export async function getRepos(username: string) {\n  const { data } = await octokit.repos.listForUser({\n    username,\n    sort: "updated",\n    per_page: 10\n  });\n  return data;\n}' }
      ],
      hints: [
        { level: 1, content: 'Filter out forks if desired', unlockMinutes: 5 },
        { level: 2, content: 'Cache GitHub responses using unstable_cache or fetch options', unlockMinutes: 15 }
      ],
      pitfalls: ['Rate limiting from GitHub API', 'Fetching too much data'],
      estimatedTime: '3 hours',
      videoUrl: 'https://www.youtube.com/embed/1r-F3FIONl8'
    },
    {
      order: 4,
      title: 'Portfolio Preview',
      description: 'Live preview of the generated portfolio.',
      codeSnippets: [
        { language: 'tsx', code: '<div className="prose lg:prose-xl mx-auto dark:prose-invert">\n  <h1>{profile.name}</h1>\n  <Markdown>{profile.bio}</Markdown>\n  <div className="grid grid-cols-2 gap-4">\n     {repos.map(repo => <RepoCard key={repo.id} repo={repo} />)}\n  </div>\n</div>' }
      ],
      hints: [
        { level: 1, content: 'Use `react-markdown` to render the bio', unlockMinutes: 10 }
      ],
      pitfalls: ['XSS vulnerabilities in markdown rendering', 'Styles leaking out of preview'],
      estimatedTime: '4 hours',
      videoUrl: 'https://www.youtube.com/embed/Sklc_fQBmcs'
    },
    {
      order: 5,
      title: 'PDF Generation',
      description: 'Generate a resume PDF from profile data.',
      codeSnippets: [
        { language: 'bash', code: 'npm install @react-pdf/renderer' },
        { language: 'tsx', code: 'import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";\n\nconst Resume = ({ profile }) => (\n  <Document>\n    <Page style={styles.page}>\n      <Text style={styles.header}>{profile.name}</Text>\n       <View style={styles.section}>\n         <Text>{profile.bio}</Text>\n       </View>\n    </Page>\n  </Document>\n);' }
      ],
      hints: [
        { level: 1, content: 'PDF generation is resource intensive, do it client-side if possible', unlockMinutes: 15 },
        { level: 2, content: 'Use `PDFDownloadLink` for immediate download button', unlockMinutes: 30 }
      ],
      pitfalls: ['Fonts not loading in PDF', 'Layout differences between web and PDF'],
      estimatedTime: '4 hours',
      videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4'
    },
    {
      order: 6,
      title: 'Deploy',
      description: 'Deploy to Vercel.',
      codeSnippets: [{ language: 'bash', code: 'vercel' }],
      estimatedTime: '1 hour',
      videoUrl: 'https://www.youtube.com/embed/2HBIzEx6IZA'
    }
  ],
}

// 35 Questions (5 per step * 7 steps) - Reusing the generic Next.js ones from seed-quiz.ts
// We will assign these cyclicly or just reuse the logic.
// For simplicity, we define a function that returns the 35 questions.
const getQuestions = () => [
  // Step 1: Setup
  { stepOrder: 1, question: 'What command creates a new Next.js project?', options: ['npm create next-app', 'npx create-next-app', 'npm install next', 'next init'], correctIndex: 1, explanation: 'npx runs packages without installing globally.', order: 1 },
  { stepOrder: 1, question: 'Which file is the entry point for global styles in Next.js app directory?', options: ['styles.css', 'globals.css', 'app.css', 'main.css'], correctIndex: 1, explanation: 'Conventionally globals.css in the app directory.', order: 2 },
  { stepOrder: 1, question: 'What does npx prisma generate do?', options: ['Creates database', 'Generates TypeScript types', 'Runs migrations', 'Starts Studio'], correctIndex: 1, explanation: 'Generates Prisma Client with types.', order: 3 },
  { stepOrder: 1, question: 'Where should secrets like API keys be stored?', options: ['package.json', '.env file', 'public folder', 'code'], correctIndex: 1, explanation: '.env keeps secrets out of git.', order: 4 },
  { stepOrder: 1, question: 'What is the default port for Next.js dev server?', options: ['8080', '3000', '5000', '4200'], correctIndex: 1, explanation: 'localhost:3000 is the default.', order: 5 },

  // Step 2: UI
  { stepOrder: 2, question: 'Which component is used for client-side navigation in Next.js?', options: ['<a>', '<Link>', '<NavLink>', '<Router>'], correctIndex: 1, explanation: 'next/link handles client-side transitions.', order: 1 },
  { stepOrder: 2, question: 'How do you mark a component as a Client Component?', options: ['"use client"', '"client-side"', 'import Client', 'No need'], correctIndex: 0, explanation: 'Add "use client" directive at the top of the file.', order: 2 },
  { stepOrder: 2, question: 'What is the benefit of Server Components?', options: ['Interactivity', 'Direct database access', 'Browser APIs', 'OnClickListener'], correctIndex: 1, explanation: 'Server components can access backend resources securely.', order: 3 },
  { stepOrder: 2, question: 'Which Tailwind class adds padding on all sides?', options: ['m-4', 'p-4', 'pad-4', 'sp-4'], correctIndex: 1, explanation: 'p-4 adds 1rem padding.', order: 4 },
  { stepOrder: 2, question: 'How do you make a layout responsive in Tailwind?', options: ['media-queries', 'prefixed modifiers (md:, lg:)', 'flex-responsive', 'grid-auto'], correctIndex: 1, explanation: 'Using modifiers like md:flex changes styles at breakpoints.', order: 5 },

  // Step 3: Database
  { stepOrder: 3, question: 'What file defines your Prisma schema?', options: ['schema.sql', 'schema.prisma', 'database.js', 'models.ts'], correctIndex: 1, explanation: 'schema.prisma contains the data model definition.', order: 1 },
  { stepOrder: 3, question: 'Which command applies schema changes to the DB during dev?', options: ['prisma push', 'prisma db push', 'prisma migrate', 'prisma apply'], correctIndex: 1, explanation: 'db push checks for compatibility and updates the schema.', order: 2 },
  { stepOrder: 3, question: 'How do you define a unique field in Prisma?', options: ['@unique', 'unique=true', '@id', '@primary'], correctIndex: 0, explanation: 'The @unique attribute enforces uniqueness.', order: 3 },
  { stepOrder: 3, question: 'What mapping represents a one-to-many relation?', options: ['Object / Array', 'String / Int', 'Boolean / Float', 'None'], correctIndex: 0, explanation: 'One side has the Object relation, the other has the Array.', order: 4 },
  { stepOrder: 3, question: 'Why use environment variables for DB URL?', options: ['Security', 'Speed', 'Required by SQL', 'Easier typing'], correctIndex: 0, explanation: 'To prevent exposing credentials in code.', order: 5 },

  // Step 4: Logic
  { stepOrder: 4, question: 'What is the best way to fetch data in a Server Component?', options: ['useEffect', 'async/await', 'axios', 'XHR'], correctIndex: 1, explanation: 'Server Components are async, so you can await data directly.', order: 1 },
  { stepOrder: 4, question: 'How do you handle "Not Found" pages dynamically?', options: ['return 404', 'notFound() function', 'Error Component', 'Redirect'], correctIndex: 1, explanation: 'Import notFound from next/navigation.', order: 2 },
  { stepOrder: 4, question: 'What is ISR?', options: ['Incremental Static Regeneration', 'Internal Server Rendering', 'Immediate State React', 'None'], correctIndex: 0, explanation: 'Allows updating static pages after build.', order: 3 },
  { stepOrder: 4, question: 'How do you create a dynamic route?', options: ['[slug]', '{slug}', ':slug', '*slug*'], correctIndex: 0, explanation: 'Brackets [param] denote dynamic segments.', order: 4 },
  { stepOrder: 4, question: 'Where do API routes live in App Router?', options: ['pages/api', 'app/api/route.ts', 'server/api', 'backend/index.js'], correctIndex: 1, explanation: 'In app directory, usually route.ts files.', order: 5 },

  // Step 5: State
  { stepOrder: 5, question: 'Which hook manages complex state logic?', options: ['useState', 'useReducer', 'useEffect', 'useRef'], correctIndex: 1, explanation: 'useReducer is better for complex state transitions.', order: 1 },
  { stepOrder: 5, question: 'What library is popular for global state in React?', options: ['JQuery', 'Zustand', 'Moments', 'Lodash'], correctIndex: 1, explanation: 'Zustand is a small, fast state management solution.', order: 2 },
  { stepOrder: 5, question: 'How do you persist state across reloads?', options: ['Session State', 'Cookies/LocalStorage', 'Global Variable', 'RAM'], correctIndex: 1, explanation: 'LocalStorage persists after browser close.', order: 3 },
  { stepOrder: 5, question: 'What is "Prop Drilling"?', options: ['Passing data deeply', 'Building props', 'Deleting props', 'Type checking'], correctIndex: 0, explanation: 'Passing props through many layers of components.', order: 4 },
  { stepOrder: 5, question: 'How to avoid Prop Drilling?', options: ['Context API', 'More props', 'Global variables', 'Ignore it'], correctIndex: 0, explanation: 'Context allows sharing values without explicitly passing props.', order: 5 },

  // Step 6: Advanced
  { stepOrder: 6, question: 'What is "Debouncing"?', options: ['Removing bugs', 'Delaying execution', 'Speeding up', 'Caching'], correctIndex: 1, explanation: 'Delaying a function (like search) until typing stops.', order: 1 },
  { stepOrder: 6, question: 'Why use separate "loading.tsx"?', options: ['Required by React', 'Show fallback UI instantly', 'Fixes bugs', 'Better CSS'], correctIndex: 1, explanation: 'Next.js automatically shows this while async page loads.', order: 2 },
  { stepOrder: 6, question: 'What is "Optimization"?', options: ['Writing less code', 'Improving performance', 'Using TypeScript', 'Deploying'], correctIndex: 1, explanation: 'Making the app faster and more efficient.', order: 3 },
  { stepOrder: 6, question: 'How do you optimize images in Next.js?', options: ['<img> tag', '<Image> component', 'CSS background', 'SVG'], correctIndex: 1, explanation: 'Next/Image handles resizing and compression automatically.', order: 4 },
  { stepOrder: 6, question: 'What is Code Splitting?', options: ['Deleting code', 'Loading only needed code', 'Formatting code', 'Comments'], correctIndex: 1, explanation: 'Splitting bundles to load only what is needed for the page.', order: 5 },

  // Step 7: Deployment
  { stepOrder: 7, question: 'What does "npm run build" do?', options: ['Starts server', 'Creates production optimized version', 'Installs deps', 'Runs tests'], correctIndex: 1, explanation: 'Compiles the app for production.', order: 1 },
  { stepOrder: 7, question: 'Why use Environment Variables in Vercel?', options: ['Convenience', 'Security & Config', 'Speed', 'Required'], correctIndex: 1, explanation: 'To manage secrets and config for different environments.', order: 2 },
  { stepOrder: 7, question: 'What is a "Cold Start"?', options: ['Server turning on', 'Function waking up', 'Slow network', 'First render'], correctIndex: 1, explanation: 'Delay when a serverless function starts after inactivity.', order: 3 },
  { stepOrder: 7, question: 'How do you check build errors?', options: ['Guess', 'Check Logs', 'Ignore them', 'Ask AI'], correctIndex: 1, explanation: 'Build logs show exact errors during compilation.', order: 4 },
  { stepOrder: 7, question: 'What is a "Preview Deployment"?', options: ['Live site', 'Test version for PRs', 'Localhost', 'Mockup'], correctIndex: 1, explanation: 'A deployment created for a specific branch or PR.', order: 5 }
];

async function main() {
  console.log('🌱 Starting comprehensive data seed...')
  const questions = getQuestions()

  for (const projectConfig of PROJECTS) {
    console.log(`\n📦 Processing Project: ${projectConfig.title} (${projectConfig.slug})...`)

    // 1. Upsert Project
    const project = await prisma.projectTemplate.upsert({
      where: { slug: projectConfig.slug },
      update: {
        title: projectConfig.title,
        description: projectConfig.description,
        technologies: projectConfig.technologies,
        resumeImpact: 5,
        category: 'Full-Stack',
        timeEstimate: '20-30 hours',
        difficulty: 'intermediate'
      },
      create: {
        slug: projectConfig.slug,
        title: projectConfig.title,
        description: projectConfig.description,
        technologies: projectConfig.technologies,
        resumeImpact: 5,
        category: 'Full-Stack',
        timeEstimate: '20-30 hours',
        difficulty: 'intermediate'
      }
    })

    console.log(`   - Project ID: ${project.id}`)


    // 2. Check/Create Steps
    // FORCE UPDATE: Delete existing steps to ensure fresh content
    await prisma.quizQuestion.deleteMany({
      where: { step: { projectTemplateId: project.id } }
    })
    await prisma.step.deleteMany({
      where: { projectTemplateId: project.id }
    })

    // Get specific steps for this project, or fallback to an empty array (shouldn't happen with our plan)
    const specificSteps = PROJECT_CONTENT[projectConfig.slug] || []

    console.log(`   - Creating ${specificSteps.length} steps (fresh seed)...`)
    for (const stepTmpl of specificSteps) {
      await prisma.step.create({
        data: {
          projectTemplateId: project.id,
          ...stepTmpl,
        }
      })
    }

    // 3. Seed Quiz Questions
    const steps = await prisma.step.findMany({
      where: { projectTemplateId: project.id },
      orderBy: { order: 'asc' }
    })

    let questionCount = 0
    for (const q of questions) {
      // Find the corresponding step ID for this project
      const step = steps.find(s => s.order === q.stepOrder)
      if (!step) continue

      // Check existence
      const exist = await prisma.quizQuestion.findFirst({
        where: { stepId: step.id, question: q.question }
      })

      if (!exist) {
        await prisma.quizQuestion.create({
          data: {
            stepId: step.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            order: q.order,
            difficulty: 'medium'
          }
        })
        questionCount++
      }
    }
    console.log(`   - Seeded ${questionCount} missing questions.`)
  }

  const totalQ = await prisma.quizQuestion.count()
  console.log(`\n✅ Final Quiz Question Count: ${totalQ}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
