// src/components/TitleBar.js
import React, { useState } from 'react';
const { remote } = window.require ? window.require('electron') : { remote: null };

const TitleBar = ({ 
  toggleSidebar, 
  isSidebarOpen, 
  onChangeSidebarContent, 
  currentSidebarContent 
}) => {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  const handleClose = () => {
    if (remote) {
      remote.getCurrentWindow().hide();
    }
  };

  const handleMinimize = () => {
    if (remote) {
      remote.getCurrentWindow().minimize();
    }
  };

  // Toggle sidebar menu display
  const toggleSidebarMenu = (e) => {
    e.stopPropagation();
    setShowSidebarMenu(!showSidebarMenu);
  };

  // Close sidebar menu when clicking elsewhere
  const handleDocumentClick = () => {
    if (showSidebarMenu) {
      setShowSidebarMenu(false);
    }
  };

  // Set content type and close menu
  const setSidebarContent = (contentType) => {
    onChangeSidebarContent(contentType);
    setShowSidebarMenu(false);
  };

  // Add event listener for closing menu
  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showSidebarMenu]);

  return (
    <div className="title-bar">
      <div className="title">ChatStevePT</div>
      
      <div className="title-bar-buttons">
        <div className="title-bar-button minimize-button" onClick={handleMinimize}></div>
        <div className="title-bar-button close-button" onClick={handleClose}></div>
      </div>
      
      <div className="sidebar-controls">
        <div className="sidebar-dropdown" onClick={(e) => toggleSidebarMenu(e)}>
          <button className={`sidebar-button ${isSidebarOpen ? 'active' : ''}`}>
            {isSidebarOpen ? currentSidebarContent.charAt(0).toUpperCase() + currentSidebarContent.slice(1) : '☰'}
          </button>
          
          {showSidebarMenu && (
            <div className="sidebar-menu">
              <div 
                className={`sidebar-menu-item ${currentSidebarContent === 'recipes' ? 'active' : ''}`}
                onClick={() => setSidebarContent('recipes')}
              >
                Crafting Recipes
              </div>
              <div 
                className={`sidebar-menu-item ${currentSidebarContent === 'stats' ? 'active' : ''}`}
                onClick={() => setSidebarContent('stats')}
              >
                Player Stats
              </div>
              <div 
                className="sidebar-menu-item"
                onClick={toggleSidebar}
              >
                {isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TitleBar;