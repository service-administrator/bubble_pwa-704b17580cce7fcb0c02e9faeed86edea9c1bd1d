const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
  app.use(
    `/bubble`,
    createProxyMiddleware({
      target: 'http://api.bubble.jyhs.kr',
      changeOrigin: true,
      pathRewrite: {
        '^/bubble':''
      },
    })
  );
};