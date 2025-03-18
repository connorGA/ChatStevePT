// src/components/TitleBar.js
import React, { useState, useEffect } from 'react';

const TitleBar = ({ 
  toggleSidebar, 
  isSidebarOpen, 
  onChangeSidebarContent, 
  currentSidebarContent 
}) => {
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  const handleClose = () => {
    if (window.electron) {
      window.electron.hideWindow();
    }
  };

  const handleMinimize = () => {
    if (window.electron && window.electron.send) {
      window.electron.send('minimize-window');
    }
  };

  // Close sidebar menu when clicking elsewhere
  const handleDocumentClick = () => {
    if (showSidebarMenu) {
      setShowSidebarMenu(false);
    }
  };

  // Add event listener for closing menu
  useEffect(() => {
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
      
      {/* Simplified direct sidebar toggle button */}
      <button 
        className="minecraft-btn sidebar-toggle-btn" 
        onClick={(e) => {
          e.stopPropagation();
          toggleSidebar();
        }}
      >
        {isSidebarOpen ? 'Close Sidebar' : 'Crafting & Stats'}
      </button>
    </div>
  );
};

export default TitleBar;