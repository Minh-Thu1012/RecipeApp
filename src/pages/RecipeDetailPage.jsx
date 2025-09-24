import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import '../styles/recipe-detail.css'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [relatedRecipes, setRelatedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

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
        
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
        setIsFavorite(favorites.some(fav => fav.idMeal === recipeData.idMeal))

        if (recipeData.strCategory) {
          fetchRelatedRecipes(recipeData.strCategory, recipeData.idMeal)
        }
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

  const fetchRelatedRecipes = async (category, currentId) => {
    try {
      const response = await axiosClient.get(`/filter.php?c=${encodeURIComponent(category)}`)
      const allRecipes = response.data.meals || []

      const related = allRecipes
        .filter(recipe => recipe.idMeal !== currentId)
        .slice(0, 3)
      setRelatedRecipes(related)
    } catch (err) {
      console.error('Related recipes error:', err)
    }
  }

  const toggleFavorite = () => {
    if (!recipe) return

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (isFavorite) {

      const updatedFavorites = favorites.filter(fav => fav.idMeal !== recipe.idMeal)
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setIsFavorite(false)
    } else {
      const updatedFavorites = [...favorites, recipe]
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
      setIsFavorite(true)
    }
  }

  const getImageGallery = (recipe) => {
    const images = []
    
    if (recipe.strMealThumb) {
      images.push({
        src: recipe.strMealThumb,
        alt: recipe.strMeal,
        type: 'main'
      })
    }

    return images
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
  const imageGallery = getImageGallery(recipe)

  return (
    <div className="recipe-detail-page">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Home
      </button>

      <div className="recipe-detail">

        <div className="recipe-gallery-section">
          <div className="main-image-container">
            <img 
              src={imageGallery[selectedImage]?.src || recipe.strMealThumb} 
              alt={imageGallery[selectedImage]?.alt || recipe.strMeal}
              className="recipe-main-image"
            />
          </div>
          
          {imageGallery.length > 1 && (
            <div className="gallery-thumbnails">
              {imageGallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`thumbnail-button ${selectedImage === index ? 'active' : ''}`}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="thumbnail-image"
                  />
                </button>
              ))}
            </div>
          )}
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


          {relatedRecipes.length > 0 && (
            <div className="related-recipes-section">
              <h2>Related Recipes</h2>
              <div className="related-recipes-grid">
                {relatedRecipes.map((relatedRecipe) => (
                  <div key={relatedRecipe.idMeal} className="related-recipe-card">
                    <img 
                      src={relatedRecipe.strMealThumb} 
                      alt={relatedRecipe.strMeal}
                      className="related-recipe-image"
                    />
                    <h4 className="related-recipe-title">{relatedRecipe.strMeal}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage
