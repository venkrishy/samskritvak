import { useState, useEffect } from 'react';

/**
 * Custom hook to fetch lesson data from Notion cache
 */
export function useLesson(lessonId) {
  const [lessonData, setLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load from cache first
        const cacheData = await loadFromCache();
        
        if (cacheData && cacheData.lessons && cacheData.lessons[lessonId]) {
          setLessonData(cacheData.lessons[lessonId]);
        } else {
          // Fallback to curriculum data if not in cache
          const fallbackData = await loadFromCurriculum(lessonId);
          setLessonData(fallbackData);
        }
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  return { lesson: lessonData, loading, error };
}

/**
 * Load lesson data from Notion cache
 */
async function loadFromCache() {
  try {
    const response = await fetch('/src/data/notionCache.json');
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Could not load Notion cache:', error);
  }
  return null;
}

/**
 * Load lesson data from curriculum (fallback)
 */
async function loadFromCurriculum(lessonId) {
  try {
    // Import curriculum data dynamically
    const { curriculumData } = await import('../data/curriculum.js');
    
    // Find lesson in curriculum data
    for (const [categoryId, category] of Object.entries(curriculumData)) {
      const lesson = category.lessons.find(l => l.id === lessonId);
      if (lesson) {
        return {
          lessonId: lesson.id,
          title: lesson.title,
          category: category.title,
          level: 'Beginner',
          imageUrl: '/images/placeholder.png',
          content: {
            title: lesson.title,
            subtitle: lesson.description,
            level: 'Beginner',
            progress: 50,
            goalAndVocabulary: {
              title: 'Goal and Vocabulary',
              content: '<p>Learn essential vocabulary and concepts in Sanskrit.</p>',
              examples: [
                { sanskrit: 'example (उदाहरण)', english: 'example' },
                { sanskrit: 'practice (अभ्यास)', english: 'practice' }
              ],
              tips: 'This is placeholder content that needs to be customized for each lesson.'
            },
            exampleDialogue: {
              title: 'Example Dialogue',
              content: '<p>Here\'s how you can use the vocabulary in conversation:</p>',
              examples: [
                { sanskrit: 'Person A: example question', english: 'Example question' },
                { sanskrit: 'Person B: example answer', english: 'Example answer' }
              ]
            },
            image: {
              imageSrc: '/images/placeholder.png',
              imageAlt: 'Placeholder image for practice',
              description: '<p>Practice using the vocabulary with the image.</p><p><strong>Practice:</strong> Use the vocabulary in sentences.</p>',
              placeholder: 'Write practice sentences in transliteration...'
            },
            quiz: [
              {
                question: "What does 'example' mean?",
                options: ['option1', 'option2', 'option3', 'option4'],
                correctAnswer: 'option1',
                explanation: 'This is a placeholder explanation.'
              }
            ]
          }
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading from curriculum:', error);
    return null;
  }
}

/**
 * Hook to check if cache is stale and needs refresh
 */
export function useCacheStatus() {
  const [isStale, setIsStale] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    const checkCacheStatus = async () => {
      try {
        const cacheData = await loadFromCache();
        if (cacheData) {
          setLastSync(cacheData.lastSync);
          
          // Check if cache is older than 1 hour
          const lastSyncTime = new Date(cacheData.lastSync);
          const now = new Date();
          const hoursDiff = (now - lastSyncTime) / (1000 * 60 * 60);
          setIsStale(hoursDiff > 1);
        } else {
          setIsStale(true);
        }
      } catch (error) {
        console.error('Error checking cache status:', error);
        setIsStale(true);
      }
    };

    checkCacheStatus();
  }, []);

  return { isStale, lastSync };
}

export default useLesson;
