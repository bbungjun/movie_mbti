'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getTMDBImageUrl } from '@/lib/utils';
import { STREAMING_CONTENTS, getContentById } from '../data/streamingContents';
import { getTasteResult } from '../storage/localTasteResultStorage';
import { TasteAxisResult, TasteMbtiResult } from '../types';

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      init: (key: string) => void;
      Share?: {
        sendDefault: (options: unknown) => void;
      };
    };
  }
}

const TRAIT_LABELS: Record<string, string> = {
  stimulation: '자극과 속도감',
  emotion: '감정선',
  imagination: '세계관',
  realism: '현실감',
  structure: '구조와 완성도',
  relationship: '관계와 캐릭터',
  closure: '완결감',
  novelty: '새로움',
};

interface TasteResultViewProps {
  resultId: string;
}

function getSelectedAxisLabel(axis: TasteAxisResult) {
  return axis.selectedCode === axis.leftCode ? axis.leftLabel : axis.rightLabel;
}

export function TasteResultView({ resultId }: TasteResultViewProps) {
  const [result, setResult] = useState<TasteMbtiResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareNotice, setShareNotice] = useState('');

  useEffect(() => {
    setResult(getTasteResult(resultId));
  }, [resultId]);

  const ratedContents = useMemo(() => {
    if (!result) return [];
    return result.ratings
      .map((rating) => ({
        rating: rating.rating,
        content: getContentById(rating.contentId),
      }))
      .filter((item) => item.content)
      .sort((a, b) => b.rating - a.rating);
  }, [result]);

  const recommendedContents = useMemo(() => {
    if (!result) return [];
    return result.recommendedContentIds
      .map((id) => getContentById(id))
      .filter((content): content is (typeof STREAMING_CONTENTS)[number] => Boolean(content));
  }, [result]);

  const getSharePayload = () => {
    if (!result) return;
    const url = window.location.href;
    const text = `내 Netflix 작품 취향 코드는 ${result.code}, ${result.title}!`;

    return { url, text };
  };

  const copyShareLink = async (notice = '링크가 복사됐어요') => {
    const payload = getSharePayload();
    if (!payload) return;

    await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
    setCopied(true);
    setShareNotice(notice);
    window.setTimeout(() => {
      setCopied(false);
      setShareNotice('');
    }, 1800);
  };

  const handleNativeShare = async () => {
    const payload = getSharePayload();
    if (!payload) return;

    if (navigator.share) {
      await navigator.share({
        title: 'Netflix 작품 취향 코드 결과',
        text: payload.text,
        url: payload.url,
      });
      return;
    }

    await copyShareLink();
  };

  const handleInstagramShare = async () => {
    await copyShareLink('링크를 복사했어요. 인스타 DM에 붙여넣어 공유하세요.');
    window.open('https://www.instagram.com/direct/inbox/', '_blank', 'noopener,noreferrer');
  };

  const loadKakaoSdk = () => {
    return new Promise<void>((resolve, reject) => {
      if (window.Kakao) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Kakao SDK'));
      document.head.appendChild(script);
    });
  };

  const handleKakaoShare = async () => {
    const payload = getSharePayload();
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

    if (!payload || !result) return;

    if (!kakaoKey) {
      await copyShareLink('카카오 JavaScript 키가 없어 링크를 복사했어요.');
      return;
    }

    try {
      await loadKakaoSdk();
      if (!window.Kakao) throw new Error('Kakao SDK is unavailable');
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }

      window.Kakao.Share?.sendDefault({
        objectType: 'feed',
        content: {
          title: `내 Netflix 작품 취향 코드는 ${result.code}`,
          description: `${result.title} - ${result.subtitle}`,
          imageUrl: `${window.location.origin}/placeholder-poster.svg`,
          link: {
            mobileWebUrl: payload.url,
            webUrl: payload.url,
          },
        },
        buttons: [
          {
            title: '결과 보기',
            link: {
              mobileWebUrl: payload.url,
              webUrl: payload.url,
            },
          },
        ],
      });
    } catch {
      await copyShareLink('카카오 공유를 열 수 없어 링크를 복사했어요.');
    }
  };

  if (!result) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-netflix-black px-4 text-white">
        <div className="max-w-sm text-center animate-fade-in">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 md:mb-6 md:h-20 md:w-20">
            <svg className="h-8 w-8 text-neutral-600 md:h-10 md:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black md:text-3xl">결과를 찾을 수 없어요</h1>
          <p className="mt-3 text-sm text-neutral-400 md:mt-4 md:text-base">
            결과는 현재 브라우저에 저장됩니다.<br />
            테스트를 다시 진행해보세요.
          </p>
          <Link
            href="/"
            className="btn-netflix mt-6 inline-flex w-full items-center justify-center gap-2 md:mt-8 md:w-auto"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            테스트 하러 가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-netflix-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-netflix-red/10 via-transparent to-transparent" />
        <div className="absolute -top-20 left-1/2 h-48 w-[500px] -translate-x-1/2 rounded-full bg-netflix-red/10 blur-3xl md:-top-40 md:h-96 md:w-[1000px]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-6 md:pb-12 md:pt-8">
          {/* Back link */}
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-400 transition-colors active:bg-white/10 md:gap-2 md:px-4 md:py-2 md:text-sm md:hover:bg-white/10 md:hover:text-white"
          >
            <svg className="h-3.5 w-3.5 transition-transform group-active:-translate-x-0.5 md:h-4 md:w-4 md:group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            다시 테스트하기
          </Link>

          {/* Result Card - Single column on mobile */}
          <div className="mt-6 flex flex-col gap-6 md:mt-8 lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-8">
            {/* Main Result */}
            <div className="animate-fade-in rounded-2xl border border-netflix-red/20 bg-gradient-to-br from-netflix-red/10 via-neutral-900/90 to-neutral-950/90 p-5 shadow-xl backdrop-blur-sm md:rounded-3xl md:p-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-netflix-red/20 px-3 py-1.5 md:gap-2 md:px-4 md:py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-netflix-red opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-netflix-red" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-netflix-red md:text-sm">
                  작품 취향 코드
                </span>
              </div>

              <h1 className="mt-4 text-5xl font-black tracking-tight text-white md:mt-6 md:text-7xl lg:text-8xl">
                {result.code}
              </h1>
              <h2 className="mt-2 text-2xl font-black text-white md:mt-4 md:text-3xl lg:text-4xl">
                {result.title}
              </h2>
              <p className="mt-1 text-base text-netflix-red md:mt-2 md:text-xl">
                {result.subtitle}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-neutral-300 md:mt-6 md:text-lg">
                {result.description}
              </p>
              <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-relaxed text-neutral-400 md:text-sm">
                이 결과는 작품 평가 패턴을 바탕으로 만든 콘텐츠 취향 분석입니다.
              </p>

              {/* Share buttons - Full width on mobile */}
              <div className="mt-6 space-y-3 md:mt-8">
                <p className="text-xs font-semibold text-neutral-400 md:text-sm">결과 공유하기</p>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={handleInstagramShare}
                    className="group flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 text-sm font-bold text-white transition-transform active:scale-95 md:h-12 md:gap-2 md:hover:scale-105"
                  >
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span className="hidden min-[400px]:inline">인스타</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleKakaoShare}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] text-sm font-bold text-neutral-900 transition-transform active:scale-95 md:h-12 md:gap-2 md:hover:scale-105"
                  >
                    <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3c-5.24 0-9.5 3.262-9.5 7.281 0 2.596 1.753 4.876 4.384 6.139l-.893 3.262c-.072.264.214.49.462.365l3.945-2.357c.534.067 1.082.102 1.602.102 5.24 0 9.5-3.262 9.5-7.281C21.5 6.262 17.24 3 12 3z" />
                    </svg>
                    <span className="hidden min-[400px]:inline">카카오</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 text-sm font-bold text-white transition-all active:scale-95 active:bg-white/10 md:h-12 md:gap-2 md:hover:border-white/40 md:hover:bg-white/10"
                  >
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {copied ? '복사됨' : '공유'}
                  </button>
                </div>
                {shareNotice && (
                  <p className="animate-fade-in text-center text-xs font-medium text-netflix-red md:text-sm">
                    {shareNotice}
                  </p>
                )}
              </div>
            </div>

            {/* Analysis Details */}
            <div className="animate-slide-up space-y-4 md:space-y-6">
              {/* Strengths - Horizontal scroll on mobile */}
              <section className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm md:rounded-2xl md:p-6">
                <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-netflix-red md:h-8 md:w-8">
                    <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  취향 해석
                </h3>
                <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:mt-4 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0">
                  {result.strengths.map((strength) => (
                    <div
                      key={strength}
                      className="shrink-0 rounded-lg bg-white/5 px-4 py-3 text-center transition-colors active:bg-white/10 md:rounded-xl md:p-4 md:hover:bg-white/10"
                    >
                      <p className="whitespace-nowrap text-sm font-semibold text-white md:whitespace-normal">{strength}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-netflix-red/20 bg-netflix-red/5 p-3 md:mt-4 md:rounded-xl md:p-4">
                  <p className="text-sm text-neutral-300">{result.watchStyle}</p>
                </div>
              </section>

              {/* Axis Analysis - 2x2 grid on mobile */}
              <section className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm md:rounded-2xl md:p-6">
                <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 md:h-8 md:w-8">
                    <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </span>
                  분석 축
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2 md:mt-4 md:gap-4">
                  {result.axisResults.map((axis) => (
                    <div key={axis.axis} className="rounded-lg bg-white/5 p-3 md:rounded-xl md:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-400 md:text-sm">{axis.label}</span>
                        <span className="text-lg font-black text-netflix-red md:text-2xl">{axis.selectedCode}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-white md:text-base">
                        {getSelectedAxisLabel(axis)}
                      </p>
                      <p className="mt-1 text-[10px] text-neutral-500 md:text-xs">
                        {axis.leftLabel} ↔ {axis.rightLabel}
                      </p>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-800 md:mt-3 md:h-2">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-netflix-red to-netflix-red-hover transition-all duration-500"
                          style={{
                            width: `${Math.max(
                              12,
                              (Math.max(axis.leftScore, axis.rightScore) /
                                (axis.leftScore + axis.rightScore || 1)) *
                                100
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-[10px] text-neutral-500 md:mt-2 md:text-xs">
                        {axis.confidence === 'mixed'
                          ? '균형형'
                          : axis.confidence === 'medium'
                            ? '조금 더 뚜렷'
                            : '뚜렷함'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Content Analysis Section */}
      <section className="border-t border-white/5 bg-neutral-950 px-4 py-6 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:gap-8 lg:grid lg:grid-cols-2">
            {/* Top Traits & Ratings */}
            <div className="space-y-4 md:space-y-6">
              {/* Top Traits */}
              <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 md:rounded-2xl md:p-6">
                <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500 md:h-8 md:w-8">
                    <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  높게 반응한 취향
                </h3>
                <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                  {result.topTraits.map((trait) => (
                    <span
                      key={trait}
                      className="shrink-0 rounded-lg border border-netflix-red/30 bg-netflix-red/10 px-3 py-1.5 text-xs font-semibold text-netflix-red md:px-4 md:py-2 md:text-sm"
                    >
                      {TRAIT_LABELS[trait] ?? trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Rated - Compact list on mobile */}
              <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 md:rounded-2xl md:p-6">
                <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500 md:h-8 md:w-8">
                    <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  내 별점 상위
                </h3>
                <div className="mt-3 space-y-2 md:mt-4 md:space-y-3">
                  {ratedContents.slice(0, 4).map((item, i) => (
                    <div
                      key={item.content!.id}
                      className="flex items-center justify-between rounded-lg bg-white/5 p-3 transition-colors active:bg-white/10 md:rounded-xl md:p-4 md:hover:bg-white/10"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-neutral-400 md:h-6 md:w-6 md:text-xs">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold md:text-base">{item.content!.title}</span>
                      </div>
                      <div className="flex items-center gap-0.5 rounded-lg bg-netflix-red/20 px-2 py-0.5 md:gap-1 md:px-3 md:py-1">
                        <svg className="h-3 w-3 text-netflix-red md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-netflix-red">{item.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations - Horizontal scroll on mobile */}
            <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 md:rounded-2xl md:p-6">
              <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500 md:h-8 md:w-8">
                  <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
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
                      <Image
                        src={getTMDBImageUrl(content.posterPath, 'w500')}
                        alt={content.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 128px, 160px"
                      />
                    </div>
                    <div className="p-2 md:p-3">
                      <h4 className="truncate text-xs font-bold md:text-sm">{content.title}</h4>
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

      {/* Footer - Sticky CTA on mobile */}
      <footer className="border-t border-white/5 bg-netflix-black px-4 py-6 md:py-8">
        <div className="mx-auto max-w-6xl text-center">
          <Link
            href="/"
            className="btn-netflix inline-flex w-full items-center justify-center gap-2 md:w-auto"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            다시 테스트하기
          </Link>
          <p className="mt-4 text-xs text-neutral-600 md:mt-6 md:text-sm">
            본 서비스는 Netflix 공식 서비스가 아닙니다.
          </p>
        </div>
        {/* Safe area spacer */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </footer>
    </main>
  );
}
