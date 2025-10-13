import { Client } from '@notionhq/client';

class NotionService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
  }

  /**
   * Fetch all published lessons from Notion database
   */
  async getAllLessons() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        sorts: [
          {
            property: 'Order',
            direction: 'ascending'
          }
        ]
      });

      return response.results;
    } catch (error) {
      console.error('Error fetching lessons from Notion:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific lesson by LessonID
   */
  async getLessonByID(lessonId) {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'LessonID',
          rich_text: {
            equals: lessonId
          }
        }
      });

      if (response.results.length === 0) {
        return null;
      }

      return response.results[0];
    } catch (error) {
      console.error(`Error fetching lesson ${lessonId} from Notion:`, error);
      throw error;
    }
  }

  /**
   * Fetch page content (blocks) for a specific page
   */
  async getPageContent(pageId) {
    try {
      const response = await this.notion.blocks.children.list({
        block_id: pageId,
      });

      return response.results;
    } catch (error) {
      console.error(`Error fetching page content for ${pageId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new lesson page in Notion
   */
  async createLesson(lessonData) {
    try {
      const response = await this.notion.pages.create({
        parent: {
          database_id: this.databaseId,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: lessonData.title
                }
              }
            ]
          },
          LessonID: {
            rich_text: [
              {
                text: {
                  content: lessonData.lessonId
                }
              }
            ]
          },
          Category: {
            select: {
              name: lessonData.category
            }
          },
          Level: {
            select: {
              name: lessonData.level
            }
          },
          ImageURL: {
            url: lessonData.imageUrl || ''
          },
          Order: {
            number: lessonData.order || 0
          }
        },
        children: lessonData.blocks || []
      });

      return response;
    } catch (error) {
      console.error('Error creating lesson in Notion:', error);
      throw error;
    }
  }

  /**
   * Update an existing lesson page
   */
  async updateLesson(pageId, lessonData) {
    try {
      // Update properties
      await this.notion.pages.update({
        page_id: pageId,
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: lessonData.title
                }
              }
            ]
          },
          LessonID: {
            rich_text: [
              {
                text: {
                  content: lessonData.lessonId
                }
              }
            ]
          },
          Category: {
            select: {
              name: lessonData.category
            }
          },
          Level: {
            select: {
              name: lessonData.level
            }
          },
          Status: {
            select: {
              name: lessonData.status || 'Published'
            }
          },
          ImageURL: {
            url: lessonData.imageUrl || ''
          },
          Order: {
            number: lessonData.order || 0
          }
        }
      });

      // Update content blocks if provided
      if (lessonData.blocks) {
        // First, clear existing blocks
        const existingBlocks = await this.getPageContent(pageId);
        for (const block of existingBlocks) {
          await this.notion.blocks.delete({
            block_id: block.id
          });
        }

        // Add new blocks
        await this.notion.blocks.children.append({
          block_id: pageId,
          children: lessonData.blocks
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating lesson in Notion:', error);
      throw error;
    }
  }

  /**
   * Rate limiting helper
   */
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Batch operations with rate limiting
   */
  async batchOperation(operations, delayMs = 350) {
    const results = [];
    for (const operation of operations) {
      try {
        const result = await operation();
        results.push(result);
        await this.delay(delayMs); // Respect rate limits
      } catch (error) {
        console.error('Error in batch operation:', error);
        results.push({ error: error.message });
      }
    }
    return results;
  }
}

export default NotionService;
