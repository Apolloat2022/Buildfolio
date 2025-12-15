// components/MarkCompleteButton.tsx - FIXED
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Check, Loader2 } from "lucide-react";
import QuizModalComplete from "@/components/QuizModalComplete";

interface MarkCompleteButtonProps {
  stepId: string;
  projectId: string;
  isCompleted: boolean;
  requiresQuiz?: boolean;
}

export default function MarkCompleteButton({
  stepId,
  projectId,
  isCompleted,
  requiresQuiz = true
}: MarkCompleteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const clickRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const markComplete = useCallback(async () => {
    if (clickRef.current) return;
    clickRef.current = true;
    
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, projectId })
      });
      
      if (!response.ok) {
        throw new Error("Failed to mark complete");
      }
      
      // Success - reload page
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to mark step as complete");
      setIsLoading(false);
      clickRef.current = false;
    }
  }, [stepId, projectId]);

  const loadQuiz = useCallback(async () => {
    if (clickRef.current) return;
    clickRef.current = true;
    
    setLoadingQuiz(true);
    
    try {
      const response = await fetch(`/api/quiz/questions?stepId=${stepId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load quiz: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.questions || data.questions.length === 0) {
        alert("No quiz questions found. Marking as complete.");
        markComplete();
        return;
      }
      
      setQuizQuestions(data.questions);
      setShowQuiz(true);
    } catch (error: any) {
      console.error("Quiz error:", error);
      alert(`Error: ${error.message}. Marking as complete.`);
      markComplete();
    } finally {
      setLoadingQuiz(false);
      clickRef.current = false;
    }
  }, [stepId, markComplete]);

  const handleClick = useCallback(() => {
    if (isCompleted) return;
    
    if (requiresQuiz && !showQuiz) {
      loadQuiz();
    } else {
      markComplete();
    }
  }, [isCompleted, requiresQuiz, showQuiz, loadQuiz, markComplete]);

  const handleQuizPass = useCallback(() => {
    setShowQuiz(false);
    setQuizQuestions([]);
    markComplete();
  }, [markComplete]);

  const handleQuizClose = useCallback(() => {
    setShowQuiz(false);
    setQuizQuestions([]);
  }, []);

  // Don't render button until mounted
  if (!isMounted) {
    return (
      <div className="w-full py-3 px-4 bg-gray-200 rounded-lg animate-pulse"></div>
    );
  }

  if (isCompleted) {
    return (
      <button disabled className="w-full py-3 px-4 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2">
        <Check size={20} />
        Complete
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading || loadingQuiz}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading || loadingQuiz ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            {loadingQuiz ? "Loading Quiz..." : "Processing..."}
          </>
        ) : (
          "Mark Complete"
        )}
      </button>
      
      {showQuiz && quizQuestions.length > 0 && (
        <QuizModalComplete
          stepId={stepId}
          questions={quizQuestions}
          onPass={handleQuizPass}
          onClose={handleQuizClose}
        />
      )}
    </>
  );
}
