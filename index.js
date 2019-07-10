const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const {app, BrowserWindow, ipcMain} = electron;

let mainWindow

app.on('ready', () => {
    console.log('this is the starting')

    mainWindow = new BrowserWindow({webPreferences: {
        nodeIntegration: true
      }});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('video:submit', (event, path) => {
    ffmpeg.ffprobe(path, (error, metadata) => {
        if (error) {
            console.log(error);
        }
        if (mainWindow) {
            mainWindow.webContents.send('video:metadata', metadata.format.duration);
        }
        
    })
});