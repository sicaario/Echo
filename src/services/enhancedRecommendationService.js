const CLIENT_ID = 'eeaa9dd43a104c07a12c75a87435c822';
const CLIENT_SECRET = '41bf7c433e8b402f838bb119cdfc7f0b';

let accessToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
    if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
        return accessToken;
    }

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error('Failed to get access token');
        }

        const data = await response.json();
        accessToken = data.access_token;
        tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
        
        return accessToken;
    } catch (error) {
        console.error('Error getting Spotify access token:', error);
        throw error;
    }
};

// Enhanced recommendation system with multiple strategies
export const getEnhancedRecommendations = async (userPreferences = {}) => {
    const {
        likedSongs = [],
        recentlyPlayed = [],
        preferredGenres = [],
        timeOfDay = 'any',
        mood = 'neutral'
    } = userPreferences;

    try {
        const recommendations = [];
        
        // Strategy 1: Based on liked songs
        if (likedSongs.length > 0) {
            const likedBasedRecs = await getRecommendationsFromSeeds(likedSongs.slice(0, 5), 'liked');
            recommendations.push(...likedBasedRecs);
        }

        // Strategy 2: Based on recently played
        if (recentlyPlayed.length > 0) {
            const recentBasedRecs = await getRecommendationsFromSeeds(recentlyPlayed.slice(0, 3), 'recent');
            recommendations.push(...recentBasedRecs);
        }

        // Strategy 3: Genre-based recommendations
        if (preferredGenres.length > 0) {
            const genreBasedRecs = await getGenreBasedRecommendations(preferredGenres);
            recommendations.push(...genreBasedRecs);
        }

        // Strategy 4: Time-based recommendations
        const timeBasedRecs = await getTimeBasedRecommendations(timeOfDay);
        recommendations.push(...timeBasedRecs);

        // Strategy 5: Mood-based recommendations
        const moodBasedRecs = await getMoodBasedRecommendations(mood);
        recommendations.push(...moodBasedRecs);

        // Remove duplicates and shuffle
        const uniqueRecommendations = removeDuplicates(recommendations);
        return shuffleArray(uniqueRecommendations).slice(0, 50);

    } catch (error) {
        console.error('Error getting enhanced recommendations:', error);
        return [];
    }
};

const getRecommendationsFromSeeds = async (seedTracks, type = 'general') => {
    try {
        const token = await getAccessToken();
        const trackIds = seedTracks
            .filter(track => track.id)
            .slice(0, 5)
            .map(track => track.id)
            .join(',');

        if (!trackIds) return [];

        // Adjust parameters based on type
        const params = new URLSearchParams({
            seed_tracks: trackIds,
            limit: type === 'liked' ? 20 : 10,
            market: 'US'
        });

        // Add audio features based on type
        if (type === 'liked') {
            params.append('target_popularity', '70');
            params.append('target_energy', '0.7');
        } else if (type === 'recent') {
            params.append('target_popularity', '60');
            params.append('target_danceability', '0.6');
        }

        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?${params}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (!response.ok) throw new Error('Recommendations request failed');

        const data = await response.json();
        return data.tracks.map(track => ({
            ...formatTrack(track),
            recommendationType: type
        }));
    } catch (error) {
        console.error(`Error getting ${type} recommendations:`, error);
        return [];
    }
};

const getGenreBasedRecommendations = async (genres) => {
    try {
        const token = await getAccessToken();
        const seedGenres = genres.slice(0, 5).join(',');

        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}&limit=15&market=US`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (!response.ok) throw new Error('Genre recommendations request failed');

        const data = await response.json();
        return data.tracks.map(track => ({
            ...formatTrack(track),
            recommendationType: 'genre'
        }));
    } catch (error) {
        console.error('Error getting genre recommendations:', error);
        return [];
    }
};

const getTimeBasedRecommendations = async (timeOfDay) => {
    try {
        const token = await getAccessToken();
        let params = new URLSearchParams({
            limit: 10,
            market: 'US'
        });

        // Adjust parameters based on time of day
        switch (timeOfDay) {
            case 'morning':
                params.append('seed_genres', 'pop,indie,acoustic');
                params.append('target_energy', '0.6');
                params.append('target_valence', '0.7');
                break;
            case 'afternoon':
                params.append('seed_genres', 'pop,rock,electronic');
                params.append('target_energy', '0.8');
                params.append('target_danceability', '0.7');
                break;
            case 'evening':
                params.append('seed_genres', 'chill,ambient,jazz');
                params.append('target_energy', '0.4');
                params.append('target_valence', '0.5');
                break;
            case 'night':
                params.append('seed_genres', 'electronic,ambient,downtempo');
                params.append('target_energy', '0.3');
                params.append('target_valence', '0.4');
                break;
            default:
                params.append('seed_genres', 'pop,rock,electronic');
                params.append('target_popularity', '70');
        }

        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?${params}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (!response.ok) throw new Error('Time-based recommendations request failed');

        const data = await response.json();
        return data.tracks.map(track => ({
            ...formatTrack(track),
            recommendationType: 'time'
        }));
    } catch (error) {
        console.error('Error getting time-based recommendations:', error);
        return [];
    }
};

const getMoodBasedRecommendations = async (mood) => {
    try {
        const token = await getAccessToken();
        let params = new URLSearchParams({
            limit: 10,
            market: 'US'
        });

        // Adjust parameters based on mood
        switch (mood) {
            case 'happy':
                params.append('seed_genres', 'pop,dance,funk');
                params.append('target_valence', '0.8');
                params.append('target_energy', '0.8');
                params.append('target_danceability', '0.7');
                break;
            case 'sad':
                params.append('seed_genres', 'indie,alternative,folk');
                params.append('target_valence', '0.3');
                params.append('target_energy', '0.4');
                break;
            case 'energetic':
                params.append('seed_genres', 'rock,electronic,hip-hop');
                params.append('target_energy', '0.9');
                params.append('target_danceability', '0.8');
                break;
            case 'chill':
                params.append('seed_genres', 'chill,ambient,lo-fi');
                params.append('target_energy', '0.3');
                params.append('target_valence', '0.6');
                break;
            case 'focus':
                params.append('seed_genres', 'ambient,classical,instrumental');
                params.append('target_energy', '0.4');
                params.append('target_instrumentalness', '0.8');
                break;
            default:
                params.append('seed_genres', 'pop,rock,indie');
                params.append('target_popularity', '60');
        }

        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?${params}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (!response.ok) throw new Error('Mood-based recommendations request failed');

        const data = await response.json();
        return data.tracks.map(track => ({
            ...formatTrack(track),
            recommendationType: 'mood'
        }));
    } catch (error) {
        console.error('Error getting mood-based recommendations:', error);
        return [];
    }
};

// Get trending tracks
export const getTrendingTracks = async (timeRange = 'short_term', limit = 20) => {
    try {
        const token = await getAccessToken();
        
        // Use featured playlists as a proxy for trending
        const response = await fetch(
            `https://api.spotify.com/v1/browse/featured-playlists?limit=5&country=US`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (!response.ok) throw new Error('Featured playlists request failed');

        const data = await response.json();
        const tracks = [];

        // Get tracks from featured playlists
        for (const playlist of data.playlists.items.slice(0, 3)) {
            const playlistResponse = await fetch(
                `https://api.spotify.com/v1/playlists/${playlist.id}/tracks?limit=10`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (playlistResponse.ok) {
                const playlistData = await playlistResponse.json();
                const playlistTracks = playlistData.items
                    .filter(item => item.track && item.track.preview_url)
                    .map(item => ({
                        ...formatTrack(item.track),
                        recommendationType: 'trending'
                    }));
                tracks.push(...playlistTracks);
            }
        }

        return shuffleArray(tracks).slice(0, limit);
    } catch (error) {
        console.error('Error getting trending tracks:', error);
        return [];
    }
};

// Get new releases
export const getNewReleases = async (limit = 20) => {
    try {
        const token = await getAccessToken();
        
        const response = await fetch(
            `https://api.spotify.com/v1/browse/new-releases?limit=${limit}&country=US`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        if (!response.ok) throw new Error('New releases request failed');

        const data = await response.json();
        const tracks = [];

        // Get tracks from new release albums
        for (const album of data.albums.items.slice(0, 10)) {
            const albumResponse = await fetch(
                `https://api.spotify.com/v1/albums/${album.id}/tracks?limit=3`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (albumResponse.ok) {
                const albumData = await albumResponse.json();
                const albumTracks = albumData.items
                    .filter(track => track.preview_url)
                    .map(track => ({
                        id: track.id,
                        title: track.name,
                        artist: track.artists.map(artist => artist.name).join(', '),
                        album: album.name,
                        imageUrl: album.images[0]?.url || album.images[1]?.url || '',
                        duration: track.duration_ms,
                        preview_url: track.preview_url,
                        external_urls: track.external_urls,
                        popularity: track.popularity || 50,
                        recommendationType: 'new-release'
                    }));
                tracks.push(...albumTracks);
            }
        }

        return tracks.slice(0, limit);
    } catch (error) {
        console.error('Error getting new releases:', error);
        return [];
    }
};

// Utility functions
const formatTrack = (track) => ({
    id: track.id,
    title: track.name,
    artist: track.artists.map(artist => artist.name).join(', '),
    album: track.album.name,
    imageUrl: track.album.images[0]?.url || track.album.images[1]?.url || '',
    duration: track.duration_ms,
    preview_url: track.preview_url,
    external_urls: track.external_urls,
    popularity: track.popularity
});

const removeDuplicates = (tracks) => {
    const seen = new Set();
    return tracks.filter(track => {
        if (seen.has(track.id)) {
            return false;
        }
        seen.add(track.id);
        return true;
    });
};

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Export existing functions for backward compatibility
export { searchSpotifyTracks, getSpotifyRecommendations, getTrackFeatures } from './spotifyService';