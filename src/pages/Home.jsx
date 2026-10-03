import Hero from '../components/Hero'
import Services from '../components/Services'
import Process from '../components/Process'
import Portfolio from '../components/Portfolio'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Newsletter from '../components/Newsletter'
import usePageTitle from '../hooks/usePageTitle'

export default function Home() {
  usePageTitle() // restores the default title/description
  return (
    <>
      <Hero />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Newsletter />
    </>
  )
}
