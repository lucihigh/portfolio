module.exports = {
  apps: [
    {
      name: "portfolio-api",
      cwd: "/var/www/ledanhdat/server",
      script: "dist/index.js",
      interpreter: "node",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
