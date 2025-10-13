import ChapterTitleCard from '@/components/cards/ChapterTitleCard'
import ExplanationCard from '@/components/cards/ExplanationCard'
import ImageCard from '@/components/cards/ImageCard'
import QuizCard from '@/components/cards/QuizCard'
import { getLessonNavigation } from '@/lib/navigation'
import { useLesson } from '@/hooks/useLesson'

export default function RequestsCommandsNotionPage() {
  const navigation = getLessonNavigation('/04-actions/requests-commands');
  const { lessonData, loading, error } = useLesson('requests-commands');
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-muted-foreground">Loading lesson from Notion...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Error loading lesson</h3>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }
  
  if (!lessonData) {
    return (
      <div className="text-center py-8 text-gray-500">
        Lesson not found. Please check if the lesson exists in Notion.
      </div>
    );
  }
  
  const { content } = lessonData;
  
  return (
    <div className="space-y-4">
      {/* Chapter & Title Card */}
      <ChapterTitleCard 
        {...navigation}
        title={content.title}
        subtitle={content.subtitle}
        level={content.level}
        progress={content.progress}
      />
      
      {/* Goal and Vocabulary Card */}
      {content.goalAndVocabulary && (
        <ExplanationCard 
          title={content.goalAndVocabulary.title}
          content={content.goalAndVocabulary.content}
          examples={content.goalAndVocabulary.examples}
          tips={content.goalAndVocabulary.tips}
        />
      )}
      
      {/* Tips Card */}
      {content.tips && (
        <ExplanationCard 
          title={content.tips.title}
          content={content.tips.content}
          tips={content.tips.tips}
        />
      )}
      
      {/* Example Dialogue Card */}
      {content.exampleDialogue && (
        <ExplanationCard 
          title={content.exampleDialogue.title}
          content={content.exampleDialogue.content}
          examples={content.exampleDialogue.examples}
        />
      )}
      
      {/* Image Card */}
      {content.image && (
        <ImageCard 
          imageSrc={content.image.imageSrc}
          imageAlt={content.image.imageAlt}
          description={content.image.description}
          placeholder={content.image.placeholder}
        />
      )}
      
      {/* Quiz Cards */}
      {content.quiz && content.quiz.map((quiz, index) => (
        <QuizCard 
          key={index}
          question={quiz.question}
          options={quiz.options}
          correctAnswer={quiz.correctAnswer}
          explanation={quiz.explanation}
          type={quiz.type}
        />
      ))}
    </div>
  )
}

