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
  size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) {
    return '/placeholder-poster.svg';
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
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

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function createBracket<T>(items: T[]): [T, T][] {
  if (items.length !== 8) {
    throw new Error('Tournament requires exactly 8 items');
  }
  const shuffled = shuffleArray(items);
  return [
    [shuffled[0], shuffled[1]],
    [shuffled[2], shuffled[3]],
    [shuffled[4], shuffled[5]],
    [shuffled[6], shuffled[7]],
  ];
}

export function getRoundName(round: number): string {
  switch (round) {
    case 8:
      return '8강';
    case 4:
      return '4강';
    case 2:
      return '결승';
    default:
      return `${round}강`;
  }
}

export function getMatchProgress(round: number, matchNumber: number): string {
  const totalMatches = round / 2;
  return `${matchNumber}/${totalMatches}`;
}
