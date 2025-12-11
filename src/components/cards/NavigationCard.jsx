/**
 * @deprecated This component is deprecated and should not be used.
 * Use ChapterTitleCard instead for lesson page headers and navigation.
 * 
 * NavigationCard was designed for chapter overview pages but was incorrectly
 * used in lesson pages, causing layout issues. ChapterTitleCard provides
 * the correct lesson-focused navigation and styling.
 * 
 * @deprecated_since 2024-12-19
 * @replacement ChapterTitleCard
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavigationCard = ({ 
  currentLesson, 
  chapterNumber, 
  lessonNumber, 
  totalLessons,
  chapterTitle,
  nextLesson,
  prevLesson,
  nextChapter,
  prevChapter
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Chapter Level Navigation */}
      <Card className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Chapter Navigation */}
            <div className="flex space-x-2">
              {prevChapter && (
                <Link to={prevChapter.url}>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 border-green-300 text-green-700 hover:bg-green-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev Chapter</span>
                  </Button>
                </Link>
              )}
              
              {nextChapter ? (
                <Link to={nextChapter.url}>
                  <Button 
                    className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  disabled
                  className="flex items-center space-x-2 bg-gray-400 text-gray-600 cursor-not-allowed"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Chapter Info with lesson count */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-800">{chapterTitle}</h3>
              <p className="text-sm text-green-600">Chapter {chapterNumber} • Lesson {lessonNumber} of {totalLessons}</p>
            </div>

            {/* Spacer for balance */}
            <div className="w-32"></div>
          </div>
        </CardContent>
      </Card>

      {/* Lesson Level Navigation - moved below title area by consumer layout; keep component order as-is */}
      <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mt-2">
        <CardContent className="p-4 pt-2">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Lesson Navigation */}
            <div className="flex space-x-2">
              {prevLesson && (
                <Link to={prevLesson.url}>
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Button>
                </Link>
              )}
              
              {nextLesson ? (
                <Link to={nextLesson.url}>
                  <Button 
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <Button 
                  disabled
                  className="flex items-center space-x-2 bg-gray-400 text-gray-600 cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Lesson Info */}
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800">
                {currentLesson}
              </h3>
              <p className="text-sm text-blue-600">
                Lesson {lessonNumber} of {totalLessons}
              </p>
            </div>

            {/* Spacer for balance */}
            <div className="w-32"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationCard;
