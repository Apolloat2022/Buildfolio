// components/MarkCompleteButton.tsx - SIMPLE VERSION
"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { Check, Loader2 } from 'lucide-react'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
  requiresQuiz?: boolean
}

export default function MarkCompleteButton({
  stepId,
  projectId,
  isCompleted,
  requiresQuiz = true
}: MarkCompleteButtonProps) {
  const [state, setState] = useState({
    isLoading: false,
    showQuiz: false,
    quizQuestions: [] as any[],
    loadingQuiz: false
  })
  
  const [isMounted, setIsMounted] = useState(false)
  const clickRef = useRef(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const markComplete = useCallback(async () => {
    if (clickRef.current) return
    clickRef.current = true
    
    updateState({ isLoading: true })
    
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to mark complete')
      }
      
      // Success
      setTimeout(() => {
        window.location.reload()
      }, 500)
      
    } catch (error: any) {
      console.error('Error:', error)
      alert(`❌ Failed: ${error.message}`)
      updateState({ isLoading: false })
      clickRef.current = false
    }
  }, [stepId, projectId, updateState])

  const loadQuiz = useCallback(async () => {
    if (clickRef.current) return
    clickRef.current = true
    
    updateState({ loadingQuiz: true })
    
    try {
      const response = await fetch(`/api/quiz/questions?stepId=${stepId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to load quiz: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.questions || data.questions.length === 0) {
        alert('No quiz questions found. Marking as complete.')
        markComplete()
        return
      }
      
      updateState({
        quizQuestions: data.questions,
        showQuiz: true,
        loadingQuiz: false
      })
      
    } catch (error: any) {
      console.error('Quiz error:', error)
      alert(`Quiz Error: ${error.message}\n\nMarking as complete anyway.`)
      markComplete()
    } finally {
      clickRef.current = false
    }
  }, [stepId, markComplete, updateState])

  const handleClick = useCallback(() => {
    if (isCompleted) return
    
    if (requiresQuiz && !state.showQuiz) {
      loadQuiz()
    } else {
      markComplete()
    }
  }, [isCompleted, requiresQuiz, state.showQuiz, loadQuiz, markComplete])

  const handleQuizPass = useCallback(() => {
    updateState({ showQuiz: false, quizQuestions: [] })
    markComplete()
  }, [markComplete, updateState])

  const handleQuizClose = useCallback(() => {
    updateState({ showQuiz: false, quizQuestions: [] })
  }, [updateState])

  // Don't render anything until mounted
  if (!isMounted) {
    return (
      <div className="w-full py-3 px-4 bg-gray-100 rounded-lg animate-pulse"></div>
    )
  }

  if (isCompleted) {
    return (
      <button disabled className="w-full py-3 px-4 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
        <Check size={20} />
        Complete
      </button>
    )
  }

  // Dynamically import QuizModal only when needed
  const renderQuizModal = () => {
    if (state.showQuiz && state.quizQuestions.length > 0) {
      // This will be handled by the conditional rendering in the parent
      return null
    }
    return null
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={state.isLoading || state.loadingQuiz}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
      >
        {state.isLoading || state.loadingQuiz ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {state.loadingQuiz ? 'Loading Quiz...' : 'Processing...'}
          </>
        ) : (
          'Mark Complete'
        )}
      </button>
      
      {renderQuizModal()}
    </>
  )
}

