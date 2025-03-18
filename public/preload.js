// public/preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use ipcRenderer
contextBridge.exposeInMainWorld(
  'electron', {
    send: (channel, data) => {
      // Whitelist channels
      const validChannels = ['toggle-focus-mode', 'request-input-focus', 'hide-window'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['focus-mode-changed', 'visibility-changed', 'window-shown'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    // Add helper functions
    focusInput: () => {
      ipcRenderer.send('request-input-focus');
    },
    hideWindow: () => {
      ipcRenderer.send('hide-window');
    }
  }
);