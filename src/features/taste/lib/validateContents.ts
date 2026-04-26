import { StreamingContent } from '../types';

export function validateContents(contents: StreamingContent[]): string[] {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  contents.forEach((content, index) => {
    if (seenIds.has(content.id)) {
      errors.push(`Duplicate content id: ${content.id}`);
    }
    seenIds.add(content.id);

    if (!content.title.trim()) {
      errors.push(`Missing title at index ${index}`);
    }

    if (!content.summary.trim()) {
      errors.push(`Missing summary for ${content.id}`);
    }

    if (!content.posterPath) {
      errors.push(`Missing posterPath for ${content.id}`);
    }

    Object.entries(content.traits).forEach(([trait, value]) => {
      if (value < 0 || value > 100) {
        errors.push(`Trait ${trait} for ${content.id} must be between 0 and 100`);
      }
    });
  });

  return errors;
}
