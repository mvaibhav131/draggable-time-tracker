
import path from 'path';
import { app, BrowserWindow, shell, ipcMain,Tray,Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import windowStateKeeper from 'electron-window-state';


// Optional set the idle time option in menu label..(3min,4min,5min,8min,10min)
let idleTemplate=[{label:"3min"},{label:"4min"},{label:"5min"},{label:"8min"},{label:"10min"}];
let contextMenu=Menu.buildFromTemplate(idleTemplate);
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  //set Window Management State

  let mainWindowState= windowStateKeeper({
    defaultWidth:120,
    defaultHeight:60,
  })
 // create new browser window
  mainWindow = new BrowserWindow({
    show: false,
    x:mainWindowState.x,
    y:mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    frame:false,
    transparent: true, // transparent background
    alwaysOnTop:true, // always on Top condition
    roundedCorners:false,
    webPreferences: {
      nodeIntegration:true,
      devTools:false, //remove devtools
        preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    resizable:false // avoid resizing
  });

  mainWindow.loadURL(resolveHtmlPath('index.html')); 
    // manage mainWindow stateHere
  mainWindowState.manage(mainWindow);

  mainWindow.webContents.on('context-menu',()=>{
    contextMenu.popup();
  })

 // set the tray
  // let tray =new Tray('idle.jpg');
  // tray.setToolTip("Select idle time")

    mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
