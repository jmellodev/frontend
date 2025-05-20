// postcss.config.js
import tailwindcss from '@tailwindcss/postcss';
import cssnano from 'cssnano';

export default {
  plugins: {
    '@tailwindcss/postcss': {},
    ...(process.env.NODE_ENV === 'production' ? {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          minifySelectors: true
        }]
      }
    } : {})
  }
};