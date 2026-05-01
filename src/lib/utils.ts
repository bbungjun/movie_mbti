function createUuid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function generateSessionId(): string {
  if (typeof window === 'undefined') {
    return createUuid();
  }

  const existingSession = localStorage.getItem('movieCupSession');
  if (existingSession) {
    return existingSession;
  }

  const newSession = createUuid();
  localStorage.setItem('movieCupSession', newSession);
  return newSession;
}

export function createNewSession(): string {
  const newSession = createUuid();
  if (typeof window !== 'undefined') {
    localStorage.setItem('movieCupSession', newSession);
  }
  return newSession;
}

export function getTMDBImageUrl(
  path: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) {
    return '/placeholder-poster.svg';
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getTMDBPosterSrcSet(path: string | null): string | undefined {
  if (!path) {
    return undefined;
  }

  return [
    `${getTMDBImageUrl(path, 'w185')} 185w`,
    `${getTMDBImageUrl(path, 'w342')} 342w`,
    `${getTMDBImageUrl(path, 'w500')} 500w`,
  ].join(', ');
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
