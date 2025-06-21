"use client";

import React from "react";

/**
 * HydrationFix component to prevent hydration mismatches caused by browser extensions
 * This component removes attributes injected by browser extensions before React hydration
 */
export function HydrationFix(): React.JSX.Element {
  return (
    <script
      id="hydration-fix"
      dangerouslySetInnerHTML={{
        __html: `
          // Remove common browser extension attributes that cause hydration mismatches
          if (typeof document !== 'undefined') {
            // ColorZilla extension
            if (document.body && document.body.hasAttribute('cz-shortcut-listen')) {
              document.body.removeAttribute('cz-shortcut-listen');
            }
            
            // Other common extension attributes
            const attributesToRemove = [
              'cz-shortcut-listen',
              'data-new-gr-c-s-check-loaded',
              'data-gr-ext-installed',
              'spellcheck'
            ];
            
            attributesToRemove.forEach(attr => {
              if (document.body && document.body.hasAttribute(attr)) {
                document.body.removeAttribute(attr);
              }
            });

            // Set up MutationObserver to watch for extension modifications
            const observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.target === document.body) {
                  attributesToRemove.forEach(attr => {
                    if (document.body.hasAttribute(attr)) {
                      document.body.removeAttribute(attr);
                    }
                  });
                }
              });
            });

            // Start observing
            if (document.body) {
              observer.observe(document.body, {
                attributes: true,
                attributeFilter: attributesToRemove
              });
            }
          }
        `,
      }}
    />
  );
}
