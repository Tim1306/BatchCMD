'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
const isDevelopment = process.env.NODE_ENV !== 'production'

const dataPath = app.getPath('userData');
const fileUrl = path.join(dataPath, 'config.json')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  // if (isDevelopment && !process.env.IS_TEST) {
  //   // Install Vue Devtools
  //   try {
  //     await installExtension(VUEJS_DEVTOOLS)
  //   } catch (e) {
  //     console.error('Vue Devtools failed to install:', e.toString())
  //   }
  // }
  createWindow()
})

/*
执行shell命令
*command：命令
*position：文件夹位置
*/
ipcMain.on('cmd', function(event, obj){
  console.log(event, obj)
  exec(obj.command, {cwd: obj.position}, function(error, stdout, stderr){
    if (!error) {
      win.webContents.send('over', {title: obj.key, code: 0})
    } else {
      win.webContents.send('over', {title: obj.key, code: 1})
    }
  })
})

/*
* 获取数据
*/
ipcMain.on('getData', (event, data) => {
  if(fs.existsSync(fileUrl)) {
    let config = JSON.parse(fs.readFileSync(fileUrl))
    win.webContents.send('gtDataSuccess', JSON.stringify(config))
  }
})
/*
* 设置
*/
ipcMain.on('setData', (event, data) => {
  fs.writeFile(fileUrl, data, (err) => {
    if (err) win.webContents.send('setDataErr')
    else win.webContents.send('setDataSuccess', data)
  })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
} else {
  Menu.setApplicationMenu(null)
}
