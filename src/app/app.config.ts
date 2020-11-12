import { translationChunksConfig, translations } from '@spartacus/assets';
import { StorefrontConfig } from '@spartacus/storefront';

export const appConfig: StorefrontConfig = {
  backend: {
    occ: {
      baseUrl: 'https://spartacus-dev0.eastus.cloudapp.azure.com:9002',
      prefix: '/occ/v2/',
    },
  },

  i18n: {
    resources: translations,
    chunks: translationChunksConfig,
    fallbackLang: 'en',
  },
  features: {
    level: '3.0',
  },
};
