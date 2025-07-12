import type { Mod } from '@/types';

export const mod: Mod = {
  id: 'relative-post-date',
  name: 'Relative Post Date',
  description: "Replaces the absolute post date in the community with a relative time (e.g., 'last week') in the user's language.",
  category: 'Functionality',
  tags: ['community', 'ux', 'date', 'time'],
  enabled: false,
  published: true,
  modType: 'javascript',
  mediaBeforeUrl: '/images/mods/relative-post-date-before.png',
  mediaUrl: '/images/mods/relative-post-date-after.png',
  previewEnabled: true,
  functionString: `(config) => {
    const datePattern = /\\d{1,2}\\s\\w+\\s\\d{4}/;

    function extractDateFromH6(fullString) {
      const match = fullString.match(datePattern);
      if (match) {
        return match[0];
      }
      return null;
    }

    function parseFrenchDate(dateString) {
      const months = {
        janvier: 0, 'février': 1, mars: 2, avril: 3, mai: 4, juin: 5,
        juillet: 6, 'août': 7, septembre: 8, octobre: 9, novembre: 10, 'décembre': 11
      };
      const parts = dateString.split(' ');
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = months[parts[1].toLowerCase()];
      const year = parseInt(parts[2], 10);
      if (isNaN(day) || month === undefined || isNaN(year)) return null;
      return new Date(year, month, day);
    }
    
    function parseEnglishDate(dateString) {
      // Handles formats like "24 July 2024"
      return new Date(dateString);
    }

    function getRelativeTimeString(date) {
        if (!date || isNaN(date.getTime())) {
          return null;
        }

        const now = new Date();
        const diffInSeconds = Math.round((now - date) / 1000);
        
        const lang = document.documentElement.lang || 'en';
        const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

        const minutes = Math.round(diffInSeconds / 60);
        const hours = Math.round(minutes / 60);
        const days = Math.round(hours / 24);
        const weeks = Math.round(days / 7);
        const months = Math.round(days / 30.44); // Average days in a month
        const years = Math.round(days / 365.25);

        if (years > 0) return rtf.format(-years, 'year');
        if (months > 0) return rtf.format(-months, 'month');
        if (days > 0) return rtf.format(-days, 'day');
        if (weeks > 0) return rtf.format(-weeks, 'week');
        if (hours > 0) return rtf.format(-hours, 'hour');
        if (minutes > 0) return rtf.format(-minutes, 'minute');
        return rtf.format(-diffInSeconds, 'second');
    }

    const postDateEls = qsa('div[id^="forums_topic_"] h6');
    if (!postDateEls || postDateEls.length === 0) return;

    postDateEls.forEach(postDateEl => {
      // Add a marker to prevent re-processing
      if (postDateEl.dataset.dateModified) return;

      const fullString = postDateEl.innerText;
      const dateString = extractDateFromH6(fullString);
      if (!dateString) return;

      let parsedDate;
      if (/[éû]/.test(dateString)) { // Simple check for French month names
        parsedDate = parseFrenchDate(dateString);
      } else {
        parsedDate = parseEnglishDate(dateString);
      }

      const relativeTimeString = getRelativeTimeString(parsedDate);
      if (!relativeTimeString) return;

      for (let i = 0; i < postDateEl.childNodes.length; i++) {
        const node = postDateEl.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.includes(dateString)) {
            node.textContent = node.textContent.replace(dateString, relativeTimeString);
            postDateEl.dataset.dateModified = 'true';
            break; 
          }
        }
      }
    });
  }`,
};
