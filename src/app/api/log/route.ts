import { NextRequest, NextResponse } from 'next/server';
import { GameLog } from '@/types';

// This would connect to Supabase in production
// For now, we just acknowledge the log

export async function POST(request: NextRequest) {
  try {
    const log: GameLog = await request.json();

    // Validate required fields
    if (!log.sessionId || !log.genre || !log.winnerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, this would save to Supabase
    // const supabase = createServerClient();
    // await supabase.from('game_logs').insert({
    //   session_id: log.sessionId,
    //   genre: log.genre,
    //   round: log.round,
    //   movie_a_id: log.movieAId,
    //   movie_b_id: log.movieBId,
    //   winner_id: log.winnerId,
    //   time_spent_ms: log.timeSpentMs,
    // });

    console.log('Game log received:', log);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Log API Error:', error);
    return NextResponse.json(
      { error: 'Failed to save log' },
      { status: 500 }
    );
  }
}
