import Navbar from '@/components/landing/Navbar'
import Hero from '@/components/landing/Hero'
import Welcome from '@/components/landing/Welcome'
import Worship from '@/components/landing/Worship'
import Ministry from '@/components/landing/Ministry'
import Quote from '@/components/landing/Quote'
import Location from '@/components/landing/Location'
import Cta from '@/components/landing/Cta'
import Footer from '@/components/landing/Footer'
import RevealObserver from '@/components/landing/RevealObserver'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Welcome />
        <Worship />
        <Ministry />
        <Quote />
        <Location />
        <Cta />
      </main>
      <Footer />
      <RevealObserver />
    </>
  )
}
