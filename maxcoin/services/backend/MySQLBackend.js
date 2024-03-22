/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const pg = require("pg");
const CoinAPI = require("../CoinAPI");

class MySQLBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.connection = null;
  }

  async connect() {
    this.connection = new pg.Pool({
      user: "postgres",
      host: "localhost",
      database: "maxcoin",
      password: "password",
      port: 5432,
    });
    return this.connection;
  }

  async disconnect() {
    this.connection = null;
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const values = [];

    Object.entries(data.bpi).forEach((entry) => {
      values.push([entry[0], entry[1]]);
    });

    const queryString =
      "INSERT INTO coinvalues (valuedate, coinvalue) VALUES ($1, $2)";

    const promises = values.map((item) => {
      const value = [item[0], item[1]];
      return this.connection.query(queryString, value);
    });

    return Promise.all(promises);
  }

  async getMax() {
    return this.connection.query(
      "SELECT * FROM coinvalues ORDER BY coinvalue DESC LIMIT 1"
    );
  }

  async getMin() {
    return this.connection.query(
      "SELECT * FROM coinvalues ORDER BY coinvalue ASC LIMIT 1"
    );
  }

  async max() {
    console.info("Connection to mysql established");
    console.time("mysql-connect");
    const client = await this.connect();
    if (client) {
      console.info("Connected to mysql");
    } else {
      throw new Error("Failed to connect to mysql");
    }
    console.timeEnd("mysql-connect");

    console.info("Inserting data into mysql");
    console.time("mysql-insert");
    const insertResult = await this.insert();
    console.timeEnd("mysql-insert");
    console.info(`Inserted ${insertResult.length} documents`);

    console.info("Fetching max value from mysql");
    console.time("mysql-max");
    const maxValue = await this.getMax();
    console.timeEnd("mysql-max");

    console.info("Fetching min value from mysql");
    console.time("mysql-min");
    const minValue = await this.getMin();
    console.timeEnd("mysql-min");

    console.info("Disconnecting from mysql");
    console.time("mysql-disconnect");
    await this.disconnect();
    console.timeEnd("mysql-disconnect");

    return {
      max: maxValue.rows,
      min: minValue.rows,
    };
  }
}

module.exports = MySQLBackend;
