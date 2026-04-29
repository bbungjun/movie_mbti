import { describe, expect, it } from 'vitest';
import { STREAMING_CONTENTS } from '../data/streamingContents';
import { selectTestContents } from './selectTestContents';

const POLE_CHECKS = {
  D: (content: (typeof STREAMING_CONTENTS)[number]) =>
    content.profileAxes.dopamine - content.profileAxes.afterglow > 0,
  A: (content: (typeof STREAMING_CONTENTS)[number]) =>
    content.profileAxes.afterglow - content.profileAxes.dopamine > 0,
  C: (content: (typeof STREAMING_CONTENTS)[number]) =>
    content.profileAxes.concept - content.profileAxes.emotionDriven > 0,
  E: (content: (typeof STREAMING_CONTENTS)[number]) =>
    content.profileAxes.emotionDriven - content.profileAxes.concept > 0,
  P: (content: (typeof STREAMING_CONTENTS)[number]) =>
    content.profileAxes.plotDriven - content.profileAxes.relationshipDriven > 0,
  R: (content: (typeof STREAMING_CONTENTS)[number]) =>
    content.profileAxes.relationshipDriven - content.profileAxes.plotDriven > 0,
} as const;

describe('selectTestContents', () => {
  it('returns a deterministic 10-content set with no duplicates', () => {
    const firstSelection = selectTestContents(STREAMING_CONTENTS, 10).map(
      (content) => content.id
    );
    const secondSelection = selectTestContents(STREAMING_CONTENTS, 10).map(
      (content) => content.id
    );

    expect(firstSelection).toEqual(secondSelection);
    expect(firstSelection).toHaveLength(10);
    expect(new Set(firstSelection).size).toBe(10);
  });

  it('covers all six profile poles in the selected set', () => {
    const selected = selectTestContents(STREAMING_CONTENTS, 10);
    const coveredPoles = Object.entries(POLE_CHECKS)
      .filter(([, predicate]) => selected.some((content) => predicate(content)))
      .map(([pole]) => pole);

    expect(coveredPoles).toEqual(
      expect.arrayContaining(['D', 'A', 'C', 'E', 'P', 'R'])
    );
  });
});
