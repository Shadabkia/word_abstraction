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
  getLevelAsPost(levelId: string) {
    const level = this.getLevel(levelId);
    if (!level) return null;

    return {
      levelId: level.id,
      author: {
        name: 'Kian',
        username: '@kian_ontheroad',
        avatar: '',
      },
      location: level.location,
      timestamp: level.timestamp,
      slides: level.slides,
      caption: level.caption,
      likes: level.likes,
      comments: level.comments,
      gameId: 'word-connect',
      gameLevelNumber: level.wordConnectLevel,
    };
  }
}

// Singleton instance
export const campaignManager = new CampaignManager();

