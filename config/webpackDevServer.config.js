'use strict';

const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const ignoredFiles = require('react-dev-utils/ignoredFiles');
const config = require('./webpack.config.dev');
const paths = require('./paths');

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

module.exports = function(proxy, allowedHost) {
  return {
    disableHostCheck: !proxy ||
      process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    compress: true,
    clientLogLevel: 'none',
    contentBase: paths.appPublic,
    watchContentBase: true,
    // Enable hot reloading server. It will provide /sockjs-node/ endpoint
    hot: true,
    // It is important to tell WebpackDevServer to use the same "root" pm /.
    publicPath: config.output.publicPath,
    // WebpackDevServer is noisy by default so we emit custom message instbove.
    quiet: true,
    watchOptions: {
      ignored: ignoredFiles(paths.appSrc),
    },
    https: protocol === 'https',
    host: host,
    overlay: false,
    historyApiFallback: {
      disableDotRule: true,
    },
    public: allowedHost,
    proxy,
    before(app) {
      app.use(errorOverlayMiddleware());
      app.use(noopServiceWorkerMiddleware());
    },
  };
};
