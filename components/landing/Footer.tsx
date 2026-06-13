const SERVICES = [
  ["주일1부(다음세대)", "9:20 - 10:20"],
  ["주일2부(청·장년)", "11:00 - 12:00"],
  ["주일3부(찬양예배)", "12:50 - 13:20"],
  ["주일성경공부", "13:20 - 14:00"],
  ["수요예배", "19:30 - 20:30"],
  ["금요기도회", "20:30 - 22:00"],
  ["아침기도회", "6:00 - 6:30"],
] as const;

export default function Footer() {
  return (
    <footer
      style={{
        background: "#2E3A24",
        padding: `clamp(36px, 5vw, 56px) var(--landing-px)`,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px 48px",
          marginBottom: 40,
        }}
      >
        {/* 교회명 + 소개 */}
        <div>
          <p
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 10px",
              letterSpacing: "-0.2px",
            }}
          >
            늘사랑교회
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            예수 그리스도를 따르며
            <br />
            하나님 나라를 알리자!
          </p>
        </div>

        {/* 예배 안내 */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              margin: "0 0 12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            예배 안내
          </p>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {SERVICES.map(([name, time]) => (
              <li
                key={name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                  {name}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,0.4)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 오시는 길 */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              margin: "0 0 12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            오시는 길
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.65)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              서울특별시 영등포구 영등포로 130,
              <br />
              진로아파트 상가동 3층 (07292)
            </p>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                margin: 0,
              }}
            >
              02-2637-5070
            </p>
          </div>
        </div>

        {/* 담임목사 */}
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              margin: "0 0 12px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            담임목사
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            담임목사 최진권
            <br />
            <span style={{ color: "rgba(255,255,255,0.4)" }}>
              lordship_choi@msn.com
            </span>
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          © {new Date().getFullYear()} 늘사랑교회. All rights reserved.
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", margin: 0 }}>
          목회돌봄 관리 시스템
        </p>
      </div>
    </footer>
  );
}
