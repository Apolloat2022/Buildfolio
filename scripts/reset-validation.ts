import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function reset() {
  const userId = 'cmj35wqyk000041uchedxvsm3'
  
  const project = await prisma.startedProject.findFirst({
    where: {
      userId,
      projectTemplate: { slug: 'ecommerce-store' }
    }
  })
  
  if (!project) {
    console.log('Project not found')
    return
  }
  
  await prisma.startedProject.update({
    where: { id: project.id },
    data: {
      certificateEligible: false,
      certificateIssuedAt: null,
      githubRepoUrl: null,
      showcaseSubmitted: false,
      adminReviewed: false
    }
  })
  
  console.log('✅ Reset validation fields')
  console.log('Progress still at 100%, but certificate disabled')
  console.log('Now you can test the GitHub submission flow!')
}

reset().then(() => process.exit(0))
