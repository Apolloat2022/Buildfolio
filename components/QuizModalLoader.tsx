// components/QuizModalLoader.tsx - DYNAMIC LOADER
"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import QuizModal with NO SSR
const QuizModal = dynamic(() => import('./QuizModal'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    </div>
  )
})

interface QuizModalLoaderProps {
  stepId: string
  questions: any[]
  onPass: () => void
  onClose: () => void
}

export default function QuizModalLoader({ stepId, questions, onPass, onClose }: QuizModalLoaderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !questions || questions.length === 0) {
    return null
  }

  return (
    <QuizModal
      stepId={stepId}
      questions={questions}
      onPass={onPass}
      onClose={onClose}
    />
  )
}
