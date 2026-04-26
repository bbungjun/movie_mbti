import { GameLog, GameResult } from '@/types';
import {
  clearTasteResults,
  getTasteResult,
  saveTasteResult,
} from '@/features/taste/storage/localTasteResultStorage';

// Supabase client placeholder
// For MVP, we use localStorage. This can be replaced with actual Supabase later.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function isSupabaseAvailable(): boolean {
  return !!SUPABASE_URL && SUPABASE_URL !== 'xxx' && !!SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'xxx';
}

// Log game action (each selection in the tournament)
export async function logGameAction(log: GameLog): Promise<void> {
  // Store in localStorage for now
  if (typeof window !== 'undefined') {
    const logs = JSON.parse(localStorage.getItem('gameLogs') || '[]');
    logs.push({
      ...log,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('gameLogs', JSON.stringify(logs));
  }

  // If Supabase is available, also send to server
  if (isSupabaseAvailable()) {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
    } catch (error) {
      console.error('Failed to log to Supabase:', error);
    }
  }
}

// Save game result
export async function saveGameResult(result: Omit<GameResult, 'id' | 'createdAt'>): Promise<string> {
  const id = crypto.randomUUID();
  const fullResult: GameResult = {
    ...result,
    id,
    createdAt: new Date().toISOString(),
  };

  // Store in localStorage
  if (typeof window !== 'undefined') {
    const results = JSON.parse(localStorage.getItem('gameResults') || '{}');
    results[id] = fullResult;
    localStorage.setItem('gameResults', JSON.stringify(results));
  }

  return id;
}

// Get game result by ID
export function getGameResult(id: string): GameResult | null {
  if (typeof window === 'undefined') return null;

  const results = JSON.parse(localStorage.getItem('gameResults') || '{}');
  return results[id] || null;
}

export { getTasteResult, saveTasteResult };

// Get all logs for a session
export function getSessionLogs(sessionId: string): GameLog[] {
  if (typeof window === 'undefined') return [];

  const logs = JSON.parse(localStorage.getItem('gameLogs') || '[]');
  return logs.filter((log: GameLog & { session_id?: string }) =>
    log.sessionId === sessionId || log.session_id === sessionId
  );
}

// Clear all local data (for testing)
export function clearAllLocalData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gameLogs');
    localStorage.removeItem('gameResults');
    localStorage.removeItem('currentGame');
    localStorage.removeItem('movieCupSession');
    clearTasteResults();
  }
}
