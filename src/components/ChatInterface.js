// src/components/ChatInterface.js
import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = ({ messages, onSendMessage, messagesEndRef }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [focusMode, setFocusMode] = useState(true); // Default to true now
  const inputRef = useRef(null);
  
  // Focus the input element
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      
      // Request focus through the Electron API as well
      if (window.electron) {
        window.electron.focusInput();
      }
    }
  };
  
  // Set up event listeners for our custom events from main process
  useEffect(() => {
    // Check if we're in Electron environment
    if (window.electron) {
      // Listen for focus mode changes
      window.electron.receive('focus-mode-changed', (isFocusMode) => {
        console.log('Focus mode changed:', isFocusMode);
        setFocusMode(isFocusMode);
        
        // When entering focus mode, focus the input field
        if (isFocusMode) {
          // Use setTimeout to ensure the DOM has updated
          setTimeout(focusInput, 50);
        }
      });
      
      // Listen for visibility changes
      window.electron.receive('visibility-changed', (isVisible) => {
        console.log('Visibility changed:', isVisible);
        
        // When window becomes visible, focus the input
        if (isVisible) {
          setTimeout(focusInput, 100);
        }
      });
    }
    
    // Add keyboard shortcut listener - keep as alternative
    const handleKeyDown = (e) => {
      // Check for Ctrl+Shift+. (or Cmd+Shift+. on Mac) - keep as alternative method
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '.') {
        // Toggle focus mode through IPC if available
        if (window.electron) {
          window.electron.send('toggle-focus-mode');
        }
      }
      
      // Check for Escape key
      if (e.key === 'Escape') {
        // Hide window when ESC is pressed
        if (window.electron) {
          window.electron.hideWindow();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  // Add click handler to make sure we have focus
  const handleContainerClick = () => {
    focusInput();
  };

  // Handle mouse enter to try to capture focus
  const handleMouseEnter = () => {
    focusInput();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage('');
      // Re-focus the input after sending
      setTimeout(focusInput, 50);
    }
  };

  return (
    <div 
      className="chat-container" 
      onClick={handleContainerClick}
      onMouseEnter={handleMouseEnter}
    >
      {/* Simplified status indicator with less prominence */}
      <div className="focus-mode-indicator">
        <span>ChatStevePT - Your Minecraft Assistant</span>
        <span className="shortcut-hint">Press ESC to close or Cmd+. to toggle visibility</span>
      </div>
      
      <div className="messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          className="minecraft-input"
          placeholder="Type your question..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onFocus={() => console.log('Input focused')}
          onBlur={() => setTimeout(focusInput, 10)} // Try to re-focus if we lose focus
        />
        <button 
          type="submit" 
          className="minecraft-btn"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;