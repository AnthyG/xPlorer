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