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
        tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 minute early
        
        return accessToken;
    } catch (error) {
        console.error('Error getting Spotify access token:', error);
        throw error;
    }
};

export const searchSpotifyTracks = async (query, limit = 20) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Search request failed');
        }

        const data = await response.json();
        return data.tracks.items.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            album: track.album.name,
            imageUrl: track.album.images[0]?.url || track.album.images[1]?.url || '',
            duration: track.duration_ms,
            preview_url: track.preview_url,
            external_urls: track.external_urls,
            popularity: track.popularity
        }));
    } catch (error) {
        console.error('Error searching Spotify tracks:', error);
        return [];
    }
};

export const getSpotifyRecommendations = async (seedTracks, limit = 20) => {
    try {
        const token = await getAccessToken();
        
        // Extract track IDs from seed tracks (limit to 5 as per Spotify API)
        const trackIds = seedTracks
            .filter(track => track.id)
            .slice(0, 5)
            .map(track => track.id)
            .join(',');

        if (!trackIds) {
            return [];
        }

        const response = await fetch(
            `https://api.spotify.com/v1/recommendations?seed_tracks=${trackIds}&limit=${limit}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Recommendations request failed');
        }

        const data = await response.json();
        return data.tracks.map(track => ({
            id: track.id,
            title: track.name,
            artist: track.artists.map(artist => artist.name).join(', '),
            album: track.album.name,
            imageUrl: track.album.images[0]?.url || track.album.images[1]?.url || '',
            duration: track.duration_ms,
            preview_url: track.preview_url,
            external_urls: track.external_urls,
            popularity: track.popularity
        }));
    } catch (error) {
        console.error('Error getting Spotify recommendations:', error);
        return [];
    }
};

export const getTrackFeatures = async (trackId) => {
    try {
        const token = await getAccessToken();
        const response = await fetch(
            `https://api.spotify.com/v1/audio-features/${trackId}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Track features request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error getting track features:', error);
        return null;
    }
};