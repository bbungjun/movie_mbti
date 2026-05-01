import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '넷플릭스 시리즈로 알아보는 작품 취향 코드',
  description: '한국 Netflix 오리지널 20개에 별점을 매기고 당신만의 콘텐츠 취향 코드와 추천 작품을 확인해보세요.',
  keywords: ['넷플릭스', '취향 테스트', '작품 취향', 'OTT 추천', '콘텐츠 추천', '오징어게임', '더글로리'],
  openGraph: {
    title: 'Netflix 작품 취향 코드',
    description: '한국 Netflix 오리지널 20개로 알아보는 4글자 취향 테스트',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Netflix 작품 취향 코드',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Netflix 작품 취향 코드',
    description: '한국 Netflix 오리지널 20개로 알아보는 4글자 취향 테스트',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Netflix Taste Code',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: '#141414',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${notoSansKr.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body className="bg-netflix-black font-sans text-white antialiased safe-top safe-bottom">
        {children}
      </body>
    </html>
  );
}
