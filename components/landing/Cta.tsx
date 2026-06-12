export default function Cta() {
  return (
    <section className="cta-section" id="contact">
      <div className="container">
        <div className="cta-inner">
          <h2 style={{ fontFamily: 'var(--font-sans)' }}>처음 오시나요?</h2>
          <p>
            방문 신청을 해주시면 교회를 안내해 드리겠습니다.<br />
            편안한 마음으로 오세요.
          </p>
          <a href="mailto:info@neulsarang.or.kr" className="btn-primary large">
            방문 신청하기
          </a>
        </div>
      </div>
    </section>
  )
}
