#!/usr/bin/env node

import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

class NotionConnectivityTester {
  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_INTEGRATION_TOKEN,
    });
    
    // Database IDs for the four new databases
    this.databases = {
      languages: process.env.NOTION_LANGUAGES_DB_ID,
      levels: process.env.NOTION_LEVELS_DB_ID,
      chapters: process.env.NOTION_CHAPTERS_DB_ID,
      topics: process.env.NOTION_TOPICS_DB_ID
    };
  }

  async testConnection() {
    console.log('🔍 Testing Notion API connectivity...\n');
    
    try {
      // Test basic API connectivity
      const user = await this.notion.users.me();
      console.log('✅ Notion API connection successful');
      console.log(`   Connected as: ${user.name || 'Unknown User'}`);
      console.log(`   User ID: ${user.id}\n`);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to Notion API:', error.message);
      return false;
    }
  }

  async testDatabase(databaseName, databaseId) {
    console.log(`📊 Testing ${databaseName} database...`);
    
    if (!databaseId) {
      console.log(`   ⚠️  No database ID provided for ${databaseName}`);
      console.log(`   Please set NOTION_${databaseName.toUpperCase()}_DB_ID in your .env.local file\n`);
      return false;
    }

    try {
      // Test database retrieval
      const database = await this.notion.databases.retrieve({
        database_id: databaseId
      });
      
      console.log(`   ✅ Database "${database.title[0]?.text?.content || 'Untitled'}" found`);
      console.log(`   📋 Properties: ${Object.keys(database.properties).length}`);
      
      // List properties
      const properties = Object.keys(database.properties);
      console.log(`   📝 Property names: ${properties.join(', ')}`);
      
      // Test querying the database
      const queryResult = await this.notion.databases.query({
        database_id: databaseId,
        page_size: 5
      });
      
      console.log(`   📄 Records found: ${queryResult.results.length}`);
      
      if (queryResult.results.length > 0) {
        console.log(`   📋 Sample record properties:`);
        const sampleRecord = queryResult.results[0];
        Object.keys(sampleRecord.properties).forEach(prop => {
          const propValue = sampleRecord.properties[prop];
          let value = 'N/A';
          
          if (propValue.type === 'title' && propValue.title.length > 0) {
            value = propValue.title[0].text.content;
          } else if (propValue.type === 'rich_text' && propValue.rich_text.length > 0) {
            value = propValue.rich_text[0].text.content;
          } else if (propValue.type === 'select' && propValue.select) {
            value = propValue.select.name;
          } else if (propValue.type === 'number') {
            value = propValue.number;
          } else if (propValue.type === 'url') {
            value = propValue.url;
          }
          
          console.log(`      ${prop}: ${value}`);
        });
      }
      
      console.log(`   ✅ ${databaseName} database test completed\n`);
      return true;
      
    } catch (error) {
      console.log(`   ❌ Failed to access ${databaseName} database: ${error.message}\n`);
      return false;
    }
  }

  async testAllDatabases() {
    console.log('🗄️  Testing all four databases...\n');
    
    const results = {};
    
    for (const [name, id] of Object.entries(this.databases)) {
      results[name] = await this.testDatabase(name, id);
    }
    
    return results;
  }

  async runFullTest() {
    console.log('🚀 Starting Notion Connectivity Test\n');
    console.log('=' .repeat(50));
    
    // Test basic connectivity
    const connectionOk = await this.testConnection();
    if (!connectionOk) {
      console.log('❌ Cannot proceed without basic API connectivity');
      return;
    }
    
    // Test all databases
    const results = await this.testAllDatabases();
    
    // Summary
    console.log('📊 Test Summary');
    console.log('=' .repeat(50));
    
    const totalDatabases = Object.keys(this.databases).length;
    const successfulDatabases = Object.values(results).filter(Boolean).length;
    
    console.log(`Total databases tested: ${totalDatabases}`);
    console.log(`Successful connections: ${successfulDatabases}`);
    console.log(`Failed connections: ${totalDatabases - successfulDatabases}\n`);
    
    // Detailed results
    Object.entries(results).forEach(([name, success]) => {
      console.log(`${success ? '✅' : '❌'} ${name}: ${success ? 'Connected' : 'Failed'}`);
    });
    
    if (successfulDatabases === totalDatabases) {
      console.log('\n🎉 All database connections successful!');
    } else {
      console.log('\n⚠️  Some database connections failed. Check your environment variables.');
    }
  }
}

// Run the test
const tester = new NotionConnectivityTester();
tester.runFullTest().catch(error => {
  console.error('💥 Test failed with error:', error);
  process.exit(1);
});
