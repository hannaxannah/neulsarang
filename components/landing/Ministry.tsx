const ministries = [
  {
    title: '영유아부',
    desc: '사랑으로 자라는 아이들의 첫 신앙 여정을 함께합니다.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: '유초등부',
    desc: '성경 말씀을 통해 바른 가치관을 세워가는 어린이 사역입니다.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <rect x="8" y="20" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2.5" />
        <rect x="26" y="12" width="14" height="28" rx="2" stroke="currentColor" strokeWidth="2.5" />
        <path d="M8 12l16-8 16 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: '청소년부',
    desc: '꿈과 비전을 하나님 안에서 발견하는 청소년 공동체입니다.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M24 8l4 8h8l-6.5 5 2.5 8L24 24l-8 5 2.5-8L12 16h8l4-8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: '청년부',
    desc: '세상 속에서 그리스도인으로 살아가는 청년들의 공동체입니다.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M16 20c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="30" r="10" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 26v4l3 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: '가정사역',
    desc: '건강한 가정을 세워 교회와 사회의 기초를 튼튼히 합니다.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M16 24c0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.418-3.582 8-8 8s-8-3.582-8-8z" stroke="currentColor" strokeWidth="2.5" />
        <path d="M24 16V8M24 40v-8M16 24H8M40 24h-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: '선교·전도',
    desc: '복음을 이웃과 열방에 전하는 선교와 전도 사역입니다.',
    icon: (
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="18" cy="20" r="7" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="30" cy="20" r="7" stroke="currentColor" strokeWidth="2.5" />
        <path d="M6 38c0-6.627 5.373-12 12-12M30 26c6.627 0 12 5.373 12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Ministry() {
  return (
    <section className="ministry" id="ministry">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">사역</span>
          <h2 className="section-title" style={{ fontFamily: 'var(--font-sans)' }}>모든 세대가 함께</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', marginBottom: '3.5rem' }}>
            각 세대에 맞는 사역으로 믿음 안에서 함께 성장합니다
          </p>
        </div>
        <div className="ministry-grid">
          {ministries.map((m) => (
            <div key={m.title} className="ministry-card">
              <div className="ministry-icon">{m.icon}</div>
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
