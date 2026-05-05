import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import type { TasteAnalyticsContent, TasteAnalyticsResult } from '@/features/taste/types';

interface RatingAnalyticsRow {
  content_id: string;
  rating: number | string;
}

const VALID_CODE_PATTERN = /^[A-Z]{3}$/;
const DEFAULT_LIMIT = 6;

function getLimit(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return DEFAULT_LIMIT;
  }

  return Math.min(12, Math.max(1, Math.floor(parsed)));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code')?.toUpperCase() ?? '';
  const limit = getLimit(searchParams.get('limit'));

  if (!VALID_CODE_PATTERN.test(code)) {
    return NextResponse.json(
      { error: 'Invalid taste code.' },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('taste_ratings')
      .select('content_id, rating, taste_results!inner(mbti_code)')
      .eq('taste_results.mbti_code', code);

    if (error) {
      throw error;
    }

    const ratingBuckets = new Map<string, { total: number; votes: number }>();

    (data as RatingAnalyticsRow[] | null ?? []).forEach((row) => {
      const rating = Number(row.rating);

      if (!row.content_id || !Number.isFinite(rating)) {
        return;
      }

      const bucket = ratingBuckets.get(row.content_id) ?? { total: 0, votes: 0 };
      bucket.total += rating;
      bucket.votes += 1;
      ratingBuckets.set(row.content_id, bucket);
    });

    const topRatedContents: TasteAnalyticsContent[] = Array.from(
      ratingBuckets.entries()
    )
      .map(([contentId, bucket]) => ({
        contentId,
        averageRating: Number((bucket.total / bucket.votes).toFixed(2)),
        votes: bucket.votes,
      }))
      .sort((left, right) => {
        if (right.averageRating !== left.averageRating) {
          return right.averageRating - left.averageRating;
        }

        return right.votes - left.votes;
      })
      .slice(0, limit);

    const result: TasteAnalyticsResult = {
      code,
      topRatedContents,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to load taste analytics', error);

    return NextResponse.json(
      { error: 'Failed to load taste analytics.' },
      { status: 500 }
    );
  }
}
