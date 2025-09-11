import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import '../styles/recipe-card.css'

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

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    idMeal: PropTypes.string.isRequired,
    strMeal: PropTypes.string.isRequired,
    strMealThumb: PropTypes.string.isRequired
  }).isRequired
}

export default RecipeCard
