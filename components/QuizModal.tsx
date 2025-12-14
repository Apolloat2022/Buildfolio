"use client"
import { useState, useEffect } from 'react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation?: string | null
}

interface QuizModalProps {
  stepId: string
  isOpen: boolean
  onClose: () => void
  onPass: () => void
}

export default function QuizModal({ stepId, isOpen, onClose, onPass }: QuizModalProps) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    
    async function fetchQuestions() {
      try {
        setLoading(true)
        const res = await fetch(`/api/quiz/questions?stepId=${stepId}`)
        const data = await res.json()
        
        if (data.questions && Array.isArray(data.questions)) {
          setQuestions(data.questions)
        } else {
          setQuestions([])
        }
      } catch (error) {
        console.error('Failed to load quiz:', error)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchQuestions()
  }, [stepId, isOpen])

  if (!isOpen) return null

  if (loading) {
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div><p className="mt-4 text-gray-700">Loading quiz...</p></div></div>)
  }

  if (!questions || questions.length === 0) {
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8 max-w-md"><h3 className="text-xl font-bold mb-4">No Quiz Available</h3><p className="text-gray-600 mb-4">This step doesn't have quiz questions yet.</p><button onClick={onClose} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Close</button></div></div>)
  }

  const currentQuestion = questions[currentIndex]
  const totalQuestions = questions.length
  const passThreshold = Math.ceil(totalQuestions * 0.8)

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setShowExplanation(true)
    if (index === currentQuestion.correctIndex) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setCompleted(true)
    }
  }

  const handleRetry = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setCompleted(false)
  }

  if (completed) {
    const passed = score >= passThreshold
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-8 max-w-md"><h3 className="text-2xl font-bold mb-4">{passed ? '🎉 Quiz Passed!' : '❌ Not Quite'}</h3><p className="text-xl mb-4">Score: {score}/{totalQuestions}</p><p className="text-gray-600 mb-6">{passed ? `Great job! You got ${score} out of ${totalQuestions} correct.` : `You need ${passThreshold} correct to pass. You got ${score}.`}</p><div className="flex gap-4">{passed ? (<button onClick={() => { onPass(); onClose(); }} className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Continue</button>) : (<button onClick={handleRetry} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Retry Quiz</button>)}<button onClick={onClose} className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">Close</button></div></div></div>)
  }

  return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"><div className="mb-6"><div className="flex justify-between items-center mb-2"><span className="text-sm text-gray-600">Question {currentIndex + 1} of {totalQuestions}</span><span className="text-sm text-gray-600">Score: {score}/{totalQuestions}</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full transition-all" style={{width: `${((currentIndex + 1) / totalQuestions) * 100}%`}}></div></div></div><h3 className="text-xl font-bold mb-6">{currentQuestion.question}</h3><div className="space-y-3 mb-6">{currentQuestion.options.map((option, index) => {const isSelected = selectedAnswer === index; const isCorrect = index === currentQuestion.correctIndex; const showCorrect = showExplanation && isCorrect; const showWrong = showExplanation && isSelected && !isCorrect; return (<button key={index} onClick={() => !showExplanation && handleAnswer(index)} disabled={showExplanation} className={`w-full p-4 text-left rounded-lg border-2 transition-all ${showCorrect ? 'bg-green-100 border-green-500' : showWrong ? 'bg-red-100 border-red-500' : isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'} ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}><span className="font-medium">{option}</span></button>)})}</div>{showExplanation && currentQuestion.explanation && (<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"><p className="text-sm text-blue-900"><strong>Explanation:</strong> {currentQuestion.explanation}</p></div>)}<div className="flex gap-4">{showExplanation && (<button onClick={handleNext} className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">{currentIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}</button>)}<button onClick={onClose} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">Close</button></div></div></div>)
}
