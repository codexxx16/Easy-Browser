/**
 * Main script for Music Player
 * Dibuat lebih direct & robust untuk mengurangi error
 */

// DOM Elements
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const resultsContainer = document.getElementById('results');
const resultsSection = document.getElementById('resultsSection');
const searchResultTitle = document.getElementById('searchResultTitle');
const loadingElement = document.querySelector('.loading');
const noResultsElement = document.querySelector('.no-results');
const audioPlayer = document.getElementById('audioPlayer');
const welcomePanel = document.getElementById('welcomePanel');
const welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
const logoLink = document.getElementById('logoLink');
const historySection = document.getElementById('historySection');
const historyList = document.getElementById('historyList');

// Player elements
const playerMini = document.getElementById('playerMini');
const playerFull = document.getElementById('playerFull');
const minimizeBtn = document.getElementById('minimizeBtn');

// Mini player elements
const miniThumbnail = document.getElementById('miniThumbnail');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');
const miniPlayBtn = document.getElementById('miniPlayBtn');
const miniNextBtn = document.getElementById('miniNextBtn');

// Full player elements
const fullThumbnail = document.getElementById('fullThumbnail');
const fullTitle = document.getElementById('fullTitle');
const fullArtist = document.getElementById('fullArtist');
const playBtnLarge = document.getElementById('playBtnLarge');
const prevBtnLarge = document.getElementById('prevBtnLarge');
const nextBtnLarge = document.getElementById('nextBtnLarge');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBarLarge = document.getElementById('progressBarLarge');
const progressLarge = document.getElementById('progressLarge');
const currentTimeLarge = document.getElementById('currentTimeLarge');
const totalTimeLarge = document.getElementById('totalTimeLarge');
const downloadBtnLarge = document.getElementById('downloadBtnLarge');
const queueList = document.getElementById('queueList');

// App State
let currentPlaylist = [];
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let recentlyPlayed = [];

/**
 * Shows welcome panel with animation
 */
function showWelcomePanel() {
    setTimeout(() => {
        welcomePanel.classList.add('show');
    }, 100);
}

/**
 * Searches for songs using the API
 * @param {string} query - Search query
 */
async function searchSongs(query) {
    // Show loading indicator
    loadingElement.style.display = 'flex';
    resultsContainer.innerHTML = '';
    noResultsElement.style.display = 'none';
    
    // Update UI to show results section
    historySection.style.display = 'none';
    resultsSection.classList.add('active');
    searchResultTitle.textContent = `Hasil Pencarian: "${query}"`;
    
    try {
        // Fetch data from the API
        const response = await fetch(`${API_URL.SEARCH}?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        // Hide loading indicator
        loadingElement.style.display = 'none';
        
        // Check if we have valid results
        if (!data.status || !data.data || data.data.length === 0) {
            noResultsElement.style.display = 'block';
            return;
        }
        
        // Format and update playlist
        currentPlaylist = UTILS.formatSearchResults(data.data);
        
        // Display results
        displayResults(currentPlaylist);
    } catch (error) {
        console.error('Error fetching search results:', error);
        loadingElement.style.display = 'none';
        noResultsElement.style.display = 'block';
    }
}

/**
 * Displays search results in the UI
 * @param {Array} songs - Array of song objects
 */
function displayResults(songs) {
    resultsContainer.innerHTML = '';
    
    songs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'song-card';
        songCard.dataset.songId = song.id;
        
        // Check if title is too long and needs scrolling
        const needsScrolling = UTILS.needsScrolling(song.title);
        
        songCard.innerHTML = `
            <img src="${song.thumbnail}" alt="${song.title}" class="song-thumbnail">
            <div class="song-info">
                <div class="${needsScrolling ? 'scrolling-text' : 'song-title'}">
                    ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                </div>
                <div class="song-artist">${song.artist}</div>
                <div class="song-duration">${song.timestamp || '0:00'}</div>
            </div>
        `;
        
        songCard.addEventListener('click', () => {
            const index = currentPlaylist.findIndex(s => s.id === song.id);
            playSong(index);
            updateQueue();
        });
        
        resultsContainer.appendChild(songCard);
    });
}

/**
 * Plays a song from the current playlist
 * @param {number} index - Index of the song in the playlist
 */
async function playSong(index) {
    if (index < 0 || index >= currentPlaylist.length) return;
    
    currentSongIndex = index;
    const song = currentPlaylist[index];
    
    // Show loading
    loadingElement.style.display = 'flex';
    
    try {
        // Direct API call to get MP3
        const response = await fetch(`${API_URL.DOWNLOAD_MP3}?url=${encodeURIComponent(song.videoUrl)}`);
        const data = await response.json();
        
        // Direct access to download URL
        const downloadUrl = data && data.data && data.data.dl ? data.data.dl : null;
        
        if (!downloadUrl) {
            throw new Error('Failed to get audio URL');
        }
        
        // Update mini player UI
        miniThumbnail.src = song.thumbnail;
        
        // Check if title is too long for mini player
        if (UTILS.needsScrolling(song.title)) {
            miniTitle.className = 'scrolling-text';
            miniTitle.innerHTML = `<div class="scrolling-text-content">${song.title}</div>`;
        } else {
            miniTitle.className = 'song-title';
            miniTitle.textContent = song.title;
        }
        
        miniArtist.textContent = song.artist;
        
        // Update full player UI
        fullThumbnail.src = song.thumbnail;
        
        // Check if title is too long for full player
        if (UTILS.needsScrolling(song.title, 30)) {
            fullTitle.className = 'now-title-large scrolling-text';
            fullTitle.innerHTML = `<div class="scrolling-text-content">${song.title}</div>`;
        } else {
            fullTitle.className = 'now-title-large';
            fullTitle.textContent = song.title;
        }
        
        fullArtist.textContent = song.artist;
        
        // Update play/pause icons
        const playIcon = isPlaying ? 'fa-pause' : 'fa-play';
        miniPlayBtn.innerHTML = `<i class="fas ${playIcon}"></i>`;
        playBtnLarge.innerHTML = `<i class="fas ${playIcon}"></i>`;
        
        // Set audio source and play
        audioPlayer.src = downloadUrl;
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playBtnLarge.innerHTML = '<i class="fas fa-pause"></i>';
                playerMini.classList.remove('hidden');
                
                // Add to recently played
                addToRecentlyPlayed(song);
            })
            .catch(error => {
                console.error('Error playing audio:', error);
            });
    } catch (error) {
        console.error('Error getting audio URL:', error);
        alert('Failed to play this song. Please try another one.');
    } finally {
        loadingElement.style.display = 'none';
    }
}

/**
 * Adds a song to the recently played list
 * @param {Object} song - Song object to add
 */
function addToRecentlyPlayed(song) {
    // Remove song if already in the list
    recentlyPlayed = recentlyPlayed.filter(s => s.id !== song.id);
    
    // Add to beginning of list
    recentlyPlayed.unshift(song);
    
    // Keep only the specified maximum number of songs
    if (recentlyPlayed.length > APP_DEFAULTS.MAX_RECENT_ITEMS) {
        recentlyPlayed = recentlyPlayed.slice(0, APP_DEFAULTS.MAX_RECENT_ITEMS);
    }
    
    // Update the UI
    updateRecentlyPlayed();
    
    // Save to local storage
    localStorage.setItem(APP_DEFAULTS.STORAGE_KEY, JSON.stringify(recentlyPlayed));
}

/**
 * Updates the recently played list in the UI
 */
function updateRecentlyPlayed() {
    if (recentlyPlayed.length === 0) {
        historyList.innerHTML = `
            <div class="no-history">
                <p>Belum ada lagu yang diputar</p>
            </div>
        `;
        return;
    }
    
    historyList.innerHTML = '';
    
    recentlyPlayed.forEach(song => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        // Check if title is too long
        const needsScrolling = UTILS.needsScrolling(song.title, 25);
        
        historyItem.innerHTML = `
            <img src="${song.thumbnail}" alt="${song.title}" class="history-thumbnail">
            <div class="history-info">
                <div class="${needsScrolling ? 'history-title scrolling-text' : 'history-title'}">
                    ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                </div>
                <div class="history-artist">${song.artist}</div>
            </div>
            <div class="history-duration">${song.timestamp || '0:00'}</div>
        `;
        
        historyItem.addEventListener('click', () => {
            // Add the song to current playlist if not already there
            if (!currentPlaylist.some(s => s.id === song.id)) {
                currentPlaylist.unshift(song);
            }
            
            const index = currentPlaylist.findIndex(s => s.id === song.id);
            playSong(index);
            updateQueue();
        });
        
        historyList.appendChild(historyItem);
    });
}

/**
 * Updates the queue list in the player
 */
function updateQueue() {
    queueList.innerHTML = '';
    
    // Show next songs in the queue up to the configured maximum
    for (let i = 0; i < APP_DEFAULTS.MAX_QUEUE_ITEMS; i++) {
        const nextIndex = (currentSongIndex + i + 1) % currentPlaylist.length;
        if (nextIndex !== currentSongIndex) { // Don't show current song in the queue
            const song = currentPlaylist[nextIndex];
            
            const queueItem = document.createElement('div');
            queueItem.className = 'queue-item';
            
            // Check if title is too long
            const needsScrolling = UTILS.needsScrolling(song.title);
            
            queueItem.innerHTML = `
                <img src="${song.thumbnail}" alt="${song.title}" class="queue-thumbnail">
                <div class="queue-info">
                    <div class="${needsScrolling ? 'queue-title scrolling-text' : 'queue-title'}">
                        ${needsScrolling ? `<div class="scrolling-text-content">${song.title}</div>` : song.title}
                    </div>
                    <div class="queue-artist">${song.artist}</div>
                </div>
                <div class="queue-duration">${song.timestamp || '0:00'}</div>
            `;
            
            queueItem.addEventListener('click', () => {
                playSong(nextIndex);
                updateQueue();
            });
            
            queueList.appendChild(queueItem);
        }
    }
    
    // If there are no next songs, show message
    if (queueList.children.length === 0) {
        queueList.innerHTML = `
            <div class="no-results">
                <p>Tidak ada lagu berikutnya dalam antrean</p>
            </div>
        `;
    }
}

/**
 * Toggles play/pause
 */
function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        isPlaying = true;
        miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtnLarge.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audioPlayer.pause();
        isPlaying = false;
        miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtnLarge.innerHTML = '<i class="fas fa-play"></i>';
    }
}

/**
 * Plays the next song in the playlist
 */
function playNextSong() {
    if (isShuffle) {
        // Play random song from playlist excluding the current one
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * currentPlaylist.length);
        } while (nextIndex === currentSongIndex && currentPlaylist.length > 1);
        
        playSong(nextIndex);
    } else {
        playSong((currentSongIndex + 1) % currentPlaylist.length);
    }
    updateQueue();
}

/**
 * Plays the previous song in the playlist
 */
function playPreviousSong() {
    playSong((currentSongIndex - 1 + currentPlaylist.length) % currentPlaylist.length);
    updateQueue();
}

/**
 * Updates the progress bar based on audio playback
 */
function updateProgressBar() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration || 1;
    const progressPercent = (currentTime / duration) * 100;
    
    progressLarge.style.width = `${progressPercent}%`;
    currentTimeLarge.textContent = UTILS.formatTime(currentTime);
    totalTimeLarge.textContent = UTILS.formatTime(duration);
}

/**
 * Sets the progress when clicking on the progress bar
 * @param {Event} e - Click event
 */
function setProgress(e) {
    // Get the bounding rectangle of the progress bar
    const rect = progressBarLarge.getBoundingClientRect();
    // Calculate the click position relative to the progress bar
    const clickPosition = e.clientX - rect.left;
    // Calculate the percentage of the click position relative to the width of the progress bar
    const percentage = clickPosition / rect.width;
    // Set the audio player's current time based on the percentage of the duration
    audioPlayer.currentTime = percentage * audioPlayer.duration;
}

/**
 * Toggles shuffle mode
 */
function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleBtn.style.color = 'var(--primary)';
    } else {
        shuffleBtn.style.color = 'var(--light)';
    }
}

/**
 * Toggles repeat mode
 */
function toggleRepeat() {
    isRepeat = !isRepeat;
    if (isRepeat) {
        repeatBtn.style.color = 'var(--primary)';
    } else {
        repeatBtn.style.color = 'var(--light)';
    }
}

/**
 * Downloads the current song as MP3
 */
function downloadCurrentSong() {
    if (currentPlaylist.length === 0 || currentSongIndex < 0) return;
    
    const song = currentPlaylist[currentSongIndex];
    
    // Show loading
    loadingElement.style.display = 'flex';
    
    // Direct download approach
    fetch(`${API_URL.DOWNLOAD_MP3}?url=${encodeURIComponent(song.videoUrl)}`)
        .then(response => response.json())
        .then(data => {
            loadingElement.style.display = 'none';
            
            const downloadUrl = data && data.data && data.data.dl ? data.data.dl : null;
            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                alert('Failed to get download link. Please try again.');
            }
        })
        .catch(error => {
            loadingElement.style.display = 'none';
            console.error('Error getting MP3 download URL:', error);
            alert('Failed to download. Please try again later.');
        });
}

/**
 * Loads recently played songs from local storage
 */
function loadRecentlyPlayed() {
    const storedRecent = localStorage.getItem(APP_DEFAULTS.STORAGE_KEY);
    if (storedRecent) {
        try {
            recentlyPlayed = JSON.parse(storedRecent);
            updateRecentlyPlayed();
        } catch (e) {
            console.error('Error parsing stored recently played:', e);
        }
    }
}

/**
 * Initialize application
 */
function initApp() {
    // Load recently played
    loadRecentlyPlayed();
    
    // Show welcome panel each time
    showWelcomePanel();
    
    // Hide results section initially
    resultsSection.classList.remove('active');
    
    // Set up event listeners
    setupEventListeners();
}

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Welcome panel
    welcomeCloseBtn.addEventListener('click', () => {
        welcomePanel.classList.remove('show');
        setTimeout(() => {
            welcomePanel.classList.add('hidden');
        }, 600); // Match the transition duration
        
        // Check if we have recently played songs
        if (recentlyPlayed.length === 0) {
            // If no history, show recommended songs
            searchSongs(APP_DEFAULTS.DEFAULT_SEARCH);
        } else {
            // Update recently played list
            updateRecentlyPlayed();
        }
    });
    
    // Logo link
    logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Hide results section, show history section
        resultsSection.classList.remove('active');
        historySection.style.display = 'block';
        
        // If there's no history, show some recommendations
        if (recentlyPlayed.length === 0 && currentPlaylist.length === 0) {
            searchSongs(APP_DEFAULTS.DEFAULT_SEARCH);
        }
    });
    
    // Search
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchSongs(query);
        }
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchSongs(query);
            }
        }
    });
    
    // Player controls
    minimizeBtn.addEventListener('click', () => {
        playerFull.style.display = 'none';
        playerMini.classList.remove('hidden');
    });
    
    playerMini.addEventListener('click', function(e) {
        if (!e.target.classList.contains('control-btn') && !e.target.closest('.control-btn')) {
            playerFull.style.display = 'flex';
            playerMini.classList.add('hidden');
        }
    });
    
    // Mini player controls
    miniPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    
    miniNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playNextSong();
    });
    
    // Full player controls
    playBtnLarge.addEventListener('click', togglePlay);
    prevBtnLarge.addEventListener('click', playPreviousSong);
    nextBtnLarge.addEventListener('click', playNextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBarLarge.addEventListener('click', setProgress);
    
    // Audio player events
    audioPlayer.addEventListener('timeupdate', updateProgressBar);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
        } else {
            playNextSong();
        }
    });
    
    // Download button
    downloadBtnLarge.addEventListener('click', downloadCurrentSong);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);