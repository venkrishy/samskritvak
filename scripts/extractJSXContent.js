#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

class JSXContentExtractor {
  constructor() {
    this.basePath = '/Users/venky/git/samskritvak/src/app';
    this.extractedContent = {};
  }

  // Extract content from a single JSX file
  extractFromFile(filePath, chapterNumber) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const extracted = {
        filePath,
        chapterNumber,
        title: this.extractTitle(content),
        subtitle: this.extractSubtitle(content),
        goalAndVocabulary: this.extractGoalAndVocabulary(content),
        tips: this.extractTips(content),
        exampleDialogue: this.extractExampleDialogue(content),
        examples: this.extractExamples(content),
        quiz: this.extractQuiz(content),
        images: this.extractImages(content)
      };
      
      return extracted;
    } catch (error) {
      console.error(`❌ Error reading ${filePath}:`, error.message);
      return null;
    }
  }

  extractTitle(content) {
    const titleMatch = content.match(/title="([^"]+)"/);
    return titleMatch ? titleMatch[1] : '';
  }

  extractSubtitle(content) {
    const subtitleMatch = content.match(/subtitle="([^"]+)"/);
    return subtitleMatch ? subtitleMatch[1] : '';
  }

  extractGoalAndVocabulary(content) {
    const goalMatch = content.match(/title="Goal and Vocabulary"[\s\S]*?content="([^"]+)"/);
    if (goalMatch) {
      return {
        title: 'Goal and Vocabulary',
        content: goalMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
      };
    }
    return null;
  }

  extractTips(content) {
    const tipsMatch = content.match(/tips="([^"]+)"/);
    return tipsMatch ? tipsMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '';
  }

  extractExampleDialogue(content) {
    const dialogueMatch = content.match(/title="Example Dialogue"[\s\S]*?content="([^"]+)"/);
    if (dialogueMatch) {
      return {
        title: 'Example Dialogue',
        content: dialogueMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
      };
    }
    return null;
  }

  extractExamples(content) {
    const examples = [];
    const exampleMatches = content.matchAll(/examples=\[([\s\S]*?)\]/g);
    
    for (const match of exampleMatches) {
      const exampleContent = match[1];
      const sanskritMatches = exampleContent.matchAll(/sanskrit:\s*"([^"]+)"/g);
      const englishMatches = exampleContent.matchAll(/english:\s*"([^"]+)"/g);
      
      const sanskritArray = Array.from(sanskritMatches, m => m[1]);
      const englishArray = Array.from(englishMatches, m => m[1]);
      
      for (let i = 0; i < Math.min(sanskritArray.length, englishArray.length); i++) {
        examples.push({
          sanskrit: sanskritArray[i],
          english: englishArray[i]
        });
      }
    }
    
    return examples;
  }

  extractQuiz(content) {
    const quizMatch = content.match(/<QuizCard[\s\S]*?question="([^"]+)"[\s\S]*?options=\[([\s\S]*?)\][\s\S]*?correctAnswer="([^"]+)"/);
    if (quizMatch) {
      const optionsContent = quizMatch[2];
      const options = [];
      const optionMatches = optionsContent.matchAll(/"([^"]+)"/g);
      
      for (const match of optionMatches) {
        options.push(match[1]);
      }
      
      return {
        question: quizMatch[1],
        options,
        correctAnswer: quizMatch[3]
      };
    }
    return null;
  }

  extractImages(content) {
    const images = [];
    const imageMatches = content.matchAll(/imageSrc="([^"]+)"/g);
    
    for (const match of imageMatches) {
      images.push(match[1]);
    }
    
    return images;
  }

  // Convert extracted content to Notion blocks format
  convertToNotionBlocks(extracted) {
    const blocks = [];
    
    // Add title as heading
    if (extracted.title) {
      blocks.push({
        type: 'heading_2',
        heading_2: {
          rich_text: [{ text: { content: extracted.title } }]
        }
      });
    }
    
    // Add subtitle as paragraph
    if (extracted.subtitle) {
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: extracted.subtitle } }]
        }
      });
    }
    
    // Add goal and vocabulary
    if (extracted.goalAndVocabulary) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: extracted.goalAndVocabulary.title } }]
        }
      });
      
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: extracted.goalAndVocabulary.content } }]
        }
      });
    }
    
    // Add examples as bulleted list
    if (extracted.examples && extracted.examples.length > 0) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: 'Vocabulary Examples' } }]
        }
      });
      
      extracted.examples.forEach(example => {
        blocks.push({
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              { text: { content: `${example.sanskrit} - ` } },
              { text: { content: example.english, annotations: { italic: true } } }
            ]
          }
        });
      });
    }
    
    // Add tips
    if (extracted.tips) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: 'Tips' } }]
        }
      });
      
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: extracted.tips } }]
        }
      });
    }
    
    // Add example dialogue
    if (extracted.exampleDialogue) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: extracted.exampleDialogue.title } }]
        }
      });
      
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: extracted.exampleDialogue.content } }]
        }
      });
    }
    
    // Add quiz
    if (extracted.quiz) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: 'Quiz Question' } }]
        }
      });
      
      blocks.push({
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: extracted.quiz.question } }]
        }
      });
      
      extracted.quiz.options.forEach((option, index) => {
        const letter = String.fromCharCode(65 + index); // A, B, C, D
        blocks.push({
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: `${letter}) ${option}` } }]
          }
        });
      });
    }
    
    // Add image placeholders
    if (extracted.images && extracted.images.length > 0) {
      blocks.push({
        type: 'heading_3',
        heading_3: {
          rich_text: [{ text: { content: 'Images' } }]
        }
      });
      
      extracted.images.forEach(image => {
        blocks.push({
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: `[Image placeholder - ${image} - will be added]` } }]
          }
        });
      });
    }
    
    return blocks;
  }

  // Extract content from all JSX files in a chapter directory
  extractChapterContent(chapterDir, chapterNumber) {
    const chapterPath = path.join(this.basePath, chapterDir);
    const extracted = {};
    
    try {
      const items = fs.readdirSync(chapterPath, { withFileTypes: true });
      
      items.forEach(item => {
        if (item.isDirectory() && item.name !== 'page.jsx') {
          const subTopicPath = path.join(chapterPath, item.name, 'page.jsx');
          if (fs.existsSync(subTopicPath)) {
            const content = this.extractFromFile(subTopicPath, chapterNumber);
            if (content) {
              extracted[item.name] = {
                ...content,
                notionBlocks: this.convertToNotionBlocks(content)
              };
            }
          }
        }
      });
      
      return extracted;
    } catch (error) {
      console.error(`❌ Error processing chapter ${chapterDir}:`, error.message);
      return {};
    }
  }

  // Extract content from all chapters (1-6)
  async extractAllContent() {
    console.log('📚 Extracting content from JSX files...\n');
    
    const chapters = [
      { dir: '01-getting-started', number: 1 },
      { dir: '02-existence-identification', number: 2 },
      { dir: '03-location', number: 3 },
      { dir: '04-actions', number: 4 },
      { dir: '05-plurals', number: 5 },
      { dir: '06-directions', number: 6 }
    ];
    
    for (const chapter of chapters) {
      console.log(`📖 Processing Chapter ${chapter.number}: ${chapter.dir}`);
      const content = this.extractChapterContent(chapter.dir, chapter.number);
      this.extractedContent[`chapter_${chapter.number}`] = content;
      
      const subTopicCount = Object.keys(content).length;
      console.log(`   ✅ Found ${subTopicCount} subtopics`);
    }
    
    // Generate summary
    const totalSubTopics = Object.values(this.extractedContent)
      .reduce((sum, chapter) => sum + Object.keys(chapter).length, 0);
    
    console.log(`\n📊 Extraction Summary:`);
    console.log(`   Total subtopics: ${totalSubTopics}`);
    console.log(`   Chapters processed: ${chapters.length}`);
    
    return this.extractedContent;
  }

  // Save extracted content to JSON file
  saveToFile() {
    const outputPath = '/Users/venky/git/samskritvak/extracted-jsx-content.json';
    fs.writeFileSync(outputPath, JSON.stringify(this.extractedContent, null, 2), 'utf8');
    console.log(`\n💾 Content saved to: ${outputPath}`);
    return outputPath;
  }
}

// Run the extraction
const extractor = new JSXContentExtractor();
extractor.extractAllContent()
  .then(() => extractor.saveToFile())
  .catch(error => {
    console.error('💥 Extraction failed with error:', error);
    process.exit(1);
  });
