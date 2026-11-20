import MaskedText from './MaskedText';

const posters = [
  {
    id: 'answermap',
    eyebrow: 'AnswerMap · KAUST Academy',
    title: 'Faithful Black-Box Spatial Interpretability for Vision Language Models',
    description:
      'AnswerMap builds spatial explanations from model outputs without access to internal weights, then tests whether those maps faithfully track the model’s answers.',
    preview: '/kaustposter-preview.webp',
    original: '/kaustposter.png',
    width: 4678,
    height: 3307,
    alt: 'AnswerMap research poster describing a black-box spatial interpretability method for vision-language models, including its methodology and results.',
  },
  {
    id: 'medical-xai',
    eyebrow: 'Women in Data Science 2025 · KFUPM',
    title: 'Explainable AI for Medical Image Segmentation',
    description:
      'A comparison of post-hoc explainability methods for MedSAM segmentation, exploring how the choice of technique affects medical-image explanations.',
    preview: '/wids-2025-poster-preview.webp',
    original: '/WiDs%202025%20Poster.png',
    width: 2245,
    height: 3179,
    alt: 'Women in Data Science 2025 poster about explainable AI methods for medical image segmentation.',
  },
];

export default function Research() {
  return (
    <section id="research" className="section research">
      <div className="section__head">
        <h2 className="section__title">
          <MaskedText>Research &amp; posters</MaskedText>
        </h2>
        <span className="section__meta">Selected work</span>
      </div>

      <div className="research__grid">
        {posters.map((poster) => (
          <article className={`research-poster research-poster--${poster.id}`} key={poster.id}>
            <a
              className="research-poster__preview"
              href={poster.original}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open full-size poster: ${poster.title}`}
            >
              <img
                src={poster.preview}
                alt={poster.alt}
                width={poster.width}
                height={poster.height}
                loading="lazy"
                decoding="async"
              />
              <span className="research-poster__open">View full poster ↗</span>
            </a>
            <div className="research-poster__details">
              <p className="research-poster__eyebrow">{poster.eyebrow}</p>
              <h3>{poster.title}</h3>
              <p className="research-poster__description">{poster.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
