export type VisitorType = 'recruiter' | 'researcher' | 'student' | 'browsing';

export const VISITOR_TYPES: Array<{ value: VisitorType; label: string }> = [
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'student', label: 'Fellow student' },
  { value: 'browsing', label: 'Just browsing' },
];

export type HomepageSection =
  | 'about'
  | 'experience'
  | 'research'
  | 'projects'
  | 'books'
  | 'stack'
  | 'contact';

export const HOMEPAGE_ORDER: Record<VisitorType, HomepageSection[]> = {
  recruiter: ['experience', 'projects', 'about', 'research', 'stack', 'books', 'contact'],
  researcher: ['research', 'about', 'projects', 'experience', 'stack', 'books', 'contact'],
  student: ['projects', 'stack', 'about', 'research', 'experience', 'books', 'contact'],
  browsing: ['about', 'projects', 'books', 'stack', 'experience', 'research', 'contact'],
};

export function isVisitorType(value: unknown): value is VisitorType {
  return VISITOR_TYPES.some((item) => item.value === value);
}
