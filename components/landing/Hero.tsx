import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <p className="hero-eyebrow">Welcome to</p>
        <h1 className="hero-title" style={{ fontFamily: 'var(--font-sans)' }}>늘사랑교회</h1>
        <p className="hero-sub">언제나, 변함없이, 사랑으로</p>
        <div className="hero-buttons">
          <Link href="#worship" className="btn-primary">예배 시간 보기</Link>
          <Link href="#about" className="btn-outline">교회 소개</Link>
        </div>
      </div>
      <div className="hero-scroll">
        <div className="scroll-indicator" />
      </div>
    </section>
  )
}
