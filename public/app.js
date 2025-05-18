const DATA_URL = 'https://ztrcompany1.github.io/game-store-data/games.json';

fetch(DATA_URL)
  .then(res => res.json())
  .then(jogos => {
    const catalogo = document.getElementById('catalogo');

    jogos.forEach(jogo => {
      const div = document.createElement('div');
      div.className = 'jogo';
      div.innerHTML = `
        <img src="${jogo.image}" alt="${jogo.title}">
        <h3>${jogo.title}</h3>
        <p>${jogo.description}</p>
        <button onclick="baixar('${jogo.title}')">Baixar</button>
      `;
      catalogo.appendChild(div);
    });
  });

function baixar(titulo) {
  fetch(DATA_URL)
    .then(res => res.json())
    .then(async jogos => {
      const jogo = jogos.find(j => j.title === titulo);
      await window.electronAPI.baixarJogo(jogo);

      const btn = [...document.querySelectorAll('button')]
        .find(b => b.innerText === 'Baixar' && b.parentElement.querySelector('h3').innerText === titulo);
      btn.innerText = "Jogar";
      btn.onclick = () => window.electronAPI.executarJogo(jogo);
    });
}
