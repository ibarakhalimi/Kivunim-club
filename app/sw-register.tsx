'use client'
import { useEffect } from 'react'

export default function SwRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let refreshing = false

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return
        refreshing = true
        window.location.reload()
      })

      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => {
        registration.update()
      })
    }
  }, [])
  return null
}
