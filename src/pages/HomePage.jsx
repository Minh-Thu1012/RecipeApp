import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import RecipeList from '../components/RecipeList'

const HomePage = () => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const searchRecipes = async (term) => {
    if (!term.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await axiosClient.get(`/search.php?s=${encodeURIComponent(term)}`)
      setRecipes(response.data.meals || [])
    } catch (err) {
      setError('Failed to fetch recipes. Please try again.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    searchRecipes(searchTerm)
  }

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  // Load default recipes on component mount
  useEffect(() => {
    searchRecipes('chicken')
  }, [])

  return (
    <div className="home-page">
      <div className="search-section">
        <h1 className="page-title">Find Your Perfect Recipe</h1>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search for recipes..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="results-section">
        <h2 className="results-title">
          {searchTerm ? `Results for "${searchTerm}"` : 'Popular Recipes'}
        </h2>
        <RecipeList recipes={recipes} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default HomePage
