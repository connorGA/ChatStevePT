// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import TitleBar from './components/TitleBar';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import { processMessage } from './services/chatbot';
import minecraftDataService from './services/MinecraftDataService';

function App() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I\'m ChatStevePT, your Minecraft assistant. How can I help you today?' }
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState('recipes');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const messagesEndRef = useRef(null);

  // Initialize data on app start
  useEffect(() => {
    const initData = async () => {
      try {
        await minecraftDataService.initialize();
        setDataLoaded(true);
      } catch (error) {
        console.error('Error initializing Minecraft data:', error);
      }
    };
    
    initData();
  }, []);

  // Listen for focus mode changes from the main process
  useEffect(() => {
    if (window.electron) {
      window.electron.receive('focus-mode-changed', (isFocusMode) => {
        setFocusMode(isFocusMode);
      });
      
      window.electron.receive('visibility-changed', (isWindowVisible) => {
        setIsVisible(isWindowVisible);
        
        // When visibility changes, handle game pause/unpause
        if (isWindowVisible) {
          // We're showing the window, pause the game
          if (window.electron.pauseGame) {
            window.electron.pauseGame();
          }
        } else {
          // We're hiding the window, unpause the game
          if (window.electron.unpauseGame) {
            window.electron.unpauseGame();
          }
        }
      });
    }
  }, []);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message) => {
    // Add user message to chat
    setMessages(prevMessages => [...prevMessages, { sender: 'user', text: message }]);
    
    // Process the message and get a response
    const response = processMessage(message);
    
    // If there's recipe data, show it in the sidebar
    if (response.recipes && response.recipes.length > 0) {
      setSidebarContent('recipes');
      setIsSidebarOpen(true);
    }
    
    // Add bot response to chat
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: response.text }]);
    }, 500);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleSidebarContentChange = (content) => {
    setSidebarContent(content);
    if (!isSidebarOpen) {
      setIsSidebarOpen(true);
    }
  };

  // Handle window close with ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        // If ESC is pressed and our window is visible, hide it and unpause the game
        if (window.electron && window.electron.send) {
          window.electron.send('unpause-game');
          // Hide the window after a short delay
          setTimeout(() => {
            if (window.electron.send) {
              window.electron.send('hide-window');
            }
          }, 50);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  return (
    <div className={`app-container ${focusMode ? 'focus-active' : ''} ${isVisible ? 'app-visible' : 'app-hidden'}`}>
      <TitleBar 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
        onChangeSidebarContent={handleSidebarContentChange}
        currentSidebarContent={sidebarContent}
        focusMode={focusMode}
      />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          messagesEndRef={messagesEndRef}
        />
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          content={sidebarContent}
          toggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}

export default App;