import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from './app/layout.jsx'
import HomePage from './app/page.jsx'

// Import new 14-module structure pages
import GettingStartedPage from './app/01-getting-started/page.jsx'
import ExistenceIdentificationPage from './app/02-existence-identification/page.jsx'
import LocationPage from './app/03-location/page.jsx'
import ActionsPage from './app/04-actions/page.jsx'
import PluralsPage from './app/05-plurals/page.jsx'
import DirectionsPage from './app/06-directions/page.jsx'
import ToolRolePage from './app/07-tool-role/page.jsx'
import OwnershipPage from './app/08-ownership/page.jsx'
import TensesPage from './app/09-tenses/page.jsx'
import AdjectivesPage from './app/10-adjectives/page.jsx'
import TimeNumbersPage from './app/11-time-numbers/page.jsx'
import ComplexSentencesPage from './app/12-complex-sentences/page.jsx'
import AdvancedVerbsPage from './app/13-advanced-verbs/page.jsx'
import ComplexDialoguePage from './app/14-complex-dialogue/page.jsx'
import TestNotionPage from './app/test-notion/page.jsx'

// Import 01-getting-started lesson pages
import GreetingsIdentityPage from './app/01-getting-started/greetings-identity/page.jsx'
import MasculineNamePage from './app/01-getting-started/masculine-name/page.jsx'
import FeminineNamePage from './app/01-getting-started/feminine-name/page.jsx'
import WhoWhatPage from './app/01-getting-started/who-what/page.jsx'
import YesNoPage from './app/01-getting-started/yes-no/page.jsx'
import DailyItemsPage from './app/01-getting-started/daily-items/page.jsx'

// Import 02-existence-identification lesson pages
import ExistencePage from './app/02-existence-identification/existence/page.jsx'
import ExistsNotPage from './app/02-existence-identification/exists-not/page.jsx'
import NeuterDemonstrativesPage from './app/02-existence-identification/neuter-demonstratives/page.jsx'
import MasculineDemonstrativesPage from './app/02-existence-identification/masculine-demonstratives/page.jsx'
import FeminineDemonstrativesPage from './app/02-existence-identification/feminine-demonstratives/page.jsx'
import WorkplaceVocabularyPage from './app/02-existence-identification/workplace-vocabulary/page.jsx'

// Import 03-location lesson pages
import SpatialConceptsPage from './app/03-location/spatial-concepts/page.jsx'
import WherePage from './app/03-location/where/page.jsx'
import HereTherePage from './app/03-location/here-there/page.jsx'
import EverywhereElsewherePage from './app/03-location/everywhere-elsewhere/page.jsx'
import LocationDirectionsPage from './app/03-location/directions/page.jsx'
import InsideOutsidePage from './app/03-location/inside-outside/page.jsx'
import FromWherePage from './app/03-location/from-where/page.jsx'

// Import 04-actions lesson pages
import SimpleActionsPage from './app/04-actions/simple-actions/page.jsx'
import SimpleVerbsPage from './app/04-actions/simple-verbs/page.jsx'
import IActionsPage from './app/04-actions/i-actions/page.jsx'
import YouActionsPage from './app/04-actions/you-actions/page.jsx'
import RequestsCommandsPage from './app/04-actions/requests-commands/page.jsx'
import NecessityPage from './app/04-actions/necessity/page.jsx'

// Import 05-plurals lesson pages
import PluralConceptsPage from './app/05-plurals/plural-concepts/page.jsx'
import SingularPluralPage from './app/05-plurals/singular-plural/page.jsx'
import WeYouPluralPage from './app/05-plurals/we-you-plural/page.jsx'
import MasculineTheyPage from './app/05-plurals/masculine-they/page.jsx'
import FeminineTheyPage from './app/05-plurals/feminine-they/page.jsx'
import NeuterTheyPage from './app/05-plurals/neuter-they/page.jsx'
import PluralVerbsPage from './app/05-plurals/plural-verbs/page.jsx'
import HowManyPage from './app/05-plurals/how-many/page.jsx'

import DashboardPage from './app/dashboard/page.jsx'
import CurriculumPage from './app/curriculum/page.jsx'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout><HomePage /></RootLayout>} />
        <Route path="/dashboard" element={<RootLayout><DashboardPage /></RootLayout>} />
        <Route path="/curriculum" element={<RootLayout><CurriculumPage /></RootLayout>} />
        
        {/* New 14-module structure routes */}
        <Route path="/01-getting-started" element={<RootLayout><GettingStartedPage /></RootLayout>} />
        <Route path="/02-existence-identification" element={<RootLayout><ExistenceIdentificationPage /></RootLayout>} />
        <Route path="/03-location" element={<RootLayout><LocationPage /></RootLayout>} />
        <Route path="/04-actions" element={<RootLayout><ActionsPage /></RootLayout>} />
        <Route path="/05-plurals" element={<RootLayout><PluralsPage /></RootLayout>} />
        <Route path="/06-directions" element={<RootLayout><DirectionsPage /></RootLayout>} />
        <Route path="/07-tool-role" element={<RootLayout><ToolRolePage /></RootLayout>} />
        <Route path="/08-ownership" element={<RootLayout><OwnershipPage /></RootLayout>} />
        <Route path="/09-tenses" element={<RootLayout><TensesPage /></RootLayout>} />
        <Route path="/10-adjectives" element={<RootLayout><AdjectivesPage /></RootLayout>} />
        <Route path="/11-time-numbers" element={<RootLayout><TimeNumbersPage /></RootLayout>} />
        <Route path="/12-complex-sentences" element={<RootLayout><ComplexSentencesPage /></RootLayout>} />
        <Route path="/13-advanced-verbs" element={<RootLayout><AdvancedVerbsPage /></RootLayout>} />
        <Route path="/14-complex-dialogue" element={<RootLayout><ComplexDialoguePage /></RootLayout>} />
        
        {/* 01-getting-started lesson routes */}
        <Route path="/01-getting-started/greetings-identity" element={<RootLayout><GreetingsIdentityPage /></RootLayout>} />
        <Route path="/01-getting-started/masculine-name" element={<RootLayout><MasculineNamePage /></RootLayout>} />
        <Route path="/01-getting-started/feminine-name" element={<RootLayout><FeminineNamePage /></RootLayout>} />
        <Route path="/01-getting-started/who-what" element={<RootLayout><WhoWhatPage /></RootLayout>} />
        <Route path="/01-getting-started/yes-no" element={<RootLayout><YesNoPage /></RootLayout>} />
        <Route path="/01-getting-started/daily-items" element={<RootLayout><DailyItemsPage /></RootLayout>} />
        
        {/* 02-existence-identification lesson routes */}
        <Route path="/02-existence-identification/existence" element={<RootLayout><ExistencePage /></RootLayout>} />
        <Route path="/02-existence-identification/exists-not" element={<RootLayout><ExistsNotPage /></RootLayout>} />
        <Route path="/02-existence-identification/neuter-demonstratives" element={<RootLayout><NeuterDemonstrativesPage /></RootLayout>} />
        <Route path="/02-existence-identification/masculine-demonstratives" element={<RootLayout><MasculineDemonstrativesPage /></RootLayout>} />
        <Route path="/02-existence-identification/feminine-demonstratives" element={<RootLayout><FeminineDemonstrativesPage /></RootLayout>} />
        <Route path="/02-existence-identification/workplace-vocabulary" element={<RootLayout><WorkplaceVocabularyPage /></RootLayout>} />
        
        {/* 03-location lesson routes */}
        <Route path="/03-location/spatial-concepts" element={<RootLayout><SpatialConceptsPage /></RootLayout>} />
        <Route path="/03-location/where" element={<RootLayout><WherePage /></RootLayout>} />
        <Route path="/03-location/here-there" element={<RootLayout><HereTherePage /></RootLayout>} />
        <Route path="/03-location/everywhere-elsewhere" element={<RootLayout><EverywhereElsewherePage /></RootLayout>} />
        <Route path="/03-location/directions" element={<RootLayout><LocationDirectionsPage /></RootLayout>} />
        <Route path="/03-location/inside-outside" element={<RootLayout><InsideOutsidePage /></RootLayout>} />
        <Route path="/03-location/from-where" element={<RootLayout><FromWherePage /></RootLayout>} />
        
        {/* 04-actions lesson routes */}
        <Route path="/04-actions/simple-actions" element={<RootLayout><SimpleActionsPage /></RootLayout>} />
        <Route path="/04-actions/simple-verbs" element={<RootLayout><SimpleVerbsPage /></RootLayout>} />
        <Route path="/04-actions/i-actions" element={<RootLayout><IActionsPage /></RootLayout>} />
        <Route path="/04-actions/you-actions" element={<RootLayout><YouActionsPage /></RootLayout>} />
        <Route path="/04-actions/requests-commands" element={<RootLayout><RequestsCommandsPage /></RootLayout>} />
        <Route path="/04-actions/necessity" element={<RootLayout><NecessityPage /></RootLayout>} />
        
        {/* 05-plurals lesson routes */}
        <Route path="/05-plurals/plural-concepts" element={<RootLayout><PluralConceptsPage /></RootLayout>} />
        <Route path="/05-plurals/singular-plural" element={<RootLayout><SingularPluralPage /></RootLayout>} />
        <Route path="/05-plurals/we-you-plural" element={<RootLayout><WeYouPluralPage /></RootLayout>} />
        <Route path="/05-plurals/masculine-they" element={<RootLayout><MasculineTheyPage /></RootLayout>} />
        <Route path="/05-plurals/feminine-they" element={<RootLayout><FeminineTheyPage /></RootLayout>} />
        <Route path="/05-plurals/neuter-they" element={<RootLayout><NeuterTheyPage /></RootLayout>} />
        <Route path="/05-plurals/plural-verbs" element={<RootLayout><PluralVerbsPage /></RootLayout>} />
        <Route path="/05-plurals/how-many" element={<RootLayout><HowManyPage /></RootLayout>} />
        
        {/* Test Notion Integration */}
        <Route path="/test-notion" element={<RootLayout><TestNotionPage /></RootLayout>} />
        
      </Routes>
    </Router>
  )
}

export default App
