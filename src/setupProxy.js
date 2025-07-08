const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://neoapi.devrayan.ir/api",
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        "^/api": "/api",
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(
          `[Proxy] ${req.method} ${req.originalUrl} → ${proxyReq.getHeader(
            "host"
          )}${proxyReq.path}`
        );
      },
      onError: (err, req, res) => {
        console.error("Proxy error:", err);
      },
    })
  );
};
