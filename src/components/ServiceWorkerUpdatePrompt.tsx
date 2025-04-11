'use client'

import { useEffect, useState } from 'react'

export default function ServiceWorkerUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })

      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setShowPrompt(true)
              }
            })
          }
        })
      })
    }
  }, [])

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white py-2 px-4 rounded-xl shadow-md z-50 flex items-center gap-2 animate-fade-in">
      🔄 New version available.
      <button
        onClick={() => window.location.reload()}
        className="ml-2 underline"
      >
        Refresh
      </button>
    </div>
  )
}