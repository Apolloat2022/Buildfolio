'use client'

import { useState, useEffect } from 'react'
import { Flame, Trophy, Star, Award } from 'lucide-react'

interface UserStats {
  currentStreak: number
  longestStreak: number
  totalPoints: number
  level: number
  completedProjects: number
  badges: Array<{
    id: string
    name: string
    icon: string
    unlockedAt: string
  }>
}

export default function GamificationDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="animate-pulse">Loading stats...</div>
  }

  if (!stats) return null

  const progressToNextLevel = ((stats.totalPoints % 1000) / 1000) * 100

  return (
    <div className="space-y-6">
      {/* Level & Points */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5" />
              <span className="text-sm opacity-90">Level</span>
            </div>
            <div className="text-4xl font-bold">{stats.level}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90 mb-1">Total Points</div>
            <div className="text-3xl font-bold">{stats.totalPoints.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Level {stats.level + 1}</span>
            <span>{stats.totalPoints % 1000} / 1000</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streaks & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.longestStreak}</div>
              <div className="text-sm text-gray-600">Best Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.completedProjects}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-purple-600" />
          Badges Earned ({stats.badges.length})
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {stats.badges.map((badge) => (
            <div 
              key={badge.id}
              className="text-center p-4 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50"
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="text-xs font-medium text-gray-700">{badge.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}