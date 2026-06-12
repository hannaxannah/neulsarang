const services = [
  {
    featured: true,
    day: '주일',
    title: '주일예배',
    times: [{ label: '1부', value: '오전 9:00' }, { label: '2부', value: '오전 11:00' }],
  },
  { featured: false, day: '수요일', title: '수요예배', times: [{ label: '저녁', value: '오후 7:30' }] },
  { featured: false, day: '금요일', title: '금요기도회', times: [{ label: '저녁', value: '오후 9:00' }] },
  { featured: false, day: '매일', title: '새벽기도', times: [{ label: '새벽', value: '오전 5:30' }] },
]

export default function Worship() {
  return (
    <section className="worship" id="worship">
      <div className="container">
        <div className="section-header">
          <span className="section-tag light">예배안내</span>
          <h2 className="section-title light" style={{ fontFamily: 'var(--font-sans)' }}>함께 예배합니다</h2>
          <p className="section-desc">늘사랑교회의 모든 예배에 여러분을 초대합니다</p>
        </div>
        <div className="worship-grid">
          {services.map((s) => (
            <div key={s.title} className={`worship-card${s.featured ? ' featured' : ''}`}>
              <div className="worship-day">{s.day}</div>
              <h3 style={{ fontFamily: 'var(--font-sans)' }}>{s.title}</h3>
              <div className="worship-times">
                {s.times.map((t) => (
                  <div key={t.label} className="time-row">
                    <span className="time-label">{t.label}</span>
                    <span className="time-value">{t.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
