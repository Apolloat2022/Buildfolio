"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function CertificateFloatingButton() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    fetch('/api/user/has-certificates')
      .then(res => res.json())
      .then(data => {
        if (data.hasCertificates) {
          setCount(1)
        }
      })
      .catch(() => {})
  }, [])

  if (count === 0) return null

  return (
    <Link
      href="/certificates"
      className="fixed bottom-8 right-8 z-50 px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-2xl hover:from-yellow-500 hover:to-orange-600 font-bold text-lg flex items-center gap-2 animate-bounce hover:animate-none transition-all"
    >
      🎓 View Certificate ({count})
    </Link>
  )
}
