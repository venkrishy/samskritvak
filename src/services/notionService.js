import { Client } from '@notionhq/client';

class NotionService {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_INTEGRATION_TOKEN,
    });
    this.databaseId = process.env.NOTION_DATABASE_ID;
    this._schema = null; // cached database schema
    this._titlePropName = 'Title'; // default expected name per README
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
      // Ensure schema and resolve property names
      const props = await this._buildProperties(lessonData);

      const response = await this.notion.pages.create({
        parent: {
          database_id: this.databaseId,
        },
        properties: props,
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
      const props = await this._buildProperties(lessonData, /*forUpdate*/ true);
      await this.notion.pages.update({
        page_id: pageId,
        properties: props
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

  /**
   * Retrieve and cache database schema
   */
  async _ensureSchema() {
    if (this._schema) return this._schema;
    const db = await this.notion.databases.retrieve({ database_id: this.databaseId });
    const props = db.properties || {};

    // Find title prop
    let titlePropName = Object.keys(props).find((k) => props[k]?.type === 'title');
    if (!titlePropName) titlePropName = this._titlePropName;
    this._titlePropName = titlePropName;

    // Utility to find a property by preferred name, fallback by type and fuzzy name match
    const findProp = (preferredName, type, nameHints = []) => {
      if (props[preferredName]?.type === type) return preferredName;
      for (const key of Object.keys(props)) {
        if (props[key]?.type === type) {
          const lower = key.toLowerCase();
          if (nameHints.some(h => lower.includes(h))) return key;
        }
      }
      return null;
    };

    const lessonIdProp = findProp('LessonID', 'rich_text', ['lesson', 'id']);
    const categoryProp = findProp('Category', 'select', ['category']);
    const levelProp = findProp('Level', 'select', ['level']);
    const orderProp = findProp('Order', 'number', ['order', 'sort']);
    const statusProp = findProp('Status', 'select', ['status']);
    const imageUrlProp = findProp('ImageURL', 'url', ['image', 'url']);

    this._schema = {
      props,
      titlePropName,
      lessonIdProp,
      categoryProp,
      levelProp,
      orderProp,
      statusProp,
      imageUrlProp,
    };
    return this._schema;
  }

  /**
   * Build properties payload compatible with the database schema
   */
  async _buildProperties(lessonData, forUpdate = false) {
    const schema = await this._ensureSchema();
    const properties = {};

    // Title
    properties[schema.titlePropName] = {
      title: [
        {
          text: { content: lessonData.title }
        }
      ]
    };

    // LessonID
    if (schema.lessonIdProp && lessonData.lessonId) {
      properties[schema.lessonIdProp] = {
        rich_text: [ { text: { content: lessonData.lessonId } } ]
      };
    }

    // Category select
    if (schema.categoryProp && lessonData.category) {
      properties[schema.categoryProp] = { select: { name: lessonData.category } };
    }

    // Level select
    if (schema.levelProp && lessonData.level) {
      properties[schema.levelProp] = { select: { name: lessonData.level } };
    }

    // Status (only on update if provided)
    if (schema.statusProp && (lessonData.status || (!forUpdate && lessonData.status !== undefined))) {
      properties[schema.statusProp] = { select: { name: lessonData.status || 'Published' } };
    }

    // Image URL (omit if missing)
    if (schema.imageUrlProp && (lessonData.imageUrl || forUpdate)) {
      properties[schema.imageUrlProp] = { url: lessonData.imageUrl || null };
    }

    // Order number
    if (schema.orderProp && (typeof lessonData.order === 'number' || !forUpdate)) {
      properties[schema.orderProp] = { number: typeof lessonData.order === 'number' ? lessonData.order : 0 };
    }

    return properties;
  }
}

export default NotionService;
