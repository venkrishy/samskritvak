/**
 * Parse Notion blocks into app-compatible format
 */

export class ContentParser {
  /**
   * Parse Notion blocks into structured lesson content
   */
  static parseLessonBlocks(blocks) {
    const content = {
      goalAndVocabulary: null,
      tips: null,
      exampleDialogue: null,
      image: null,
      quiz: []
    };

    let currentSection = null;
    let currentQuiz = null;

    for (const block of blocks) {
      const blockType = block.type;
      
      // Handle headings to identify sections
      if (blockType === 'heading_1' || blockType === 'heading_2' || blockType === 'heading_3') {
        const headingText = this.extractText(block[blockType].rich_text);
        currentSection = this.identifySection(headingText);
        continue;
      }

      // Handle different block types based on current section
      switch (currentSection) {
        case 'goalAndVocabulary':
          content.goalAndVocabulary = this.parseGoalAndVocabulary(block, content.goalAndVocabulary);
          break;
        case 'tips':
          content.tips = this.parseTips(block, content.tips);
          break;
        case 'exampleDialogue':
          content.exampleDialogue = this.parseExampleDialogue(block, content.exampleDialogue);
          break;
        case 'image':
          content.image = this.parseImage(block);
          break;
        case 'quiz':
          const quizItem = this.parseQuizItem(block);
          if (quizItem) {
            content.quiz.push(quizItem);
          }
          break;
      }
    }

    return content;
  }

  /**
   * Extract text content from Notion rich text
   */
  static extractText(richText) {
    if (!richText) return '';
    return richText.map(item => item.plain_text).join('');
  }

  /**
   * Identify which section a heading belongs to
   */
  static identifySection(headingText) {
    const text = headingText.toLowerCase();
    
    if (text.includes('goal') && text.includes('vocabulary')) {
      return 'goalAndVocabulary';
    } else if (text.includes('tip')) {
      return 'tips';
    } else if (text.includes('dialogue') || text.includes('example')) {
      return 'exampleDialogue';
    } else if (text.includes('image') || text.includes('picture')) {
      return 'image';
    } else if (text.includes('quiz') || text.includes('question')) {
      return 'quiz';
    }
    
    return null;
  }

  /**
   * Parse Goal and Vocabulary section
   */
  static parseGoalAndVocabulary(block, existing) {
    const content = existing || { content: '', examples: [] };
    
    switch (block.type) {
      case 'paragraph':
        if (!content.content) {
          content.content = this.extractText(block.paragraph.rich_text);
        }
        break;
      case 'bulleted_list_item':
        // Handle vocabulary items
        const item = this.extractText(block.bulleted_list_item.rich_text);
        if (item.includes('→') || item.includes('-')) {
          const parts = item.split(/→|-/);
          if (parts.length === 2) {
            content.examples.push({
              sanskrit: parts[0].trim(),
              english: parts[1].trim()
            });
          }
        }
        break;
    }
    
    return content;
  }

  /**
   * Parse Tips section
   */
  static parseTips(block, existing) {
    const content = existing || { content: '', tips: [] };
    
    switch (block.type) {
      case 'paragraph':
        if (!content.content) {
          content.content = this.extractText(block.paragraph.rich_text);
        }
        break;
      case 'bulleted_list_item':
        const tip = this.extractText(block.bulleted_list_item.rich_text);
        content.tips.push(tip);
        break;
    }
    
    return content;
  }

  /**
   * Parse Example Dialogue section
   */
  static parseExampleDialogue(block, existing) {
    const content = existing || { content: '', examples: [] };
    
    switch (block.type) {
      case 'paragraph':
        if (!content.content) {
          content.content = this.extractText(block.paragraph.rich_text);
        }
        break;
      case 'bulleted_list_item':
        const item = this.extractText(block.bulleted_list_item.rich_text);
        if (item.includes(':')) {
          const parts = item.split(':');
          if (parts.length === 2) {
            content.examples.push({
              sanskrit: parts[0].trim(),
              english: parts[1].trim()
            });
          }
        }
        break;
    }
    
    return content;
  }

  /**
   * Parse Image section
   */
  static parseImage(block) {
    if (block.type === 'image') {
      return {
        url: block.image.external?.url || block.image.file?.url,
        caption: this.extractText(block.image.caption)
      };
    }
    return null;
  }

  /**
   * Parse Quiz items
   */
  static parseQuizItem(block) {
    if (block.type === 'paragraph') {
      const text = this.extractText(block.paragraph.rich_text);
      
      // Parse quiz question format: "Q: Question text?"
      if (text.startsWith('Q:') || text.startsWith('Question:')) {
        return {
          type: 'question',
          text: text.replace(/^(Q:|Question:)\s*/, '')
        };
      }
      
      // Parse options format: "A: option1 | option2 | option3 | option4"
      if (text.startsWith('A:') || text.startsWith('Options:')) {
        const optionsText = text.replace(/^(A:|Options:)\s*/, '');
        return {
          type: 'options',
          options: optionsText.split('|').map(opt => opt.trim())
        };
      }
      
      // Parse correct answer format: "Correct: option1"
      if (text.startsWith('Correct:')) {
        return {
          type: 'correct',
          answer: text.replace('Correct:', '').trim()
        };
      }
      
      // Parse explanation format: "Explanation: Why this is correct"
      if (text.startsWith('Explanation:')) {
        return {
          type: 'explanation',
          text: text.replace('Explanation:', '').trim()
        };
      }
    }
    
    return null;
  }

  /**
   * Transform parsed content into component props
   */
  static transformToComponentProps(parsedContent, lessonMetadata) {
    const props = {
      title: lessonMetadata.title,
      subtitle: lessonMetadata.subtitle || 'Learning essential concepts',
      level: lessonMetadata.level || 'Beginner',
      progress: lessonMetadata.progress || 50,
      imageUrl: lessonMetadata.imageUrl,
      
      // Goal and Vocabulary card
      goalAndVocabulary: parsedContent.goalAndVocabulary ? {
        title: 'Goal and Vocabulary',
        content: `<p>${parsedContent.goalAndVocabulary.content}</p>`,
        examples: parsedContent.goalAndVocabulary.examples || [],
        tips: parsedContent.goalAndVocabulary.tips?.join(' ') || ''
      } : null,
      
      // Tips card
      tips: parsedContent.tips ? {
        title: 'Tips',
        content: `<p>${parsedContent.tips.content}</p>`,
        tips: parsedContent.tips.tips || []
      } : null,
      
      // Example Dialogue card
      exampleDialogue: parsedContent.exampleDialogue ? {
        title: 'Example Dialogue',
        content: `<p>${parsedContent.exampleDialogue.content}</p>`,
        examples: parsedContent.exampleDialogue.examples || []
      } : null,
      
      // Image card
      image: parsedContent.image ? {
        imageSrc: parsedContent.image.url,
        imageAlt: parsedContent.image.caption || 'Lesson image',
        description: `<p>Practice using the vocabulary with the image.</p><p><strong>Practice:</strong> Use the vocabulary in sentences.</p>`,
        placeholder: 'Write practice sentences in transliteration...'
      } : null,
      
      // Quiz cards
      quiz: this.transformQuizItems(parsedContent.quiz)
    };
    
    return props;
  }

  /**
   * Transform quiz items into quiz card props
   */
  static transformQuizItems(quizItems) {
    const quizCards = [];
    let currentQuiz = null;
    
    for (const item of quizItems) {
      switch (item.type) {
        case 'question':
          if (currentQuiz) {
            quizCards.push(currentQuiz);
          }
          currentQuiz = {
            question: item.text,
            type: 'multiple-choice',
            options: [],
            correctAnswer: '',
            explanation: ''
          };
          break;
          
        case 'options':
          if (currentQuiz) {
            currentQuiz.options = item.options;
          }
          break;
          
        case 'correct':
          if (currentQuiz) {
            currentQuiz.correctAnswer = item.answer;
          }
          break;
          
        case 'explanation':
          if (currentQuiz) {
            currentQuiz.explanation = item.text;
          }
          break;
      }
    }
    
    if (currentQuiz) {
      quizCards.push(currentQuiz);
    }
    
    return quizCards;
  }
}

export default ContentParser;

