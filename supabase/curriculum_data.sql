-- Insert curriculum data from CSV
BEGIN;

INSERT INTO public.curriculum (
          chapter_order, chapter_title, topic_order, topic_title, 
          topic_description, topic_details, explanation, example, 
          example_tips, dialogue, image_alt, image_name, image_url, image_prompt
        ) VALUES (
          1,
          'Hello! Getting Started',
          '1.1',
          'Greetings and Identity',
          'Basic greetings and introducing yourself in Sanskrit',
          'Basic greetings and introducing yourself in Sanskrit',
          'Learn how to greet people and introduce yourself in Sanskrit. This lesson covers the fundamental phrases for meeting and getting to know someone.',
          '{ sanskrit: "namaste (नमस्ते)", english: "Hello" | sanskrit: "svāgatam (स्वागतम्)", english: "Welcome" | sanskrit: "mama nāma (मम नाम)", english: "My name" | sanskrit: "tava nāma (तव नाम)", english: "Your name" | sanskrit: "kaḥ (कः)", english: "Who" | sanskrit: "kim (किम्)", english: "What" }',
          'Use ''namaste'' for both hello and goodbye. It''s a respectful greeting that can be used at any time of day.',
          '{ sanskrit: "Person A: namaste! (Hello!)", english: "Person A: Hello!" | sanskrit: "Person B: namaste! mama nāma Rāmaḥ. (Hello! My name is Rama.)", english: "Person B: Hello! My name is Rama." | sanskrit: "Person A: tava nāma kim? (What is your name?)", english: "Person A: What is your name?" | sanskrit: "Person B: mama nāma Sītā. (My name is Sita.)", english: "Person B: My name is Sita." }',
          'Two people greeting each other in traditional Indian style',
          'greetings-practice.png',
          'https://dash.cloudflare.com/9e1c4092ca4c803f08a507eab1d1d1e7/r2/default/buckets/sanskrit/objects/greetings-practice.png/details',
          'Educational illustration for Sanskrit learning, clean modern style, suitable for language learning app, Two people greeting each other in traditional Indian style, bright colors, clear typography, educational design'
        );
INSERT INTO public.curriculum (
          chapter_order, chapter_title, topic_order, topic_title, 
          topic_description, topic_details, explanation, example, 
          example_tips, dialogue, image_alt, image_name, image_url, image_prompt
        ) VALUES (
          0,
          ' fruits',
          ' water',
          ' food',
          ' clothing',
          ' etc.,daily-use-items.jpg,https://dash.cloudflare.com/9e1c4092ca4c803f08a507eab1d1d1e7/r2/default/buckets/sanskrit/objects/daily-use-items.jpg/details,Educational illustration for Sanskrit learning',
          ' clean modern style',
          ' suitable for language learning app',
          ' Various daily use items like books',
          ' fruits',
          ' water',
          ' food',
          ' clothing',
          ' etc.'
        );

COMMIT;