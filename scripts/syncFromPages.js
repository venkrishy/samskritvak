import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import PageBasedNotionService from '../src/services/pageBasedNotionService.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PageBasedNotionSync {
  constructor() {
    this.notionService = new PageBasedNotionService();
    this.cachePath = path.join(__dirname, '..', 'src', 'data', 'notionCache.json');
  }

  /**
   * Define the lesson titles to search for
   */
  getLessonTitles() {
    return [
      'Greetings and Identity',
      'Basic Conversations',
      'Naming Things & Asking \'Is It There?\'',
      // Add more lesson titles as needed
    ];
  }

  /**
   * Sync lessons from individual Notion pages
   */
  async sync() {
    console.log('🔄 Starting page-based sync from Notion...');
    
    try {
      const lessonTitles = this.getLessonTitles();
      console.log(`📚 Looking for ${lessonTitles.length} lesson pages`);
      
      // Get all lessons from pages
      const lessons = await this.notionService.getAllLessons(lessonTitles);
      
      if (Object.keys(lessons).length === 0) {
        console.log('❌ No lessons found');
        return;
      }

      // Create cache structure
      const cacheData = {
        lastSync: new Date().toISOString(),
        version: '1.0.0',
        lessons: lessons
      };

      // Save cache
      fs.writeFileSync(this.cachePath, JSON.stringify(cacheData, null, 2));
      console.log(`💾 Cache saved to: ${this.cachePath}`);
      
      console.log('✅ Page-based sync completed successfully!');
      console.log(`📊 Synced ${Object.keys(lessons).length} lessons`);
      
      // Log synced lessons
      for (const [lessonId, lesson] of Object.entries(lessons)) {
        console.log(`✅ Synced: ${lesson.title}`);
      }
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      throw error;
    }
  }
}

// Run the sync
const sync = new PageBasedNotionSync();
sync.sync().catch(console.error);

