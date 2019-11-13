const { dialog } = require('electron');
const { app, BrowserWindow } = require('electron');
// const { autoUpdater } = require('electron-updater');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron')
const { version } = require('./package')

const server = 'https://github.com/Akshat-Nautiyal/kori-wallet'
const feed = `${server}/Akshat-Nautiyal/kori-wallet/${process.platform}-${process.arch}/${app.getVersion()}`

var path = require('path')

// // Setup logger

// autoUpdater.logger = require('electron-log');
// autoUpdater.logger.transports.file.level = 'info';

// // Setup updater events

// autoUpdater.on('checking-for-update', () =>{
//   console.log('checking for update....');
// });

// autoUpdater.on('update-available', (info) => {
//   console.log('Update Available');
//   console.log('Version', info.version);
//   console.log('Release date', info.releaseDate);
// });


// autoUpdater.on('update-not-available', () => {
//   console.log('Update not available');
// });

// autoUpdater.on('download-progress', (progress) => {
//   console.log(`Progress ${Math.floor(progress.percent)}`);
// });

// autoUpdater.on('update-downloaded', (info) => {
//   console.log('Update downloaded');
//   autoUpdater.quitAndInstall();
// });

// autoUpdater.on('error', (error) => {
//   console.error(error);
// });




 global.win

function createWindow () {
  if(!isDev){
    autoUpdater.checkForUpdates();
  }
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'resources/1.png'),
    webPreferences: {
      nodeIntegration: true
    }
  })
 win.setMenu(null)

  // and load the index.html of the app.
  //win.loadFile('/home/arstudioz/ejs/src/login.html')
  win.loadFile(__dirname + '/login.html')
 

  // Open the DevTools.
//win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//   const dialogOpts = {
//     type: 'info',
//     buttons: ['Restart', 'Later'],
//     title: 'Application Update',
//     message: process.platform === 'win32' ? releaseNotes : releaseName,
//     detail: 'A new version has been downloaded. Restart the application to apply the updates.'
//   }

//   dialog.showMessageBox(dialogOpts, (response) => {
//     if (response === 0) autoUpdater.quitAndInstall()
//   })
// })


// autoUpdater.on('error', message => {
//   console.error('There was a problem updating the application')
//   console.error(message)
// })





console.log(`Current version: ${version}`)

autoUpdater.setFeedURL(feed)
// autoUpdater.checkForUpdates()
setInterval(() => {
  autoUpdater.checkForUpdates()
},1 * 60 * 1000)

autoUpdater.on('checking-for-update', () => {
  console.log('checking-for-update')
})

autoUpdater.on('update-available', () => {
  console.log('update-available')
})

autoUpdater.on('update-not-available', () => {
  console.log('update-not-available')
})

autoUpdater.on(
  'update-downloaded',
  (event, releaseNotes, releaseName, updateURL) => {
    console.log('update-downloaded', {
      event,
      releaseNotes,
      releaseName,
      updateURL
    })
  }
)

autoUpdater.on('error', error => {
  console.log('error', { error })
})



// autoUpdater.setFeedURL(feed)

 