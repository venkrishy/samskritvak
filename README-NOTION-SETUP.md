# Notion Integration Setup Guide

This guide will help you set up Notion as your content management system for the Sanskrit Learning App.

## Prerequisites

- A Notion account (free)
- Node.js and npm installed
- Access to your Sanskrit Learning App repository

## Step 1: Create Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name like "Sanskrit Learning App"
4. Select your workspace
5. Click "Submit"
6. Copy the "Internal Integration Token" (starts with `secret_`)

## Step 2: Create Notion Database

1. In your Notion workspace, create a new page
2. Add a database by typing `/database` and selecting "Table - Inline"
3. Name it "Sanskrit Lessons"
4. Add the following properties to your database:

### Database Properties

| Property Name | Type | Description |
|---------------|------|-------------|
| Title | Title | Auto-created title field |
| LessonID | Text | Unique identifier (e.g., "greetings", "basic_numbers") |
| Category | Select | Options: Foundational, Pronouns, Numbers, Vocabulary, Grammar, Time and Calendar, Verbs, Directions and Locations, Conversation, Advanced |
| Level | Select | Options: Beginner, Intermediate, Advanced |
| Status | Select | Options: Draft, Published |
| ImageURL | URL | Link to lesson image |
| Order | Number | For sorting lessons |

## Step 3: Share Database with Integration

1. Open your "Sanskrit Lessons" database
2. Click "Share" in the top right
3. Click "Add people, emails, groups, or integrations"
4. Search for your integration name ("Sanskrit Learning App")
5. Select it and give it "Can edit" permissions
6. Copy the database ID from the URL (the long string after the last `/` and before the `?`)

## Step 4: Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```
   NOTION_API_KEY=secret_your_integration_token_here
   NOTION_DATABASE_ID=your_database_id_here
   ```

## Step 5: Install Dependencies

```bash
npm install
```

## Step 6: Migrate Content to Notion

Run the migration script to push all existing content to Notion:

```bash
npm run migrate-to-notion
```

This will:
- Read all existing lesson content
- Create pages in your Notion database
- Set all properties and content blocks
- Generate a migration log

## Step 7: Sync Content from Notion

After migration, sync the content back to create the cache:

```bash
npm run sync-notion
```

This will:
- Fetch all published lessons from Notion
- Parse the content into app-compatible format
- Create a cache file (`src/data/notionCache.json`)
- Generate a sync log

## Step 8: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit a lesson page to see if content loads from Notion cache

3. Check the example Notion-powered lesson at:
   `/04-actions/requests-commands-notion`

## Content Editing Workflow

### For Teachers:

1. **Edit Content**: Open any lesson page in Notion and edit directly
2. **Update Properties**: Change category, level, status, or image URL
3. **Add Content**: Use Notion's rich text editor to add sections
4. **Sync Changes**: Run `npm run sync-notion` to pull changes to the app

### Content Structure in Notion:

Each lesson page should have these sections:

1. **Goal and Vocabulary** (Heading 2)
   - Main content paragraph
   - Bulleted list of vocabulary items (Sanskrit → English)

2. **Tips** (Heading 2)
   - Main content paragraph
   - Bulleted list of tips

3. **Example Dialogue** (Heading 2)
   - Main content paragraph
   - Bulleted list of dialogue examples (Person A: Sanskrit → English)

4. **Quiz Time!** (Heading 2)
   - Quiz questions in format:
     - Q: Question text?
     - A: option1 | option2 | option3 | option4
     - Correct: option1
     - Explanation: Why this is correct

## Troubleshooting

### Common Issues:

1. **"Unauthorized" Error**: Check your API key and database permissions
2. **"Database not found"**: Verify the database ID is correct
3. **"Rate limit exceeded"**: The scripts include delays, but you can increase them if needed
4. **Content not loading**: Check the browser console for errors

### Debug Commands:

```bash
# Check if environment variables are loaded
node -e "console.log(process.env.NOTION_API_KEY ? 'API Key loaded' : 'API Key missing')"

# Test Notion connection
node -e "
import NotionService from './src/services/notionService.js';
const notion = new NotionService();
notion.getAllLessons().then(console.log).catch(console.error);
"
```

## File Structure

```
├── src/
│   ├── services/
│   │   ├── notionService.js      # Notion API wrapper
│   │   └── contentParser.js      # Parse Notion blocks
│   ├── hooks/
│   │   └── useLesson.js          # React hook for lesson data
│   └── data/
│       └── notionCache.json      # Cached lesson data
├── scripts/
│   ├── migrateToNotion.js        # Migration script
│   └── syncFromNotion.js         # Sync script
└── .env.local                    # Your Notion credentials
```

## Next Steps

1. **Test with a few lessons** before migrating all content
2. **Train teachers** on the Notion editing workflow
3. **Set up regular sync** (can be automated later)
4. **Consider auto-sync** for production use

## Support

If you encounter issues:
1. Check the migration/sync logs
2. Verify Notion database structure
3. Test with a simple lesson first
4. Check browser console for errors

The system is designed to be robust with fallbacks to curriculum data if Notion content is unavailable.

