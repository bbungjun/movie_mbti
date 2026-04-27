import { getTMDBImageUrl } from '@/lib/utils';
import { TasteHomePoster } from '@/features/taste/components/TasteHomePoster';
import { TasteTestFlow } from '@/features/taste/components/TasteTestFlow';
import { STREAMING_CONTENTS } from '@/features/taste/data/streamingContents';

export default function Home() {
  const featuredContent =
    STREAMING_CONTENTS.find((content) => content.id === 'when-life-gives-you-tangerines') ??
    STREAMING_CONTENTS[0];

  return (
    <main className="bg-netflix-black">
      <TasteHomePoster
        posterUrl={getTMDBImageUrl(featuredContent.posterPath, 'w780')}
        startHref="#taste-test"
      />

      <div id="taste-test">
        <TasteTestFlow />
      </div>
    </main>
  );
}
