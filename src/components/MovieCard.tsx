'use client';

import Image from 'next/image';
import { Movie } from '@/types';
import { formatRating, getTMDBImageUrl } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  selected?: boolean;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function MovieCard({
  movie,
  onClick,
  selected = false,
  showDetails = false,
  size = 'md',
}: MovieCardProps) {
  const sizeClasses = {
    sm: 'w-32 md:w-40',
    md: 'w-40 md:w-52',
    lg: 'w-44 md:w-64',
  };

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses[size]} overflow-hidden rounded-lg bg-zinc-900 ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''} ${selected ? 'ring-4 ring-yellow-400' : ''}`}
    >
      <div className="relative aspect-[2/3] bg-zinc-800">
        <Image
          src={getTMDBImageUrl(movie.poster_path, 'w500')}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 176px, 256px"
        />
        <div className="absolute right-2 top-2 rounded bg-black/70 px-2 py-1 text-xs font-bold text-yellow-300">
          {formatRating(movie.vote_average)}
        </div>
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold text-white">{movie.title}</h3>
        {showDetails && <p className="mt-1 text-xs text-zinc-400">{movie.release_date?.split('-')[0]}</p>}
      </div>
    </div>
  );
}
