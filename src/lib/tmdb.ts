import { Movie, WatchProviders, TMDBResponse } from '@/types';
import { GENRES, getGenreById } from '@/constants/genres';
import { getMockMoviesByGenre, getRandomMockMovies } from '@/data/mockMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || '';

// Fetch options with Bearer token
const fetchOptions = {
  headers: {
    'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
};

// Re-export for backward compatibility
export { GENRES, getGenreById };

// Check if TMDB API is available
function isApiAvailable(): boolean {
  return !!TMDB_ACCESS_TOKEN && TMDB_ACCESS_TOKEN.length > 10;
}

// Fetch movies by genre
export async function fetchMoviesByGenre(genreId: string, limit: number = 8): Promise<Movie[]> {
  const genre = getGenreById(genreId);
  if (!genre) {
    throw new Error(`Unknown genre: ${genreId}`);
  }

  // Use mock data if API key is not set
  if (!isApiAvailable()) {
    console.log('Using mock data (TMDB API key not set)');
    return getMockMoviesByGenre(genreId, limit);
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?language=ko-KR&sort_by=popularity.desc&with_genres=${genre.tmdbId}&vote_count.gte=1000&page=1`,
      { ...fetchOptions, next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data: TMDBResponse<Movie> = await response.json();
    return data.results.slice(0, limit);
  } catch (error) {
    console.error('TMDB API error, falling back to mock data:', error);
    return getMockMoviesByGenre(genreId, limit);
  }
}

// Fetch similar movies
export async function fetchSimilarMovies(movieId: number, limit: number = 3): Promise<Movie[]> {
  if (!isApiAvailable()) {
    return getRandomMockMovies(movieId, limit);
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/similar?language=ko-KR&page=1`,
      { ...fetchOptions, next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch similar movies');
    }

    const data: TMDBResponse<Movie> = await response.json();
    return data.results.slice(0, limit);
  } catch (error) {
    console.error('TMDB API error:', error);
    return [];
  }
}

// Fetch watch providers (OTT info)
export async function fetchWatchProviders(movieId: number): Promise<WatchProviders | null> {
  if (!isApiAvailable()) {
    return null;
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/watch/providers`,
      { ...fetchOptions, next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // Return Korean providers if available, otherwise US
    return data.results?.KR || data.results?.US || null;
  } catch (error) {
    console.error('TMDB API error:', error);
    return null;
  }
}

// Fetch movie details
export async function fetchMovieDetails(movieId: number): Promise<Movie | null> {
  if (!isApiAvailable()) {
    const allMockMovies = Object.values(
      await import('@/data/mockMovies').then((m) => m.MOCK_MOVIES)
    ).flat();
    return allMockMovies.find((m) => m.id === movieId) || null;
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?language=ko-KR`,
      { ...fetchOptions, next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('TMDB API error:', error);
    return null;
  }
}
