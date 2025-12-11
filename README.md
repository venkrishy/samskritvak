## Auth roadmap (approved)

- Google OAuth via Supabase (implemented on `feat/supabase-authentication`).
- Persistent authentication - users stay logged in until explicit logout (implemented on `feat/persistent-authentication`).
- Avatar menu in navbar with Account preferences, Theme, Logout (Logout implemented; Account/Theme TODO).

### Features
- **Persistent Sessions**: Users remain logged in across browser sessions, page refreshes, and device restarts
- **Auto Token Refresh**: Sessions automatically refresh to maintain authentication
- **Session Storage**: Authentication state stored in localStorage for persistence
- **Loading States**: Proper loading indicators during session restoration

### TODOs
- Add production domain(s) and update Supabase Redirect URLs.
- Implement Account preferences page.
- Implement Theme switcher (Light/Dark/System).

## Environment Variables

This project uses environment variables to configure the application. You will need to create two files, `.env` and `.env.local`, in the root of the project.

### `.env`

This file should contain variables that are safe to be committed to the repository. You can copy the `env.example` file to create it:

```bash
cp env.example .env
```

### `.env.local`

This file should contain sensitive information and is not meant to be committed to the repository. Create a file named `.env.local` in the root of the project and add the following content:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=

# Notion
NOTION_INTEGRATION_TOKEN=

# R2
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
```

You will need to fill in the values for the variables in both files. The comments in the example files explain what each variable is for.
# Sanskrit Learning App

A comprehensive single-page application for learning Sanskrit, built with React and Vite. The app provides structured lessons organized by curriculum categories, with proper Sanskrit typography and interactive navigation.

## Features

### 📚 Curriculum Structure
- **Foundation**: Basic conversations, greetings, and introductions
- **Pronouns**: Basic, demonstrative, and interrogative pronouns
- **Time**: Daily routines, days, dates, and time expressions
- **Verbs**: Present tense forms and conjugations
- **Grammar**: Plural forms and advanced grammatical concepts
- **Numbers**: Basic numbers, counting questions, and practice
- **Vocabulary**: Household objects, kitchen utensils, and workplace vocabulary
- **Directions**: Spatial relationships and travel vocabulary
- **Conversation**: Basic and complex dialogues, family conversations
- **Advanced**: Advanced exercises, grammar mastery, reading comprehension, and writing practice

### 🎨 Design Features
- **Sanskrit Typography**: Proper Devanagari font support with Noto Sans/Serif Devanagari
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **External CSS**: Dedicated Sanskrit-specific styling in `src/styles/sanskrit.css`
- **Interactive Navigation**: Hierarchical navigation with collapsible categories
- **Progress Tracking**: Visual progress indicators and lesson completion tracking

### 🚀 Technical Features
- **Single Page Application**: Built with React Router for seamless navigation
- **Content Loading**: Dynamic loading of markdown content from curriculum files
- **Table of Contents**: Displays the complete curriculum structure on the homepage
- **Breadcrumb Navigation**: Easy navigation between categories and lessons
- **Mobile-Friendly**: Responsive sidebar and mobile menu support

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Sanskrit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── pages/
│   │   ├── LandingPage.jsx          # Homepage with table of contents
│   │   ├── CurriculumOverview.jsx   # Curriculum category overview
│   │   ├── CategoryPage.jsx         # Individual category page
│   │   └── LessonPage.jsx           # Individual lesson page
│   ├── ContentLoader.jsx            # Markdown content loader
│   ├── CurriculumSidebar.jsx        # Navigation sidebar
│   └── Navbar.jsx                   # Main navigation
├── data/
│   └── curriculum.js                # Curriculum data structure
├── styles/
│   └── sanskrit.css                 # Sanskrit-specific styling
└── App.jsx                          # Main app component with routing
```

## Curriculum Content

The curriculum content is organized in the `/curriculum` folder with the following structure:

```
curriculum/
├── foundation/          # Basic concepts
├── pronouns/           # Pronoun forms
├── time/              # Time expressions
├── verbs/             # Verb conjugations
├── grammar/           # Grammar concepts
├── numbers/           # Number systems
├── vocabulary/        # Thematic vocabulary
├── directions/        # Spatial relationships
├── conversation/      # Dialogue patterns
├── advanced/          # Advanced exercises
└── reference/         # Table of contents
```

Each lesson is a markdown file that gets loaded dynamically when accessed.

## Customization

### Adding New Lessons
1. Add the lesson file to the appropriate category folder in `/curriculum`
2. Update the curriculum data in `src/data/curriculum.js`
3. The lesson will automatically appear in the navigation

### Styling
- Sanskrit-specific styles are in `src/styles/sanskrit.css`
- Main app styles use Tailwind CSS
- Custom CSS variables are defined for Sanskrit typography

### Navigation
- Update `src/data/curriculum.js` to modify the curriculum structure
- The navigation automatically reflects changes to the curriculum data

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with React and Vite
- Uses Tailwind CSS for styling
- Sanskrit fonts from Google Fonts (Noto Sans/Serif Devanagari)
- Curriculum based on Samskrita Bharati materials
