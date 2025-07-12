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
  configOptions: [
    {
      key: 'textColor',
      label: 'Text Color',
      type: 'color',
      value: '#ffffff',
      placeholder: '#ffffff',
    },
    {
      key: 'fontWeight',
      label: 'Font Weight',
      type: 'select',
      value: 'bold',
      options: ['normal', 'bold', '500', '600', '700'],
    },
    {
      key: 'animationDuration',
      label: 'Animation Duration (s)',
      type: 'number',
      value: '1.2',
      placeholder: '1.2',
    }
  ],
  functionString: `(config) => {
    const duration = parseFloat(config.animationDuration) || 1.2;
    const submitDelay = Math.max(0, (duration * 1000) - 400);

    // --- START: Style Injection ---
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
        background-color: var(--color-primary-500, #3B82F6);
        font-size: .9rem;
        font-weight: \${config.fontWeight || 'bold'};
        color: \${config.textColor || '#ffffff'};
        pointer-events: none;
        animation: xpFloatUp \${duration}s ease-out forwards;
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

      publishBtn.addEventListener("click", function (e) {
        if (isSubmitting) {
            // This is the programmatic click, let it go through
            return;
        }
        
        const xp = getXPValue();
        
        if (xp === null) {
            // If no XP value, just submit immediately without animation.
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        isSubmitting = true;
        publishBtn.disabled = true;

        const xpFloat = document.createElement("div");
        xpFloat.className = "xp-bonus-float";
        xpFloat.textContent = \`+\${xp} XP ✨\`;

        // Make button relative to position the animation
        publishBtn.style.position = "relative";
        publishBtn.appendChild(xpFloat);

        // Submit the form by re-clicking after a delay
        setTimeout(() => {
          publishBtn.disabled = false;
          // The isSubmitting flag will be true, so this click will be allowed
          publishBtn.click();
        }, submitDelay);

        // Clean up the element after animation completes
        setTimeout(() => {
          xpFloat.remove();
        }, duration * 1000);

      }, true);
    }
  }`,
};
