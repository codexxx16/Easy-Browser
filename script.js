// Easy-Browser Core Script

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('results');
const audioPlayer = document.getElementById('audioPlayer');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playerThumbnail = document.getElementById('playerThumbnail');
const playerTime = document.getElementById('playerTime');
const miniPlayer = document.getElementById('miniPlayer');
const fullPlayer = document.getElementById('fullPlayer');
const queueContainer = document.getElementById('queue');

let currentTrack = null;
let queue = [];
let recentlyPlayed = JSON.parse(localStorage.getItem(APP_DEFAULTS.STORAGE_KEY)) || [];

// Search songs via API
function searchSongs(query) {
    resultsContainer.innerHTML = '<p>Loading...</p>';
    fetch(`${API_URL.SEARCH}?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const songs = UTILS.formatSearchResults(data.result);
            displayResults(songs);
        })
        .catch(() => {
            resultsContainer.innerHTML = '<p>Failed to fetch results.</p>';
        });
}

// Display results in DOM
function displayResults(songs) {
    resultsContainer.innerHTML = '';
    songs.forEach(song => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <img src="${song.thumbnail}" alt="Thumbnail">
            <div>
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
                <span>${song.timestamp}</span>
            </div>
        `;
        card.addEventListener('click', () => playSong(song));
        resultsContainer.appendChild(card);
    });
}

// Play selected song
function playSong(song) {
    fetch(`${API_URL.DOWNLOAD_MP3}?id=${song.id}`)
        .then(response => response.json())
        .then(data => {
            const url = UTILS.getDownloadUrl(data);
            if (!url) return;
            currentTrack = song;
            audioPlayer.src = url;
            updatePlayerUI(song);
            updateRecentlyPlayed(song);
            audioPlayer.play();
        });
}

// Update player display
function updatePlayerUI(song) {
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    playerThumbnail.src = song.thumbnail;
    fullPlayer.classList.add('active');
    miniPlayer.classList.remove('active');
}

// Audio player events
audioPlayer.addEventListener('timeupdate', () => {
    playerTime.textContent = UTILS.formatTime(audioPlayer.currentTime);
});

audioPlayer.addEventListener('ended', () => {
    playNext();
});

// Update and save recently played
function updateRecentlyPlayed(song) {
    recentlyPlayed = recentlyPlayed.filter(item => item.id !== song.id);
    recentlyPlayed.unshift(song);
    if (recentlyPlayed.length > APP_DEFAULTS.MAX_RECENT_ITEMS) {
        recentlyPlayed.pop();
    }
    localStorage.setItem(APP_DEFAULTS.STORAGE_KEY, JSON.stringify(recentlyPlayed));
}

// Add to queue
function addToQueue(song) {
    if (queue.length < APP_DEFAULTS.MAX_QUEUE_ITEMS) {
        queue.push(song);
        renderQueue();
    }
}

// Play next in queue
function playNext() {
    if (queue.length > 0) {
        const next = queue.shift();
        renderQueue();
        playSong(next);
    } else {
        fullPlayer.classList.remove('active');
        miniPlayer.classList.add('active');
    }
}

// Render queue items
function renderQueue() {
    queueContainer.innerHTML = '';
    queue.forEach(song => {
        const item = document.createElement('div');
        item.className = 'queue-item';
        item.textContent = song.title;
        queueContainer.appendChild(item);
    });
}

// Trigger search
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) searchSongs(query);
});

// Trigger default search on load
window.addEventListener('load', () => {
    searchSongs(APP_DEFAULTS.DEFAULT_SEARCH);
});
