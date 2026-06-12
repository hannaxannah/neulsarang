import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-logo" style={{ fontFamily: 'var(--font-sans)' }}>늘사랑교회</p>
            <p className="footer-tagline">언제나, 변함없이, 사랑으로</p>
          </div>
          <nav className="footer-links">
            <Link href="#about">교회소개</Link>
            <Link href="#worship">예배안내</Link>
            <Link href="#ministry">사역</Link>
            <Link href="#location">오시는길</Link>
          </nav>
          <div className="footer-contact">
            <p>주일예배 오전 9:00 / 11:00</p>
            <p>수요예배 오후 7:30</p>
            <p>info@neulsarang.or.kr</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 늘사랑교회. All rights reserved.</p>
          <p>
            <a href="http://www.neulsarang.or.kr" target="_blank" rel="noopener noreferrer">
              기존 홈페이지
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
