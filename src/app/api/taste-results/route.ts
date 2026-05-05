import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { FALLBACK_RESULT_COPY, RESULT_COPY } from '@/features/taste/data/resultCopy';
import type { TasteMbtiResult } from '@/features/taste/types';

function isTasteResult(value: unknown): value is TasteMbtiResult {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const result = value as Partial<TasteMbtiResult>;
  return (
    typeof result.id === 'string' &&
    typeof result.sessionId === 'string' &&
    typeof result.code === 'string' &&
    Array.isArray(result.ratings) &&
    Array.isArray(result.axisResults)
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing result id.' },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();
    const { data: resultRow, error: resultError } = await supabase
      .from('taste_results')
      .select(
        'id, session_id, mbti_code, axis_results, top_traits, skipped_content_ids, recommended_content_ids, created_at'
      )
      .eq('id', id)
      .single();

    if (resultError || !resultRow) {
      return NextResponse.json(
        { error: 'Taste result not found.' },
        { status: 404 }
      );
    }

    const { data: ratingRows, error: ratingsError } = await supabase
      .from('taste_ratings')
      .select('content_id, rating')
      .eq('result_id', id)
      .order('id', { ascending: true });

    if (ratingsError) {
      throw ratingsError;
    }

    const code = String(resultRow.mbti_code);
    const copy = RESULT_COPY[code] ?? FALLBACK_RESULT_COPY;
    const result: TasteMbtiResult = {
      ...copy,
      code,
      id: resultRow.id,
      sessionId: resultRow.session_id,
      axisResults: resultRow.axis_results,
      topTraits: resultRow.top_traits ?? [],
      ratings: (ratingRows ?? []).map((row) => ({
        contentId: row.content_id,
        rating: Number(row.rating),
      })),
      skippedContentIds: resultRow.skipped_content_ids ?? [],
      recommendedContentIds: resultRow.recommended_content_ids ?? [],
      createdAt: resultRow.created_at,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Failed to load taste result', error);

    return NextResponse.json(
      { error: 'Failed to load taste result.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let result: unknown;

  try {
    result = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request body.' },
      { status: 400 }
    );
  }

  if (!isTasteResult(result)) {
    return NextResponse.json(
      { error: 'Invalid taste result payload.' },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseServerClient();

    const { error: resultError } = await supabase
      .from('taste_results')
      .upsert(
        {
          id: result.id,
          session_id: result.sessionId,
          mbti_code: result.code,
          axis_results: result.axisResults,
          top_traits: result.topTraits,
          skipped_content_ids: result.skippedContentIds,
          recommended_content_ids: result.recommendedContentIds,
          created_at: result.createdAt,
        },
        { onConflict: 'id' }
      );

    if (resultError) {
      throw resultError;
    }

    const ratingRows = result.ratings.map((rating) => ({
      result_id: result.id,
      session_id: result.sessionId,
      content_id: rating.contentId,
      rating: rating.rating,
      created_at: result.createdAt,
    }));

    if (ratingRows.length > 0) {
      const { error: deleteError } = await supabase
        .from('taste_ratings')
        .delete()
        .eq('result_id', result.id);

      if (deleteError) {
        throw deleteError;
      }

      const { error: ratingsError } = await supabase
        .from('taste_ratings')
        .insert(ratingRows);

      if (ratingsError) {
        throw ratingsError;
      }
    }

    return NextResponse.json({ id: result.id }, { status: 201 });
  } catch (error) {
    console.error('Failed to persist taste result', error);

    return NextResponse.json(
      { error: 'Failed to save taste result.' },
      { status: 500 }
    );
  }
}
