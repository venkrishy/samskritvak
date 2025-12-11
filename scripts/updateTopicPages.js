#!/usr/bin/env node

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

class TopicPageUpdater {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_INTEGRATION_TOKEN,
    });
    
    this.databases = {
      topics: process.env.NOTION_TOPICS_DB_ID,
      chapters: process.env.NOTION_CHAPTERS_DB_ID
    };
    
    this.mappingReport = [];
    this.missingContentReport = [];
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

  // Load extracted JSX content
  loadExtractedContent() {
    try {
      const contentPath = '/Users/venky/git/samskritvak/extracted-jsx-content.json';
      if (fs.existsSync(contentPath)) {
        return JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      }
      console.log('❌ Extracted content file not found. Run extractJSXContent.js first.');
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

  // Map JSX subtopics to Notion topics
  mapSubtopicsToTopics(extractedContent, topics, chapters) {
    console.log('🔗 Mapping JSX subtopics to Notion topics...');
    
    const mappings = [];
    
    // Process each chapter
    Object.entries(extractedContent).forEach(([chapterKey, subtopics]) => {
      const chapterNumber = parseInt(chapterKey.split('_')[1]);
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
      
      console.log(`   📖 Chapter ${chapterNumber}: ${Object.keys(subtopics).length} subtopics, ${chapterTopics.length} topics`);
      
      // Map subtopics to topics
      Object.entries(subtopics).forEach(([subtopicKey, subtopicContent]) => {
        const mappedTopic = this.findBestTopicMatch(subtopicKey, subtopicContent, chapterTopics);
        
        if (mappedTopic) {
          mappings.push({
            subtopicKey,
            subtopicContent,
            topic: mappedTopic,
            chapterNumber,
            chapterData
          });
          
          this.mappingReport.push({
            chapter: chapterNumber,
            subtopic: subtopicKey,
            topicId: this.getPropertyValue(mappedTopic.properties.TopicId),
            topicDisplayName: this.getPropertyValue(mappedTopic.properties.Topic_Dispay_Name),
            mapped: true
          });
        } else {
          this.mappingReport.push({
            chapter: chapterNumber,
            subtopic: subtopicKey,
            topicId: 'N/A',
            topicDisplayName: 'N/A',
            mapped: false
          });
        }
      });
    });
    
    return mappings;
  }

  // Find the best topic match for a subtopic
  findBestTopicMatch(subtopicKey, subtopicContent, chapterTopics) {
    const subtopicName = subtopicKey.replace(/-/g, ' ').toLowerCase();
    const contentTitle = subtopicContent.title?.toLowerCase() || '';
    
    // Try exact matches first
    for (const topic of chapterTopics) {
      const topicDisplayName = this.getPropertyValue(topic.properties.Topic_Dispay_Name).toLowerCase();
      const topicId = this.getPropertyValue(topic.properties.TopicId).toLowerCase();
      
      if (topicDisplayName.includes(subtopicName) || subtopicName.includes(topicDisplayName) ||
          topicId.includes(subtopicName) || subtopicName.includes(topicId)) {
        return topic;
      }
    }
    
    // Try fuzzy matching based on content
    for (const topic of chapterTopics) {
      const topicDisplayName = this.getPropertyValue(topic.properties.Topic_Dispay_Name).toLowerCase();
      
      // Check if any words match
      const subtopicWords = subtopicName.split(' ');
      const topicWords = topicDisplayName.split(' ');
      
      const matchingWords = subtopicWords.filter(word => 
        topicWords.some(topicWord => 
          topicWord.includes(word) || word.includes(topicWord)
        )
      );
      
      if (matchingWords.length > 0) {
        return topic;
      }
    }
    
    return null;
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

  // Update all topic pages
  async updateAllTopicPages() {
    console.log('🚀 Starting Topic Page Updates\n');
    console.log('=' .repeat(50));
    
    try {
      // Load extracted content
      const extractedContent = this.loadExtractedContent();
      if (!extractedContent) {
        return { success: false, error: 'No extracted content found' };
      }
      
      // Fetch data from Notion
      const [topics, chapters] = await Promise.all([
        this.fetchTopics(),
        this.fetchChapters()
      ]);
      
      // Map subtopics to topics
      const mappings = this.mapSubtopicsToTopics(extractedContent, topics, chapters);
      
      console.log(`\n📊 Mapping Summary:`);
      console.log(`   Total mappings: ${mappings.length}`);
      console.log(`   Mapped topics: ${this.mappingReport.filter(m => m.mapped).length}`);
      console.log(`   Unmapped topics: ${this.mappingReport.filter(m => !m.mapped).length}`);
      
      // Update topic pages
      console.log('\n🔄 Updating topic pages...');
      const updateResults = [];
      
      for (const mapping of mappings) {
        const result = await this.updateTopicPage(mapping.topic, mapping.subtopicContent);
        updateResults.push({
          ...result,
          subtopic: mapping.subtopicKey,
          chapter: mapping.chapterNumber
        });
        
        await this.delay(500); // Rate limiting
      }
      
      // Generate reports
      this.generateReports(updateResults);
      
      const successCount = updateResults.filter(r => r.success).length;
      const failCount = updateResults.filter(r => !r.success).length;
      
      console.log(`\n✅ Update Complete!`);
      console.log(`   Successful updates: ${successCount}`);
      console.log(`   Failed updates: ${failCount}`);
      
      return { success: true, successCount, failCount };
      
    } catch (error) {
      console.error('❌ Update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate reports
  generateReports(updateResults) {
    // Content mapping report
    const mappingReportPath = '/Users/venky/git/samskritvak/content-mapping-report.json';
    fs.writeFileSync(mappingReportPath, JSON.stringify(this.mappingReport, null, 2), 'utf8');
    
    // Missing content report (topics without content)
    const missingContent = this.mappingReport.filter(m => !m.mapped);
    const missingReportPath = '/Users/venky/git/samskritvak/missing-content-report.json';
    fs.writeFileSync(missingReportPath, JSON.stringify(missingContent, null, 2), 'utf8');
    
    console.log(`\n📊 Reports generated:`);
    console.log(`   Content mapping: ${mappingReportPath}`);
    console.log(`   Missing content: ${missingReportPath}`);
  }
}

// Run the update
const updater = new TopicPageUpdater();
updater.updateAllTopicPages().catch(error => {
  console.error('💥 Update failed with error:', error);
  process.exit(1);
});
