import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const slug = (await params).slug
  
  try {
    const project = await prisma.projectTemplate.findUnique({
      where: { slug },
      include: { steps: { orderBy: { order: 'asc' } } }
    })

    if (!project) {
      return <div className="p-8"><h1>Not Found: {slug}</h1></div>
    }

    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p>Steps: {project.steps.length}</p>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-red-600">ERROR!</h1>
        <pre>{error instanceof Error ? error.message : 'Unknown'}</pre>
      </div>
    )
  }
}