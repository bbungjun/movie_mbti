'use client';

import Link from 'next/link';
import { GENRES } from '@/constants/genres';

export default function GenreSelector() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 p-4 md:grid-cols-3">
      {GENRES.map((genre) => (
        <Link
          key={genre.id}
          href={`/genre/${genre.id}`}
          className={`flex min-h-[140px] flex-col items-center justify-center rounded-lg bg-gradient-to-br ${genre.color} p-6 text-center hover:scale-[1.02]`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded bg-black/20 text-xl font-black text-white">
            {genre.icon}
          </span>
          <span className="mt-3 text-xl font-bold text-white">{genre.name}</span>
          <span className="mt-1 text-sm text-white/75">8강 토너먼트</span>
        </Link>
      ))}
    </div>
  );
}
