import Link from 'next/link'

const values = [
  { icon: '✦', title: '말씀 중심', desc: '하나님의 말씀을 삶의 기준으로 삼고 날마다 성경으로 살아갑니다.' },
  { icon: '✦', title: '기도의 교회', desc: '개인과 공동체가 함께 기도하며 하나님의 뜻을 구합니다.' },
  { icon: '✦', title: '섬김과 나눔', desc: '이웃을 사랑하고 지역 사회를 섬기는 교회로 살아갑니다.' },
  { icon: '✦', title: '선교의 사명', desc: '복음을 땅 끝까지 전하는 선교적 교회를 지향합니다.' },
]

export default function Welcome() {
  return (
    <section className="welcome" id="about">
      <div className="container">
        <div className="welcome-grid">
          <div className="welcome-text">
            <span className="section-tag">교회소개</span>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-serif)' }}>
              하나님의 사랑을<br />나누는 교회
            </h2>
            <p className="section-body">
              늘사랑교회는 복음 위에 세워진 교회입니다.<br />
              말씀과 기도로 성장하고, 섬김과 나눔으로 세상에 빛을 비추며,
              모든 세대가 함께 하나님을 예배하는 공동체입니다.
            </p>
            <p className="section-body">
              처음 오시는 분도, 오랫동안 신앙생활을 해오신 분도 모두 환영합니다.
            </p>
            <Link href="#contact" className="btn-primary">첫 방문 신청하기</Link>
          </div>
          <div className="welcome-cards">
            {values.map((v) => (
              <div key={v.title} className="value-card">
                <div className="value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
