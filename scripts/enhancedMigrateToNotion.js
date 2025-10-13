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

class EnhancedNotionMigrator {
  constructor() {
    this.notionService = new NotionService();
    this.migrationLog = [];
  }

  /**
   * Extract content from React component file
   */
  extractContentFromReactComponent(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const blocks = [];
      
      // Extract ChapterTitleCard content
      const titleMatch = content.match(/title="([^"]+)"/);
      const subtitleMatch = content.match(/subtitle="([^"]+)"/);
      const levelMatch = content.match(/level="([^"]+)"/);
      
      if (titleMatch) {
        blocks.push({
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: titleMatch[1] } }]
          }
        });
      }
      
      if (subtitleMatch) {
        blocks.push({
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: subtitleMatch[1] } }]
          }
        });
      }

      // Extract ExplanationCard content
      const explanationCards = this.extractExplanationCards(content);
      blocks.push(...explanationCards);

      // Extract QuizCard content
      const quizCards = this.extractQuizCards(content);
      blocks.push(...quizCards);

      // Extract ImageCard content
      const imageCards = this.extractImageCards(content);
      blocks.push(...imageCards);

      return blocks;
    } catch (error) {
      console.error(`Error extracting content from ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Extract ExplanationCard components
   */
  extractExplanationCards(content) {
    const blocks = [];
    const explanationRegex = /<ExplanationCard\s+([^>]+)>/g;
    let match;

    while ((match = explanationRegex.exec(content)) !== null) {
      const props = match[1];
      
      // Extract title
      const titleMatch = props.match(/title="([^"]+)"/);
      if (titleMatch) {
        blocks.push({
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: titleMatch[1] } }]
          }
        });
      }

      // Extract content
      const contentMatch = props.match(/content="([^"]+)"/);
      if (contentMatch) {
        // Remove HTML tags and decode entities
        const cleanContent = contentMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
        
        blocks.push({
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: cleanContent } }]
          }
        });
      }

      // Extract examples
      const examplesMatch = props.match(/examples=\[([^\]]+)\]/);
      if (examplesMatch) {
        blocks.push({
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: 'Examples' } }]
          }
        });

        // Parse examples array
        const examplesContent = examplesMatch[1];
        const exampleItems = examplesContent.match(/\{[^}]+\}/g);
        if (exampleItems) {
          for (const item of exampleItems) {
            const sanskritMatch = item.match(/sanskrit:\s*"([^"]+)"/);
            const englishMatch = item.match(/english:\s*"([^"]+)"/);
            
            if (sanskritMatch && englishMatch) {
              blocks.push({
                type: 'bulleted_list_item',
                bulleted_list_item: {
                  rich_text: [
                    { type: 'text', text: { content: `${sanskritMatch[1]} → ${englishMatch[1]}` } }
                  ]
                }
              });
            }
          }
        }
      }

      // Extract tips
      const tipsMatch = props.match(/tips="([^"]+)"/);
      if (tipsMatch) {
        blocks.push({
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: `💡 ${tipsMatch[1]}` } }],
            icon: { emoji: '💡' }
          }
        });
      }
    }

    return blocks;
  }

  /**
   * Extract QuizCard components
   */
  extractQuizCards(content) {
    const blocks = [];
    const quizRegex = /<QuizCard\s+([^>]+)>/g;
    let match;

    while ((match = quizRegex.exec(content)) !== null) {
      const props = match[1];
      
      // Extract question
      const questionMatch = props.match(/question="([^"]+)"/);
      if (questionMatch) {
        blocks.push({
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: 'Quiz Time!' } }]
          }
        });

        blocks.push({
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: questionMatch[1] } }]
          }
        });
      }

      // Extract options
      const optionsMatch = props.match(/options=\[([^\]]+)\]/);
      if (optionsMatch) {
        const optionsContent = optionsMatch[1];
        const optionItems = optionsContent.match(/"([^"]+)"/g);
        if (optionItems) {
          for (const option of optionItems) {
            const cleanOption = option.replace(/"/g, '');
            blocks.push({
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [{ type: 'text', text: { content: cleanOption } }]
              }
            });
          }
        }
      }

      // Extract explanation
      const explanationMatch = props.match(/explanation="([^"]+)"/);
      if (explanationMatch) {
        blocks.push({
          type: 'callout',
          callout: {
            rich_text: [{ type: 'text', text: { content: `💡 ${explanationMatch[1]}` } }],
            icon: { emoji: '💡' }
          }
        });
      }
    }

    return blocks;
  }

  /**
   * Extract ImageCard components
   */
  extractImageCards(content) {
    const blocks = [];
    const imageRegex = /<ImageCard\s+([^>]+)>/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const props = match[1];
      
      // Extract description
      const descriptionMatch = props.match(/description="([^"]+)"/);
      if (descriptionMatch) {
        // Remove HTML tags and decode entities
        const cleanDescription = descriptionMatch[1]
          .replace(/<[^>]*>/g, '')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
        
        blocks.push({
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: cleanDescription } }]
          }
        });
      }
    }

    return blocks;
  }

  /**
   * Find the React component file for a lesson
   */
  findLessonComponentFile(lessonId) {
    const possiblePaths = [
      `src/app/01-getting-started/${lessonId}/page.jsx`,
      `src/app/02-existence-identification/${lessonId}/page.jsx`,
      `src/app/03-location/${lessonId}/page.jsx`,
      `src/app/04-actions/${lessonId}/page.jsx`,
      `src/app/05-plurals/${lessonId}/page.jsx`,
      `src/app/06-directions/${lessonId}/page.jsx`,
      `src/app/07-tool-role/${lessonId}/page.jsx`,
      `src/app/08-ownership/${lessonId}/page.jsx`,
      `src/app/09-tenses/${lessonId}/page.jsx`,
      `src/app/10-adjectives/${lessonId}/page.jsx`,
      `src/app/11-time-numbers/${lessonId}/page.jsx`,
      `src/app/12-complex-sentences/${lessonId}/page.jsx`,
      `src/app/13-advanced-verbs/${lessonId}/page.jsx`,
      `src/app/14-complex-dialogue/${lessonId}/page.jsx`
    ];

    for (const filePath of possiblePaths) {
      if (fs.existsSync(path.join(__dirname, '..', filePath))) {
        return path.join(__dirname, '..', filePath);
      }
    }

    return null;
  }

  /**
   * Update existing lesson with content
   */
  async updateLessonWithContent(lessonId, title, category, level, order) {
    try {
      console.log(`📝 Updating content for: ${title}`);
      
      // Find the React component file
      const componentFile = this.findLessonComponentFile(lessonId);
      if (!componentFile) {
        console.log(`⚠️  No component file found for ${lessonId}`);
        return null;
      }

      // Extract content from React component
      const blocks = this.extractContentFromReactComponent(componentFile);
      if (blocks.length === 0) {
        console.log(`⚠️  No content extracted from ${componentFile}`);
        return null;
      }

      // Find existing lesson in Notion
      const existingLesson = await this.notionService.getLessonByID(lessonId);
      if (!existingLesson) {
        console.log(`⚠️  Lesson ${lessonId} not found in Notion`);
        return null;
      }

      // Update the lesson page with content blocks
      const response = await this.notionService.notion.blocks.children.append({
        block_id: existingLesson.id,
        children: blocks
      });

      console.log(`✅ Updated content for: ${title}`);
      return response;
    } catch (error) {
      console.error(`❌ Failed to update ${title}:`, error.message);
      this.migrationLog.push({
        lessonId,
        title,
        status: 'failed',
        error: error.message
      });
      return null;
    }
  }

  /**
   * Run the enhanced migration
   */
  async migrate() {
    console.log('🚀 Starting enhanced migration to Notion...');
    
    // Extract all lessons from curriculum data
    const allLessons = [];
    for (const category of Object.values(curriculumData)) {
      if (category.lessons) {
        for (const lesson of category.lessons) {
          allLessons.push({
            ...lesson,
            category: category.title,
            level: 'Beginner',
            order: allLessons.length + 1
          });
        }
      }
    }
    
    console.log(`📚 Found ${allLessons.length} lessons to update`);

    let successCount = 0;
    let failCount = 0;

    for (const lesson of allLessons) {
      try {
        const result = await this.updateLessonWithContent(
          lesson.id,
          lesson.title,
          lesson.category,
          lesson.level,
          lesson.order
        );

        if (result) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to process ${lesson.title}:`, error.message);
        failCount++;
      }
    }

    // Save migration log
    const logPath = path.join(__dirname, 'enhanced-migration-log.json');
    fs.writeFileSync(logPath, JSON.stringify(this.migrationLog, null, 2));
    console.log(`📋 Enhanced migration log saved to: ${logPath}`);
    
    console.log('✅ Enhanced migration completed!');
    console.log(`📊 Updated ${successCount} lessons, ${failCount} failed`);
  }
}

// Run the migration
const migrator = new EnhancedNotionMigrator();
migrator.migrate().catch(console.error);
