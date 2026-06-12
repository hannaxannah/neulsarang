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
      `}</style>

      <div
        style={{
          background: "#F9F8F6",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <TopBar />
        <Mockup />
        <Footer />
      </div>
    </>
  );
}
