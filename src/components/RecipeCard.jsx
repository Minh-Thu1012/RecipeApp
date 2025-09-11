import { Link } from 'react-router-dom'

const RecipeCard = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <Link to={`/recipe/${recipe.idMeal}`} className="recipe-link">
        <div className="recipe-image-container">
          <img 
            src={recipe.strMealThumb} 
            alt={recipe.strMeal}
            className="recipe-image"
          />
        </div>
        <div className="recipe-info">
          <h3 className="recipe-title">{recipe.strMeal}</h3>
        </div>
      </Link>
    </div>
  )
}

export default RecipeCard
