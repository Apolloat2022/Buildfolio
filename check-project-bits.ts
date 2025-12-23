import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 verifying Project Bits...')

    const projectsToCheck = [
        { slug: 'todo-app', snippetKeywords: ['@hello-pangea/dnd', 'model Todo'] },
        { slug: 'weather-app', snippetKeywords: ['WEATHER_API_KEY', 'navigator.geolocation', 'recharts'] },
        { slug: 'social-dashboard', snippetKeywords: ['@tremor/react', 'DonutChart'] },
        { slug: 'recipe-finder', snippetKeywords: ['framer-motion', 'model Recipe'] },
        { slug: 'portfolio-builder', snippetKeywords: ['@octokit/rest', '@react-pdf/renderer'] }
    ]

    let allPass = true

    for (const check of projectsToCheck) {
        console.log(`\nChecking ${check.slug}...`)
        const project = await prisma.projectTemplate.findUnique({
            where: { slug: check.slug },
            include: { steps: true }
        })

        if (!project) {
            console.error(`❌ Project ${check.slug} not found`)
            allPass = false
            continue
        }

        // Check steps count
        if (project.steps.length === 0) {
            console.error(`❌ No steps found for ${check.slug}`)
            allPass = false
            continue
        }

        // Check snippets
        const allSnippets = project.steps.flatMap(s => (s.codeSnippets as any[])?.map(cs => cs.code) || []).join('\n')

        for (const keyword of check.snippetKeywords) {
            if (allSnippets.includes(keyword) || allSnippets.includes(keyword.replace(/-/g, ' '))) {
                // simplistic check, might need regex if fuzzy
                console.log(`   ✅ Found keyword: ${keyword}`)
            } else {
                // Try lenient match for key concepts
                const lenient = allSnippets.toLowerCase().includes(keyword.toLowerCase())
                if (lenient) {
                    console.log(`   ✅ Found keyword (lenient): ${keyword}`)
                } else {
                    console.error(`   ❌ Missing keyword: ${keyword}`)
                    console.log('      snippets found:', allSnippets.substring(0, 200) + '...')
                    allPass = false
                }
            }
        }

        // Check hints
        const totalHints = project.steps.reduce((acc, s) => acc + ((s.hints as any[])?.length || 0), 0)
        if (totalHints > 0) {
            console.log(`   ✅ Found ${totalHints} hints`)
        } else {
            console.warn(`   ⚠️ No hints found for ${check.slug}`)
            // Not strictly failing, but warning
        }
    }

    if (allPass) {
        console.log('\n✨ Verification PASSED! All projects have specific content.')
    } else {
        console.error('\n❌ Verification FAILED.')
        process.exit(1)
    }
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
