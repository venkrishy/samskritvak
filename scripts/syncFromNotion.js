#!/usr/bin/env node

/**
 * Sync script to pull content from Notion and update local cache
 * This script fetches all published lessons from Notion and creates a cache file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import NotionService from '../src/services/notionService.js';
import ContentParser from '../src/services/contentParser.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class NotionSync {
  constructor() {
    this.notionService = new NotionService();
    this.cachePath = path.join(__dirname, '..', 'src', 'data', 'notionCache.json');
    this.syncLog = [];
  }

  /**
   * Main sync function
   */
  async sync() {
    console.log('🔄 Starting sync from Notion...');
    
    try {
      // Fetch all published lessons from Notion
      const notionPages = await this.notionService.getAllLessons();
      console.log(`📚 Found ${notionPages.length} published lessons in Notion`);
      
      const syncedLessons = {};
      
      // Process each lesson
      for (const page of notionPages) {
        try {
          const lessonData = await this.syncLesson(page);
          if (lessonData) {
            syncedLessons[lessonData.lessonId] = lessonData;
            console.log(`✅ Synced: ${lessonData.title}`);
          }
        } catch (error) {
          console.error(`❌ Failed to sync lesson:`, error.message);
          this.syncLog.push({
            error: error.message,
            timestamp: new Date().toISOString()
          });
        }
        
        // Add delay to respect rate limits
        await this.delay(350);
      }
      
      // Save cache file
      await this.saveCache(syncedLessons);
      
      console.log('✅ Sync completed successfully!');
      console.log(`📊 Synced ${Object.keys(syncedLessons).length} lessons`);
      
    } catch (error) {
      console.error('❌ Sync failed:', error);
      process.exit(1);
    }
  }

  /**
   * Sync a single lesson from Notion
   */
  async syncLesson(page) {
    try {
      // Get page properties
      const properties = page.properties;
      const lessonId = this.extractText(properties.LessonID?.rich_text);
      const title = this.extractText(properties.Title?.title);
      const category = properties.Category?.select?.name;
      const level = properties.Level?.select?.name;
      const imageUrl = properties.ImageURL?.url;
      const order = properties.Order?.number;
      
      if (!lessonId || !title) {
        console.warn(`⚠️  Skipping page with missing LessonID or Title: ${page.id}`);
        return null;
      }
      
      // Fetch page content (blocks)
      const blocks = await this.notionService.getPageContent(page.id);
      
      // Parse content
      const parsedContent = ContentParser.parseLessonBlocks(blocks);
      
      // Transform to component props
      const lessonMetadata = {
        title,
        subtitle: 'Learning essential concepts',
        level: level || 'Beginner',
        progress: 50,
        imageUrl: imageUrl || '/images/placeholder.png'
      };
      
      const componentProps = ContentParser.transformToComponentProps(parsedContent, lessonMetadata);
      
      // Create lesson data structure
      const lessonData = {
        lessonId,
        title,
        category,
        level,
        imageUrl,
        order,
        notionPageId: page.id,
        lastModified: page.last_edited_time,
        content: componentProps,
        rawBlocks: blocks // Keep raw blocks for debugging
      };
      
      this.syncLog.push({
        lessonId,
        title,
        status: 'success',
        timestamp: new Date().toISOString()
      });
      
      return lessonData;
      
    } catch (error) {
      console.error(`❌ Error syncing lesson:`, error.message);
      this.syncLog.push({
        error: error.message,
        timestamp: new Date().toISOString()
      });
      return null;
    }
  }

  /**
   * Extract text from Notion rich text
   */
  extractText(richText) {
    if (!richText) return '';
    return richText.map(item => item.plain_text).join('');
  }

  /**
   * Save cache file
   */
  async saveCache(lessons) {
    const cacheData = {
      lastSync: new Date().toISOString(),
      version: '1.0.0',
      lessons,
      syncLog: this.syncLog
    };
    
    // Ensure directory exists
    const cacheDir = path.dirname(this.cachePath);
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    
    // Write cache file
    fs.writeFileSync(this.cachePath, JSON.stringify(cacheData, null, 2));
    console.log(`💾 Cache saved to: ${this.cachePath}`);
  }

  /**
   * Load existing cache
   */
  loadCache() {
    try {
      if (fs.existsSync(this.cachePath)) {
        const cacheData = JSON.parse(fs.readFileSync(this.cachePath, 'utf8'));
        return cacheData;
      }
    } catch (error) {
      console.warn('⚠️  Could not load existing cache:', error.message);
    }
    return null;
  }

  /**
   * Get lesson by ID from cache
   */
  getLessonFromCache(lessonId) {
    const cache = this.loadCache();
    if (cache && cache.lessons && cache.lessons[lessonId]) {
      return cache.lessons[lessonId];
    }
    return null;
  }

  /**
   * Check if cache is stale
   */
  isCacheStale(maxAgeHours = 1) {
    const cache = this.loadCache();
    if (!cache || !cache.lastSync) {
      return true;
    }
    
    const lastSync = new Date(cache.lastSync);
    const now = new Date();
    const hoursDiff = (now - lastSync) / (1000 * 60 * 60);
    
    return hoursDiff > maxAgeHours;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run sync if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const sync = new NotionSync();
  sync.sync().catch(console.error);
}

export default NotionSync;
