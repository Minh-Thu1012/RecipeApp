import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import RecipeList from '../components/RecipeList'
import '../styles/category-page.css'

const CategoryPage = () => {
  const { name } = useParams()
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryRecipes = async () => {
      if (!name) return

      setLoading(true)
      setError(null)

      try {
        const response = await axiosClient.get(`/filter.php?c=${encodeURIComponent(name)}`)
        setRecipes(response.data.meals || [])
      } catch (err) {
        setError('Unable to load recipe list. Please try again.')
        console.error('Category recipes error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryRecipes()
  }, [name])

  if (loading) {
    return (
      <div className="category-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recipes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="category-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="category-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Home
      </button>

      <div className="category-header">
        <h1 className="page-title">Recipes: {decodeURIComponent(name)}</h1>
        <p className="category-count">
          {recipes.length} recipes in this category
        </p>
      </div>

      <div className="category-recipes">
        <RecipeList recipes={recipes} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default CategoryPage
