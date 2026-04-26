import { NextRequest, NextResponse } from 'next/server';
import { fetchMoviesByGenre, fetchSimilarMovies, getGenreById } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const genre = searchParams.get('genre');
  const movieId = searchParams.get('movieId');
  const type = searchParams.get('type') || 'genre';

  try {
    if (type === 'similar' && movieId) {
      const movies = await fetchSimilarMovies(parseInt(movieId, 10));
      return NextResponse.json({ movies });
    }

    if (type === 'genre' && genre) {
      const genreInfo = getGenreById(genre);
      if (!genreInfo) {
        return NextResponse.json(
          { error: 'Invalid genre' },
          { status: 400 }
        );
      }

      const movies = await fetchMoviesByGenre(genre);
      return NextResponse.json({ movies, genre: genreInfo });
    }

    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}
