const { app, BrowserWindow, globalShortcut, Tray, Menu, screen, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');

let mainWindow;
let tray;
let isVisible = false;
let isClickable = false; // Start in non-interactive mode
const isMac = process.platform === 'darwin';

function createWindow() {
  // Get screen dimensions for positioning
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  
  // Create the browser window with special settings
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: false,
    },
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    resizable: true,
    focusable: true,
    hasShadow: false,
    // Position in bottom right
    x: width - 420,
    y: height - 620,
    // macOS specific
    titleBarStyle: 'hidden',
    vibrancy: 'under-window',
    visualEffectState: 'active'
  });

  // Load the app
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    showWindowWithoutFocus();
    
    // Auto-hide after initial display
    setTimeout(() => {
      hideWindow();
    }, 3000);
  });

  // When showing the window, make it interactive immediately
  mainWindow.on('show', () => {
    // Make window interactive by default when shown
    toggleInteractionMode(true);
    if (mainWindow.webContents) {
      mainWindow.webContents.send('focus-mode-changed', true);
    }
  });

  // Set up IPC communication for focus mode toggling
  ipcMain.on('toggle-focus-mode', (event) => {
    isClickable = !isClickable;
    toggleInteractionMode(isClickable);
    // Notify renderer process about the change
    event.sender.send('focus-mode-changed', isClickable);
  });

  // Event to request focus on the input field
  ipcMain.on('request-input-focus', () => {
    if (isClickable) {
      // Send focus command to the webContents
      mainWindow.webContents.focus();
      // Execute script to focus on input
      mainWindow.webContents.executeJavaScript("document.querySelector('.minecraft-input')?.focus();");
    }
  });

  // Handle explicit request to hide window
  ipcMain.on('hide-window', () => {
    hideWindow();
  });

  // Open DevTools in development mode (in a separate window)
  if (isDev) {
    const devTools = new BrowserWindow({ 
      show: false,
      focusable: true 
    });
    mainWindow.webContents.setDevToolsWebContents(devTools.webContents);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    devTools.show();
  }

  // Prevent window from being closed, hide it instead
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      hideWindow();
      return false;
    }
    return true;
  });
  
  // Initially fully interactive (change from previous behavior)
  mainWindow.setIgnoreMouseEvents(false);
}

// Toggle interaction mode
function toggleInteractionMode(interactive) {
  isClickable = interactive;
  
  if (interactive) {
    // Make window fully interactive
    mainWindow.setIgnoreMouseEvents(false);
    
    // Give window focus for keyboard input
    mainWindow.focus();
    mainWindow.webContents.focus();
    
    // Force focus on input field
    setTimeout(() => {
      mainWindow.webContents.executeJavaScript("document.querySelector('.minecraft-input')?.focus();");
    }, 50);
  } else {
    // Make window non-interactive (clicks pass through)
    mainWindow.setIgnoreMouseEvents(true);
    // Let Minecraft regain focus
    mainWindow.blur();
  }
}

// Create tray icon
function createTray() {
  let iconPath;
  
  // Check various icon locations
  const possiblePaths = [
    path.join(__dirname, 'steve-icon.png'),
    path.join(__dirname, '../public/steve-icon.png'),
    path.join(__dirname, 'favicon.ico'),
    path.join(__dirname, '../public/favicon.ico')
  ];
  
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      iconPath = p;
      break;
    }
  }
  
  try {
    if (iconPath) {
      tray = new Tray(iconPath);
    } else {
      // Fallback to empty icon
      const { nativeImage } = require('electron');
      const emptyIcon = nativeImage.createEmpty();
      tray = new Tray(emptyIcon);
      console.log('Using empty icon as fallback');
    }
  } catch (error) {
    console.error('Failed to load tray icon:', error);
    const { nativeImage } = require('electron');
    const emptyIcon = nativeImage.createEmpty();
    tray = new Tray(emptyIcon);
  }
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show/Hide ChatStevePT',
      click: () => {
        toggleWindow();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('ChatStevePT - Minecraft Assistant');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    toggleWindow();
  });
}

// Toggle window visibility
function toggleWindow() {
  if (isVisible) {
    hideWindow();
  } else {
    showWindowWithoutFocus();
  }
}

// Show window without taking focus
function showWindowWithoutFocus() {
  // Position window in bottom right of screen
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y);
  
  // Critical for macOS - set window level extremely high
  mainWindow.setAlwaysOnTop(true, 'floating', 1);
  mainWindow.setVisibleOnAllWorkspaces(true, {visibleOnFullScreen: true});
  mainWindow.setFullScreenable(false);
  
  // Show window
  mainWindow.show();
  isVisible = true;
  
  // Enable interaction by default when shown
  toggleInteractionMode(true);
  
  // Notify renderer about visibility change and focus mode
  if (mainWindow.webContents) {
    mainWindow.webContents.send('visibility-changed', true);
    mainWindow.webContents.send('focus-mode-changed', true);
  }
  
  // Explicitly focus the input field
  setTimeout(() => {
    mainWindow.focus();
    mainWindow.webContents.focus();
    mainWindow.webContents.executeJavaScript("document.querySelector('.minecraft-input')?.focus();");
  }, 100);
}

// Hide window
function hideWindow() {
  mainWindow.hide();
  isVisible = false;
  
  // Notify renderer about visibility change
  if (mainWindow.webContents) {
    mainWindow.webContents.send('visibility-changed', false);
  }
}

// Calculate window position (bottom right of screen)
function getWindowPosition() {
  const windowBounds = mainWindow.getBounds();
  const screenBounds = screen.getPrimaryDisplay().workAreaSize;
  
  // Position it in the bottom right with some padding
  return {
    x: Math.round(screenBounds.width - windowBounds.width - 20),
    y: Math.round(screenBounds.height - windowBounds.height - 20)
  };
}

// App ready event
app.whenReady().then(() => {
  createWindow();
  createTray();
  
  // Register global shortcut - for toggling visibility
  globalShortcut.register('CommandOrControl+.', () => {
    toggleWindow();
  });
  
  // Keep the keyboard shortcut as an alternative method
  globalShortcut.register('CommandOrControl+Shift+.', () => {
    toggleInteractionMode(!isClickable);
    if (isVisible) {
      mainWindow.webContents.send('focus-mode-changed', isClickable);
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Unregister shortcuts when app is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});