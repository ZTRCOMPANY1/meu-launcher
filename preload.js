const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  baixarJogo: (jogo) => ipcRenderer.invoke('baixar-jogo', jogo),
  executarJogo: (jogo) => ipcRenderer.invoke('executar-jogo', jogo)
});
