'use client';

import { useState, useEffect, useCallback } from 'react';
import { Movie, GameLog } from '@/types';
import { shuffleArray, createNewSession } from '@/lib/utils';
import { logGameAction, saveGameResult } from '@/lib/supabase';
import { fetchSimilarMovies } from '@/lib/tmdb';

export interface MatchState {
  round: number;
  matchNumber: number;
  movieA: Movie;
  movieB: Movie;
  roundMovies: Movie[];
  winners: Movie[];
}

export interface TournamentProgress {
  completedMatches: number;
  totalMatches: number;
  percentage: number;
  totalMatchesInRound: number;
}

export interface UseTournamentReturn {
  matchState: MatchState | null;
  sessionId: string;
  isTransitioning: boolean;
  selectedMovie: Movie | null;
  progress: TournamentProgress;
  handleSelect: (winner: Movie) => Promise<string | null>;
}

export function useTournament(movies: Movie[], genre: string): UseTournamentReturn {
  const [sessionId] = useState(() => createNewSession());
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [matchStartTime, setMatchStartTime] = useState<number>(Date.now());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Initialize the tournament
  useEffect(() => {
    if (movies.length === 8) {
      const shuffled = shuffleArray(movies);
      setMatchState({
        round: 8,
        matchNumber: 1,
        movieA: shuffled[0],
        movieB: shuffled[1],
        roundMovies: shuffled,
        winners: [],
      });
      setMatchStartTime(Date.now());
    }
  }, [movies]);

  const handleSelect = useCallback(
    async (winner: Movie): Promise<string | null> => {
      if (!matchState || isTransitioning) return null;

      setIsTransitioning(true);
      setSelectedMovie(winner);

      const timeSpent = Date.now() - matchStartTime;
      const { round, matchNumber, movieA, movieB, roundMovies, winners } = matchState;

      // Log the selection
      const log: GameLog = {
        sessionId,
        genre,
        round,
        movieAId: movieA.id,
        movieBId: movieB.id,
        winnerId: winner.id,
        timeSpentMs: timeSpent,
      };
      await logGameAction(log);

      // Add winner to current round winners
      const newWinners = [...winners, winner];

      // Short delay for visual feedback
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if round is complete
      const totalMatchesInRound = round / 2;
      const isRoundComplete = matchNumber === totalMatchesInRound;

      if (isRoundComplete) {
        // Check if tournament is complete (finals just ended)
        if (round === 2) {
          // Tournament complete!
          const runnerUp = winner.id === movieA.id ? movieB : movieA;

          // Fetch similar movies for recommendations
          const recommendations = await fetchSimilarMovies(winner.id, 3);

          // Save result and return result ID
          const resultId = await saveGameResult({
            sessionId,
            genre,
            winner,
            runnerUp,
            recommendations,
          });

          return resultId;
        }

        // Move to next round
        const nextRound = round / 2;
        const shuffledWinners = shuffleArray(newWinners);

        setMatchState({
          round: nextRound,
          matchNumber: 1,
          movieA: shuffledWinners[0],
          movieB: shuffledWinners[1],
          roundMovies: shuffledWinners,
          winners: [],
        });
      } else {
        // Next match in same round
        const nextMatchIndex = matchNumber * 2;

        setMatchState({
          round,
          matchNumber: matchNumber + 1,
          movieA: roundMovies[nextMatchIndex],
          movieB: roundMovies[nextMatchIndex + 1],
          roundMovies,
          winners: newWinners,
        });
      }

      setMatchStartTime(Date.now());
      setSelectedMovie(null);
      setIsTransitioning(false);

      return null;
    },
    [matchState, isTransitioning, matchStartTime, sessionId, genre]
  );

  // Calculate progress
  const calculateProgress = (): TournamentProgress => {
    if (!matchState) {
      return {
        completedMatches: 0,
        totalMatches: 7,
        percentage: 0,
        totalMatchesInRound: 4,
      };
    }

    const { round, matchNumber } = matchState;
    const totalMatches = 4 + 2 + 1; // 8강(4) + 4강(2) + 결승(1)
    const totalMatchesInRound = round / 2;

    const completedMatches =
      (round === 8 ? matchNumber - 1 : 4) +
      (round === 4 ? matchNumber - 1 : round === 2 ? 2 : 0) +
      (round === 2 ? matchNumber - 1 : 0);

    return {
      completedMatches,
      totalMatches,
      percentage: (completedMatches / totalMatches) * 100,
      totalMatchesInRound,
    };
  };

  return {
    matchState,
    sessionId,
    isTransitioning,
    selectedMovie,
    progress: calculateProgress(),
    handleSelect,
  };
}
