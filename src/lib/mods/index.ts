import type { Mod } from '@/types';
import { mod as transformSchoolNameMod } from './transform-school-name';
import { mod as programsSingularMod } from './programs-singular';
import { mod as updateProgramLinkMod } from './update-program-link';
import { mod as askQuestionNewTabMod } from './ask-question-new-tab';
import { mod as stickySectionsMod } from './sticky-sections';
import { mod as courseCardCustomizerMod } from './course-card-customizer';
import { mod as chapterStyleCustomizerMod } from './chapter-style-customizer';
import { mod as sectionArrowReorderMod } from './section-arrow-reorder';
import { mod as sidebarToggleCustomizerMod } from './sidebar-toggle-customizer';
import { mod as globalFontCustomizerMod } from './global-font-customizer';
import { mod as communityLevelBadgeMod } from './community-level-badge';
import { mod as horizontalPaymentPlansMod } from './horizontal-payment-plans';
import { mod as relativePostDateMod } from './relative-post-date';

const allModsRaw: Mod[] = [
  transformSchoolNameMod,
  programsSingularMod,
  updateProgramLinkMod,
  askQuestionNewTabMod,
  stickySectionsMod,
  courseCardCustomizerMod,
  chapterStyleCustomizerMod,
  sectionArrowReorderMod,
  sidebarToggleCustomizerMod,
  globalFontCustomizerMod,
  communityLevelBadgeMod,
  horizontalPaymentPlansMod,
  relativePostDateMod,
];

// Filter out mods that are explicitly set to `published: false`
// Mods without the `published` key will be included by default.
export const allMods: Mod[] = allModsRaw.filter(mod => mod.published !== false);
