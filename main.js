const electron = require('electron')
const fs = require('fs')
    // Module to control application life.
const app = electron.app
    // Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Menu = electron.Menu
const MenuItem = electron.MenuItem
const ipc = electron.ipcMain

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mWs = []

function createWindow(ndir) {
    var ndir = ndir || __dirname // OR OPTIONS.PATH
        // Create the browser window.
    var mWx = mWs.push(new BrowserWindow({ width: 800, height: 600, frame: false, titleBarStyle: 'hidden' })) - 1

    // and load the index.html of the app.
    mWs[mWx].loadURL(`file://${__dirname}/index.html`)

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mWs[mWx].on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        (function(mWx2) {
            mWs.splice(mWx2, 1);
        })(mWx)
    })

    mWs[mWx].show()
    mWs[mWx].webContents.on('did-finish-load', () => {
        // console.log("Sending Initial DIR >> " + ndir)
        mWs[mWx].webContents.send('change_DIR', ndir)
        mWs[mWx].webContents.on('context-menu', function(e, params) {
            menu_general.popup(mWs[mWx], params.x, params.y)
            return false
        })
    })
    mWs[mWx].on('page-title-updated', function(event, title) {
        mWs[mWx].setTitle(title)
    })
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

// const menu_general_arr = {}
// const menu_file_arr = {}
// eval('var menu_general_arr = ' + fs.readFile('./js/menu_arrs.js'))
const menu_general_arr = {
    'New Window': {
        label: 'New Window',
        accelerator: 'Ctrl+N',
        click: function(menuItem, browserWindow, event) {
            createWindow()
        }
    },
    '': '',
    'toggledevtools': {
        label: 'Toggle Developer Tools',
        role: 'toggledevtools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        windowMethod: 'toggleDevTools'
    },
    'togglefullscreen': {
        label: 'Toggle Full Screen',
        role: 'togglefullscreen',
        accelerator: process.platform === 'darwin' ? 'Control+Command+F' : 'F11',
        windowMethod: (window) => {
            window.setFullScreen(!window.isFullScreen())
        }
    }
}
const menu_file_arr = {
    'Open': {
        label: 'Open',
        click: function(menuItem, browserWindow, event) {
            BACKSEND.sender.send('OPEN_FILE')
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

let menu_general = new Menu()
let menu_file = new Menu()

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
for (let arrX in menu_general_arr) {
    var arrY = menu_general_arr[arrX]
    if (arrY === '') {
        var nMI = new MenuItem({
            type: 'separator'
        })
        menu_file.append(nMI)
        menu_general.append(nMI)
    } else {
        var nMI = new MenuItem(arrY)
        menu_file.append(nMI)
        menu_general.append(nMI)
    }
}

var BACKSEND = undefined
ipc.on('show-menu_file', function(event, arg) {
    BACKSEND = event
    const win = BrowserWindow.fromWebContents(event.sender)
    menu_file.popup(win)
})

ipc.on('new_window', function(event, DIR) {
    createWindow(DIR)
})