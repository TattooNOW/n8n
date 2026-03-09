import React from 'react';
import { SlideController } from '../components/Slideshow';
import { useEpisodeData, useEpisodeIdFromURL } from '../hooks/useEpisodeData';

/**
 * Slideshow Page - Main page for OBS browser source
 *
 * Usage in OBS:
 * Add Browser Source: http://localhost:5173/slideshow?episode=5
 * Resolution: 1920x1080
 * FPS: 30 or 60
 *
 * URL Parameters:
 * - episode: Episode number or ID (default: 1)
 *
 * Keyboard Controls:
 * - Arrow Left/Right or PageUp/PageDown: Navigate slides
 * - Q: Toggle QR code
 * - L: Toggle lower-third
 * - G: Toggle portfolio grid/fullscreen
 * - Home: Jump to first slide
 * - End: Jump to last slide
 *
 * Stream Deck Integration:
 * WebSocket: ws://localhost:9000/streamdeck
 * Commands: next, previous, toggleQR, toggleLowerThird, togglePortfolioLayout, jumpToSegment
 */
export function Slideshow() {
  const episodeId = useEpisodeIdFromURL();
  const { episode, loading, error } = useEpisodeData(episodeId);

  if (loading) {
    return (
      <div className="slideshow-container flex items-center justify-center">
        <div className="text-4xl text-muted-foreground animate-pulse">
          Loading episode {episodeId}...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slideshow-container flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <div className="text-3xl text-destructive mb-2">
            Error loading episode
          </div>
          <div className="text-xl text-muted-foreground">
            {error}
          </div>
          <div className="mt-8 text-sm text-muted-foreground">
            Make sure <code>/public/data/episode-{episodeId}.json</code> exists
          </div>
        </div>
      </div>
    );
  }

  return <SlideController episodeData={episode} />;
}
