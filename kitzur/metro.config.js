const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Increase timeouts for large bundles
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Set timeout to 5 minutes for bundle requests
      res.setTimeout(300000);
      return middleware(req, res, next);
    };
  },
};

// Increase transformer timeout
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    ...config.transformer?.minifierConfig,
    // Disable minification to speed up build
    compress: false,
    mangle: false,
  },
};

module.exports = config;
