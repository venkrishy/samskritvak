#!/usr/bin/env node

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

class NotionDataAnalyzer {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_INTEGRATION_TOKEN,
    });
    
    this.databases = {
      chapters: process.env.NOTION_CHAPTERS_DB_ID,
      topics: process.env.NOTION_TOPICS_DB_ID
    };
  }

  async analyzeChapters() {
    console.log('📚 Analyzing Chapters Database...\n');
    
    try {
      const response = await this.notion.databases.query({
        database_id: this.databases.chapters,
        page_size: 100
      });

      console.log(`Found ${response.results.length} chapters:\n`);
      
      const chapters = [];
      response.results.forEach((chapter, index) => {
        const props = chapter.properties;
        const chapterData = {
          id: chapter.id,
          chapterId: this.getPropertyValue(props.ChapterId),
          displayText: this.getPropertyValue(props.Chapter_Display_text),
          subtitle: this.getPropertyValue(props.Subtitle),
          sortOrder: this.getPropertyValue(props.SortOrder),
          levelId: this.getPropertyValue(props.LevelId),
          languageId: this.getPropertyValue(props.LanguageId),
          tags: this.getPropertyValue(props.Tags)
        };
        
        chapters.push(chapterData);
        
        console.log(`${index + 1}. ${chapterData.displayText}`);
        console.log(`   ChapterId: ${chapterData.chapterId}`);
        console.log(`   Subtitle: ${chapterData.subtitle}`);
        console.log(`   SortOrder: ${chapterData.sortOrder}`);
        console.log(`   LevelId: ${chapterData.levelId}`);
        console.log(`   LanguageId: ${chapterData.languageId}`);
        console.log(`   Tags: ${chapterData.tags}`);
        console.log(`   Notion Page ID: ${chapterData.id}\n`);
      });

      return chapters;
    } catch (error) {
      console.error('Error analyzing chapters:', error);
      return [];
    }
  }

  async analyzeTopics() {
    console.log('📝 Analyzing Topics Database...\n');
    
    try {
      const response = await this.notion.databases.query({
        database_id: this.databases.topics,
        page_size: 100
      });

      console.log(`Found ${response.results.length} topics:\n`);
      
      const topics = [];
      response.results.forEach((topic, index) => {
        const props = topic.properties;
        const topicData = {
          id: topic.id,
          topicId: this.getPropertyValue(props.TopicId),
          displayName: this.getPropertyValue(props.Topic_Dispay_Name),
          chapterId: this.getPropertyValue(props.ChapterId)
        };
        
        topics.push(topicData);
        
        console.log(`${index + 1}. ${topicData.displayName}`);
        console.log(`   TopicId: ${topicData.topicId}`);
        console.log(`   ChapterId: ${topicData.chapterId}`);
        console.log(`   Notion Page ID: ${topicData.id}\n`);
      });

      return topics;
    } catch (error) {
      console.error('Error analyzing topics:', error);
      return [];
    }
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

  async analyzeRelationships(chapters, topics) {
    console.log('🔗 Analyzing Relationships...\n');
    
    console.log('Current Topic-Chapter Mappings:');
    topics.forEach(topic => {
      console.log(`Topic: "${topic.displayName}" (${topic.topicId})`);
      console.log(`  Current ChapterId: ${topic.chapterId}`);
      
      // Find matching chapter
      const matchingChapter = chapters.find(ch => 
        ch.chapterId === topic.chapterId || 
        ch.displayText?.toLowerCase().includes(topic.displayName?.toLowerCase()) ||
        topic.displayName?.toLowerCase().includes(ch.displayText?.toLowerCase())
      );
      
      if (matchingChapter) {
        console.log(`  ✅ Matches Chapter: "${matchingChapter.displayText}" (${matchingChapter.chapterId})`);
      } else {
        console.log(`  ❌ No matching chapter found`);
      }
      console.log('');
    });
  }

  async runAnalysis() {
    console.log('🔍 Notion Data Analysis\n');
    console.log('=' .repeat(50));
    
    const chapters = await this.analyzeChapters();
    const topics = await this.analyzeTopics();
    
    await this.analyzeRelationships(chapters, topics);
    
    return { chapters, topics };
  }
}

// Run the analysis
const analyzer = new NotionDataAnalyzer();
analyzer.runAnalysis().catch(error => {
  console.error('💥 Analysis failed with error:', error);
  process.exit(1);
});
