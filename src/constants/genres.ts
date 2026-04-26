import { Genre } from '@/types';

export const GENRES: Genre[] = [
  { id: 'action', name: '액션', tmdbId: 28, icon: 'A', color: 'from-red-500 to-orange-500' },
  { id: 'romance', name: '로맨스', tmdbId: 10749, icon: 'R', color: 'from-pink-500 to-rose-500' },
  { id: 'thriller', name: '스릴러', tmdbId: 53, icon: 'T', color: 'from-gray-700 to-gray-900' },
  { id: 'horror', name: '공포', tmdbId: 27, icon: 'H', color: 'from-purple-900 to-black' },
  { id: 'scifi', name: 'SF', tmdbId: 878, icon: 'S', color: 'from-blue-600 to-cyan-500' },
  { id: 'comedy', name: '코미디', tmdbId: 35, icon: 'C', color: 'from-yellow-400 to-amber-500' },
];

export function getGenreById(id: string): Genre | undefined {
  return GENRES.find((genre) => genre.id === id);
}
