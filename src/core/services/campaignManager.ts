import campaignData from '../../assets/content/campaign.json';

export interface CampaignLevel {
  id: string;
  levelNumber: number;
  wordConnectLevel: number;
  title: string;
  titleEn: string;
  location: string;
  timestamp: string;
  slides: PostSlide[];
  caption: string;
  captionEn?: string;
  likes: number;
  comments: Comment[];
}

export interface PostSlide {
  type: 'cover' | 'story' | 'game';
  title?: string;
  text?: string;
  image?: string;
  backgroundColor?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  likes: number;
}

export interface CampaignChapter {
  id: string;
  index: number;
  title: string;
  subtitle: string;
  description: string;
  city: string;
  color: string;
  levels: CampaignLevel[];
}

interface CampaignData {
  version: string;
  chapters: CampaignChapter[];
}

// --- Narrative content (per-level JSON + assets) ---
type SocialComicSlide = {
  id: string;
  title?: string;
  panelCount?: number;
  image?: string; // asset path relative to campaign/images
  beats?: string[]; // optional supporting text (often baked into the art)
};

type LevelNarrativeContent = {
  version: number;
  id: string; // e.g. CH1-L01
  level?: {
    campaignLevelId?: string;
    levelNumberInChapter?: number;
    name?: string;
    location?: string;
    time?: string;
    mood?: string[];
    narrativeRole?: string;
  };
  post?: {
    caption?: string;
    comments?: Comment[];
  };
  comic?: {
    slides?: SocialComicSlide[];
  };
  startScreen?: {
    image?: string; // asset path relative to campaign/images
  };
};

export type CampaignPostCarouselSlide =
  | {
      type: 'comic';
      id: string;
      title?: string;
      panelCount?: number;
      imageUrl?: string;
      imageCandidates?: string[];
      beats?: string[];
    }
  | {
      type: 'legacy';
      id: string;
      title?: string;
      text?: string;
      backgroundColor?: string;
      imageUrl?: string;
      imageCandidates?: string[];
    };

export type CampaignLevelPost = {
  levelId: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  location: string;
  timestamp: string;
  carousel: {
    slides: CampaignPostCarouselSlide[];
    startScreenImageUrl?: string;
    startScreenImageCandidates?: string[];
  };
  caption: string;
  likes: number;
  comments: Comment[];
  gameId: string;
  gameLevelNumber: number;
};

const narrativeJsonModules = import.meta.glob('/src/assets/content/campaign/levels/**/*.json', {
  eager: true,
}) as Record<string, { default: LevelNarrativeContent }>;

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function resolveCampaignImage(assetPath?: string): string | undefined {
  if (!assetPath) return undefined;
  // Images live under public/ so they are served from the site root.
  // Example: public/campaign/images/ch1/CH1-L01/slide1.png → /campaign/images/ch1/CH1-L01/slide1.png
  return `/campaign/images/${assetPath}`;
}

const CAMPAIGN_IMAGE_EXTS = ['webp', 'png', 'jpg', 'jpeg', 'svg'] as const;

function uniqueStrings(items: Array<string | undefined | null>) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const i of items) {
    if (!i) continue;
    if (seen.has(i)) continue;
    seen.add(i);
    out.push(i);
  }
  return out;
}

function buildInferredFolder(chapterIndex: number, levelNumberInChapter: number) {
  return `ch${chapterIndex}/CH${chapterIndex}-L${pad2(levelNumberInChapter)}`;
}

function buildAssetCandidates(folder: string, baseName: string) {
  return CAMPAIGN_IMAGE_EXTS.map((ext) => `/campaign/images/${folder}/${baseName}.${ext}`);
}

function getNarrativeKey(chapterIndex: number, levelNumberInChapter: number) {
  return `/src/assets/content/campaign/levels/ch${chapterIndex}/CH${chapterIndex}-L${pad2(
    levelNumberInChapter,
  )}.json`;
}

/**
 * Campaign Content Manager
 * Provides access to campaign chapters, levels, and story content
 */
class CampaignManager {
  private data: CampaignData;

  constructor() {
    this.data = campaignData as CampaignData;
  }

  /**
   * Get all chapters
   */
  getChapters(): CampaignChapter[] {
    return this.data.chapters;
  }

  /**
   * Get chapter by ID
   */
  getChapter(chapterId: string): CampaignChapter | undefined {
    return this.data.chapters.find(ch => ch.id === chapterId);
  }

  /**
   * Get level by campaign level ID
   */
  getLevel(levelId: string): CampaignLevel | undefined {
    for (const chapter of this.data.chapters) {
      const level = chapter.levels.find(l => l.id === levelId);
      if (level) return level;
    }
    return undefined;
  }

  /**
   * Get level by level number (1-10, etc.)
   */
  getLevelByNumber(levelNumber: number): CampaignLevel | undefined {
    for (const chapter of this.data.chapters) {
      const level = chapter.levels.find(l => l.levelNumber === levelNumber);
      if (level) return level;
    }
    return undefined;
  }

  /**
   * Get all levels across all chapters
   */
  getAllLevels(): CampaignLevel[] {
    return this.data.chapters.flatMap(ch => ch.levels);
  }

  /**
   * Get unlocked chapters based on completed levels
   */
  getUnlockedChapters(completedLevelNumbers: number[]): CampaignChapter[] {
    return this.data.chapters.filter((chapter, index) => {
      // Chapter 1 is always unlocked
      if (index === 0) return true;
      
      // Subsequent chapters unlock when previous chapter is complete
      const previousChapter = this.data.chapters[index - 1];
      const previousChapterLevels = previousChapter.levels.map(l => l.levelNumber);
      
      // Check if all levels from previous chapter are completed
      return previousChapterLevels.every(lvl => completedLevelNumbers.includes(lvl));
    });
  }

  /**
   * Get the next level to play in campaign
   */
  getNextLevel(completedLevelNumbers: number[]): CampaignLevel | undefined {
    const allLevels = this.getAllLevels();
    
    // Find the first level that hasn't been completed
    return allLevels.find(level => !completedLevelNumbers.includes(level.levelNumber));
  }

  /**
   * Convert campaign level to post format for LevelPostView
   */
  getLevelAsPost(levelId: string): CampaignLevelPost | null {
    let foundChapter: CampaignChapter | undefined;
    let foundLevel: CampaignLevel | undefined;
    let levelIndexInChapter = -1;

    for (const chapter of this.data.chapters) {
      const idx = chapter.levels.findIndex((l) => l.id === levelId);
      if (idx >= 0) {
        foundChapter = chapter;
        foundLevel = chapter.levels[idx];
        levelIndexInChapter = idx + 1; // 1-based within chapter
        break;
      }
    }

    if (!foundLevel || !foundChapter) return null;

    // Try narrative JSON first (CHx-Lyy)
    const narrativeKey = getNarrativeKey(foundChapter.index, levelIndexInChapter);
    const narrative = narrativeJsonModules[narrativeKey]?.default;

    const caption = narrative?.post?.caption ?? foundLevel.caption;
    const comments = narrative?.post?.comments ?? foundLevel.comments;
    const location = narrative?.level?.location ?? foundLevel.location;

    const inferredFolder = buildInferredFolder(foundChapter.index, levelIndexInChapter);

    const comicSlides = (narrative?.comic?.slides ?? []).map((s, i): CampaignPostCarouselSlide => {
      const explicit = resolveCampaignImage(s.image);
      const inferredCandidates = buildAssetCandidates(inferredFolder, `slide${i + 1}`);
      return {
        type: 'comic',
        id: s.id,
        title: s.title,
        panelCount: s.panelCount,
        imageUrl: explicit,
        imageCandidates: uniqueStrings([explicit, ...inferredCandidates]),
        beats: s.beats,
      };
    });

    const legacyStorySlides = foundLevel.slides
      .filter((s) => s.type !== 'game')
      .map((s, idx): CampaignPostCarouselSlide => {
        const explicit = resolveCampaignImage(s.image);
        const inferredCandidates = buildAssetCandidates(inferredFolder, `slide${idx + 1}`);
        return {
          type: 'legacy',
          id: `legacy_${idx + 1}`,
          title: s.title,
          text: s.text,
          backgroundColor: s.backgroundColor,
          imageUrl: explicit,
          imageCandidates: uniqueStrings([explicit, ...inferredCandidates]),
        };
      });

    const slides =
      comicSlides.length > 0
        ? comicSlides
        : legacyStorySlides.length > 0
          ? legacyStorySlides
          : [
              {
                type: 'legacy',
                id: 'legacy_1',
                title: foundLevel.title,
                text: foundLevel.caption,
                backgroundColor: '#0b0b0f',
              } satisfies CampaignPostCarouselSlide,
            ];

    // If legacy content provides fewer than 4, pad with quiet blanks so the swipe rhythm stays stable.
    const paddedSlides =
      slides.length >= 4
        ? slides
        : [
            ...slides,
            ...Array.from({ length: 4 - slides.length }).map((_, i) => ({
              type: 'legacy' as const,
              id: `pad_${i + 1}`,
              title: '',
              text: '',
              backgroundColor: '#0b0b0f',
            })),
          ];

    return {
      levelId: foundLevel.id,
      author: {
        name: 'Kian',
        username: '@kian_ontheroad',
        avatar: '',
      },
      location,
      timestamp: foundLevel.timestamp,
      carousel: {
        slides: paddedSlides,
        startScreenImageUrl: resolveCampaignImage(narrative?.startScreen?.image),
        startScreenImageCandidates: uniqueStrings([
          resolveCampaignImage(narrative?.startScreen?.image),
          ...buildAssetCandidates(inferredFolder, 'start'),
        ]),
      },
      caption,
      likes: foundLevel.likes,
      comments,
      gameId: 'word-connect',
      gameLevelNumber: foundLevel.wordConnectLevel,
    };
  }
}

// Singleton instance
export const campaignManager = new CampaignManager();

