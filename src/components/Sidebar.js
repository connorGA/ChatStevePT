// src/components/Sidebar.js
import React, { useState, useRef, useEffect } from 'react';
import RecipesList from './RecipesList';
import PlayerStats from './PlayerStats';

const Sidebar = ({ isOpen, content, toggleSidebar }) => {
  const [width, setWidth] = useState(380); // Default width
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);
  const minWidth = 300; // Minimum sidebar width
  const maxWidth = 600; // Maximum sidebar width

  // Handle resize start
  const startResizing = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Handle resize end
  const stopResizing = () => {
    setIsResizing(false);
  };

  // Resize logic
  const resize = (e) => {
    if (isResizing && sidebarRef.current) {
      const newWidth = window.innerWidth - e.clientX;
      
      // Apply constraints (min/max width)
      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    }
  };

  // Focus the search input when sidebar opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Delay to ensure the sidebar is fully rendered and visible
      setTimeout(() => {
        searchInputRef.current.focus();
        console.log("Focusing sidebar search input");
      }, 300);
    }
  }, [isOpen, content]);

  // Handle mouse events for resizing
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  // Get content title based on content type
  const getContentTitle = () => {
    switch (content) {
      case 'recipes':
        return 'Crafting Recipes';
      case 'stats':
        return 'Player Statistics';
      default:
        return 'Information';
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className={`sidebar ${isOpen ? 'open' : ''}`} 
      style={{ width: isOpen ? `${width}px` : '0' }}
      onClick={(e) => e.stopPropagation()} 
    >
      <div className="sidebar-header">
        <div className="sidebar-title">{getContentTitle()}</div>
        <button 
          className="sidebar-close-btn" 
          onClick={(e) => {
            e.stopPropagation();
            toggleSidebar();
          }}
        >×</button>
      </div>
      
      <div className="resize-handle" onMouseDown={startResizing}></div>
      
      <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
        {content === 'recipes' && (
          <div className="recipes-container">
            <div className="search-box">
              <input 
                ref={searchInputRef}
                type="text" 
                className="minecraft-input sidebar-search" 
                placeholder="Search recipes..." 
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => {
                  e.stopPropagation();
                  console.log("Sidebar search focused");
                }}
              />
            </div>
            <RecipesList searchInputRef={searchInputRef} />
          </div>
        )}
        {content === 'stats' && <PlayerStats />}
      </div>
    </div>
  );
};

export default Sidebar;