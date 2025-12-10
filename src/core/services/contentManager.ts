import npcsData from '../../assets/content/npcs.json';
import postsData from '../../assets/content/posts.json';
import messagesData from '../../assets/content/messages.json';
import chaptersData from '../../assets/content/chapters.json';
import { StoryPost, MessageThread, Chapter, NPC } from '../domain/types';

/**
 * Content Manager - Loads and provides access to narrative content
 */
class ContentManager {
  private npcs: NPC[] = [];
  private posts: StoryPost[] = [];
  private messageThreads: MessageThread[] = [];
  private chapters: Chapter[] = [];

  constructor() {
    this.loadContent();
  }

  private loadContent() {
    this.npcs = npcsData.npcs as NPC[];
    this.posts = postsData.posts as StoryPost[];
    this.messageThreads = messagesData.threads as MessageThread[];
    this.chapters = chaptersData.chapters as Chapter[];
  }

  /**
   * Get all NPCs
   */
  getNPCs(): NPC[] {
    return this.npcs;
  }

  /**
   * Get NPC by ID
   */
  getNPC(id: string): NPC | undefined {
    return this.npcs.find(npc => npc.id === id);
  }

  /**
   * Get unlocked posts based on completed levels
   */
  getUnlockedPosts(completedLevels: string[]): StoryPost[] {
    return this.posts.filter(post => {
      if (!post.unlockCondition) return true; // Always visible if no condition
      
      if (post.unlockCondition.type === 'level_complete') {
        return completedLevels.includes(post.unlockCondition.targetId);
      }
      
      return false;
    });
  }

  /**
   * Get all posts (for testing)
   */
  getAllPosts(): StoryPost[] {
    return this.posts;
  }

  /**
   * Get unlocked message threads based on progress
   */
  getUnlockedThreads(completedLevels: string[]): MessageThread[] {
    return this.messageThreads.map(thread => {
      // Filter messages based on unlock conditions
      const unlockedMessages = thread.messages.filter(msg => {
        if (!msg.unlockCondition) return true;
        
        if (msg.unlockCondition.type === 'level_complete') {
          return completedLevels.includes(msg.unlockCondition.targetId);
        }
        
        return false;
      });

      // Return thread with filtered messages
      return {
        ...thread,
        messages: unlockedMessages,
        unreadCount: unlockedMessages.filter(m => !m.isRead).length,
        lastMessagePreview: unlockedMessages[unlockedMessages.length - 1]?.text || '',
        lastMessageTime: unlockedMessages[unlockedMessages.length - 1]?.timestamp || 0,
      };
    }).filter(thread => thread.messages.length > 0); // Only show threads with at least one unlocked message
  }

  /**
   * Get thread by ID
   */
  getThread(threadId: string, completedLevels: string[]): MessageThread | undefined {
    const threads = this.getUnlockedThreads(completedLevels);
    return threads.find(t => t.id === threadId);
  }

  /**
   * Get all chapters
   */
  getChapters(): Chapter[] {
    return this.chapters;
  }

  /**
   * Get unlocked chapters based on progress
   */
  getUnlockedChapters(completedLevels: string[]): Chapter[] {
    return this.chapters.filter(chapter => {
      if (!chapter.requiredLevelId) return true; // Chapter 1 is always unlocked
      return completedLevels.includes(chapter.requiredLevelId);
    });
  }
}

// Singleton instance
export const contentManager = new ContentManager();

