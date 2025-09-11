import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true)
        const response = await axiosClient.get(`/lookup.php?i=${id}`)
        const recipeData = response.data.meals?.[0]
        
        if (!recipeData) {
          setError('Recipe not found')
          return
        }

        setRecipe(recipeData)
        
        // Check if recipe is in favorites
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setIsFavorite(favorites.some(fav => fav.idMeal === recipeData.idMeal))
      } catch (err) {
        setError('Failed to fetch recipe details')
        console.error('Recipe fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRecipe()
    }
  }, [id])

  const toggleFavorite = () => {
    if (!recipe) return

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = favorites.filter(fav => fav.idMeal !== recipe.idMeal)
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    } else {
      // Add to favorites
      const updatedFavorites = [...favorites, recipe]
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setIsFavorite(true)
    }
  }

  const getIngredients = (recipe) => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`]
      const measure = recipe[`strMeasure${i}`]
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        })
      }
    }
    return ingredients
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recipe details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="error-container">
        <p className="error-message">Recipe not found</p>
        <button onClick={() => navigate('/')} className="back-button">
          Back to Home
        </button>
      </div>
    )
  }

  const ingredients = getIngredients(recipe)

  return (
    <div className="recipe-detail-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Home
      </button>

      <div className="recipe-detail">
        <div className="recipe-image-section">
          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal}
            className="recipe-detail-image"
          />
        </div>

        <div className="recipe-content">
          <div className="recipe-header">
            <h1 className="recipe-detail-title">{recipe.strMeal}</h1>
            <button 
              onClick={toggleFavorite}
              className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
            >
              {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
            </button>
          </div>

          {recipe.strCategory && (
            <p className="recipe-category">
              <strong>Category:</strong> {recipe.strCategory}
            </p>
          )}

          {recipe.strArea && (
            <p className="recipe-area">
              <strong>Cuisine:</strong> {recipe.strArea}
            </p>
          )}

          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {ingredients.map((item, index) => (
                <li key={index} className="ingredient-item">
                  <span className="ingredient-measure">{item.measure}</span>
                  <span className="ingredient-name">{item.ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <div className="instructions-content">
              {recipe.strInstructions.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="instruction-paragraph">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage
