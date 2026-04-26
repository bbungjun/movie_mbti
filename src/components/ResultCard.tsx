'use client';

import Image from 'next/image';
import { Movie } from '@/types';
import { formatRating, getTMDBImageUrl } from '@/lib/utils';

interface ResultCardProps {
  movie: Movie;
  rank: 1 | 2;
}

export default function ResultCard({ movie, rank }: ResultCardProps) {
  const isWinner = rank === 1;

  return (
    <div className={`overflow-hidden rounded-lg border ${isWinner ? 'border-yellow-400' : 'border-white/10'} bg-zinc-900`}>
      <div className="relative aspect-[2/3] bg-zinc-800">
        <Image
          src={getTMDBImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 200px, 300px"
        />
        <div className={`absolute left-3 top-3 rounded px-3 py-1 text-sm font-black ${isWinner ? 'bg-yellow-400 text-zinc-950' : 'bg-zinc-700 text-white'}`}>
          {rank}위
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-center text-lg font-bold text-white">{movie.title}</h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          평점 {formatRating(movie.vote_average)} · {movie.release_date?.split('-')[0]}
        </p>
      </div>
    </div>
  );
}
