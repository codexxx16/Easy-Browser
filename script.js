// Easy-Browser Core Script

const searchInput = document.getElementById('searchInput'); const searchButton = document.getElementById('searchButton'); const resultsContainer = document.getElementById('results'); const audioPlayer = document.getElementById('audioPlayer'); const playerTitle = document.getElementById('playerTitle'); const playerArtist = document.getElementById('playerArtist'); const playerThumbnail = document.getElementById('playerThumbnail'); const playerTime = document.getElementById('playerTime'); const miniPlayer = document.getElementById('miniPlayer'); const fullPlayer = document.getElementById('fullPlayer'); const queueContainer = document.getElementById('queue');

let currentTrack = null; let queue = []; let recentlyPlayed = JSON.parse(localStorage.getItem(APP_DEFAULTS.STORAGE_KEY)) || [];

function searchSongs(query) { resultsContainer.innerHTML = '<p>Loading...</p>'; fetch(${API_URL.SEARCH}?q=${encodeURIComponent(query)}) .then(response => response.json()) .then(data => { const songs = UTILS.formatSearchResults(data.result); displayResults(songs); }) .catch(() => { resultsContainer.innerHTML = '<p>Failed to fetch results.</p>'; }); }

function displayResults(songs) { resultsContainer.innerHTML = ''; songs.forEach(song => { const card = document.createElement('div'); card.className = 'song-card'; card.innerHTML = <img src="${song.thumbnail}" alt="Thumbnail"> <div> <h4>${song.title}</h4> <p>${song.artist}</p> <span>${song.timestamp}</span> </div>; card.addEventListener('click', () => playSong(song)); resultsContainer.appendChild(card); }); }

function playSong(song) { fetch(${API_URL.DOWNLOAD_MP3}?id=${song.id}) .then(response => response.json()) .then(data => { const url = UTILS.getDownloadUrl(data); if (!url) return; currentTrack = song; audioPlayer.src = url; updatePlayerUI(song); updateRecentlyPlayed(song); audioPlayer.play(); }); }

function updatePlayerUI(song) { playerTitle.textContent = song.title; playerArtist.textContent = song.artist; playerThumbnail.src = song.thumbnail; fullPlayer.classList.add('active'); miniPlayer.classList.remove('active'); }

audioPlayer.addEventListener('timeupdate', () => { playerTime.textContent = UTILS.formatTime(audioPlayer.currentTime); });

audioPlayer.addEventListener('ended', () => { playNext(); });

function updateRecentlyPlayed(song) { recentlyPlayed = recentlyPlayed.filter(item => item.id !== song.id); recentlyPlayed.unshift(song); if (recentlyPlayed.length > APP_DEFAULTS.MAX_RECENT_ITEMS) { recentlyPlayed.pop(); } localStorage.setItem(APP_DEFAULTS.STORAGE_KEY, JSON.stringify(recentlyPlayed)); }

function addToQueue(song) { if (queue.length < APP_DEFAULTS.MAX_QUEUE_ITEMS) { queue.push(song); renderQueue(); } }

function playNext() { if (queue.length > 0) { const next = queue.shift(); renderQueue(); playSong(next); } else { fullPlayer.classList.remove('active'); miniPlayer.classList.add('active'); } }

function renderQueue() { queueContainer.innerHTML = ''; queue.forEach(song => { const item = document.createElement('div'); item.className = 'queue-item'; item.textContent = song.title; queueContainer.appendChild(item); }); }

searchButton.addEventListener('click', () =>

