// Comprehensive curriculum data structure
export interface Topic {
  number: string
  title: string
  description: string
  explanation: string
  example: string
  example_tips: string
  dialogue: string
}

export interface Chapter {
  number: number
  title: string
  description: string
  topics: Topic[]
}

export const curriculumData: Chapter[] = [
  {
    number: 1,
    title: "Hello! Getting Started",
    description: "Learn the fundamentals of Sanskrit through greetings, introductions, and basic vocabulary.",
    topics: [
      {
        number: "1.1",
        title: "Greetings and Identity",
        description: "Basic greetings and introducing yourself in Sanskrit",
        explanation: "Learn how to greet people and introduce yourself in Sanskrit. This lesson covers the fundamental phrases for meeting and getting to know someone.",
        example: "namaste (नमस्ते) → Hello | svāgatam (स्वागतम्) → Welcome | mama nāma (मम नाम) → My name | tava nāma (तव नाम) → Your name | kaḥ (कः) → Who | kim (किम्) → What",
        example_tips: "Use 'namaste' for both hello and goodbye. It's a respectful greeting that can be used at any time of day.",
        dialogue: "Person A: namaste! (Hello!) | Person B: namaste! mama nāma Rāmaḥ. (Hello! My name is Rama.) | Person A: tava nāma kim? (What is your name?) | Person B: mama nāma Sītā. (My name is Sita.)"
      },
      {
        number: "1.2",
        title: "My Name Is... (The Masculine Name)",
        description: "Learning masculine gender names and introductions",
        explanation: "Learn how to introduce yourself using masculine names in Sanskrit. Masculine names typically end in '-ah' and represent male persons or masculine concepts.",
        example: "mama nāma (मम नाम) → My name | rāmaḥ (रामः) → Rama (masculine name) | kṛṣṇaḥ (कृष्णः) → Krishna (masculine name)",
        example_tips: "Masculine names in Sanskrit typically end in '-ah' in the nominative case. These represent male persons or masculine concepts.",
        dialogue: "Person A: mama nāma rāmaḥ. → My name is Rama."
      },
      {
        number: "1.3",
        title: "My Name Is... (The Feminine Name)",
        description: "Learning feminine gender names and introductions",
        explanation: "Learn how to introduce yourself using feminine names in Sanskrit. Feminine names typically end in '-ā' and represent female persons or feminine concepts.",
        example: "mama nāma (मम नाम) → My name | sītā (सीता) → Sita (feminine name) | lakṣmī (लक्ष्मी) → Lakshmi (feminine name)",
        example_tips: "Feminine names in Sanskrit typically end in '-ā' in the nominative case. These represent female persons or feminine concepts.",
        dialogue: "Person A: mama nāma sītā. → My name is Sita."
      },
      {
        number: "1.4",
        title: "Asking: Who? and What? (kaḥ and kim)",
        description: "Learning interrogative pronouns",
        explanation: "Learn how to ask questions using 'who' and 'what' in Sanskrit. These are fundamental question words that help you gather information.",
        example: "kaḥ (कः) → who (masculine) | kim (किम्) → what | kā (का) → who (feminine)",
        example_tips: "Use 'kaḥ' for asking about people (masculine), 'kā' for feminine, and 'kim' for asking about things or concepts.",
        dialogue: "Person A: kaḥ tvam? (Who are you?) | Person B: ahaṃ rāmaḥ. (I am Rama.)"
      },
      {
        number: "1.5",
        title: "Yes/No: Simple Affirmation and Negation",
        description: "Learning to say yes and no in Sanskrit",
        explanation: "Learn the basic ways to express agreement and disagreement in Sanskrit. These are essential for conversations.",
        example: "āṃ (आम्) → yes | na (न) → no | evaṃ (एवं) → yes, indeed",
        example_tips: "Use 'āṃ' for simple yes, 'na' for no, and 'evaṃ' for emphatic agreement.",
        dialogue: "Person A: kim gacchasi? (Are you going?) | Person B: āṃ, gacchāmi. (Yes, I am going.)"
      },
      {
        number: "1.6",
        title: "Vocabulary: Top 10 Daily Use Items",
        description: "Essential vocabulary for daily conversations",
        explanation: "Learn the most commonly used Sanskrit words for everyday objects and activities.",
        example: "jala (जल) → water | annam (अन्नम्) → food | vastram (वस्त्रम्) → clothing | pustakam (पुस्तकम्) → book",
        example_tips: "These words are used frequently in daily life and form the foundation of basic Sanskrit vocabulary.",
        dialogue: "Person A: kim icchasi? (What do you want?) | Person B: jalam icchāmi. (I want water.)"
      }
    ]
  },
  {
    number: 2,
    title: "Naming Things & Asking 'Is It There?'",
    description: "Learn to identify objects and ask about their existence using demonstrative pronouns.",
    topics: [
      {
        number: "2.1",
        title: "Existence and Identification",
        description: "Understanding how to identify and describe objects",
        explanation: "Learn how to identify objects and describe their existence in Sanskrit. This forms the foundation for more complex conversations.",
        example: "asti (अस्ति) → exists | nāsti (नास्ति) → does not exist | idam (इदम्) → this",
        example_tips: "Use 'asti' to indicate presence and 'nāsti' to indicate absence of something.",
        dialogue: "Person A: kim asti atra? (What is here?) | Person B: pustakam asti. (There is a book.)"
      },
      {
        number: "2.2",
        title: "Exists and Is Not (asti and nāsti)",
        description: "Learning existence verbs",
        explanation: "Master the use of 'asti' (exists) and 'nāsti' (does not exist) in various contexts.",
        example: "pustakam asti (पुस्तकम् अस्ति) → The book exists | jalam nāsti (जलं नास्ति) → There is no water",
        example_tips: "These verbs are essential for describing what is present or absent in any situation.",
        dialogue: "Person A: pustakam asti? (Is there a book?) | Person B: āṃ, asti. (Yes, there is.)"
      },
      {
        number: "2.3",
        title: "Demonstrating: This and That (Neuter: etat and tat)",
        description: "Learning neuter demonstrative pronouns",
        explanation: "Learn to point out objects using neuter demonstrative pronouns 'this' and 'that'.",
        example: "etat (एतत्) → this (neuter) | tat (तत्) → that (neuter) | kim etat? (किम् एतत्?) → What is this?",
        example_tips: "Use 'etat' for objects close to you and 'tat' for objects farther away.",
        dialogue: "Person A: kim etat? (What is this?) | Person B: etat pustakam. (This is a book.)"
      },
      {
        number: "2.4",
        title: "Demonstrating: This and That (Masculine: eṣaḥ and saḥ)",
        description: "Learning masculine demonstrative pronouns",
        explanation: "Learn to point out masculine objects or people using 'this' and 'that'.",
        example: "eṣaḥ (एषः) → this (masculine) | saḥ (सः) → that (masculine) | kaḥ eṣaḥ? (कः एषः?) → Who is this?",
        example_tips: "Use 'eṣaḥ' for masculine objects or people close to you, 'saḥ' for those farther away.",
        dialogue: "Person A: kaḥ eṣaḥ? (Who is this?) | Person B: eṣaḥ rāmaḥ. (This is Rama.)"
      },
      {
        number: "2.5",
        title: "Demonstrating: This and That (Feminine: eṣā and sā)",
        description: "Learning feminine demonstrative pronouns",
        explanation: "Learn to point out feminine objects or people using 'this' and 'that'.",
        example: "eṣā (एषा) → this (feminine) | sā (सा) → that (feminine) | kā eṣā? (का एषा?) → Who is this?",
        example_tips: "Use 'eṣā' for feminine objects or people close to you, 'sā' for those farther away.",
        dialogue: "Person A: kā eṣā? (Who is this?) | Person B: eṣā sītā. (This is Sita.)"
      },
      {
        number: "2.6",
        title: "Vocabulary: Workplace Items",
        description: "Learning vocabulary for workplace and office items",
        explanation: "Expand your vocabulary with words commonly used in professional and workplace settings.",
        example: "lekhani (लेखनी) → pen | meṣaḥ (मेषः) → table | āsanaṃ (आसनं) → chair | pustakam (पुस्तकम्) → book",
        example_tips: "These words help you describe and discuss items in professional environments.",
        dialogue: "Person A: kim asti meṣe? (What is on the table?) | Person B: pustakam asti. (There is a book.)"
      }
    ]
  },
  {
    number: 3,
    title: "Where Is It? Describing Location",
    description: "Learn to describe locations and ask about where things are using spatial concepts.",
    topics: [
      {
        number: "3.1",
        title: "Basic Spatial Concepts",
        description: "Understanding fundamental location words",
        explanation: "Learn the basic Sanskrit words for describing where things are located in space.",
        example: "atra (अत्र) → here | tatra (तत्र) → there | kutra (कुत्र) → where",
        example_tips: "These words form the foundation for all spatial descriptions in Sanskrit.",
        dialogue: "Person A: kutra pustakam? (Where is the book?) | Person B: atra asti. (It is here.)"
      },
      {
        number: "3.2",
        title: "Location: Where? (kutra)",
        description: "Learning to ask about location",
        explanation: "Master the art of asking 'where' questions in Sanskrit conversations.",
        example: "kutra (कुत्र) → where | kutra gacchasi? (कुत्र गच्छसि?) → Where are you going?",
        example_tips: "Use 'kutra' to ask about the location of people, objects, or actions.",
        dialogue: "Person A: kutra gacchasi? (Where are you going?) | Person B: gṛhaṃ gacchāmi. (I am going home.)"
      },
      {
        number: "3.3",
        title: "Location: Here and There (atra and tatra)",
        description: "Learning to indicate specific locations",
        explanation: "Learn to point out specific locations using 'here' and 'there'.",
        example: "atra (अत्र) → here | tatra (तत्र) → there | atra asti (अत्र अस्ति) → it is here",
        example_tips: "Use 'atra' for things close to you and 'tatra' for things farther away.",
        dialogue: "Person A: kutra pustakam? (Where is the book?) | Person B: atra asti. (It is here.)"
      },
      {
        number: "3.4",
        title: "Location: Everywhere and Elsewhere (sarvatra and anyatra)",
        description: "Learning broader location concepts",
        explanation: "Expand your location vocabulary with words for broader spatial concepts.",
        example: "sarvatra (सर्वत्र) → everywhere | anyatra (अन्यत्र) → elsewhere | kutra sarvatra? (कुत्र सर्वत्र?) → Where everywhere?",
        example_tips: "Use these words to describe general or specific locations in broader contexts.",
        dialogue: "Person A: kutra sarvatra? (Where everywhere?) | Person B: gṛhe sarvatra. (Everywhere in the house.)"
      },
      {
        number: "3.5",
        title: "Location: Front, Back, Left, Right (purataḥ, pṛṣṭhataḥ, etc.)",
        description: "Learning directional location words",
        explanation: "Learn to describe positions using directional words like front, back, left, and right.",
        example: "purataḥ (पुरतः) → in front | pṛṣṭhataḥ (पृष्ठतः) → behind | vāme (वामे) → on the left | dakṣiṇe (दक्षिणे) → on the right",
        example_tips: "These words help you give precise directions and describe relative positions.",
        dialogue: "Person A: kutra meṣaḥ? (Where is the table?) | Person B: purataḥ asti. (It is in front.)"
      },
      {
        number: "3.6",
        title: "Location: Inside and Outside (antaḥ and bahiḥ)",
        description: "Learning interior and exterior concepts",
        explanation: "Learn to describe whether things are inside or outside of containers or spaces.",
        example: "antaḥ (अन्तः) → inside | bahiḥ (बहिः) → outside | antaḥ asti (अन्तः अस्ति) → it is inside",
        example_tips: "Use these words to describe the position of objects relative to containers or spaces.",
        dialogue: "Person A: kutra pustakam? (Where is the book?) | Person B: antaḥ asti. (It is inside.)"
      },
      {
        number: "3.7",
        title: "Location: From Here/There/Where (itaḥ, tataḥ, yataḥ)",
        description: "Learning origin and source concepts",
        explanation: "Learn to describe the origin or source of movement using 'from here', 'from there', and 'from where'.",
        example: "itaḥ (इतः) → from here | tataḥ (ततः) → from there | yataḥ (यतः) → from where | itaḥ gacchati (इतः गच्छति) → goes from here",
        example_tips: "These words help you describe the starting point of movement or the source of something.",
        dialogue: "Person A: kutra gacchasi? (Where are you going?) | Person B: itaḥ gṛhaṃ gacchāmi. (I am going home from here.)"
      }
    ]
  },
  {
    number: 4,
    title: "Action! What People Are Doing",
    description: "Learn to describe actions and activities using present tense verbs.",
    topics: [
      {
        number: "4.1",
        title: "Simple Actions (Present Tense)",
        description: "Learning basic present tense verbs",
        explanation: "Master the fundamental present tense verbs that describe everyday actions and activities.",
        example: "gacchati (गच्छति) → goes | likhati (लिखति) → writes | paṭhati (पठति) → reads | khādati (खादति) → eats",
        example_tips: "Present tense verbs in Sanskrit typically end in '-ati' for third person singular.",
        dialogue: "Person A: kim karoti? (What is he doing?) | Person B: pustakam paṭhati. (He is reading a book.)"
      },
      {
        number: "4.2",
        title: "Action! Simple Verbs (gacchati, likhati)",
        description: "Learning common action verbs",
        explanation: "Expand your vocabulary with frequently used action verbs for daily activities.",
        example: "gacchati (गच्छति) → goes | likhati (लिखति) → writes | paṭhati (पठति) → reads | khādati (खादति) → eats",
        example_tips: "These verbs form the foundation for describing most daily activities and routines.",
        dialogue: "Person A: kutra gacchati? (Where is he going?) | Person B: gṛhaṃ gacchati. (He is going home.)"
      },
      {
        number: "4.3",
        title: "Using I with Action Words (Ahaṃ gacchāmi)",
        description: "Learning first person present tense",
        explanation: "Learn to use action verbs with 'I' to describe your own activities and actions.",
        example: "ahaṃ gacchāmi (अहं गच्छामि) → I go | ahaṃ likhāmi (अहं लिखामि) → I write | ahaṃ paṭhāmi (अहं पठामि) → I read",
        example_tips: "First person verbs typically end in '-āmi' when used with 'ahaṃ' (I).",
        dialogue: "Person A: kim karosi? (What are you doing?) | Person B: ahaṃ pustakam paṭhāmi. (I am reading a book.)"
      },
      {
        number: "4.4",
        title: "Using You with Action Words (Tvaṃ gacchasi)",
        description: "Learning second person present tense",
        explanation: "Learn to use action verbs with 'you' to ask about or describe someone else's activities.",
        example: "tvaṃ gacchasi (त्वं गच्छसि) → you go | tvaṃ likhasi (त्वं लिखसि) → you write | tvaṃ paṭhasi (त्वं पठसि) → you read",
        example_tips: "Second person verbs typically end in '-asi' when used with 'tvaṃ' (you).",
        dialogue: "Person A: kutra gacchasi? (Where are you going?) | Person B: gṛhaṃ gacchāmi. (I am going home.)"
      },
      {
        number: "4.5",
        title: "Requests and Simple Commands (Gacchati vs. Gacchatu)",
        description: "Learning imperative forms",
        explanation: "Learn to make requests and give commands using imperative forms of verbs.",
        example: "gacchatu (गच्छतु) → let him go | likhatu (लिखतु) → let him write | paṭhatu (पठतु) → let him read",
        example_tips: "Imperative forms typically end in '-atu' for third person commands.",
        dialogue: "Person A: gacchatu! (Let him go!) | Person B: āṃ, gacchatu. (Yes, let him go.)"
      },
      {
        number: "4.6",
        title: "Necessity: Needs and Sufficiency (āvaśyakam and paryāptam)",
        description: "Learning necessity and sufficiency concepts",
        explanation: "Learn to express what is necessary, needed, or sufficient in various situations.",
        example: "āvaśyakam (आवश्यकं) → necessary | paryāptam (पर्याप्तं) → sufficient | kim āvaśyakam? (किम् आवश्यकं?) → What is necessary?",
        example_tips: "Use these words to express requirements, needs, and adequacy in conversations.",
        dialogue: "Person A: kim āvaśyakam? (What is necessary?) | Person B: jalam āvaśyakam. (Water is necessary.)"
      }
    ]
  },
  {
    number: 5,
    title: "Groups and Plurals",
    description: "Learn to work with multiple objects and people using plural forms.",
    topics: [
      {
        number: "5.1",
        title: "Dealing with Many (Plural Forms)",
        description: "Understanding plural concepts",
        explanation: "Learn the fundamental concepts of plural forms in Sanskrit and how they differ from singular.",
        example: "ekam (एकं) → one | bahūni (बहूनि) → many | ekaḥ (एकः) → one (masculine) | bahavaḥ (बहवः) → many (masculine)",
        example_tips: "Plural forms in Sanskrit change based on gender and case, just like singular forms.",
        dialogue: "Person A: kati pustakāni? (How many books?) | Person B: bahūni pustakāni. (Many books.)"
      },
      {
        number: "5.2",
        title: "Singular and Plural Concepts (ekavacanam and bahuvacanam)",
        description: "Learning singular and plural terminology",
        explanation: "Master the Sanskrit terms for singular and plural and understand when to use each form.",
        example: "ekavacanam (एकवचनं) → singular | bahuvacanam (बहुवचनं) → plural | ekaḥ (एकः) → one | bahavaḥ (बहवः) → many",
        example_tips: "Understanding these concepts is crucial for proper Sanskrit grammar and communication.",
        dialogue: "Person A: kim ekavacanam? (What is singular?) | Person B: ekaḥ puruṣaḥ ekavacanam. (One man is singular.)"
      },
      {
        number: "5.3",
        title: "Plurals: We and Y'all (Ahaṃ / Vayam and Tvam / Yūyam)",
        description: "Learning first and second person plurals",
        explanation: "Learn to use 'we' and 'you all' in Sanskrit conversations and understand their verb forms.",
        example: "vayam (वयम्) → we | yūyam (यूयम्) → you all | vayam gacchāmaḥ (वयं गच्छामः) → we go | yūyam gacchatha (यूयं गच्छथ) → you all go",
        example_tips: "Plural forms of 'I' and 'you' have different verb endings than their singular counterparts.",
        dialogue: "Person A: kutra gacchatha? (Where are you all going?) | Person B: vayam gṛhaṃ gacchāmaḥ. (We are going home.)"
      },
      {
        number: "5.4",
        title: "Plurals: They/Those (Masculine: te and ete)",
        description: "Learning masculine plural demonstratives",
        explanation: "Learn to refer to multiple masculine objects or people using 'they' and 'those'.",
        example: "te (ते) → they (masculine) | ete (एते) → these (masculine) | te gacchanti (ते गच्छन्ति) → they go | ete puruṣāḥ (एते पुरुषाः) → these men",
        example_tips: "Use 'te' for masculine plural objects or people, 'ete' for those close to you.",
        dialogue: "Person A: kaḥ te? (Who are they?) | Person B: te puruṣāḥ. (They are men.)"
      },
      {
        number: "5.5",
        title: "Plurals: They/Those (Feminine: tāḥ and etāḥ)",
        description: "Learning feminine plural demonstratives",
        explanation: "Learn to refer to multiple feminine objects or people using 'they' and 'those'.",
        example: "tāḥ (ताः) → they (feminine) | etāḥ (एताः) → these (feminine) | tāḥ gacchanti (ताः गच्छन्ति) → they go | etāḥ strīyaḥ (एताः स्त्रियः) → these women",
        example_tips: "Use 'tāḥ' for feminine plural objects or people, 'etāḥ' for those close to you.",
        dialogue: "Person A: kāḥ tāḥ? (Who are they?) | Person B: tāḥ strīyaḥ. (They are women.)"
      },
      {
        number: "5.6",
        title: "Plurals: They/Those (Neuter: tāni and etāni)",
        description: "Learning neuter plural demonstratives",
        explanation: "Learn to refer to multiple neuter objects using 'they' and 'those'.",
        example: "tāni (तानि) → they (neuter) | etāni (एतानि) → these (neuter) | tāni gacchanti (तानि गच्छन्ति) → they go | etāni pustakāni (एतानि पुस्तकानि) → these books",
        example_tips: "Use 'tāni' for neuter plural objects, 'etāni' for those close to you.",
        dialogue: "Person A: kāni tāni? (What are they?) | Person B: tāni pustakāni. (They are books.)"
      },
      {
        number: "5.7",
        title: "Plurals: Action Words (Nrityati vs. Nrityanti)",
        description: "Learning plural verb forms",
        explanation: "Master the difference between singular and plural verb forms in Sanskrit.",
        example: "nrityati (नृत्यति) → dances (singular) | nrityanti (नृत्यन्ति) → dance (plural) | gacchati (गच्छति) → goes (singular) | gacchanti (गच्छन्ति) → go (plural)",
        example_tips: "Plural verbs typically end in '-anti' while singular verbs end in '-ati'.",
        dialogue: "Person A: kim karoti? (What does he do?) | Person B: nrityati. (He dances.)"
      },
      {
        number: "5.8",
        title: "Asking: How many? (kati santi)",
        description: "Learning to ask about quantities",
        explanation: "Learn to ask 'how many' questions and understand the responses in Sanskrit.",
        example: "kati (कति) → how many | santi (सन्ति) → are | kati pustakāni santi? (कति पुस्तकानि सन्ति?) → How many books are there?",
        example_tips: "Use 'kati' to ask about quantities and 'santi' to indicate existence of multiple items.",
        dialogue: "Person A: kati pustakāni santi? (How many books are there?) | Person B: pañca pustakāni santi. (There are five books.)"
      }
    ]
  }
]

// Navigation helper functions
export function getNextTopic(currentChapter: number, currentTopic: string): { chapter: number, topic: string } | null {
  const chapter = curriculumData.find(c => c.number === currentChapter)
  if (!chapter) return null
  
  const currentIndex = chapter.topics.findIndex(t => t.number === currentTopic)
  if (currentIndex === -1) return null
  
  // Check if there's a next topic in the same chapter
  if (currentIndex < chapter.topics.length - 1) {
    return { chapter: currentChapter, topic: chapter.topics[currentIndex + 1].number }
  }
  
  // If no next topic in current chapter, check next chapter
  const nextChapter = curriculumData.find(c => c.number === currentChapter + 1)
  if (nextChapter && nextChapter.topics.length > 0) {
    return { chapter: nextChapter.number, topic: nextChapter.topics[0].number }
  }
  
  return null
}

export function getPreviousTopic(currentChapter: number, currentTopic: string): { chapter: number, topic: string } | null {
  const chapter = curriculumData.find(c => c.number === currentChapter)
  if (!chapter) return null
  
  const currentIndex = chapter.topics.findIndex(t => t.number === currentTopic)
  if (currentIndex === -1) return null
  
  // Check if there's a previous topic in the same chapter
  if (currentIndex > 0) {
    return { chapter: currentChapter, topic: chapter.topics[currentIndex - 1].number }
  }
  
  // If no previous topic in current chapter, check previous chapter
  const prevChapter = curriculumData.find(c => c.number === currentChapter - 1)
  if (prevChapter && prevChapter.topics.length > 0) {
    return { chapter: prevChapter.number, topic: prevChapter.topics[prevChapter.topics.length - 1].number }
  }
  
  return null
}

export function getNextChapter(currentChapter: number): number | null {
  const nextChapter = curriculumData.find(c => c.number === currentChapter + 1)
  return nextChapter ? nextChapter.number : null
}

export function getPreviousChapter(currentChapter: number): number | null {
  const prevChapter = curriculumData.find(c => c.number === currentChapter - 1)
  return prevChapter ? prevChapter.number : null
}

export function getTopicData(chapterNumber: number, topicNumber: string) {
  const chapter = curriculumData.find(c => c.number === chapterNumber)
  if (!chapter) return null
  
  const topic = chapter.topics.find(t => t.number === topicNumber)
  return topic || null
}

export function getChapterData(chapterNumber: number) {
  return curriculumData.find(c => c.number === chapterNumber) || null
}
