'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" style={{ fontFamily: 'var(--font-serif)' }}>
          늘사랑교회
        </Link>
        <nav className="nav-links">
          <Link href="#about">교회소개</Link>
          <Link href="#worship">예배안내</Link>
          <Link href="#ministry">사역</Link>
          <Link href="#location">오시는길</Link>
          <Link href="#contact" className="nav-cta">방문신청</Link>
        </nav>
        <button
          className="hamburger"
          id="hamburger"
          aria-label="메뉴"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <Link href="#about" className="mobile-link" onClick={closeMenu}>교회소개</Link>
        <Link href="#worship" className="mobile-link" onClick={closeMenu}>예배안내</Link>
        <Link href="#ministry" className="mobile-link" onClick={closeMenu}>사역</Link>
        <Link href="#location" className="mobile-link" onClick={closeMenu}>오시는길</Link>
        <Link href="#contact" className="mobile-link" onClick={closeMenu}>방문신청</Link>
      </div>
    </header>
  )
}
