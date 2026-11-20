import { DrawablyButton } from 'drawably/react';
import MaskedText from './MaskedText';

const CV_URL =
  'https://drive.google.com/file/d/12JoiIlniM8XtUum_tfgw85R39tse9h6T/view?usp=drive_link';

const experiences = [
  {
    period: 'Jun 2026 – Sep 2026',
    role: 'Independent Researcher',
    organization: 'AnswerMap · KAUST-affiliated group',
    summary: 'Built and benchmarked spatial explanations for vision-language models.',
  },
  {
    period: 'Jun 2026 – Aug 2026',
    role: 'AI Summer Program',
    organization: 'KAUST Academy',
    summary: 'Intensive AI specialization across ML, vision, NLP, and generative AI.',
  },
  {
    period: 'Oct 2025 – May 2026',
    role: 'Product Designer',
    organization: 'Interverse',
    summary: 'Designed an AI hiring platform and built its landing page in React.',
  },
  {
    period: 'Nov 2024 – May 2025',
    role: 'Research Assistant',
    organization: 'KFUPM',
    summary: 'Evaluated explainable AI for medical segmentation; co-authored an IEEE JBHI paper.',
  },
];

const impact = [
  { value: 'Top 100', label: 'among 24,000+ KAUST AI program applicants' },
  { value: '2nd place', label: 'WiDS Best Poster Award' },
  { value: 'Campus-wide', label: 'KFUPM Student App redesign now in use' },
];

export default function Experience() {
  return (
    <section id="experience" className="section experience">
      <div className="section__head">
        <h2 className="section__title">
          <MaskedText>Experience &amp; impact</MaskedText>
        </h2>
        <DrawablyButton
          type="button"
          onClick={() => window.open(CV_URL, '_blank', 'noopener,noreferrer')}
          aria-label="View my CV (opens in a new tab)"
        >
          View my CV
        </DrawablyButton>
      </div>

      <div className="experience-timeline-wrap">
        <svg
          className="experience-timeline__path"
          viewBox="0 0 1000 80"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="experience-thread-wobble"
              x="-2%"
              y="-15%"
              width="104%"
              height="130%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.025"
                numOctaves="1"
                seed="4"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale="1.5"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
          <path
            className="experience-timeline__thread-bed"
            d="M0 18 C55 18 75 18 125 18 C230 18 265 58 375 58 C485 58 515 18 625 18 C735 18 765 58 875 58 C925 58 950 18 1000 18"
          />
          <path
            className="experience-timeline__thread"
            d="M0 18 C55 18 75 18 125 18 C230 18 265 58 375 58 C485 58 515 18 625 18 C735 18 765 58 875 58 C925 58 950 18 1000 18"
          />
        </svg>
        <ol className="experience-timeline">
          {experiences.map((item, index) => (
            <li className="experience-timeline__item" key={item.role}>
              <span
                className="experience-timeline__node"
                data-position={index % 2}
                aria-hidden="true"
              />
              <p className="experience-timeline__period">{item.period}</p>
              <h4>{item.role}</h4>
              <p className="experience-timeline__organization">{item.organization}</p>
              <p className="experience-timeline__summary">{item.summary}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="experience-impact">
        <h3 className="experience__subhead">Impact at a glance</h3>
        <ul className="experience-impact__list">
          {impact.map((item) => (
            <li className="experience-impact__item" key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
        <p className="experience__education">
          BSc Computer Science · King Fahd University of Petroleum and Minerals
          <span>2023 – 2027</span>
        </p>
      </div>
    </section>
  );
}
