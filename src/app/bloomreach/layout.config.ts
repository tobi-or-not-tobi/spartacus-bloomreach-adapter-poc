import { LayoutConfig } from '@spartacus/storefront';

export const bloomreachLayoutConfig = {
  layoutSlots: {
    // The page template is configured to render the following slots
    base: {
      // the header contains some static CMS content in Spartacus, this can
      // be removed or further extended.
      header: ['PreHeader', 'SiteLogin'],
      slots: ['main'],
    },
  },
} as LayoutConfig;
