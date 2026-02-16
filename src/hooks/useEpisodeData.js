import { useState, useEffect } from 'react';

/**
 * Hook to load episode data from JSON file
 * @param {string|number} episodeId - Episode number or filename
 * @returns {object} { episode, loading, error }
 */
export function useEpisodeData(episodeId) {
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEpisode() {
      try {
        setLoading(true);
        setError(null);

        // Fetch episode JSON from public/data/ directory
        const response = await fetch(`/data/episode-${episodeId}.json`);

        if (!response.ok) {
          throw new Error(`Failed to load episode ${episodeId}: ${response.statusText}`);
        }

        const data = await response.json();
        setEpisode(data);
      } catch (err) {
        console.error('Error loading episode:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (episodeId) {
      loadEpisode();
    }
  }, [episodeId]);

  return { episode, loading, error };
}

/**
 * Parse episode number from URL query params
 * Usage: const episodeId = useEpisodeIdFromURL();
 */
export function useEpisodeIdFromURL() {
  const [episodeId, setEpisodeId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('episode') || params.get('id') || '1';
    setEpisodeId(id);
  }, []);

  return episodeId;
}
