const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const {app, BrowserWindow, ipcMain, Menu} = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    console.log('this is the starting')

    mainWindow = new BrowserWindow({webPreferences: {
        nodeIntegration: true
      }});
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('todo:add', (event, value) => {
    mainWindow.webContents.send('todo:add', value);
    addWindow.close();
    
})

function createAddWindow () {
    addWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 300,
        height: 200,
        title: 'Add new todo'
        }
    );
    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'CLear Todos',
                click() {
                    mainWindow.webContents.send('todo:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Command + Q' : 'Ctrl + Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role: 'reload'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command + Alt + I' : 'Ctrl + Shift + I',
                click (item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            }
        ]
        
    })
}

function menuAccelerator () {
    // (() => {
        if (process.platform === 'darwin') {
            return 'Command+Q';
        } else {
            return 'Ctrl+Q';
        }
    // })(),
}

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