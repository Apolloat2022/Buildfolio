
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const projects = ['todo-app', 'weather-app', 'social-dashboard', 'recipe-finder', 'portfolio-builder']

    for (const slug of projects) {
        const project = await prisma.projectTemplate.findUnique({
            where: { slug },
            include: { steps: { orderBy: { order: 'asc' }, take: 2 } }
        })

        if (!project) {
            console.log(`❌ Project ${slug} not found`)
            continue
        }

        console.log(`\n✅ Project: ${project.title}`)
        project.steps.forEach(step => {
            console.log(`  Step ${step.order}: ${step.title}`)
            console.log(`    Snippets: ${JSON.stringify(step.codeSnippets).length} chars`)
            console.log(`    Hints: ${JSON.stringify(step.hints).length} chars`)
            // console.log(`    Snippets Content:`, step.codeSnippets)
        })
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
