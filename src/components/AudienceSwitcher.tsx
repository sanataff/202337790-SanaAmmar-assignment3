import { DrawablyButton } from 'drawably/react';
import { VISITOR_TYPES, type VisitorType } from '../data/visitorTypes';
import ReceptionDesk from './ReceptionDesk';

type AudienceSwitcherProps = {
  value: VisitorType;
  onChange: (value: VisitorType) => void;
};

export default function AudienceSwitcher({ value, onChange }: AudienceSwitcherProps) {
  return (
    <div className="welcome">
      <ReceptionDesk visitorType={value} />

      <fieldset className="audience-switcher">
        <legend>Who&rsquo;s visiting?</legend>
        <div className="audience-switcher" role="group" aria-label="Visitor type">
          {VISITOR_TYPES.map((visitor) => (
            <DrawablyButton
              key={visitor.value}
              className="achoice"
              type="button"
              aria-pressed={value === visitor.value}
              onClick={() => onChange(visitor.value)}
            >
              {visitor.label}
            </DrawablyButton>
          ))}
        </div>
        <p className="audience-switcher__note" aria-live="polite">
          {value === 'recruiter' && 'Experience, impact, and my CV are first.'}
          {value === 'researcher' && 'Research and posters are first.'}
          {value === 'student' && 'Side projects and my toolkit are first.'}
          {value === 'browsing' && 'Explore the portfolio in its general order.'}
        </p>
      </fieldset>
    </div>
  );
}
