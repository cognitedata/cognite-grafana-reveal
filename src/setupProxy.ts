const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      pathRewrite: {
        '^/api': '', // rewrite path
      },
      headers: {
        authorization: undefined
      }
    })
  );
};