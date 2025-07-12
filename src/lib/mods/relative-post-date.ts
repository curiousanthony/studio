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
     const datePattern = /\d{1,2}\s\w+\s\d{4}/;
    log("Date pattern:", datePattern);

    function extractDateFromH6(fullString) {
      log("Extracting date from string:", fullString);
      const match = fullString.match(datePattern);
      if (match) {
        log("Date extracted:", match[0]);
        return match[0];
      }
      log("No date found in string:", fullString);
      return null;
    }

    function parseFrenchDate(dateString) {
      log("Parsing French date:", dateString);
      const months = {
        janvier: 0, 'février': 1, mars: 2, avril: 3, mai: 4, juin: 5,
        juillet: 6, 'août': 7, septembre: 8, octobre: 9, novembre: 10, 'décembre': 11
      };
      const parts = dateString.split(' ');
      if (parts.length !== 3) {
        log("Invalid date format:", dateString);
        return null;
      }
      const day = parseInt(parts[0], 10);
      const month = months[parts[1].toLowerCase()];
      const year = parseInt(parts[2], 10);
      if (isNaN(day) || month === undefined || isNaN(year)) {
        log("Invalid date values:", dateString);
        return null;
      }
      const date = new Date(year, month, day);
      log("Parsed French date:", date);
      return date;
    }

    function getRelativeTimeString(date) {
      log("Getting relative time string for date:", date);
      if (!date || isNaN(date.getTime())) {
        log("Invalid date:", date);
        return null;
      }

      // Set the time component to midnight for both dates
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const postDate = new Date(date);
      postDate.setHours(0, 0, 0, 0);

      const diffInMilliseconds = now - postDate;
      const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      const lang = 'fr'; // Force French language for relative time format
      //log("Language for relative time format:", lang);
      const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });

      if (diffInDays > 0) {
        const relativeTimeString = rtf.format(-diffInDays, 'day');
        log("Relative time string (days):", relativeTimeString);
        return relativeTimeString;
      }

      // Fallback for other time units if needed
      const diffInSeconds = Math.round(diffInMilliseconds / 1000);
      const minutes = Math.round(diffInSeconds / 60);
      const hours = Math.round(minutes / 60);
      const weeks = Math.round(diffInDays / 7);
      const months = Math.round(diffInDays / 30.44); // Average days in a month
      const years = Math.round(diffInDays / 365.25);

      if (years > 0) {
        const relativeTimeString = rtf.format(-years, 'year');
        log("Relative time string (years):", relativeTimeString);
        return relativeTimeString;
      }
      if (months > 0) {
        const relativeTimeString = rtf.format(-months, 'month');
        log("Relative time string (months):", relativeTimeString);
        return relativeTimeString;
      }
      if (weeks > 0) {
        const relativeTimeString = rtf.format(-weeks, 'week');
        log("Relative time string (weeks):", relativeTimeString);
        return relativeTimeString;
      }
      if (hours > 0) {
        const relativeTimeString = rtf.format(-hours, 'hour');
        log("Relative time string (hours):", relativeTimeString);
        return relativeTimeString;
      }
      if (minutes > 0) {
        const relativeTimeString = rtf.format(-minutes, 'minute');
        log("Relative time string (minutes):", relativeTimeString);
        return relativeTimeString;
      }
      const relativeTimeString = rtf.format(-diffInSeconds, 'second');
      log("Relative time string (seconds):", relativeTimeString);
      return relativeTimeString;
    }

    const postDateEls = qsa('div[id^="forums_topic_"] h6');
    log("Found post date elements:", postDateEls);
    if (!postDateEls || postDateEls.length === 0) {
      log("No post date elements found.");
      return;
    }

    postDateEls.forEach(postDateEl => {
      //log("Processing post date element:", postDateEl);
      // Add a marker to prevent re-processing
      if (postDateEl.dataset.dateModified) {
        log("Element already processed:", postDateEl);
        return;
      }

      const fullString = postDateEl.innerText;
      //log("Full text content of element:", fullString);
      const dateString = extractDateFromH6(fullString);
      if (!dateString) {
        //log("No date string found in element:", postDateEl);
        return;
      }

      // Always use French date parsing
      const parsedDate = parseFrenchDate(dateString);

      const relativeTimeString = getRelativeTimeString(parsedDate);
      if (!relativeTimeString) {
        log("No relative time string generated for date:", dateString);
        return;
      }

      for (let i = 0; i < postDateEl.childNodes.length; i++) {
        const node = postDateEl.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent.includes(dateString)) {
            log("Replacing date string with relative time string in node:", node);
            node.textContent = node.textContent.replace(dateString, relativeTimeString);
            postDateEl.dataset.dateModified = 'true';
            log("Updated node text content:", node.textContent);
            break;
          }
        }
      }
    });`,
};
