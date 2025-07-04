import type { Mod } from '@/types';
import { mod as transformSchoolNameMod } from './transform-school-name';
import { mod as programsSingularMod } from './programs-singular';
import { mod as updateProgramLinkMod } from './update-program-link';
import { mod as askQuestionNewTabMod } from './ask-question-new-tab';

export const allMods: Mod[] = [
  transformSchoolNameMod,
  programsSingularMod,
  updateProgramLinkMod,
  askQuestionNewTabMod,
];
