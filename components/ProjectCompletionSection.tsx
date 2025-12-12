import { auth } from '@/app/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProjectCompletionFlow from '@/components/ProjectCompletionFlow'

interface ProjectCompletionSectionProps {
  projectSlug: string
}

export default async function ProjectCompletionSection({ projectSlug }: ProjectCompletionSectionProps) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  const startedProject = await prisma.startedProject.findFirst({
    where: {
      userId: session.user.id,
      projectTemplate: { slug: projectSlug }
    },
    include: {
      projectTemplate: true
    }
  })

  if (!startedProject || startedProject.progress < 100) {
    return null
  }

  return (
    <ProjectCompletionFlow
      projectId={startedProject.projectTemplateId}
      projectSlug={projectSlug}
      projectTitle={startedProject.projectTemplate.title}
      userId={session.user.id}
      progress={startedProject.progress}
      githubRepoUrl={startedProject.githubRepoUrl}
      showcaseSubmitted={startedProject.showcaseSubmitted}
      certificateEligible={startedProject.certificateEligible}
    />
  )
}
