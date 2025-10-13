#!/usr/bin/env node

/**
 * Migration script to push existing content to Notion
 * This script reads all existing lesson content and creates Notion pages
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import NotionService from '../src/services/notionService.js';
import { curriculumData } from '../src/data/curriculum.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class NotionMigrator {
  constructor() {
    this.notionService = new NotionService();
    this.migrationLog = [];
  }

  /**
   * Main migration function
   */
  async migrate() {
    console.log('🚀 Starting migration to Notion...');
    
    try {
      // Get all lessons from curriculum data
      const allLessons = this.getAllLessonsFromCurriculum();
      console.log(`📚 Found ${allLessons.length} lessons to migrate`);
      
      // Process each lesson
      for (const lesson of allLessons) {
        await this.migrateLesson(lesson);
        // Add delay to respect rate limits
        await this.delay(500);
      }
      
      // Save migration log
      this.saveMigrationLog();
      
      console.log('✅ Migration completed successfully!');
      console.log(`📊 Migrated ${this.migrationLog.length} lessons`);
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  }

  /**
   * Get all lessons from curriculum data
   */
  getAllLessonsFromCurriculum() {
    const lessons = [];
    
    Object.entries(curriculumData).forEach(([categoryId, category]) => {
      category.lessons.forEach(lesson => {
        lessons.push({
          ...lesson,
          categoryId,
          categoryTitle: category.title,
          categoryDescription: category.description
        });
      });
    });
    
    return lessons;
  }

  /**
   * Migrate a single lesson
   */
  async migrateLesson(lesson) {
    try {
      console.log(`📝 Migrating: ${lesson.title}`);
      
      // Read existing content if available
      const content = await this.readLessonContent(lesson);
      
      // Create Notion blocks from content
      const blocks = this.createNotionBlocks(content, lesson);
      
      // Prepare lesson data for Notion
      const lessonData = {
        title: lesson.title,
        lessonId: lesson.id,
        category: this.mapCategoryToNotion(lesson.categoryTitle),
        level: 'Beginner', // Default level
        status: 'Published',
        imageUrl: this.getImageUrl(lesson),
        order: this.getOrder(lesson),
        blocks
      };
      
      // Create page in Notion
      const result = await this.notionService.createLesson(lessonData);
      
      this.migrationLog.push({
        lessonId: lesson.id,
        title: lesson.title,
        notionPageId: result.id,
        status: 'success',
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ Created: ${lesson.title} (${result.id})`);
      
    } catch (error) {
      console.error(`❌ Failed to migrate ${lesson.title}:`, error.message);
      
      this.migrationLog.push({
        lessonId: lesson.id,
        title: lesson.title,
        status: 'failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Read existing lesson content
   */
  async readLessonContent(lesson) {
    const contentPath = path.join(__dirname, '..', 'curriculum', lesson.file);
    
    try {
      if (fs.existsSync(contentPath)) {
        const content = fs.readFileSync(contentPath, 'utf8');
        return this.parseMarkdownContent(content);
      }
    } catch (error) {
      console.warn(`⚠️  Could not read content for ${lesson.title}: ${error.message}`);
    }
    
    // Return default content structure
    return this.getDefaultContent(lesson);
  }

  /**
   * Parse markdown content into structured format
   */
  parseMarkdownContent(content) {
    const lines = content.split('\n');
    const sections = {
      goalAndVocabulary: { content: '', examples: [] },
      tips: { content: '', tips: [] },
      exampleDialogue: { content: '', examples: [] },
      quiz: []
    };
    
    let currentSection = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      // Identify sections by content patterns
      if (trimmed.includes('Numbers') || trimmed.includes('सङ्ख्याः')) {
        currentSection = 'goalAndVocabulary';
        sections.goalAndVocabulary.content = 'Learn Sanskrit numbers and counting';
        continue;
      }
      
      if (trimmed.includes('→') || trimmed.includes('-')) {
        // Parse vocabulary items
        const parts = trimmed.split(/→|-/);
        if (parts.length === 2) {
          sections.goalAndVocabulary.examples.push({
            sanskrit: parts[0].trim(),
            english: parts[1].trim()
          });
        }
      }
    }
    
    return sections;
  }

  /**
   * Get default content structure for lessons without existing content
   */
  getDefaultContent(lesson) {
    return {
      goalAndVocabulary: {
        content: `Learn essential vocabulary and concepts in ${lesson.title.toLowerCase()}.`,
        examples: [
          { sanskrit: 'example (उदाहरण)', english: 'example' },
          { sanskrit: 'practice (अभ्यास)', english: 'practice' }
        ]
      },
      tips: {
        content: 'This is placeholder content that needs to be customized for each lesson.',
        tips: ['Tip 1: Practice regularly', 'Tip 2: Use in conversation']
      },
      exampleDialogue: {
        content: "Here's how you can use the vocabulary in conversation:",
        examples: [
          { sanskrit: 'Person A: example question', english: 'Example question' },
          { sanskrit: 'Person B: example answer', english: 'Example answer' }
        ]
      },
      quiz: [
        {
          question: "What does 'example' mean?",
          options: ['option1', 'option2', 'option3', 'option4'],
          correctAnswer: 'option1',
          explanation: 'This is a placeholder explanation.'
        }
      ]
    };
  }

  /**
   * Create Notion blocks from content
   */
  createNotionBlocks(content, lesson) {
    const blocks = [];
    
    // Goal and Vocabulary section
    blocks.push({
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: 'Goal and Vocabulary' } }]
      }
    });
    
    blocks.push({
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: content.goalAndVocabulary.content } }]
      }
    });
    
    // Add examples as bulleted list
    content.goalAndVocabulary.examples.forEach(example => {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ 
            type: 'text', 
            text: { content: `${example.sanskrit} → ${example.english}` } 
          }]
        }
      });
    });
    
    // Tips section
    blocks.push({
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: 'Tips' } }]
      }
    });
    
    blocks.push({
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: content.tips.content } }]
      }
    });
    
    content.tips.tips.forEach(tip => {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ type: 'text', text: { content: tip } }]
        }
      });
    });
    
    // Example Dialogue section
    blocks.push({
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: 'Example Dialogue' } }]
      }
    });
    
    blocks.push({
      type: 'paragraph',
      paragraph: {
        rich_text: [{ type: 'text', text: { content: content.exampleDialogue.content } }]
      }
    });
    
    content.exampleDialogue.examples.forEach(example => {
      blocks.push({
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [{ 
            type: 'text', 
            text: { content: `${example.sanskrit}: ${example.english}` } 
          }]
        }
      });
    });
    
    // Quiz section
    blocks.push({
      type: 'heading_2',
      heading_2: {
        rich_text: [{ type: 'text', text: { content: 'Quiz Time!' } }]
      }
    });
    
    content.quiz.forEach((quiz, index) => {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `Q: ${quiz.question}` } }]
        }
      });
      
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `A: ${quiz.options.join(' | ')}` } }]
        }
      });
      
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `Correct: ${quiz.correctAnswer}` } }]
        }
      });
      
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ type: 'text', text: { content: `Explanation: ${quiz.explanation}` } }]
        }
      });
    });
    
    return blocks;
  }

  /**
   * Map category to Notion select option
   */
  mapCategoryToNotion(categoryTitle) {
    const mapping = {
      '01 - Foundational': 'Foundational',
      '02 - Pronouns': 'Pronouns',
      '03 - Numbers': 'Numbers',
      '04 - Vocabulary': 'Vocabulary',
      '05 - Grammar': 'Grammar',
      '06 - Time and Calendar': 'Time and Calendar',
      '07 - Verbs': 'Verbs',
      '08 - Directions and Locations': 'Directions and Locations',
      '09 - Conversation': 'Conversation',
      '10 - Advanced': 'Advanced'
    };
    
    return mapping[categoryTitle] || 'Other';
  }

  /**
   * Get image URL for lesson
   */
  getImageUrl(lesson) {
    // Default placeholder image
    return '/images/placeholder.png';
  }

  /**
   * Get order for lesson
   */
  getOrder(lesson) {
    // Simple ordering based on lesson ID
    const orderMap = {
      'basic_conversations': 1,
      'greetings': 2,
      'introductions': 3,
      'basic_numbers': 4,
      'counting_questions': 5,
      'number_practice': 6
    };
    
    return orderMap[lesson.id] || 999;
  }

  /**
   * Save migration log
   */
  saveMigrationLog() {
    const logPath = path.join(__dirname, '..', 'migration-log.json');
    fs.writeFileSync(logPath, JSON.stringify(this.migrationLog, null, 2));
    console.log(`📋 Migration log saved to: ${logPath}`);
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const migrator = new NotionMigrator();
  migrator.migrate().catch(console.error);
}

export default NotionMigrator;
