export type StepId =
  | 'GOAL'
  | 'TIME'
  | 'EXPERIENCE'
  | 'ALLOCATION'
  | 'EXPOSURE'
  | 'RETURNS';

export interface Answers {
  GOAL:        string;
  TIME:        string;
  EXPERIENCE:  string;
  ALLOCATION:  string;
  EXPOSURE:    string;
  RETURNS:     string;
}
