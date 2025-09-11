import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/favorites-page.css'

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

  const removeFromFavorites = (recipeId) => {
    const updatedFavorites = favorites.filter(recipe => recipe.idMeal !== recipeId)
    setFavorites(updatedFavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  if (favorites.length === 0) {
    return (
      <div className="favorites-page">
        <h1 className="page-title">My Favorites</h1>
        <div className="empty-favorites">
          <p>No favorite recipes yet.</p>
          <Link to="/" className="browse-recipes-link">
            Browse Recipes
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page">
      <h1 className="page-title">My Favorites</h1>
      <p className="favorites-count">{favorites.length} favorite recipe{favorites.length !== 1 ? 's' : ''}</p>
      
      <div className="favorites-list">
        {favorites.map((recipe) => (
          <div key={recipe.idMeal} className="favorite-item">
            <Link to={`/recipe/${recipe.idMeal}`} className="favorite-link">
              <img 
                src={recipe.strMealThumb} 
                alt={recipe.strMeal}
                className="favorite-image"
              />
              <div className="favorite-info">
                <h3 className="favorite-title">{recipe.strMeal}</h3>
                {recipe.strCategory && (
                  <p className="favorite-category">{recipe.strCategory}</p>
                )}
              </div>
            </Link>
            <button 
              onClick={() => removeFromFavorites(recipe.idMeal)}
              className="remove-favorite-button"
              title="Remove from favorites"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FavoritesPage
