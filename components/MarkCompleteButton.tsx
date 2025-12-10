'use client'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
}

export default function MarkCompleteButton({ stepId, projectId, isCompleted }: MarkCompleteButtonProps) {
  const handleClick = async () => {
    const action = isCompleted ? 'incomplete' : 'complete'
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, projectId, action }),
    })
    window.location.reload()
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-2 px-4 rounded-lg font-medium ${
        isCompleted 
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
    </button>
  )
}