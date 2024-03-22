/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */
const Redis = require("ioredis");
const CoinAPI = require("../CoinAPI");

class RedisBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.client = null;
  }

  async connect() {
    this.client = new Redis();
    return this.client;
  }

  async disconnect() {
    return this.client.disconnect();
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const values = [];

    Object.entries(data.bpi).forEach((entry) => {
      values.push(entry[1]);
      values.push(entry[0]);
    });
    return this.client.zadd("maxcoin:values", values);
  }

  async getMax() {
    return this.client.zrange("maxcoin:values", -1, -1, "WITHSCORES");
  }

  async getMin() {
    return this.client.zrange("maxcoin:values", 0, 0, "WITHSCORES");
  }

  async max() {
    console.info("Connection to Redis established");
    console.time("redis-connect");
    const client = this.connect();
    if (client) {
      console.info("Connected to redis");
    } else {
      throw new Error("Failed to connect to redis");
    }
    console.timeEnd("redis-connect");

    console.info("Inserting data into redis");
    console.time("redis-insert");
    const insertResult = await this.insert();
    console.timeEnd("redis-insert");
    console.info(`Inserted ${insertResult} documents`);

    console.info("Fetching max value from redis");
    console.time("redis-max");
    const maxValue = await this.getMax();
    console.timeEnd("redis-max");

    console.info("Fetching min value from redis");
    console.time("redis-min");
    const minValue = await this.getMin();
    console.timeEnd("redis-min");

    console.info("Disconnecting from redis");
    console.time("redis-disconnect");
    await this.disconnect();
    console.timeEnd("redis-disconnect");

    return {
      max: maxValue,
      min: minValue,
    };
  }
}

module.exports = RedisBackend;
