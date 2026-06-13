import TopBar from "./TopBar";
import Mockup from "./Mockup";
import Footer from "./Footer";

export default function LandingHero() {
  return (
    <>
      <style>{`
        :root {
          --landing-px: clamp(48px, 8vw, 120px);
        }
        @media (orientation: portrait) {
          :root {
            --landing-px: clamp(20px, 5vw, 48px);
          }
        }
        @keyframes landingFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .land-1 { animation: landingFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both; }
        .land-2 { animation: landingFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.20s both; }
        .land-3 { animation: landingFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.35s both; }
        .land-4 { animation: landingFadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.50s both; }
      `}</style>

      <div
        style={{
          background: "#F9F8F6",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <div className="land-1"><TopBar /></div>
        <Mockup />
        <div className="land-4"><Footer /></div>
      </div>
    </>
  );
}
