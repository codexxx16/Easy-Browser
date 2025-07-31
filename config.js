// Easy-Browser Configuration

const API_URL = {
    SEARCH: 'https://api.siputzx.my.id/api/s/youtube',
    DOWNLOAD_MP3: 'https://api.siputzx.my.id/api/d/ytmp3'
};

const APP_DEFAULTS = {
    DEFAULT_SEARCH: 'popular songs 2025',
    MAX_RECENT_ITEMS: 10,
    MAX_QUEUE_ITEMS: 5,
    STORAGE_KEY: 'easyBrowserRecentlyPlayed'
};

const UTILS = {
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    },

    needsScrolling(text, maxLength = 20) {
        return text && text.length > maxLength;
    },

    formatSong(item) {
        return {
            id: item.videoId || '',
            title: item.title || 'Unknown Title',
            artist: item.author?.name || 'Unknown Artist',
            thumbnail: item.thumbnail || item.image || '/api/placeholder/300/300',
            duration: item.seconds || item.duration?.seconds || 0,
            timestamp: item.timestamp || item.duration?.timestamp || '0:00',
            videoUrl: item.url || ''
        };
    },

    formatSearchResults(items) {
        if (!Array.isArray(items)) return [];
        return items.map(item => this.formatSong(item));
    },

    getDownloadUrl(data) {
        return data?.dl || null;
    }
};
