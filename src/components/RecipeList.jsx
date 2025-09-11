import RecipeCard from './RecipeCard'
import PropTypes from 'prop-types'

const RecipeList = ({ recipes, loading, error }) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recipes...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">Error: {error}</p>
      </div>
    )
  }

  if (!recipes || recipes.length === 0) {
    return (
      <div className="no-results">
        <p>No recipes found. Try a different search term.</p>
      </div>
    )
  }

  return (
    <div className="recipe-list">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.idMeal} recipe={recipe} />
      ))}
    </div>
  )
}

RecipeList.propTypes = {
  recipes: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
}

export default RecipeList
