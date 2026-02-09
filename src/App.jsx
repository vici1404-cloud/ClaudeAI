import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import WellnessCards from './components/WellnessCards'
import Insights from './components/Insights'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <WellnessCards />
        <Insights />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}

export default App
