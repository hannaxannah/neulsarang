import { auth } from "@/auth";
import PageContainer from "@/components/dashboard/PageContainer";

const STATS = [
  { label: "전체 성도", value: "–", sub: "등록 성도 수" },
  { label: "이번 주 출석", value: "–", sub: "출석률 집계 예정" },
  { label: "활동 목장", value: "–", sub: "목장 수" },
  { label: "이번 달 헌금", value: "–", sub: "합계 집계 예정" },
];

export default async function DashboardPage() {
  const session = await auth();

  return (
    <PageContainer>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#1D1D1F",
            margin: "0 0 4px",
            letterSpacing: "-0.3px",
          }}
        >
          통계 홈
        </h1>
      </div>

      {/* Stats grid */}
      <div
        className="stats-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              padding: "20px 20px 18px",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: "#86868B",
                margin: "0 0 10px",
                letterSpacing: "0.02em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </p>
            <p
              style={{
                fontSize: 32,
                fontWeight: 600,
                color: "#1D1D1F",
                margin: "0 0 4px",
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}
            >
              {s.value}
            </p>
            <p style={{ fontSize: 11, color: "#AEAEB2", margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.06)",
          padding: "24px",
          minHeight: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: 13, color: "#C7C7CC", margin: 0 }}>
          통계 차트는 6단계에서 구현됩니다.
        </p>
      </div>
    </PageContainer>
  );
}
