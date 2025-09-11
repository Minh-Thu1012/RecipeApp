import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import RecipeDetailPage from './pages/RecipeDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import './styles/navbar.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:name" element={<CategoryPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
