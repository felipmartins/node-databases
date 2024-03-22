const pkg = require("../../package.json");

module.exports = {
  applicationName: pkg.name,
  mongodb: {
    url: "mongodb://localhost:27017/shopper",
  },
  redis: {
    port: 6379,
    client: null,
  },
  mysql: {
    options: {
      host: "localhost",
      port: 5432,
      database: "shopper",
      dialect: "postgres",
      username: "postgres",
      password: "password",
    },
    client: null,
  },
};
