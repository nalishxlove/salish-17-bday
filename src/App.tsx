import "@/styles/App.css"
import HeadingSection from "@/components/sections/HeadingSection"
import WishesSection from "@/components/sections/WishesSection"
import Footer from "@/components/sections/Footer"

const App = () => (
  <div className="app-layout">
    <main className="app-main">
      <HeadingSection />
      <WishesSection />
    </main>
    <Footer />
  </div>
)

export default App
