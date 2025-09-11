import RecipeCard from './RecipeCard'

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

export default RecipeList
