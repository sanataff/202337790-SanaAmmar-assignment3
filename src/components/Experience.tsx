import MaskedText from './MaskedText';

const CV_URL =
  'https://drive.google.com/file/d/12JoiIlniM8XtUum_tfgw85R39tse9h6T/view?usp=drive_link';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section__head">
        <h2 className="section__title">
          <MaskedText>Experience &amp; impact</MaskedText>
        </h2>
        <a className="cv-link" href={CV_URL} target="_blank" rel="noopener noreferrer">
          View my CV
        </a>
      </div>

      <p className="audience-placeholder">
        Content coming soon: add roles, dates, responsibilities, and measurable outcomes here.
      </p>
    </section>
  );
}
