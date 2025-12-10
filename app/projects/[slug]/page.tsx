import { prisma } from '@/lib/prisma'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ slug: string }>
}

const getCodeSnippets = (codeSnippets: any): Array<{ language: string; code: string }> => {
  if (!codeSnippets) return []
  if (Array.isArray(codeSnippets)) {
    return codeSnippets.filter(item => 
      item && typeof item.language === 'string' && typeof item.code === 'string'
    )
  }
  return []
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const slug = (await params).slug
  
  try {
    const project = await prisma.projectTemplate.findUnique({
      where: { slug },
      include: { steps: { orderBy: { order: 'asc' } } }
    })

    if (!project) {
      return (
        <div className="p-8">
          <h1>Not Found: {slug}</h1>
          <Link href="/projects">Back to Projects</Link>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto">
            <Link href="/projects" className="text-blue-600">← Back</Link>
            <h1 className="text-2xl font-bold mt-2">{project.title}</h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          <div className="space-y-6">
            {project.steps.map((step) => {
              const codeSnippets = getCodeSnippets(step.codeSnippets)
              
              return (
                <div key={step.id} className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold mb-2">
                    Step {step.order}: {step.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Estimated Time: {step.estimatedTime || 'Not specified'}
                  </p>
                  
                  {codeSnippets.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {codeSnippets.map((snippet, idx) => (
                        <div key={idx} className="bg-gray-900 rounded-lg p-4">
                          <div className="text-xs text-gray-400 mb-2">{snippet.language}</div>
                          <pre className="text-sm text-white overflow-x-auto">
                            <code>{snippet.code}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {step.pitfalls && step.pitfalls.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                      <p className="font-bold text-yellow-800 mb-2">⚠️ Common Pitfalls:</p>
                      <ul className="list-disc list-inside text-sm text-yellow-700">
                        {step.pitfalls.map((pitfall, idx) => (
                          <li key={idx}>{pitfall}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-red-600 text-2xl font-bold">ERROR!</h1>
        <pre className="bg-red-50 p-4 mt-4 rounded">
          {error instanceof Error ? error.message : 'Unknown'}
        </pre>
      </div>
    )
  }
}