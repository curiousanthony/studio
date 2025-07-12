import type { Mod } from '@/types';

export const mod: Mod = {
  id: 'community-xp-animation',
  name: 'Community XP Animation',
  description: "Adds a dynamic '+N XP' floating animation after publishing a post, giving members a small dopamine hit and visual feedback that incentivizes participation.",
  category: 'Functionality',
  tags: ['community', 'gamification', 'ux', 'animation'],
  enabled: false,
  published: true,
  modType: 'javascript',
  functionString: `(config) => {
    // --- START: Stlye Injection ---
    const styles = \`
      @keyframes xpFloatUp {
        0% {
          opacity: 0;
          transform: translate(-50%, 0);
        }
        30%, 70% {
          opacity: 1;
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -40px);
        }
      }

      .xp-bonus-float {
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 4px 8px;
        border-radius: 6px;
        background-color: var(--color-primary-500);
        font-size: .9rem;
        font-weight: bold;
        color: white;
        pointer-events: none;
        animation: xpFloatUp 1s ease-out forwards;
        z-index: 9999;
        white-space: nowrap;
      }
    \`;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    // --- END: Style Injection ---

    const publishBtn = qs('button[data-target="form-with-trix.submit"]');

    function getXPValue() {
      const xpElement = qs('a[data-original-title="Comment gagner des points?"]');
      if (!xpElement) return null;
      
      const content = xpElement.getAttribute("data-content");
      if (!content) return null;

      const match = content.match(/Créer un post<\\\\/span>:\\\\s*(\\\\d+)\\\\s*points/);
      if (match && match[1]) {
        return parseInt(match[1], 10);
      } else {
        return null;
      }
    }

    if (publishBtn) {
      let isSubmitting = false;

      // We use a mousedown listener to be more reliable
      publishBtn.addEventListener("mousedown", function (e) {
        if (isSubmitting || qs('.xp-bonus-float', publishBtn)) return;

        isSubmitting = true;
        
        // Disable the button to prevent multiple submissions
        publishBtn.disabled = true;

        const xp = getXPValue();

        // If we can't get an XP value, submit the form normally.
        if (xp === null) {
           const form = publishBtn.closest('form');
           if (form) {
              publishBtn.disabled = false;
              form.submit();
           }
           return;
        }

        const xpFloat = document.createElement("div");
        xpFloat.className = "xp-bonus-float";
        xpFloat.textContent = \`+\${xp} XP ✨\`;

        // Make button relative to position the animation
        publishBtn.style.position = "relative";
        publishBtn.appendChild(xpFloat);

        // Submit the form after the animation is mostly visible
        // This makes the UI feel responsive.
        setTimeout(() => {
          const form = publishBtn.closest('form');
          if (form) {
            // Re-enable button before submission if needed by the backend
            publishBtn.disabled = false;
            form.submit();
          }
        }, 400);

        // Clean up the element and state after animation completes
        setTimeout(() => {
          xpFloat.remove();
          isSubmitting = false;
          publishBtn.disabled = false;
        }, 1200);

      }, true);
    }
  }`,
};
