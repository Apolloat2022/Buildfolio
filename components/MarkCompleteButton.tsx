'use client'
import { useState } from 'react'
import { showPointsToast, showStreakToast } from './ToastContainer'
import QuizModal from './QuizModal'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
  requiresQuiz?: boolean
  estimatedMinutes?: number
  timeSpentMinutes?: number
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
}

export default function MarkCompleteButton({ 
  stepId, 
  projectId, 
  isCompleted,
  requiresQuiz = true,
  estimatedMinutes = 0,
  timeSpentMinutes = 0
}: MarkCompleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)

  const handleClick = async () => {
    // If marking as incomplete, just do it directly
    if (isCompleted) {
      markComplete(false)
      return
    }

    // Check time spent (need at least 60% of estimated time)
    if (estimatedMinutes > 0) {
      const minimumTime = estimatedMinutes * 0.6
      if (timeSpentMinutes < minimumTime) {
        setShowTimeWarning(true)
        return
      }
    }

    // If marking as complete and quiz required, show quiz first
    if (requiresQuiz) {
      await loadQuiz()
    } else {
      markComplete(true)
    }
  }

  const handleTimeWarningConfirm = async () => {
    setShowTimeWarning(false)
    // Proceed with quiz anyway
    if (requiresQuiz) {
      await loadQuiz()
    } else {
      markComplete(true)
    }
  }

  const loadQuiz = async () => {
    setLoadingQuiz(true)
    try {
      const response = await fetch(`/api/quiz/questions?stepId=${stepId}`)
      const data = await response.json()
      
      if (data.questions && data.questions.length > 0) {
        setQuizQuestions(data.questions)
        setShowQuiz(true)
      } else {
        console.log('No quiz questions found, marking complete')
        markComplete(true)
      }
    } catch (error) {
      console.error('Failed to load quiz:', error)
      markComplete(true)
    } finally {
      setLoadingQuiz(false)
    }
  }

  const markComplete = async (complete: boolean) => {
    console.log('Marking step:', { stepId, projectId, complete })
    setLoading(true)
    const action = complete ? 'complete' : 'incomplete'

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId, action }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log('API Response:', data)

        if (data.pointsAwarded && data.pointsAwarded > 0) {
          showPointsToast(data.pointsAwarded, 'Great work!')
        }

        if (data.newStreak && data.newStreak >= 3) {
          showStreakToast(data.newStreak)
        }

        setTimeout(() => {
          window.location.reload()
        }, 1200)
      } else {
        console.error('API error:', response.status)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  const handleQuizPass = () => {
    setShowQuiz(false)
    markComplete(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || loadingQuiz}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          isCompleted
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading || loadingQuiz ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadingQuiz ? 'Loading Quiz...' : 'Saving...'}
          </span>
        ) : isCompleted ? (
          '✓ Completed'
        ) : (
          'Mark Complete'
        )}
      </button>

      {/* Time Warning Modal */}
      {showTimeWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-2">Not Enough Time Spent</h3>
              <p className="text-gray-600 mb-4">
                This step is estimated to take <strong>{estimatedMinutes} minutes</strong>.
                You've only spent <strong>{Math.round(timeSpentMinutes)} minutes</strong>.
              </p>
              <p className="text-gray-600 mb-6">
                We recommend spending at least <strong>{Math.round(estimatedMinutes * 0.6)} minutes</strong> to 
                fully understand the material.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowTimeWarning(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Keep Learning
                </button>
                <button
                  onClick={handleTimeWarningConfirm}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Continue Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQuiz && (
        <QuizModal
          stepId={stepId}
          questions={quizQuestions}
          onPass={handleQuizPass}
          onClose={() => setShowQuiz(false)}
        />
      )}
    </>
  )
}
