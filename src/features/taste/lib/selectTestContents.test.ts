import { afterEach, describe, expect, it, vi } from 'vitest';
import { STREAMING_CONTENTS } from '../data/streamingContents';
import { selectTestContents } from './selectTestContents';

describe('selectTestContents', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 10 random contents with no duplicates', () => {
    const selected = selectTestContents(STREAMING_CONTENTS, 10);
    const selectedIds = selected.map((content) => content.id);

    expect(selected).toHaveLength(10);
    expect(new Set(selectedIds).size).toBe(10);
    expect(
      selectedIds.every((id) =>
        STREAMING_CONTENTS.some((content) => content.id === id)
      )
    ).toBe(true);
  });

  it('varies the selected set based on Math.random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const highRandomSelection = selectTestContents(STREAMING_CONTENTS, 10).map(
      (content) => content.id
    );

    vi.restoreAllMocks();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const lowRandomSelection = selectTestContents(STREAMING_CONTENTS, 10).map(
      (content) => content.id
    );

    expect(highRandomSelection).not.toEqual(lowRandomSelection);
  });
});
