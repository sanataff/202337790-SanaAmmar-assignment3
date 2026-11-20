import { useEffect, type ReactNode } from 'react';
import About from './components/About';
import Experience from './components/Experience';
import BackToTop from './components/BackToTop';
import Books from './components/Books';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Header from './components/Header';
import Projects from './components/Projects';
import Research from './components/Research';
import Stack from './components/Stack';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  HOMEPAGE_ORDER,
  isVisitorType,
  type HomepageSection,
  type VisitorType,
} from './data/visitorTypes';
import './App.css';

export default function App() {
  const [storedVisitorType, setStoredVisitorType] =
    useLocalStorage<unknown>('portfolio-audience', 'browsing');
  const visitorType: VisitorType = isVisitorType(storedVisitorType)
    ? storedVisitorType
    : 'browsing';

  useEffect(() => {
    if (storedVisitorType !== visitorType) setStoredVisitorType(visitorType);
  }, [storedVisitorType, setStoredVisitorType, visitorType]);

  const sections: Record<HomepageSection, ReactNode> = {
    about: <About key="about" />,
    experience: <Experience key="experience" />,
    research: <Research key="research" />,
    projects: (
      <Projects
        key="projects"
        title={visitorType === 'student' ? 'Side projects & code' : 'Selected work'}
      />
    ),
    books: <Books key="books" />,
    stack: <Stack key="stack" />,
    contact: <Contact key="contact" />,
  };

  return (
    <div className="portfolio">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <Header
        visitorType={visitorType}
        onVisitorTypeChange={setStoredVisitorType}
      />

      <main id="main-content">
        {HOMEPAGE_ORDER[visitorType].map((section) => sections[section])}
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
