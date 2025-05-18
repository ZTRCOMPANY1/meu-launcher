const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const extract = require('extract-zip');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  win.loadFile('public/index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('baixar-jogo', async (event, jogo) => {
  const zipPath = path.join(__dirname, 'games', `${jogo.title}.zip`);
  const destFolder = path.join(__dirname, 'games', jogo.title);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    https.get(jogo.downloadUrl, (response) => {
      response.pipe(file);
      file.on('finish', async () => {
        file.close();
        await extract(zipPath, { dir: destFolder });
        fs.unlinkSync(zipPath); // remove o zip
        resolve();
      });
    }).on('error', (err) => {
      reject(err.message);
    });
  });
});

ipcMain.handle('executar-jogo', async (event, jogo) => {
  const exePath = path.join(__dirname, 'games', jogo.title, jogo.executable);
  shell.openPath(exePath);
});
