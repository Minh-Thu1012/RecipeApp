# Recipe App

A modern React application for discovering and managing recipes using TheMealDB API.

## Features

- 🔍 **Search Recipes**: Search for recipes by keywords
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ❤️ **Favorites**: Save your favorite recipes to localStorage
- 📖 **Detailed View**: View complete recipe details with ingredients and instructions
- 🎨 **Modern UI**: Clean and intuitive user interface

## Tech Stack

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **TheMealDB API** - Recipe data source
- **CSS3** - Styling (no external CSS frameworks)

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RecipeApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/
│   └── axiosClient.js      # Axios configuration
├── components/
│   ├── Navbar.jsx          # Navigation component
│   ├── RecipeCard.jsx      # Individual recipe card
│   └── RecipeList.jsx      # Recipe list container
├── pages/
│   ├── HomePage.jsx        # Home page with search
│   ├── RecipeDetailPage.jsx # Recipe detail view
│   └── FavoritesPage.jsx   # Favorites management
├── styles/
│   └── style.css           # Global styles
├── App.jsx                 # Main app component
└── main.jsx               # Application entry point
```

## Usage

### Home Page
- Search for recipes using the search box
- Default search shows "chicken" recipes
- Click on any recipe card to view details

### Recipe Detail Page
- View complete recipe information
- See ingredients list with measurements
- Read step-by-step cooking instructions
- Add/remove recipes from favorites

### Favorites Page
- View all saved favorite recipes
- Remove recipes from favorites
- Navigate back to recipe details

## API Integration

The app integrates with [TheMealDB API](https://www.themealdb.com/api.php):
- `search.php?s={keyword}` - Search recipes by keyword
- `lookup.php?i={id}` - Get recipe details by ID

## Features in Detail

### Search Functionality
- Real-time search with loading states
- Error handling for failed requests
- Empty state when no results found

### Favorites Management
- Uses localStorage for persistence
- Add/remove favorites from any page
- Visual feedback for favorite status

### Responsive Design
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interface elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).