'use client';

import { getTMDBImageUrl } from '@/lib/utils';
import { TasteHomePoster } from '@/features/taste/components/TasteHomePoster';
import { TasteTestFlow } from '@/features/taste/components/TasteTestFlow';
import { STREAMING_CONTENTS } from '@/features/taste/data/streamingContents';
import { TasteTestProvider, useTasteTest } from '@/features/taste/context/TasteTestContext';

function HomeContent() {
  const { isTestStarted, startTest } = useTasteTest();

  const featuredContent =
    STREAMING_CONTENTS.find(
      (content) => content.id === 'when-life-gives-you-tangerines'
    ) ?? STREAMING_CONTENTS[0];

  return (
    <main className="bg-netflix-black">
      {!isTestStarted ? (
        <TasteHomePoster
          posterUrl={getTMDBImageUrl(featuredContent.posterPath, 'w780')}
          onStart={startTest}
        />
      ) : (
        <div id="taste-test">
          <TasteTestFlow />
        </div>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <TasteTestProvider>
      <HomeContent />
    </TasteTestProvider>
  );
}
