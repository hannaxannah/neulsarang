export default function Location() {
  return (
    <section className="location" id="location">
      <div className="container">
        <div className="location-grid">
          <div className="location-info">
            <span className="section-tag">오시는 길</span>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-serif)' }}>
              늘사랑교회로<br />오세요
            </h2>
            <div className="info-list">
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </div>
                <div>
                  <p className="info-label">주소</p>
                  <p className="info-value">서울특별시 — 교회 주소를 입력해 주세요</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="1.8" />
                  </svg>
                </div>
                <div>
                  <p className="info-label">전화</p>
                  <p className="info-value">02-000-0000</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="info-label">이메일</p>
                  <p className="info-value">info@neulsarang.or.kr</p>
                </div>
              </div>
            </div>
          </div>
          <div className="map-placeholder">
            <div className="map-inner">
              <svg viewBox="0 0 64 64" fill="none" width="48" height="48">
                <path d="M32 4C21.507 4 13 12.507 13 23c0 13.125 17.5 32.5 17.5 32.5S48 36 50.992 23C51.089 12.507 42.493 4 32 4z" stroke="#c9a84c" strokeWidth="2.5" />
                <circle cx="32" cy="23" r="6" stroke="#c9a84c" strokeWidth="2.5" />
              </svg>
              <p>지도를 삽입해 주세요</p>
              <span>카카오맵 또는 구글맵 embed 코드</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
