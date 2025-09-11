import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../api/axiosClient'
import RecipeList from '../components/RecipeList'
import '../styles/homepage.css'

const HomePage = () => {
    const [recipes, setRecipes] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [categoriesLoading, setCategoriesLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchMode, setIsSearchMode] = useState(false)

    const fetchRandomRecipes = async () => {
        setLoading(true)
        setError(null)
        setIsSearchMode(false)

        try {
            // Optimized loading: Use batch approach for faster loading
            const batchSize = 5
            const totalBatches = Math.ceil(20 / batchSize)
            let allRecipes = []

            for (let batch = 0; batch < totalBatches; batch++) {
                const batchPromises = Array.from({ length: batchSize }, () => 
                    axiosClient.get('/random.php')
                )

                try {
                    const batchResponses = await Promise.all(batchPromises)
                    const batchRecipes = batchResponses.map(response => response.data.meals[0])
                    allRecipes = [...allRecipes, ...batchRecipes]

                    // Remove duplicates after each batch
                    const uniqueRecipes = allRecipes.filter((recipe, index, self) =>
                        index === self.findIndex(r => r.idMeal === recipe.idMeal)
                    )

                    // Update recipes progressively for better UX
                    setRecipes(uniqueRecipes.slice(0, 20))

                    // If we have enough unique recipes, break early
                    if (uniqueRecipes.length >= 20) {
                        setLoading(false)
                        return
                    }

                    // Small delay between batches to avoid overwhelming the server
                    if (batch < totalBatches - 1) {
                        await new Promise(resolve => setTimeout(resolve, 200))
                    }
                } catch (batchErr) {
                    console.warn(`Batch ${batch + 1} failed:`, batchErr)
                    // Continue with next batch even if one fails
                }
            }

            // Final cleanup and set recipes
            const finalUniqueRecipes = allRecipes.filter((recipe, index, self) =>
                index === self.findIndex(r => r.idMeal === recipe.idMeal)
            )

            if (finalUniqueRecipes.length > 0) {
                setRecipes(finalUniqueRecipes.slice(0, 20))
            } else {
                throw new Error('No recipes loaded')
            }

        } catch (err) {
            console.error('Random recipes error:', err)
            
            // Fallback: Try calling search API with popular keyword
            try {
                const fallbackResponse = await axiosClient.get('/search.php?s=chicken')
                setRecipes(fallbackResponse.data.meals || [])
                setError(null)
            } catch (fallbackErr) {
                console.error('Fallback also failed:', fallbackErr)
                setError('Unable to load recipe list. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchCategories = async () => {
        setCategoriesLoading(true)
        try {
            const response = await axiosClient.get('/categories.php')
            setCategories(response.data.categories || [])
        } catch (err) {
            console.error('Categories error:', err)
        } finally {
            setCategoriesLoading(false)
        }
    }

    const searchRecipes = async (term) => {
        if (!term.trim()) {
            fetchRandomRecipes()
            return
        }

        setLoading(true)
        setError(null)
        setIsSearchMode(true)

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

    const handleClearSearch = () => {
        setSearchTerm('')
        fetchRandomRecipes()
    }


    // Load random recipes and categories on component mount
    useEffect(() => {
        fetchRandomRecipes()
        fetchCategories()
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
                        {isSearchMode && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="clear-search-button"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </form>
            </div>


            <div className="categories-section">
                <h2 className="section-title">Food Classification</h2>
                {categoriesLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.idCategory}
                                to={`/category/${encodeURIComponent(category.strCategory)}`}
                                className="category-card"
                            >
                                <div className="category-image-container">
                                    <img
                                        src={category.strCategoryThumb}
                                        alt={category.strCategory}
                                        className="category-image"
                                    />
                                </div>
                                <h3 className="category-name">{category.strCategory}</h3>
                            </Link>
                        ))}
                    </div>
                )}
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
