'use client';

import { useParams } from 'next/navigation';
import { TasteResultView } from '@/features/taste/components/TasteResultView';

export default function ResultPage() {
  const params = useParams();

  return <TasteResultView resultId={params.id as string} />;
}
