// components/QuizModalComplete.tsx
"use client";

import { useState, useEffect } from "react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
}

interface QuizModalProps {
  stepId: string;
  questions: QuizQuestion[];
  onPass: () => void;
  onClose: () => void;
}

export default function QuizModalComplete({ stepId, questions, onPass, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (questions && questions.length > 0) {
      setAnswers(new Array(questions.length).fill(-1));
    }
  }, [questions]);

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
        <div className="bg-white rounded-xl p-8 max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">No Quiz Available</h3>
          <p className="text-gray-600 mb-6">No quiz questions found for this step.</p>
          <button
            onClick={onPass}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-3"
          >
            Mark Complete Without Quiz
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleSubmit = async () => {
    // Check if all questions answered
    if (answers.some(a => a === -1)) {
      alert("Please answer all questions before submitting!");
      return;
    }

    const correct = calculateScore();
    const total = questions.length;
    const percentage = (correct / total) * 100;
    
    setScore(correct);
    setSubmitted(true);
    setShowExplanation(true);

    // Submit to server
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepId,
          answers,
          score: correct,
          totalQuestions: total,
          passed: percentage >= 80
        })
      });
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }

    // Auto-proceed after 3 seconds
    setTimeout(() => {
      if (percentage >= 80) {
        onPass();
      }
    }, 3000);
  };

  const handleRetry = () => {
    setAnswers(new Array(questions.length).fill(-1));
    setSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
    setShowExplanation(false);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const currentQ = questions[currentQuestion];
  const isSelected = answers[currentQuestion] !== -1;
  const allAnswered = answers.every(a => a !== -1);
  const totalScore = submitted ? calculateScore() : 0;
  const percentage = submitted ? (totalScore / questions.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Step Quiz</h2>
            <p className="text-gray-700">
              Question {currentQuestion + 1} of {questions.length}
              {submitted && ` | Score: ${totalScore}/${questions.length}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            disabled={submitted}
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQ.question}
          </h3>
          
          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelectedOption = answers[currentQuestion] === index;
              const isCorrectOption = index === currentQ.correctIndex;
              
              let optionClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";
              
              if (submitted) {
                if (isCorrectOption) {
                  optionClass += "border-green-500 bg-green-50 ";
                } else if (isSelectedOption && !isCorrectOption) {
                  optionClass += "border-red-500 bg-red-50 ";
                } else {
                  optionClass += "border-gray-200 bg-gray-50 ";
                }
              } else if (isSelectedOption) {
                optionClass += "border-blue-500 bg-blue-50 ";
              } else {
                optionClass += "border-gray-300 hover:border-gray-400 ";
              }
              
              optionClass += submitted ? "cursor-default" : "cursor-pointer";
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  disabled={submitted}
                  className={optionClass}
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                      isSelectedOption ? "border-blue-600 bg-blue-600" : "border-gray-300"
                    }`}>
                      {submitted && isCorrectOption && (
                        <span className="text-white text-sm">✓</span>
                      )}
                      {submitted && isSelectedOption && !isCorrectOption && (
                        <span className="text-white text-sm">✗</span>
                      )}
                    </div>
                    <span className={`font-medium ${
                      submitted && isCorrectOption ? "text-green-900" :
                      submitted && isSelectedOption ? "text-red-900" :
                      "text-gray-900"
                    }`}>
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && currentQ.explanation && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
            <p className="text-blue-800">{currentQ.explanation}</p>
          </div>
        )}

        {/* Navigation & Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          {/* Previous/Next */}
          <div className="flex space-x-3">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0 || submitted}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:text-gray-400"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1 || submitted}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:text-gray-400"
            >
              Next
            </button>
          </div>

          {/* Submit/Retry */}
          <div className="flex space-x-3">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  allAnswered
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Quiz
              </button>
            ) : percentage >= 80 ? (
              <div className="text-green-700 font-semibold px-4 py-2 bg-green-50 rounded-lg">
                ✅ Quiz Passed! ({totalScore}/{questions.length})
              </div>
            ) : (
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* Score Display */}
        {submitted && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
            <div className="text-lg font-semibold mb-2">
              Score: {totalScore}/{questions.length} ({percentage.toFixed(0)}%)
            </div>
            <div className={`text-lg font-bold ${percentage >= 80 ? 'text-green-600' : 'text-red-600'}`}>
              {percentage >= 80 ? "🎉 PASSED (80%+ required)" : "❌ FAILED (80%+ required)"}
            </div>
            {percentage >= 80 && (
              <p className="text-gray-600 mt-2">This step will be marked complete...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
