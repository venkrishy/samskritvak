#!/usr/bin/env node

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

class NotionCSVExporter {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_INTEGRATION_TOKEN,
    });
    
    this.databases = {
      languages: process.env.NOTION_LANGUAGES_DB_ID,
      levels: process.env.NOTION_LEVELS_DB_ID,
      chapters: process.env.NOTION_CHAPTERS_DB_ID,
      topics: process.env.NOTION_TOPICS_DB_ID
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

  async fetchAllRecords(databaseId, databaseName) {
    console.log(`📊 Fetching ${databaseName} records...`);
    
    try {
      const allRecords = [];
      let hasMore = true;
      let startCursor = undefined;

      while (hasMore) {
        const response = await this.notion.databases.query({
          database_id: databaseId,
          start_cursor: startCursor,
          page_size: 100
        });

        allRecords.push(...response.results);
        hasMore = response.has_more;
        startCursor = response.next_cursor;

        await this.delay(350); // Rate limiting
      }

      console.log(`   ✅ Found ${allRecords.length} ${databaseName} records`);
      return allRecords;
    } catch (error) {
      console.error(`❌ Error fetching ${databaseName}:`, error.message);
      return [];
    }
  }

  async fetchLanguages() {
    const records = await this.fetchAllRecords(this.databases.languages, 'Languages');
    
    const languages = {};
    records.forEach(record => {
      const props = record.properties;
      const languageId = this.getPropertyValue(props.LanguageId);
      if (languageId && languageId !== 'N/A') {
        languages[record.id] = {
          id: record.id,
          languageId,
          priority: this.getPropertyValue(props.Priority),
          notes: this.getPropertyValue(props.Notes),
          resources: this.getPropertyValue(props.Resources),
          studyHours: this.getPropertyValue(props.Study_Hours)
        };
      }
    });
    
    return languages;
  }

  async fetchLevels() {
    const records = await this.fetchAllRecords(this.databases.levels, 'Levels');
    
    const levels = {};
    records.forEach(record => {
      const props = record.properties;
      const levelId = this.getPropertyValue(props.LevelId);
      if (levelId && levelId !== 'N/A') {
        levels[record.id] = {
          id: record.id,
          levelId,
          displayName: this.getPropertyValue(props.Display_Name),
          createdDate: this.getPropertyValue(props['created date'])
        };
      }
    });
    
    return levels;
  }

  async fetchChapters() {
    const records = await this.fetchAllRecords(this.databases.chapters, 'Chapters');
    
    const chapters = {};
    records.forEach(record => {
      const props = record.properties;
      const chapterId = this.getPropertyValue(props.ChapterId);
      if (chapterId && chapterId !== 'N/A') {
        chapters[record.id] = {
          id: record.id,
          chapterId,
          displayText: this.getPropertyValue(props.Chapter_Display_text),
          subtitle: this.getPropertyValue(props.Subtitle),
          sortOrder: this.getPropertyValue(props.SortOrder),
          levelId: this.getPropertyValue(props.LevelId),
          languageId: this.getPropertyValue(props.LanguageId),
          tags: this.getPropertyValue(props.Tags)
        };
      }
    });
    
    return chapters;
  }

  async fetchTopics() {
    const records = await this.fetchAllRecords(this.databases.topics, 'Topics');
    
    const topics = [];
    records.forEach(record => {
      const props = record.properties;
      const topicId = this.getPropertyValue(props.TopicId);
      if (topicId && topicId !== 'N/A') {
        topics.push({
          id: record.id,
          topicId,
          displayName: this.getPropertyValue(props.Topic_Dispay_Name),
          chapterId: this.getPropertyValue(props.ChapterId)
        });
      }
    });
    
    return topics;
  }

  async resolveRelations(topics, languages, levels, chapters) {
    console.log('🔗 Resolving relations...');
    
    const resolvedTopics = [];
    
    for (const topic of topics) {
      // Find the chapter this topic belongs to
      const chapter = Object.values(chapters).find(ch => ch.id === topic.chapterId);
      if (!chapter) {
        console.log(`   ⚠️  No chapter found for topic: ${topic.topicId}`);
        continue;
      }
      
      // Find the level this chapter belongs to
      const level = Object.values(levels).find(l => l.id === chapter.levelId);
      if (!level) {
        console.log(`   ⚠️  No level found for chapter: ${chapter.chapterId}`);
      }
      
      // Find the language this chapter belongs to
      const language = Object.values(languages).find(l => l.id === chapter.languageId);
      if (!language) {
        console.log(`   ⚠️  No language found for chapter: ${chapter.chapterId}`);
      }
      
      resolvedTopics.push({
        // Language data
        languageId: language?.languageId || 'N/A',
        languagePriority: language?.priority || 'N/A',
        languageNotes: language?.notes || 'N/A',
        languageResources: language?.resources || 'N/A',
        languageStudyHours: language?.studyHours || 'N/A',
        
        // Level data
        levelId: level?.levelId || 'N/A',
        levelDisplayName: level?.displayName || 'N/A',
        levelCreatedDate: level?.createdDate || 'N/A',
        
        // Chapter data
        chapterId: chapter.chapterId,
        chapterDisplayText: chapter.displayText,
        chapterSubtitle: chapter.subtitle,
        chapterSortOrder: chapter.sortOrder,
        chapterLanguageId: chapter.languageId,
        chapterLevelId: chapter.levelId,
        chapterTags: chapter.tags,
        
        // Topic data
        topicId: topic.topicId,
        topicDisplayName: topic.displayName,
        topicChapterId: topic.chapterId,
        
        // Record identifier
        recordIdentifier: topic.topicId
      });
    }
    
    return resolvedTopics;
  }

  generateCSV(data) {
    console.log('📝 Generating CSV...');
    
    if (data.length === 0) {
      console.log('❌ No data to export');
      return '';
    }
    
    // CSV Headers
    const allHeaders = [
      'LanguageId', 'Language_Priority', 'Language_Notes', 'Language_Resources', 'Language_Study_Hours',
      'LevelId', 'Level_Display_Name', 'Level_Created_Date',
      'ChapterId', 'Chapter_Display_Text', 'Chapter_Subtitle', 'Chapter_SortOrder', 'Chapter_LanguageId', 'Chapter_LevelId', 'Chapter_Tags',
      'TopicId', 'Topic_Display_Name', 'Topic_ChapterId',
      'Record_Identifier'
    ];
    
    // Check which columns have data
    const columnHasData = {};
    allHeaders.forEach(header => {
      columnHasData[header] = false;
    });
    
    // Check each row to see which columns have non-empty values
    data.forEach(row => {
      allHeaders.forEach(header => {
        let value = '';
        switch (header) {
          case 'LanguageId': value = row.languageId; break;
          case 'Language_Priority': value = row.languagePriority; break;
          case 'Language_Notes': value = row.languageNotes; break;
          case 'Language_Resources': value = row.languageResources; break;
          case 'Language_Study_Hours': value = row.languageStudyHours; break;
          case 'LevelId': value = row.levelId; break;
          case 'Level_Display_Name': value = row.levelDisplayName; break;
          case 'Level_Created_Date': value = row.levelCreatedDate; break;
          case 'ChapterId': value = row.chapterId; break;
          case 'Chapter_Display_Text': value = row.chapterDisplayText; break;
          case 'Chapter_Subtitle': value = row.chapterSubtitle; break;
          case 'Chapter_SortOrder': value = row.chapterSortOrder; break;
          case 'Chapter_LanguageId': value = row.chapterLanguageId; break;
          case 'Chapter_LevelId': value = row.chapterLevelId; break;
          case 'Chapter_Tags': value = row.chapterTags; break;
          case 'TopicId': value = row.topicId; break;
          case 'Topic_Display_Name': value = row.topicDisplayName; break;
          case 'Topic_ChapterId': value = row.topicChapterId; break;
          case 'Record_Identifier': value = row.recordIdentifier; break;
        }
        
        if (value && value !== 'N/A' && value !== '') {
          columnHasData[header] = true;
        }
      });
    });
    
    // Filter to only include columns with data
    const headers = allHeaders.filter(header => columnHasData[header]);
    
    console.log(`   📊 Using ${headers.length} columns with data (removed ${allHeaders.length - headers.length} empty columns)`);
    
    // Escape CSV values
    const escapeCSV = (value) => {
      if (value === 'N/A' || value === null || value === undefined) return '';
      const str = String(value);
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    
    // Generate CSV content
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const csvRow = headers.map(header => {
        // Map header to actual row property
        let value = '';
        switch (header) {
          case 'LanguageId': value = row.languageId; break;
          case 'Language_Priority': value = row.languagePriority; break;
          case 'Language_Notes': value = row.languageNotes; break;
          case 'Language_Resources': value = row.languageResources; break;
          case 'Language_Study_Hours': value = row.languageStudyHours; break;
          case 'LevelId': value = row.levelId; break;
          case 'Level_Display_Name': value = row.levelDisplayName; break;
          case 'Level_Created_Date': value = row.levelCreatedDate; break;
          case 'ChapterId': value = row.chapterId; break;
          case 'Chapter_Display_Text': value = row.chapterDisplayText; break;
          case 'Chapter_Subtitle': value = row.chapterSubtitle; break;
          case 'Chapter_SortOrder': value = row.chapterSortOrder; break;
          case 'Chapter_LanguageId': value = row.chapterLanguageId; break;
          case 'Chapter_LevelId': value = row.chapterLevelId; break;
          case 'Chapter_Tags': value = row.chapterTags; break;
          case 'TopicId': value = row.topicId; break;
          case 'Topic_Display_Name': value = row.topicDisplayName; break;
          case 'Topic_ChapterId': value = row.topicChapterId; break;
          case 'Record_Identifier': value = row.recordIdentifier; break;
        }
        return escapeCSV(value);
      });
      csvRows.push(csvRow.join(','));
    });
    
    return csvRows.join('\n');
  }

  async exportToCSV() {
    console.log('🚀 Starting Notion CSV Export\n');
    console.log('=' .repeat(50));
    
    try {
      // Fetch all data
      const [languages, levels, chapters, topics] = await Promise.all([
        this.fetchLanguages(),
        this.fetchLevels(),
        this.fetchChapters(),
        this.fetchTopics()
      ]);
      
      console.log(`\n📊 Data Summary:`);
      console.log(`   Languages: ${Object.keys(languages).length}`);
      console.log(`   Levels: ${Object.keys(levels).length}`);
      console.log(`   Chapters: ${Object.keys(chapters).length}`);
      console.log(`   Topics: ${topics.length}`);
      
      // Resolve relations
      const resolvedData = await this.resolveRelations(topics, languages, levels, chapters);
      
      // Generate CSV
      const csvContent = this.generateCSV(resolvedData);
      
      // Write to file
      const outputPath = '/Users/venky/git/samskritvak/notion-export.csv';
      fs.writeFileSync(outputPath, csvContent, 'utf8');
      
      console.log(`\n✅ CSV Export Complete!`);
      console.log(`   File: ${outputPath}`);
      console.log(`   Records: ${resolvedData.length}`);
      console.log(`   Size: ${(csvContent.length / 1024).toFixed(2)} KB`);
      
      return { success: true, recordCount: resolvedData.length, filePath: outputPath };
      
    } catch (error) {
      console.error('❌ Export failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Run the export
const exporter = new NotionCSVExporter();
exporter.exportToCSV().catch(error => {
  console.error('💥 Export failed with error:', error);
  process.exit(1);
});
