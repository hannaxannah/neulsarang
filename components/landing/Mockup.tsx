import Image from "next/image";

export default function Mockup() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .verse-ref { display: block; margin-top: 2px; }
          .tablet-frame { padding: 5px 5px 0 !important; border-radius: 10px 10px 0 0 !important; }
          .tablet-notch-wrap { margin-bottom: 4px !important; }
          .tablet-notch { width: 28px !important; height: 3px !important; }
        }
      `}</style>

      {/* Headline */}
      <div
        style={{
          padding:
            "clamp(4px, 1vw, 8px) var(--landing-px) clamp(48px, 7vw, 88px)",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(44px, 7.5vw, 112px)",
            fontWeight: 400,
            color: "#111",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
            wordBreak: "keep-all",
          }}
        >
          Neulsarang CareChurch.
        </h1>
      </div>

      {/* Mockup section — sage green bg behind tablet */}
      <div style={{ position: "relative", marginBottom: 0 }}>
        {/* Sage green background */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "28%",
            bottom: 0,
            background: "#8C9E78",
            borderRadius: "28px 28px 0 0",
          }}
        />

        {/* Tablet mockup */}
        <div
          style={{
            position: "relative",
            padding: "0 var(--landing-px)",
            zIndex: 1,
          }}
        >
          <div
            className="tablet-frame"
            style={{
              background: "#1A1A1A",
              borderRadius: "20px 20px 0 0",
              padding: "14px 14px 0",
              boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
            }}
          >
            <div
              className="tablet-notch-wrap"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div
                className="tablet-notch"
                style={{
                  width: 56,
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
            </div>

            <div
              style={{
                borderRadius: "10px 10px 0 0",
                overflow: "hidden",
                aspectRatio: "16/9",
                position: "relative",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1400&q=80"
                alt="Neulsarang Church"
                fill
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 100%)",
                }}
              />

              {/* 시스템 레이블 + 성경 구절 */}
              <div style={{ position: "absolute", top: 20, left: 24 }}>
                <p
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.5)",
                    margin: "0 0 10px",
                  }}
                >
                  목회돌봄 시스템 › 현황
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(18px, 3vw, 40px)",
                    fontWeight: 700,
                    color: "#fff",
                    margin: 0,
                    lineHeight: 1.45,
                    letterSpacing: "-0.02em",
                    wordBreak: "keep-all",
                  }}
                >
                  너희는 그리스도의 몸이요
                  <br />
                  지체의 각 부분이라{" "}
                  <span
                    className="verse-ref"
                    style={{
                      fontSize: "clamp(11px, 1.4vw, 18px)",
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.5)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    고린도전서 12:27
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
