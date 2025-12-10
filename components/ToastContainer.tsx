'use client'

import { useEffect, useState } from 'react'
import { Star, Flame, Trophy } from 'lucide-react'

interface Toast {
  id: number
  message: string
  points: number
  type: 'points' | 'streak' | 'badge'
}

let toastId = 0
let addToastFn: ((toast: Omit<Toast, 'id'>) => void) | null = null

export function showPointsToast(points: number, message: string = 'Step completed!') {
  if (addToastFn) {
    addToastFn({ message, points, type: 'points' })
  }
}

export function showStreakToast(streak: number) {
  if (addToastFn) {
    addToastFn({ message: `${streak} day streak!`, points: 0, type: 'streak' })
  }
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    addToastFn = (toast) => {
      const newToast = { ...toast, id: toastId++ }
      setToasts(prev => [...prev, newToast])
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id))
      }, 3000)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg shadow-2xl animate-slide-in-right flex items-center gap-3 min-w-[250px]"
        >
          {toast.type === 'points' && <Star className="w-6 h-6" />}
          {toast.type === 'streak' && <Flame className="w-6 h-6 text-orange-300" />}
          {toast.type === 'badge' && <Trophy className="w-6 h-6 text-yellow-300" />}
          
          <div>
            <div className="font-bold">{toast.message}</div>
            {toast.points > 0 && (
              <div className="text-xl font-bold">+{toast.points} points</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}