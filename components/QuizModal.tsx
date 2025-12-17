// components/QuizModal.tsx - UPDATED VERSION
"use client"

import { useState } from "react"

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string | null
}

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  onPass: () => void
  questions: QuizQuestion[]
}

export default function QuizModal({ isOpen, onClose, onPass, questions }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanations, setShowExplanations] = useState(false)

  if (!isOpen) return null

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestion] = answerIndex
    setUserAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // Calculate score
    let correct = 0
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctIndex) {
        correct++
      }
    })
    
    const calculatedScore = Math.round((correct / questions.length) * 100)
    setScore(calculatedScore)
    setQuizCompleted(true)
    
    // Show explanations if failed
    if (calculatedScore < 80) {
      setShowExplanations(true)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setUserAnswers(Array(questions.length).fill(-1))
    setQuizCompleted(false)
    setScore(0)
    setShowExplanations(false)
  }

  // Quiz completed view - shows results
  if (quizCompleted) {
    const passed = score >= 80
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            {passed ? "🎉 Quiz Passed!" : "📝 Quiz Results"}
          </h2>
          
          <div className="mb-6">
            <div className={`text-3xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
              {score}%
            </div>
            <p className="mt-2">
              {passed 
                ? "Congratulations! You passed with a score of " + score + "%." 
                : "You scored " + score + "%. Need 80% to pass."}
            </p>
          </div>

          {!passed && (
            <div className="mb-6">
              <button
                onClick={() => setShowExplanations(!showExplanations)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                {showExplanations ? "Hide Explanations" : "Show Answers & Explanations"}
              </button>
            </div>
          )}

          {showExplanations && (
            <div className="space-y-6 mb-6">
              <h3 className="text-xl font-semibold">Review Your Answers</h3>
              
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index]
                const isCorrect = userAnswer === question.correctIndex
                
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium mb-3">
                      {index + 1}. {question.question}
                    </p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => {
                        let bgColor = "bg-gray-100"
                        if (optIndex === question.correctIndex) {
                          bgColor = "bg-green-100 border border-green-300"
                        } else if (optIndex === userAnswer && !isCorrect) {
                          bgColor = "bg-red-100 border border-red-300"
                        }
                        
                        return (
                          <div
                            key={optIndex}
                            className={`p-3 rounded ${bgColor}`}
                          >
                            {option}
                            {optIndex === question.correctIndex && (
                              <span className="ml-2 text-green-700 text-sm">✓ Correct answer</span>
                            )}
                            {optIndex === userAnswer && !isCorrect && (
                              <span className="ml-2 text-red-700 text-sm">✗ Your answer</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={passed ? onPass : handleRetry}
              className={`px-6 py-2 rounded font-medium ${
                passed 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {passed ? "Continue to Next Step" : "Retry Quiz"}
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active quiz view
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-2">Step Quiz</h2>
        <p className="text-gray-600 mb-6">
          Question {currentQuestion + 1} of {questions.length}
        </p>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">
            {questions[currentQuestion].question}
          </h3>
          
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border ${
                  userAnswers[currentQuestion] === index
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {currentQuestion + 1}/{questions.length}
            </span>
            
            {currentQuestion < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={userAnswers[currentQuestion] === -1}
                className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={userAnswers.includes(-1)}
                className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
