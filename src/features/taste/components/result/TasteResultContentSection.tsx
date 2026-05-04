'use client';

import Link from 'next/link';
import { getTMDBImageUrl, getTMDBPosterSrcSet } from '@/lib/utils';
import { StreamingContent, TasteMbtiResult } from '../../types';
import { getTopTraitLabel } from './tasteResultLabels';

interface RatedContentEntry {
  rating: number;
  content: StreamingContent;
}

interface TasteResultContentSectionProps {
  ratedContents: RatedContentEntry[];
  recommendedContents: StreamingContent[];
  result: TasteMbtiResult;
}

export function TasteResultContentSection({
  ratedContents,
  recommendedContents,
  result,
}: TasteResultContentSectionProps) {
  return (
    <>
      <section className="border-t border-white/5 bg-neutral-950 px-4 py-6 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:gap-8 lg:grid lg:grid-cols-2">
            <div className="space-y-4 md:space-y-6">
              <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 md:rounded-2xl md:p-6">
                <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 md:h-8 md:w-8">
                    <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  크게 반응한 취향
                </h3>
                <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                  {result.topTraits.map((trait) => (
                    <span
                      key={trait}
                      className="shrink-0 rounded-lg border border-netflix-red/30 bg-netflix-red/10 px-3 py-1.5 text-xs font-semibold text-netflix-red md:px-4 md:py-2 md:text-sm"
                    >
                      {getTopTraitLabel(trait)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 md:rounded-2xl md:p-6">
                <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500 md:h-8 md:w-8">
                    <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  별점 상위
                </h3>
                <div className="mt-3 space-y-2 md:mt-4 md:space-y-3">
                  {ratedContents.slice(0, 4).map((item, index) => (
                    <div
                      key={item.content.id}
                      className="flex items-center justify-between rounded-lg bg-white/5 p-3 transition-colors active:bg-white/10 md:rounded-xl md:p-4 md:hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-neutral-400 md:h-6 md:w-6 md:text-xs">
                          {index + 1}
                        </span>
                        <span className="text-sm font-semibold md:text-base">
                          {item.content.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 rounded-lg bg-netflix-red/20 px-2 py-0.5 md:gap-1 md:px-3 md:py-1">
                        <svg className="h-3 w-3 text-netflix-red md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-netflix-red">
                          {item.rating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 md:rounded-2xl md:p-6">
              <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 md:h-8 md:w-8">
                  <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                다음에 볼만한 콘텐츠
              </h3>
              <div className="-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:mt-4 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-2 xl:grid-cols-4">
                {recommendedContents.map((content) => (
                  <article
                    key={content.id}
                    className="w-32 shrink-0 overflow-hidden rounded-lg bg-neutral-800 transition-all duration-300 active:scale-95 md:w-auto md:rounded-xl md:hover:scale-105 md:hover:shadow-card"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      {/* TMDB CDN sizes are enough for these small recommendation posters. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getTMDBImageUrl(content.posterPath, 'w185')}
                        srcSet={getTMDBPosterSrcSet(content.posterPath)}
                        alt={content.title}
                        onError={(event) => {
                          event.currentTarget.src = '/placeholder-poster.svg';
                          event.currentTarget.srcset = '';
                        }}
                        className="absolute inset-0 h-full w-full object-cover"
                        sizes="(max-width: 768px) 128px, 160px"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-2 md:p-3">
                      <h4 className="truncate text-xs font-bold md:text-sm">
                        {content.title}
                      </h4>
                      <p className="mt-0.5 truncate text-[10px] text-neutral-500 md:mt-1 md:text-xs">
                        {content.genres.slice(0, 2).join(', ')}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-netflix-black px-4 py-6 md:py-8">
        <div className="mx-auto max-w-6xl text-center">
          <Link
            href="/"
            className="btn-netflix inline-flex w-full items-center justify-center gap-2 md:w-auto"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            다시 테스트하기
          </Link>
          <p className="mt-4 text-xs text-neutral-600 md:mt-6 md:text-sm">
            본 서비스는 Netflix 공식 서비스가 아닙니다.
          </p>
        </div>
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </footer>
    </>
  );
}
