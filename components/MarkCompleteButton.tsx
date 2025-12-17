"use client"
import { useState } from 'react'
import QuizModal from './QuizModal'

interface MarkCompleteButtonProps {
  stepId: string
  projectId: string
  isCompleted: boolean
}

export default function MarkCompleteButton({ stepId, projectId, isCompleted }: MarkCompleteButtonProps) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [loading, setLoading] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)

  const handleComplete = () => {
    console.log('🎯 MARK COMPLETE CLICKED')
    console.log('   stepId:', stepId)
    console.log('   projectId:', projectId)
    setShowQuiz(true)
  }

  const handleQuizPass = async () => {
    console.log('🎓 QUIZ PASSED! Calling mark-complete API...')
    setLoading(true)
    
    try {
      console.log('📡 Calling API with:', { stepId, projectId })
      
      const res = await fetch('/api/progress/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, projectId })
      })
      
      console.log('📥 API Response Status:', res.status)
      
      const data = await res.json()
      console.log('📥 API Response Data:', data)
      
      if (res.ok) {
        console.log('✅ SUCCESS! Reloading page...')
        setCompleted(true)
        setShowQuiz(false)
        window.location.reload()
      } else {
        console.error('❌ API ERROR:', data)
        alert(`Error: ${data.error || 'Failed to save progress'}`)
      }
    } catch (error) {
      console.error('❌ FETCH ERROR:', error)
      alert('Network error. Check console for details.')
    }
    
    setLoading(false)
  }

  if (completed) {
    return (<div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold text-center">✓ Completed</div>)
  }

  return (<><button onClick={handleComplete} disabled={loading} className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold">{loading ? 'Saving...' : 'Take Quiz & Mark Complete'}</button><QuizModal stepId={stepId} isOpen={showQuiz} onClose={() => { console.log('❌ Quiz closed without passing'); setShowQuiz(false); }} onPass={handleQuizPass} /></>)
}
