import Link from "next/link";

export default function TopBar() {
  return (
    <>
      <style>{`
        .topbar-logo { font-size: 17px; }
        .topbar-btn { padding: 9px 22px; font-size: 14px; transition: background 0.2s; }
        .topbar-btn:hover { background: #4d6340 !important; }
        .topbar-btn-icon { width: 12px; height: 12px; }

        @media (max-width: 640px) {
          .topbar-logo { font-size: 14px; }
          .topbar-btn { padding: 7px 14px; font-size: 12px; }
          .topbar-btn-icon { width: 10px; height: 10px; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .topbar-logo { font-size: 15px; }
          .topbar-btn { padding: 8px 18px; font-size: 13px; }
          .topbar-btn-icon { width: 11px; height: 11px; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "clamp(14px, 2vw, 20px) var(--landing-px)",
        }}
      >
        <span
          className="topbar-logo"
          style={{ fontWeight: 700, color: "#111", letterSpacing: "-0.3px" }}
        >
          늘사랑교회
        </span>
        <Link
          href="/login"
          className="topbar-btn"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            borderRadius: 100,
            fontWeight: 500,
            background: "#3B4A2F",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Login
          <svg
            className="topbar-btn-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
            />
          </svg>
        </Link>
      </div>
    </>
  );
}
