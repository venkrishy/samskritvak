#!/usr/bin/env node

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

class TopicMappingFixer {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_INTEGRATION_TOKEN,
    });
    
    this.databases = {
      topics: process.env.NOTION_TOPICS_DB_ID,
      chapters: process.env.NOTION_CHAPTERS_DB_ID
    };
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getPropertyValue(property) {
    if (!property) return 'N/A';
    
    switch (property.type) {
      case 'title':
        return property.title?.[0]?.text?.content || 'N/A';
      case 'rich_text':
        return property.rich_text?.[0]?.text?.content || 'N/A';
      case 'select':
        return property.select?.name || 'N/A';
      case 'number':
        return property.number || 'N/A';
      case 'url':
        return property.url || 'N/A';
      case 'relation':
        return property.relation?.length > 0 ? property.relation[0].id : 'N/A';
      default:
        return 'N/A';
    }
  }

  // Manual mapping of JSX subtopics to Notion topics
  getManualMappings() {
    return {
      // Chapter 1 mappings
      '01-getting-started': {
        'greetings-identity': 'Basic Greetings',
        'masculine-name': 'Personal Pronouns', 
        'feminine-name': 'Personal Pronouns',
        'yes-no': 'Yes/No Responses',
        'who-what': 'Basic Questions',
        'daily-items': 'Self Introduction'
      },
      // Chapter 2 mappings  
      '02-existence-identification': {
        'existence': 'What is this?',
        'exists-not': 'What is this?',
        'masculine-demonstratives': 'Demonstrative Pronouns',
        'feminine-demonstratives': 'Demonstrative Pronouns', 
        'neuter-demonstratives': 'Demonstrative Pronouns',
        'workplace-vocabulary': 'Basic Vocabulary'
      },
      // Chapter 3 mappings
      '03-location': {
        'here-there': 'Here and There',
        'where': 'Direction Words',
        'spatial-concepts': 'Spatial Relationships',
        'inside-outside': 'Location Words',
        'from-where': 'Prepositions',
        'directions': 'Direction Words',
        'everywhere-elsewhere': 'Here and There'
      },
      // Chapter 4 mappings
      '04-actions': {
        'simple-actions': 'Action Verbs',
        'simple-verbs': 'Action Verbs',
        'i-actions': 'Daily Activities',
        'you-actions': 'Daily Activities', 
        'requests-commands': 'Routine Actions',
        'requests-commands-notion': 'Routine Actions',
        'necessity': 'Work and Play'
      },
      // Chapter 5 mappings
      '05-plurals': {
        'singular-plural': 'Singular and Plural',
        'masculine-they': 'Singular and Plural',
        'feminine-they': 'Singular and Plural',
        'neuter-they': 'Singular and Plural',
        'how-many': 'Basic Vocabulary',
        'plural-concepts': 'Singular and Plural',
        'plural-verbs': 'Singular and Plural',
        'we-you-plural': 'Singular and Plural'
      },
      // Chapter 6 mappings
      '06-directions': {
        'page': 'Direction Verbs' // This is the main page.jsx
      }
    };
  }

  // Load extracted JSX content
  loadExtractedContent() {
    try {
      const contentPath = '/Users/venky/git/samskritvak/extracted-jsx-content.json';
      if (fs.existsSync(contentPath)) {
        return JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      }
      return null;
    } catch (error) {
      console.error('❌ Error loading extracted content:', error.message);
      return null;
    }
  }

  // Get all topics from Notion
  async fetchTopics() {
    console.log('📝 Fetching topics from Notion...');
    
    try {
      const allTopics = [];
      let hasMore = true;
      let startCursor = undefined;

      while (hasMore) {
        const response = await this.notion.databases.query({
          database_id: this.databases.topics,
          start_cursor: startCursor,
          page_size: 100
        });

        allTopics.push(...response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor;

        await this.delay(350);
      }

      console.log(`   ✅ Found ${allTopics.length} topics`);
      return allTopics;
    } catch (error) {
      console.error('❌ Error fetching topics:', error.message);
      return [];
    }
  }

  // Get chapters to map chapter numbers
  async fetchChapters() {
    console.log('📚 Fetching chapters from Notion...');
    
    try {
      const allChapters = [];
      let hasMore = true;
      let startCursor = undefined;

      while (hasMore) {
        const response = await this.notion.databases.query({
          database_id: this.databases.chapters,
          start_cursor: startCursor,
          page_size: 100
        });

        allChapters.push(...response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor;

        await this.delay(350);
      }

      // Create mapping of chapter numbers to chapter data
      const chapterMap = {};
      allChapters.forEach(chapter => {
        const props = chapter.properties;
        const chapterId = this.getPropertyValue(props.ChapterId);
        const sortOrder = this.getPropertyValue(props.SortOrder);
        
        if (chapterId && sortOrder !== 'N/A') {
          chapterMap[parseInt(sortOrder)] = {
            id: chapter.id,
            chapterId,
            displayText: this.getPropertyValue(props.Chapter_Display_text)
          };
        }
      });

      console.log(`   ✅ Found ${Object.keys(chapterMap).length} chapters`);
      return chapterMap;
    } catch (error) {
      console.error('❌ Error fetching chapters:', error.message);
      return {};
    }
  }

  // Update a topic page with content
  async updateTopicPage(topic, content) {
    try {
      const topicId = this.getPropertyValue(topic.properties.TopicId);
      console.log(`   📝 Updating topic: ${topicId}`);
      
      // Clear existing content
      const existingBlocks = await this.notion.blocks.children.list({
        block_id: topic.id,
      });
      
      for (const block of existingBlocks.results) {
        await this.notion.blocks.delete({
          block_id: block.id
        });
        await this.delay(100);
      }
      
      // Add new content
      if (content.notionBlocks && content.notionBlocks.length > 0) {
        await this.notion.blocks.children.append({
          block_id: topic.id,
          children: content.notionBlocks
        });
      }
      
      console.log(`   ✅ Updated: ${topicId}`);
      return { success: true, topicId };
    } catch (error) {
      console.error(`   ❌ Failed to update topic: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Fix topic mappings and update pages
  async fixMappings() {
    console.log('🔧 Fixing Topic Mappings and Updating Pages\n');
    console.log('=' .repeat(50));
    
    try {
      // Load extracted content
      const extractedContent = this.loadExtractedContent();
      if (!extractedContent) {
        console.log('❌ No extracted content found. Run extractJSXContent.js first.');
        return;
      }
      
      // Fetch data from Notion
      const [topics, chapters] = await Promise.all([
        this.fetchTopics(),
        this.fetchChapters()
      ]);
      
      // Get manual mappings
      const manualMappings = this.getManualMappings();
      
      console.log('\n🔄 Processing manual mappings...');
      const updateResults = [];
      
      // Process each chapter
      Object.entries(manualMappings).forEach(([chapterDir, subtopicMappings]) => {
        const chapterNumber = parseInt(chapterDir.split('-')[0]);
        const chapterData = chapters[chapterNumber];
        
        if (!chapterData) {
          console.log(`   ⚠️  No chapter data found for chapter ${chapterNumber}`);
          return;
        }
        
        // Find topics for this chapter
        const chapterTopics = topics.filter(topic => {
          const props = topic.properties;
          const chapterId = this.getPropertyValue(props.ChapterId);
          return chapterId === chapterData.id;
        });
        
        console.log(`\n📖 Chapter ${chapterNumber}: ${Object.keys(subtopicMappings).length} mappings`);
        
        // Process each subtopic mapping
        Object.entries(subtopicMappings).forEach(async ([subtopicKey, topicDisplayName]) => {
          // Find the topic by display name
          const topic = chapterTopics.find(t => 
            this.getPropertyValue(t.properties.Topic_Dispay_Name) === topicDisplayName
          );
          
          if (!topic) {
            console.log(`   ❌ Topic not found: ${topicDisplayName}`);
            return;
          }
          
          // Find the content for this subtopic
          const chapterKey = `chapter_${chapterNumber}`;
          const subtopicContent = extractedContent[chapterKey]?.[subtopicKey];
          
          if (!subtopicContent) {
            console.log(`   ❌ Content not found for subtopic: ${subtopicKey}`);
            return;
          }
          
          console.log(`   🔗 Mapping: ${subtopicKey} → ${topicDisplayName}`);
          
          // Update the topic page
          const result = await this.updateTopicPage(topic, subtopicContent);
          updateResults.push({
            ...result,
            subtopic: subtopicKey,
            topicDisplayName,
            chapter: chapterNumber
          });
          
          await this.delay(500); // Rate limiting
        });
      });
      
      console.log(`\n✅ Mapping Fix Complete!`);
      console.log(`   Processed mappings: ${Object.keys(manualMappings).length} chapters`);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Mapping fix failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Run the fix
const fixer = new TopicMappingFixer();
fixer.fixMappings().catch(error => {
  console.error('💥 Fix failed with error:', error);
  process.exit(1);
});
