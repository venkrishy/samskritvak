import { Client } from '@notionhq/client';
import ContentParser from './contentParser.js';

class PageBasedNotionService {
  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY });
    this.workspaceId = process.env.NOTION_WORKSPACE_ID; // We'll need to add this
  }

  /**
   * Search for pages by title in the workspace
   */
  async searchPagesByTitle(title) {
    try {
      const response = await this.notion.search({
        query: title,
        filter: {
          property: 'object',
          value: 'page'
        }
      });

      // Find exact title match
      const exactMatch = response.results.find(page => 
        page.properties?.title?.title?.[0]?.text?.content === title ||
        page.properties?.Name?.title?.[0]?.text?.content === title
      );

      return exactMatch || null;
    } catch (error) {
      console.error(`Error searching for page "${title}":`, error);
      return null;
    }
  }

  /**
   * Get page content (blocks) for a specific page
   */
  async getPageContent(pageId) {
    try {
      const response = await this.notion.blocks.children.list({
        block_id: pageId,
      });

      return response.results;
    } catch (error) {
      console.error(`Error fetching page content for ${pageId}:`, error);
      return [];
    }
  }

  /**
   * Get page properties (title, etc.)
   */
  async getPageProperties(pageId) {
    try {
      const response = await this.notion.pages.retrieve({
        page_id: pageId,
      });

      return {
        id: response.id,
        title: this.extractTitle(response),
        url: response.url,
        createdTime: response.created_time,
        lastEditedTime: response.last_edited_time
      };
    } catch (error) {
      console.error(`Error fetching page properties for ${pageId}:`, error);
      return null;
    }
  }

  /**
   * Extract title from page properties
   */
  extractTitle(page) {
    // Try different property names for title
    const titleProperties = ['title', 'Name', 'Title', 'name'];
    
    for (const prop of titleProperties) {
      if (page.properties?.[prop]?.title?.[0]?.text?.content) {
        return page.properties[prop].title[0].text.content;
      }
    }

    // Fallback to page title if no properties match
    return 'Untitled Page';
  }

  /**
   * Get all lessons by searching for pages with specific titles
   */
  async getAllLessons(lessonTitles) {
    const lessons = {};

    for (const title of lessonTitles) {
      try {
        console.log(`🔍 Searching for page: ${title}`);
        
        // Search for the page
        const page = await this.searchPagesByTitle(title);
        if (!page) {
          console.log(`⚠️  Page not found: ${title}`);
          continue;
        }

        // Get page properties
        const properties = await this.getPageProperties(page.id);
        if (!properties) {
          console.log(`⚠️  Could not get properties for: ${title}`);
          continue;
        }

        // Get page content
        const blocks = await this.getPageContent(page.id);
        if (!blocks || blocks.length === 0) {
          console.log(`⚠️  No content found for: ${title}`);
          continue;
        }

        // Parse content using existing parser
        const parsedContent = ContentParser.parseLessonBlocks(blocks);
        const componentProps = ContentParser.transformToComponentProps(parsedContent, properties);

        // Create lesson object
        const lessonId = this.generateLessonId(title);
        lessons[lessonId] = {
          lessonId,
          title: properties.title,
          url: properties.url,
          createdTime: properties.createdTime,
          lastModified: properties.lastEditedTime,
          content: componentProps,
          rawBlocks: blocks
        };

        console.log(`✅ Found and parsed: ${title}`);
      } catch (error) {
        console.error(`❌ Error processing ${title}:`, error);
      }
    }

    return lessons;
  }

  /**
   * Generate a consistent lesson ID from title
   */
  generateLessonId(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .trim();
  }

  /**
   * Get a specific lesson by title
   */
  async getLessonByTitle(title) {
    try {
      const page = await this.searchPagesByTitle(title);
      if (!page) return null;

      const properties = await this.getPageProperties(page.id);
      const blocks = await this.getPageContent(page.id);
      
      if (!properties || !blocks) return null;

      const parsedContent = ContentParser.parseLessonBlocks(blocks);
      const componentProps = ContentParser.transformToComponentProps(parsedContent, properties);

      return {
        lessonId: this.generateLessonId(title),
        title: properties.title,
        url: properties.url,
        createdTime: properties.createdTime,
        lastModified: properties.lastEditedTime,
        content: componentProps,
        rawBlocks: blocks
      };
    } catch (error) {
      console.error(`Error getting lesson "${title}":`, error);
      return null;
    }
  }
}

export default PageBasedNotionService;

