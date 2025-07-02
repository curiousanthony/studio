import type { Mod } from '@/types';

export const initialModsData: Mod[] = [
  {
    id: 'transform-school-name',
    name: 'Transform School Name',
    description: 'Removes the default uppercase styling from the school name in the navigation bar.',
    category: 'Appearance',
    tags: ['ui', 'navigation', 'branding'],
    enabled: true,
    functionString: `(config) => {
      const schoolName = qs('.desktop-navigation-bar a[href="/"]');
      if (schoolName) {
        schoolName.style.textTransform = "none";
        log("School name transformed");
      } else {
        log("School name element not found");
      }
    }`,
    mediaUrl: 'https://placehold.co/1280x720.png',
  },
  {
    id: 'programs-singular',
    name: 'Singular Program Title',
    description: "Changes the plural 'Programmes' title to singular 'Programme' in the navigation.",
    category: 'Appearance',
    tags: ['ui', 'navigation', 'localization'],
    enabled: true,
    functionString: `(config) => {
      const programsTitleElements = qsa(".programs-page-title > span");
      if (programsTitleElements.length > 0) {
        programsTitleElements.forEach(el => {
          el.innerText = "Programme";
        });
        log("Programs nav edited");
      } else {
        log("Programs nav element not found");
      }
    }`,
    mediaUrl: 'https://placehold.co/1280x720.png',
  },
  {
    id: 'update-program-link',
    name: 'Update Program Link',
    description: "Updates the main 'Programs' navigation link to point to a specific program ID.",
    category: 'Functionality',
    tags: ['navigation', 'program'],
    enabled: true,
    configOptions: [
      {
        key: 'programId',
        label: 'Program ID',
        type: 'text',
        placeholder: 'e.g. db61dab4-edde-48af-9c38-b344f6cc8a6d',
        value: 'db61dab4-edde-48af-9c38-b344f6cc8a6d',
      },
    ],
    functionString: `(config) => {
      const programId = config.programId;
      if (!programId) {
        log("Update Program Link mod is enabled, but no Program ID is configured.");
        return;
      }
      const programsLinkElements = qsa('.desktop-navigation-bar:has(.programs-page-title) a[href="/products"]');
      if (programsLinkElements.length > 0) {
        programsLinkElements.forEach(el => {
          el.setAttribute("href", "/products/" + programId);
        });
        log("Programs link updated to program ID: " + programId, programsLinkElements);
      } else {
        log("No matching elements found for updateProgramsLink");
      }
    }`,
    mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    id: 'ask-question-new-tab',
    name: 'Ask Question in New Tab',
    description: "Makes the 'Ask a question' button under lessons open in a new tab.",
    category: 'Functionality',
    tags: ['lessons', 'q&a', 'ux'],
    enabled: false,
    functionString: `(config) => {
      setTimeout(() => {
        const askQButton = qs('#products_lesson_questions_frame > div > div > div > a');
        log("Checking for 'Ask a question' button:", askQButton);
        if (askQButton) {
          askQButton.setAttribute("target", "_blank");
          log("'Ask a question' button now opens in a new tab.");
        }
      }, 1000);
    }`,
  },
];
