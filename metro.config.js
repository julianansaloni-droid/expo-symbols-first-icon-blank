// Holds the Material Symbols font file for 18 s on its way out of the dev server, so every page
// load sees what a slow network or a cold cache sees: a font that takes longer than the 12 s
// expo-font waits for it. Nothing else is changed. Delete this file and every icon draws.
const { getDefaultConfig } = require('expo/metro-config');

const FONT_DELAY_MS = 18000;

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => (req, res, next) => {
    if (req.url && req.url.includes('MaterialSymbols')) {
      setTimeout(() => middleware(req, res, next), FONT_DELAY_MS);
      return;
    }
    middleware(req, res, next);
  },
};

module.exports = config;
