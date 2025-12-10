'use client'

import { showPointsToast } from './ToastContainer'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
}

export default function MarkCompleteButton({ stepId, projectId, isCompleted }: MarkCompleteButtonProps) {
  const handleClick = async () => {
    const action = isCompleted ? 'incomplete' : 'complete'
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, projectId, action }),
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.pointsAwarded && data.pointsAwarded > 0) {
        showPointsToast(data.pointsAwarded)
      }
    }
    
    // Wait a bit for toast to show, then reload
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
        isCompleted 
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
      }`}
    >
      {isCompleted ? '✓ Mark Incomplete' : 'Mark Complete'}
    </button>
  )
}