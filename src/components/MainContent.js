import React from 'react';
import { motion } from 'framer-motion';
import HomeView from './views/HomeView';
import LibraryView from './views/LibraryView';
import LikedSongsView from './views/LikedSongsView';
import RecentlyPlayedView from './views/RecentlyPlayedView';
import RecommendationsView from './views/RecommendationsView';

export default function MainContent({
    activeView,
    currentSong,
    recentlyPlayed,
    likedSongs,
    recommendations,
    onSelectSong,
    onLikeToggle,
    onDeleteSong,
    user
}) {
    const renderView = () => {
        switch (activeView) {
            case 'home':
                return (
                    <HomeView
                        recentlyPlayed={recentlyPlayed}
                        recommendations={recommendations}
                        onSelectSong={onSelectSong}
                        onLikeToggle={onLikeToggle}
                        likedSongs={likedSongs}
                        user={user}
                    />
                );
            case 'library':
                return (
                    <LibraryView
                        likedSongs={likedSongs}
                        recentlyPlayed={recentlyPlayed}
                        onSelectSong={onSelectSong}
                        user={user}
                    />
                );
            case 'liked':
                return (
                    <LikedSongsView
                        songs={likedSongs}
                        onSelectSong={onSelectSong}
                        onLikeToggle={onLikeToggle}
                        currentSong={currentSong}
                        user={user}
                    />
                );
            case 'recently-played':
                return (
                    <RecentlyPlayedView
                        songs={recentlyPlayed}
                        onSelectSong={onSelectSong}
                        onDeleteSong={onDeleteSong}
                        onLikeToggle={onLikeToggle}
                        likedSongs={likedSongs}
                        user={user}
                    />
                );
            case 'recommendations':
                return (
                    <RecommendationsView
                        songs={recommendations}
                        onSelectSong={onSelectSong}
                        onLikeToggle={onLikeToggle}
                        likedSongs={likedSongs}
                        user={user}
                    />
                );
            default:
                return (
                    <HomeView
                        recentlyPlayed={recentlyPlayed}
                        recommendations={recommendations}
                        onSelectSong={onSelectSong}
                        onLikeToggle={onLikeToggle}
                        likedSongs={likedSongs}
                        user={user}
                    />
                );
        }
    };

    return (
        <div className="flex-1 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
            <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-y-auto scrollbar-hidden"
            >
                {renderView()}
            </motion.div>
        </div>
    );
}