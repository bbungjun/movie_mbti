'use client';

import { useCallback, useState } from 'react';
import { TasteMbtiResult } from '../types';

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

async function loadKakaoSdk() {
  if (window.Kakao) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Kakao SDK'));
    document.head.appendChild(script);
  });
}

export function useTasteResultShare(result: TasteMbtiResult | null) {
  const [copied, setCopied] = useState(false);
  const [shareNotice, setShareNotice] = useState('');

  const getSharePayload = useCallback(() => {
    if (!result) {
      return null;
    }

    const url = window.location.href;
    const text = `🎬 Netflix 작품 취향 코드: ${result.code}, ${result.title}!`;

    return { url, text };
  }, [result]);

  const copyShareLink = useCallback(
    async (notice = '링크가 복사됐어요') => {
      const payload = getSharePayload();
      if (!payload) {
        return;
      }

      await navigator.clipboard.writeText(`${payload.text}\n${payload.url}`);
      setCopied(true);
      setShareNotice(notice);

      window.setTimeout(() => {
        setCopied(false);
        setShareNotice('');
      }, 1800);
    },
    [getSharePayload]
  );

  const handleNativeShare = useCallback(async () => {
    const payload = getSharePayload();
    if (!payload) {
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: 'Netflix 작품 취향 코드 결과',
        text: payload.text,
        url: payload.url,
      });
      return;
    }

    await copyShareLink();
  }, [copyShareLink, getSharePayload]);

  const handleInstagramShare = useCallback(async () => {
    await copyShareLink(
      '링크를 복사했어요. 인스타 DM이나 스토리에 붙여넣어 공유해보세요.'
    );
    window.open(
      'https://www.instagram.com/direct/inbox/',
      '_blank',
      'noopener,noreferrer'
    );
  }, [copyShareLink]);

  const handleKakaoShare = useCallback(async () => {
    const payload = getSharePayload();
    const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

    if (!payload || !result) {
      return;
    }

    if (!kakaoKey) {
      await copyShareLink('카카오 JavaScript 키가 없어 링크를 복사했어요.');
      return;
    }

    try {
      await loadKakaoSdk();

      if (!window.Kakao) {
        throw new Error('Kakao SDK is unavailable');
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }

      window.Kakao.Share?.sendDefault({
        objectType: 'feed',
        content: {
          title: `🎬 Netflix 작품 취향 코드: ${result.code}`,
          description: `${result.title} - ${result.subtitle}`,
          imageUrl: `${window.location.origin}/placeholder-poster.svg`,
          link: {
            mobileWebUrl: payload.url,
            webUrl: payload.url,
          },
        },
        buttons: [
          {
            title: '결과 보러가기',
            link: {
              mobileWebUrl: payload.url,
              webUrl: payload.url,
            },
          },
        ],
      });
    } catch {
      await copyShareLink(
        '카카오 공유를 열 수 없어 링크를 대신 복사했어요.'
      );
    }
  }, [copyShareLink, getSharePayload, result]);

  return {
    copied,
    shareNotice,
    handleNativeShare,
    handleInstagramShare,
    handleKakaoShare,
  };
}
