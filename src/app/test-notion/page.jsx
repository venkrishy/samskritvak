import React from 'react';
import { useLesson } from '../../hooks/useLesson';

const TestNotionPage = () => {
  const { lesson, loading, error } = useLesson('1'); // Test with lesson ID 1

  if (loading) return <div>Loading lesson from Notion...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!lesson) return <div>No lesson found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Notion Integration Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {lesson.title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <span className="font-medium text-gray-600">Category:</span>
              <span className="ml-2 text-gray-800">{lesson.category}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Level:</span>
              <span className="ml-2 text-gray-800">{lesson.level}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Order:</span>
              <span className="ml-2 text-gray-800">{lesson.order}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Last Modified:</span>
              <span className="ml-2 text-gray-800">
                {new Date(lesson.lastModified).toLocaleDateString()}
              </span>
            </div>
          </div>

          {lesson.content && (
            <div className="space-y-4">
              {lesson.content.goalAndVocabulary && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Goal and Vocabulary
                  </h3>
                  <p className="text-gray-600">{lesson.content.goalAndVocabulary}</p>
                </div>
              )}
              
              {lesson.content.tips && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Tips
                  </h3>
                  <p className="text-gray-600">{lesson.content.tips}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            ✅ Notion Integration Working!
          </h3>
          <p className="text-green-700">
            This lesson was loaded from your Notion database. 
            Teachers can now edit all content in Notion and it will sync to your app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestNotionPage;

