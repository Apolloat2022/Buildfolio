import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSnippets() {
  const snippets = await prisma.codeSnippet.findMany({
    include: {
      project: {
        select: { name: true, slug: true }
      }
    }
  })
  
  console.log('Total snippets:', snippets.length)
  console.log('\nSnippets by project:')
  
  const byProject = snippets.reduce((acc, snippet) => {
    const projectName = snippet.project?.name || 'No Project'
    acc[projectName] = (acc[projectName] || 0) + 1
    return acc
  }, {})
  
  console.log(byProject)
  
  // Show first snippet for each project
  console.log('\nFirst snippet per project:')
  const projects = [...new Set(snippets.map(s => s.project?.slug).filter(Boolean))]
  projects.forEach(slug => {
    const count = snippets.filter(s => s.project?.slug === slug).length
    console.log(- :  snippets)
  })
}

checkSnippets()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
