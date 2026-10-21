type IndexedTopic = { url: string; title: string };
type TrackData = { topics: object; order: string[]; chapters: { topics: { url: string }[] }[] };

// The lookups a lesson page makes in its track's generated JSON (src/generated/<track>.json), keyed by page url.
export function trackIndex<T extends IndexedTopic>(data: TrackData) {
  const byUrl = new Map(Object.values(data.topics as Record<string, T>).map((t) => [t.url, t]));
  return {
    topicAt: (url: string) => byUrl.get(url),
    nextAfter: (url: string) => byUrl.get(data.order[data.order.indexOf(url) + 1]),
    // 1-based chapter and lesson numbers. Found by url, so two chapters may share a title.
    position(url: string) {
      const chapterNo = data.chapters.findIndex((c) => c.topics.some((t) => t.url === url)) + 1;
      const topics = data.chapters[chapterNo - 1]?.topics ?? [];
      return { chapterNo, lessonNo: topics.findIndex((t) => t.url === url) + 1, lessonCount: topics.length };
    },
  };
}
