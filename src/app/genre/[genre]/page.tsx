import Link from 'next/link';
import { notFound } from 'next/navigation';
import WorldCup from '@/components/WorldCup';
import { fetchMoviesByGenre, getGenreById } from '@/lib/tmdb';

interface GenrePageProps {
  params: { genre: string };
}

export async function generateMetadata({ params }: GenrePageProps) {
  const genre = getGenreById(params.genre);
  if (!genre) {
    return { title: '장르를 찾을 수 없습니다' };
  }

  return {
    title: `${genre.name} 월드컵 | MovieCup`,
    description: `${genre.name} 장르 영화 8강 토너먼트`,
  };
}

export default async function GenrePage({ params }: GenrePageProps) {
  const genre = getGenreById(params.genre);

  if (!genre) {
    notFound();
  }

  const movies = await fetchMoviesByGenre(params.genre, 8);

  if (movies.length < 8) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <div className="text-center">
          <p className="mb-4 text-xl text-red-300">영화를 불러올 수 없습니다.</p>
          <Link href="/" className="text-red-200 underline">
            메인으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return <WorldCup genre={params.genre} movies={movies} />;
}
