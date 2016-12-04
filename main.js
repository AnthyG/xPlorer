const electron = require('electron')
    // Module to control application life.
const app = electron.app
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ width: 800, height: 600, frame: false, titleBarStyle: 'hidden' })

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/index.html`)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    mainWindow.show()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
var BACKSEND = undefined
const menu_file = new Menu()
const menu_file_arr = {
    'Open': {
        label: 'Open',
        click: function(menuItem, browserWindow, event) {
            BACKSEND.sender.send('OPEN', 'pong')
        }
    },
    '': '',
    'Cut': {
        label: 'Cut'
    },
    'Copy': {
        label: 'Copy'
    },
    'Paste': {
        label: 'Paste'
    },
    '': '',
    'Rename': {
        label: 'Rename'
    },
    'Delete': {
        label: 'Delete'
    }
}
for (let arrX in menu_file_arr) {
    var arrY = menu_file_arr[arrX]
    if (arrY === '') {
        menu_file.append(new MenuItem({
            type: 'separator'
        }))
    } else {
        menu_file.append(new MenuItem(arrY))
    }
}

// app.on('browser-window-created', function(event, win) {
//     win.webContents.on('context-menu', function(e, params) {
//         menu_file.popup(win, params.x, params.y)
//     })
// })

ipc.on('show-menu_file', function(event) {
    BACKSEND = event
    const win = BrowserWindow.fromWebContents(event.sender)
    menu_file.popup(win)
})