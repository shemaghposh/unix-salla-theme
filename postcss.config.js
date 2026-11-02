// postcss.config.js
// Targets come from "browserslist" in package.json (ROADMAP 6.2, docs/PERFORMANCE.md §2).
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': 'postcss-nesting',
    tailwindcss: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': true,
        // RTL-first theme: logical properties must reach the browser as written. postcss-logical
        // rewrites them to ONE physical side (left-to-right), which breaks every inline-start/end
        // rule in Arabic. All supported browsers handle them natively (docs/PERFORMANCE.md §2).
        'logical-properties-and-values': false,
      },
    },
  }
}
