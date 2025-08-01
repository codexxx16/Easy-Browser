<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Music Player</title>
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Welcome Panel -->
    <div class="welcome-panel" id="welcomePanel">
        <div class="welcome-content">
            <div class="welcome-logo">MusicPlayer</div>
            <div class="welcome-subtitle">Find, play, and download your favorite music in one place.</div>
            
            <div class="welcome-about">
                <p>MusicPlayer adalah aplikasi web sederhana yang memungkinkan Anda mencari lagu dari YouTube, memutarnya langsung di browser Anda, dan mengunduhnya dalam format MP3.</p>
            </div>
            
            <div class="welcome-thanks">
                <div class="thanks-title">Special Thanks</div>
                <ul class="thanks-list">
                    <li><strong>Siputz API</strong> - Untuk menyediakan API yang membuat music player ini mungkin</li>
                    <li><strong>FlowFalcon</strong> - Untuk pengembangan website MusicPlayer</li>
                    <li><strong>Anda</strong> - Untuk menggunakan aplikasi kami</li>
                </ul>
            </div>
            
            <button id="welcomeCloseBtn" class="welcome-btn">Lanjutkan ke Music Player</button>
        </div>
    </div>

    <div class="container">
        <div class="header">
            <a href="#" class="logo" id="logoLink">MusicPlayer</a>
            <p class="site-description">Temukan, putar, dan unduh musik favorit Anda dengan mudah.</p>
            <div class="search-container">
                <input type="text" class="search-input" placeholder="Cari lagu, artis, atau album...">
                <button class="search-btn"><i class="fas fa-search"></i> Cari</button>
            </div>
        </div>
        
        <!-- History Section -->
        <div class="history-section" id="historySection">
            <h2 class="section-title"><i class="fas fa-history"></i> Terakhir Diputar</h2>
            <div class="history-list" id="historyList">
                <!-- History items will be displayed here -->
            </div>
        </div>
        
        <!-- Results Section -->
        <div class="results-section" id="resultsSection">
            <h2 class="section-title"><i class="fas fa-music"></i> <span id="searchResultTitle">Hasil Pencarian</span></h2>
            <div class="results-container" id="results">
                <!-- Results will be displayed here -->
            </div>
        </div>
        
        <div class="loading">
            <div class="loader"></div>
            <div class="loading-text">Mengambil data...</div>
        </div>
        
        <div class="no-results">
            <h3>Tidak ada hasil yang ditemukan</h3>
            <p>Coba kata kunci lain</p>
        </div>
    </div>
    
    <!-- Mini Player (when minimized) -->
    <div class="player-minimized hidden" id="playerMini">
        <div class="now-playing-mini">
            <img src="/api/placeholder/45/45" alt="Now playing" class="now-thumbnail-mini" id="miniThumbnail">
            <div class="now-info">
                <div class="song-title" id="miniTitle">Judul Lagu</div>
                <div class="song-artist" id="miniArtist">Nama Artis</div>
            </div>
        </div>
        <div class="mini-controls">
            <button class="control-btn" id="miniPlayBtn"><i class="fas fa-play"></i></button>
            <button class="control-btn" id="miniNextBtn"><i class="fas fa-step-forward"></i></button>
        </div>
    </div>
    
    <!-- Full Screen Player -->
    <div class="player-full" id="playerFull">
        <div class="player-header">
            <button class="back-btn" id="minimizeBtn"><i class="fas fa-chevron-down"></i></button>
            <div class="player-title">Now Playing</div>
            <div style="width: 24px;"></div> <!-- Spacer for alignment -->
        </div>
        
        <div class="player-content">
            <img src="/api/placeholder/300/300" alt="Now playing" class="now-thumbnail-large" id="fullThumbnail">
            
            <div class="now-info-large">
                <div class="now-title-large" id="fullTitle">Judul Lagu</div>
                <div class="now-artist-large" id="fullArtist">Nama Artis</div>
            </div>
            
            <div class="progress-container-large">
                <div class="progress-bar-large" id="progressBarLarge">
                    <div class="progress-large" id="progressLarge"></div>
                </div>
                <div class="time-display">
                    <span id="currentTimeLarge">0:00</span>
                    <span id="totalTimeLarge">0:00</span>
                </div>
            </div>
            
            <div class="controls-large">
                <button class="control-btn-large" id="shuffleBtn"><i class="fas fa-random"></i></button>
                <button class="control-btn-large" id="prevBtnLarge"><i class="fas fa-step-backward"></i></button>
                <button class="control-btn-large play-btn-large" id="playBtnLarge"><i class="fas fa-play"></i></button>
                <button class="control-btn-large" id="nextBtnLarge"><i class="fas fa-step-forward"></i></button>
                <button class="control-btn-large" id="repeatBtn"><i class="fas fa-redo"></i></button>
            </div>
            
            <button class="download-btn" id="downloadBtnLarge"><i class="fas fa-download"></i> Download MP3</button>
        </div>
        
        <div class="next-up-container">
            <h3 class="next-up-title"><i class="fas fa-stream"></i> Next Up</h3>
            <div class="next-up-list" id="queueList">
                <!-- Queue will be displayed here -->
            </div>
        </div>
    </div>
    
    <audio id="audioPlayer" style="display: none;"></audio>
    
    <!-- Config Scripts - Load first -->
    <script src="js/config.js"></script>
    <!-- Main Scripts -->
    <script src="js/script.js"></script>
</body>
</html>
