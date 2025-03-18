// src/components/RecipesList.js
import React, { useState, useEffect, useCallback } from 'react';
import minecraftDataService from '../services/MinecraftDataService';
import imageService from '../services/ImageService';
import './RecipesList.css';

const RecipesList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = `${process.env.PUBLIC_URL}/assets/textures/missing_texture.png`;
    e.target.classList.add('error');
  };

  // Initialize minecraft data service
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      
      try {
        // Initialize the minecraft data service
        await minecraftDataService.initialize();
        
        // Get all recipes
        const allRecipes = minecraftDataService.getAllRecipes();
        setRecipes(allRecipes);
        setFilteredRecipes(allRecipes);
        
        // Get categories
        const categoryData = minecraftDataService.getCategories();
        // Add "all" category with total count
        categoryData.all = allRecipes.length;
        setCategories(categoryData);
      } catch (error) {
        console.error('Error initializing recipe data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initData();
  }, []);

  // Filter recipes when search term or category changes
  useEffect(() => {
    const filterRecipes = () => {
      setCurrentPage(1);
      let filtered = recipes;
      
      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = minecraftDataService.getRecipesByCategory(selectedCategory);
      }
      
      // Filter by search term
      if (searchTerm.trim()) {
        filtered = filtered.filter(recipe => 
          recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.materials.some(material => 
            material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            material.displayName.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      
      setFilteredRecipes(filtered);
    };
    
    filterRecipes();
  }, [searchTerm, selectedCategory, recipes]);

  // Handle search input changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Handle page changes
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // Get current page's recipes
  const getCurrentRecipes = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredRecipes.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Render grid item (with texture)
  const renderGridItem = (item, rowIndex, colIndex) => {
    if (!item) {
      return <div className="grid-item empty" key={`empty-${rowIndex}-${colIndex}`}></div>;
    }
    
    const textureUrl = imageService.getItemTextureUrl(item);
    
    return (
      <div className="grid-item" key={`item-${rowIndex}-${colIndex}`}>
        <div 
          className="item-box"
          title={item.displayName || item.name}
        >
          <img 
            src={textureUrl} 
            alt={item.displayName || item.name} 
            className="item-texture"
            onError={handleImageError}
          />
        </div>
      </div>
    );
  };

  // Total page count
  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);

  return (
    <div className="recipes-list-container">
      <h2>Minecraft Crafting Recipes</h2>
      
      <div className="recipes-controls">
        <div className="search-box">
          <input 
            type="text" 
            className="minecraft-input" 
            placeholder="Search recipes..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="categories-filter">
          <div 
            className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All ({categories.all || 0})
          </div>
          {Object.entries(categories)
            .filter(([category]) => category !== 'all' && categories[category] > 0)
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .map(([category, count]) => (
              <div 
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)} ({count})
              </div>
            ))
          }
        </div>
      </div>
      
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading crafting recipes...</div>
        </div>
      ) : (
        <>
          <div className="results-summary">
            Showing {filteredRecipes.length} {selectedCategory !== 'all' ? selectedCategory : ''} recipes
            {searchTerm ? ` matching "${searchTerm}"` : ''}
          </div>
          
          <div className="recipes-grid">
            {getCurrentRecipes().map((recipe) => (
              <div key={recipe.id} className="recipe-card pixel-border">
                <h3>{recipe.name}</h3>
                {recipe.type === 'shapeless' && (
                  <div className="recipe-type">Shapeless Recipe</div>
                )}
                
                <div className="crafting-table">
                  <div className="crafting-grid">
                    {recipe.pattern.map((row, rowIndex) => (
                      <div key={`row-${rowIndex}`} className="grid-row">
                        {row.map((item, colIndex) => 
                          renderGridItem(item, rowIndex, colIndex)
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="recipe-result">
                    <div className="arrow">→</div>
                    <div className="result-container">
                      <div className="result-item">
                        <div 
                          className="item-box result-box"
                          title={recipe.name}
                        >
                          <img 
                            src={imageService.getItemTextureUrl(recipe.resultId)} 
                            alt={recipe.name} 
                            className="item-texture"
                            onError={handleImageError}
                          />
                        </div>
                        {recipe.resultCount > 1 && (
                          <span className="result-count">×{recipe.resultCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="recipe-materials">
                  <h4>Materials Needed:</h4>
                  <ul>
                    {recipe.materials.map((material, idx) => (
                      <li key={idx} className="material-item">
                        <span className="material-symbol">
                          <div 
                            className="item-box small-item"
                            title={material.displayName || material.name}
                          >
                            <img 
                              src={imageService.getItemTextureUrl(material)} 
                              alt={material.displayName || material.name} 
                              className="item-texture"
                              onError={handleImageError}
                            />
                          </div>
                        </span>
                        <span className="material-text">
                          {material.count} × {material.displayName || material.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="recipe-description">
                  {recipe.description}
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="minecraft-btn page-btn"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Prev
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                className="minecraft-btn page-btn"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipesList;