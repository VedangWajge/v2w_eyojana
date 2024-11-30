const path = require('path');

module.exports = {
  // Your existing configuration
  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      zlib: require.resolve('browserify-zlib'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      url: require.resolve('url/')
    }
  },
  rules: {
    "no-restricted-globals": [
        "error",
        {
            name: "confirm",
            message: "Please use a custom confirmation dialog instead."
        },
        "alert",
        "prompt"
    ]
}
};
