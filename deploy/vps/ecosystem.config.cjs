module.exports = {
  apps: [
    {
      name: "portfolio-api",
      cwd: "/var/www/ledanhdat/server",
      script: "dist/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        HOST: "127.0.0.1",
        PORT: 5000
      }
    }
  ]
};
