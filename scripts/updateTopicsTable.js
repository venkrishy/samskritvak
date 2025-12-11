#!/usr/bin/env node

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

class TopicsUpdater {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_INTEGRATION_TOKEN,
    });
    
    this.databases = {
      chapters: process.env.NOTION_CHAPTERS_DB_ID,
      topics: process.env.NOTION_TOPICS_DB_ID
    };
  }

  // Comprehensive list of Sanskrit Level 1 topics organized by chapter
  getSanskritTopics() {
    return {
      "Chapter01_GettingStarted": [
        "Mama Nama", "Basic Greetings", "Introduction to Sanskrit", "Personal Pronouns", 
        "Simple Present Tense", "Common Verbs", "Family Members", "Basic Questions",
        "Yes/No Responses", "Self Introduction"
      ],
      "Chapter02_NamingThings": [
        "What is this?", "Identifying Objects", "Common Nouns", "Gender in Sanskrit",
        "Singular and Plural", "Demonstrative Pronouns", "This/That", "Basic Vocabulary",
        "Object Identification", "Question Words"
      ],
      "Chapter03_Where_Is_It": [
        "Location Words", "Prepositions", "Here and There", "Spatial Relationships",
        "Direction Words", "Place Names", "Basic Geography", "Room Descriptions",
        "Finding Objects", "Position Words"
      ],
      "Chapter04_Action_What_People_Are_Doing": [
        "Action Verbs", "Present Continuous", "Daily Activities", "Movement Verbs",
        "Work and Play", "Sports and Games", "Hobbies", "Routine Actions",
        "Physical Activities", "Leisure Time"
      ],
      "Chapter05_Going_To_And_Using_Directions": [
        "Direction Verbs", "Travel Vocabulary", "Transportation", "Journey Words",
        "Navigation", "Street Directions", "Public Transport", "Walking and Running",
        "Arrival and Departure", "Distance Words"
      ],
      "Chapter06_Going_To_And_Using_Directions": [
        "Advanced Directions", "Complex Navigation", "Route Planning", "Landmarks",
        "City Navigation", "Rural Directions", "Weather and Travel", "Time and Distance",
        "Transportation Modes", "Travel Planning"
      ],
      "Chapter07_Tool_Rule": [
        "Instrumental Case", "Tool Usage", "With/Without", "Means and Methods",
        "Using Objects", "Help and Assistance", "Tools and Equipment", "Problem Solving",
        "Resource Management", "Efficiency Words"
      ],
      "Chapter08_Ownership": [
        "Possessive Pronouns", "My/Your/His/Her", "Belonging Words", "Property and Ownership",
        "Family Possessions", "Personal Items", "Sharing and Giving", "Taking and Receiving",
        "Ownership Questions", "Possession Verbs"
      ],
      "Chapter09_Tenses": [
        "Past Tense", "Future Tense", "Time Expressions", "Yesterday/Today/Tomorrow",
        "Completed Actions", "Planned Actions", "Time Markers", "Sequence Words",
        "Duration Words", "Frequency Words"
      ],
      "Chapter10_Adjectives": [
        "Descriptive Words", "Color Adjectives", "Size and Shape", "Quality Words",
        "Comparison", "Better/Best", "Good/Bad", "Beautiful/Ugly", "Big/Small",
        "Hot/Cold", "Fast/Slow", "Old/New"
      ],
      "Chapter11_TimeAndNumbers": [
        "Numbers 1-100", "Counting", "Time of Day", "Days of Week", "Months",
        "Seasons", "Age and Years", "Duration", "Scheduling", "Appointments",
        "Birthdays", "Anniversaries"
      ],
      "Chapter12_ComplexSentences": [
        "Sentence Connectors", "Because/Therefore", "If/Then", "Although/However",
        "Complex Questions", "Multiple Clauses", "Cause and Effect", "Conditional Statements",
        "Contrast Words", "Sequence Connectors"
      ],
      "Chapter13_VerbalConcepts": [
        "Advanced Verbs", "Verb Conjugations", "Aspect and Mood", "Imperative Forms",
        "Subjunctive Mood", "Passive Voice", "Reflexive Verbs", "Compound Verbs",
        "Verb Prefixes", "Auxiliary Verbs"
      ],
      "Chapter14_Dialogue_Vocabulary_Expansion": [
        "Conversation Starters", "Polite Expressions", "Agreement/Disagreement", "Opinions",
        "Preferences", "Suggestions", "Invitations", "Apologies", "Thanks and Gratitude",
        "Advanced Vocabulary", "Idiomatic Expressions"
      ]
    };
  }

  async getChapters() {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databases.chapters,
        page_size: 100
      });

      const chapters = {};
      response.results.forEach(chapter => {
        const props = chapter.properties;
        const chapterId = this.getPropertyValue(props.ChapterId);
        if (chapterId) {
          chapters[chapterId] = {
            id: chapter.id,
            displayText: this.getPropertyValue(props.Chapter_Display_text),
            sortOrder: this.getPropertyValue(props.SortOrder)
          };
        }
      });

      return chapters;
    } catch (error) {
      console.error('Error fetching chapters:', error);
      return {};
    }
  }

  async fixMamaNamaTopic() {
    console.log('🔧 Fixing Mama Nama topic...\n');
    
    try {
      // Get the existing Mama Nama topic
      const topicsResponse = await this.notion.databases.query({
        database_id: this.databases.topics,
        filter: {
          property: 'TopicId',
          rich_text: {
            equals: 'Mama Name'
          }
        }
      });

      if (topicsResponse.results.length === 0) {
        console.log('❌ Mama Nama topic not found');
        return false;
      }

      const topic = topicsResponse.results[0];
      const chapters = await this.getChapters();
      const chapter01Id = chapters['Chapter01_GettingStarted']?.id;

      if (!chapter01Id) {
        console.log('❌ Chapter01_GettingStarted not found');
        return false;
      }

      // Update the topic with correct ChapterId relation
      await this.notion.pages.update({
        page_id: topic.id,
        properties: {
          ChapterId: {
            relation: [{ id: chapter01Id }]
          }
        }
      });

      console.log('✅ Mama Nama topic updated to link to Chapter01_GettingStarted');
      return true;
    } catch (error) {
      console.error('❌ Error fixing Mama Nama topic:', error);
      return false;
    }
  }

  async addTopicsForChapter(chapterId, topics, chapterNotionId) {
    console.log(`📝 Adding topics for ${chapterId}...`);
    
    const results = [];
    for (const topicName of topics) {
      try {
        const response = await this.notion.pages.create({
          parent: {
            database_id: this.databases.topics,
          },
          properties: {
            TopicId: {
              title: [{ text: { content: topicName } }]
            },
            Topic_Dispay_Name: {
              rich_text: [{ text: { content: topicName } }]
            },
            ChapterId: {
              relation: [{ id: chapterNotionId }]
            }
          }
        });

        results.push({ success: true, topic: topicName, id: response.id });
        console.log(`   ✅ Added: ${topicName}`);
        
        // Rate limiting
        await this.delay(350);
      } catch (error) {
        console.log(`   ❌ Failed to add: ${topicName} - ${error.message}`);
        results.push({ success: false, topic: topicName, error: error.message });
      }
    }
    
    return results;
  }

  async addAllSanskritTopics() {
    console.log('📚 Adding all Sanskrit Level 1 topics...\n');
    
    const chapters = await this.getChapters();
    const topicsData = this.getSanskritTopics();
    
    const allResults = [];
    
    for (const [chapterId, topics] of Object.entries(topicsData)) {
      const chapterInfo = chapters[chapterId];
      if (!chapterInfo) {
        console.log(`❌ Chapter ${chapterId} not found in database`);
        continue;
      }
      
      console.log(`\n📖 Processing ${chapterInfo.displayText} (${topics.length} topics)`);
      const results = await this.addTopicsForChapter(chapterId, topics, chapterInfo.id);
      allResults.push(...results);
    }
    
    return allResults;
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

  async runUpdate() {
    console.log('🚀 Starting Topics Table Update\n');
    console.log('=' .repeat(50));
    
    // Step 1: Fix existing Mama Nama topic
    console.log('Step 1: Fixing existing topic...');
    const fixResult = await this.fixMamaNamaTopic();
    
    // Step 2: Add all Sanskrit topics
    console.log('\nStep 2: Adding Sanskrit Level 1 topics...');
    const addResults = await this.addAllSanskritTopics();
    
    // Summary
    console.log('\n📊 Update Summary');
    console.log('=' .repeat(50));
    
    const successful = addResults.filter(r => r.success).length;
    const failed = addResults.filter(r => !r.success).length;
    
    console.log(`Mama Nama fix: ${fixResult ? '✅ Success' : '❌ Failed'}`);
    console.log(`New topics added: ${successful}`);
    console.log(`Failed additions: ${failed}`);
    
    if (failed > 0) {
      console.log('\n❌ Failed topics:');
      addResults.filter(r => !r.success).forEach(r => {
        console.log(`   - ${r.topic}: ${r.error}`);
      });
    }
    
    console.log(`\n🎉 Topics update completed! Total topics: ${successful + 1}`);
  }
}

// Run the update
const updater = new TopicsUpdater();
updater.runUpdate().catch(error => {
  console.error('💥 Update failed with error:', error);
  process.exit(1);
});
