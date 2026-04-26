'use client';

import { useRouter } from 'next/navigation';
import { getGenreById } from '@/constants/genres';
import { getRoundName } from '@/lib/utils';
import { Movie } from '@/types';
import { useTournament } from '@/hooks/useTournament';
import MovieCard from './MovieCard';

interface WorldCupProps {
  genre: string;
  movies: Movie[];
}

export default function WorldCup({ genre, movies }: WorldCupProps) {
  const router = useRouter();
  const { matchState, isTransitioning, selectedMovie, progress, handleSelect } = useTournament(movies, genre);
  const genreInfo = getGenreById(genre);

  const onMovieSelect = async (winner: Movie) => {
    const resultId = await handleSelect(winner);
    if (resultId) {
      router.push(`/result/${resultId}`);
    }
  };

  if (!matchState) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  const { round, matchNumber, movieA, movieB } = matchState;

  return (
    <div className="min-h-screen bg-zinc-950 px-3 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-black text-white">{genreInfo?.name ?? genre} 월드컵</h1>
        <div className="mt-2 text-xl font-bold text-yellow-300">{getRoundName(round)}</div>
        <div className="mt-1 text-sm text-zinc-400">
          {matchNumber} / {progress.totalMatchesInRound} 경기
        </div>
        <div className="mx-auto mt-3 h-2 max-w-md overflow-hidden rounded bg-zinc-800">
          <div className="h-full bg-yellow-400" style={{ width: `${progress.percentage}%` }} />
        </div>
      </div>

      <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 md:gap-8">
        <div className={`flex flex-1 justify-center ${isTransitioning && selectedMovie?.id !== movieA.id ? 'opacity-30' : ''}`}>
          <MovieCard movie={movieA} onClick={() => onMovieSelect(movieA)} selected={selectedMovie?.id === movieA.id} size="lg" />
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500 font-black text-white md:h-16 md:w-16">
          VS
        </div>
        <div className={`flex flex-1 justify-center ${isTransitioning && selectedMovie?.id !== movieB.id ? 'opacity-30' : ''}`}>
          <MovieCard movie={movieB} onClick={() => onMovieSelect(movieB)} selected={selectedMovie?.id === movieB.id} size="lg" />
        </div>
      </div>
    </div>
  );
}
