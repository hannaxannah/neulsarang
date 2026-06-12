'use client'

import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll(
      '.value-card, .worship-card, .ministry-card, .info-item, .scripture, .cta-inner'
    )
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    targets.forEach((el, i) => {
      el.classList.add('reveal')
      ;(el as HTMLElement).style.transitionDelay = `${(i % 4) * 0.08}s`
      observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return null
}
