'use client';

import { getTMDBImageUrl, getTMDBPosterSrcSet } from '@/lib/utils';
import { StreamingContent } from '../types';
import { RatingControls } from './RatingControls';

interface TasteContentCardProps {
  content: StreamingContent;
  rating: number;
  isSkipped: boolean;
  onRate: (rating: number) => void;
  onSkip: () => void;
}

export function TasteContentCard({
  content,
  rating,
  isSkipped,
  onRate,
  onSkip,
}: TasteContentCardProps) {
  return (
    <article className="group mx-auto max-w-lg animate-scale-in">
      <div
        className={`overflow-hidden rounded-2xl border bg-neutral-900 shadow-card transition-all duration-300 ${
          isSkipped
            ? 'border-neutral-700'
            : rating > 0
              ? 'border-netflix-red/50 shadow-netflix'
              : 'border-white/10'
        }`}
      >
        {/* Poster Section - Shorter aspect ratio on mobile */}
        <div className="relative aspect-[3/4] overflow-hidden bg-neutral-800 sm:aspect-[2/3]">
          {/* TMDB already serves CDN-resized posters; direct srcSet avoids cold Vercel optimizer hops between cards. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getTMDBImageUrl(content.posterPath, 'w342')}
            srcSet={getTMDBPosterSrcSet(content.posterPath)}
            alt={content.title}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ${
              isSkipped ? 'scale-105 opacity-30 grayscale' : ''
            }`}
            sizes="(max-width: 640px) 92vw, 512px"
            loading="eager"
            decoding="async"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/20 to-transparent" />

          {/* Top badges - Smaller on mobile */}
          <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-3 md:p-4">
            <div className="flex flex-col gap-1.5 md:gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm md:gap-1.5 md:px-3 md:py-1.5 md:text-xs">
                {content.type === 'series' ? (
                  <>
                    <svg className="h-3 w-3 md:h-3.5 md:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                    시리즈
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3 md:h-3.5 md:w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm0 4H4v2h1V9zm-1 4h1v2H4v-2z" clipRule="evenodd" />
                    </svg>
                    영화
                  </>
                )}
              </span>
              <span className="inline-flex rounded-md bg-netflix-red/90 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm md:px-3 md:py-1.5 md:text-xs">
                {content.year}
              </span>
            </div>

            {/* Rating display */}
            {rating > 0 && !isSkipped && (
              <div className="flex items-center gap-0.5 rounded-lg bg-netflix-red px-2 py-1.5 shadow-lg md:gap-1 md:px-3 md:py-2">
                <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-base font-black text-white md:text-lg">{rating}</span>
              </div>
            )}
          </div>

          {/* Skip overlay */}
          {isSkipped && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1.5 rounded-xl bg-black/80 px-6 py-4 backdrop-blur-sm md:gap-2 md:px-8 md:py-6">
                <svg className="h-6 w-6 text-neutral-400 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
                <span className="text-base font-bold text-neutral-300 md:text-lg">아직 안 봤어요</span>
              </div>
            </div>
          )}

          {/* Bottom content info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <h3 className="text-shadow-lg text-2xl font-black text-white md:text-3xl">
              {content.title}
            </h3>
          </div>
        </div>

        {/* Content Section - More compact on mobile */}
        <div className="space-y-4 p-4 md:space-y-5 md:p-5">
          {/* Summary - 2 lines on mobile */}
          <p className="line-clamp-2 text-sm leading-relaxed text-neutral-400">
            {content.summary}
          </p>

          {/* Genre Tags - Scrollable on mobile */}
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:gap-2 md:overflow-visible md:px-0 md:pb-0">
            {content.genres.map((genre) => (
              <span
                key={genre}
                className="shrink-0 rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-neutral-300 md:px-3 md:py-1.5"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Rating Controls */}
          <RatingControls
            rating={rating}
            isSkipped={isSkipped}
            contentTitle={content.title}
            onRate={onRate}
            onSkip={onSkip}
          />
        </div>
      </div>
    </article>
  );
}
