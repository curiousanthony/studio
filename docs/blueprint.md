# **App Name**: SchoolMaker Mods

## Core Features:

- Mods Grid Display: Display available mods as cards in a grid layout.
- Mods Filtering: Filter mods by category (Appearance, Functionality) and tags.
- Mods Search: Search mods by name or description.
- Mods Enable/Disable: Enable/disable mods with a toggle on each card.
- Mod Configuration: Display config options in a modal, including text input fields and dropdowns, based on mod options.
- Code Generation: Generate a JavaScript array of enabled mods. Mod objects should include config, as well as the Mod's designated JavaScript function for each enabled mod.
- Footer: Include a footer displaying the text 'Created by Anthony'

## Style Guidelines:

- Background color: Off-white (#F9FAFB), providing a clean backdrop for the mod cards.
- Primary color: Tailwind's blue (#2563EB) for primary buttons like 'Configure'.
- Accent color: A lighter blue (#60A5FA), analogous to the primary, to create subtle highlights.
- Font pairing: 'Space Grotesk' (sans-serif) for headings and 'Inter' (sans-serif) for body text. These two complement one another for a modern feel.
- Configuration buttons should use simple, recognizable icons (e.g., a gear icon) in the Tailwind blue color palette to maintain consistency and clarity.
- Grid layout with responsive columns to display mod cards effectively on different screen sizes. Use Tailwind's grid classes for flexibility.
- Subtle animations for toggle switches and configuration modal transitions.