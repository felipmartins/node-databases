/* eslint-disable no-useless-constructor */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-empty-function */

const { MongoClient } = require("mongodb");

const CoinAPI = require("../CoinAPI");

class MongoBackend {
  constructor() {
    this.coinAPI = new CoinAPI();
    this.mongoUrl = "mongodb://localhost:27017/maxcoin";
    this.client = null;
    this.collection = null;
  }

  async connect() {
    const mongoClient = new MongoClient(this.mongoUrl, {});
    this.client = await mongoClient.connect();
    this.collection = this.client.db("maxcoin").collection("prices");
    return this.client;
  }

  async disconnect() {
    if (this.client) {
      return this.client.close();
    }
    return false;
  }

  async insert() {
    const data = await this.coinAPI.fetch();
    const documents = [];
    Object.entries(data.bpi).forEach((entry) => {
      documents.push({ date: entry[0], value: entry[1] });
    });
    return this.collection.insertMany(documents);
  }

  async getMax() {
    return this.collection.findOne({}, { sort: { value: -1 } });
  }

  async getMin() {
    return this.collection.findOne({}, { sort: { value: 1 } });
  }

  async max() {
    console.info("Connection to MongoDB established");
    console.time("mongodb-connect");
    const client = await this.connect();
    if (client) {
      console.info("Connected to MongoDB");
    } else {
      throw new Error("Failed to connect to MongoDB");
    }
    console.timeEnd("mongodb-connect");

    console.info("Inserting data into MongoDB");
    console.time("mongodb-insert");
    const insertResult = await this.insert();
    console.timeEnd("mongodb-insert");
    console.info(`Inserted ${insertResult.insertedCount} documents`);

    console.info("Fetching max value from MongoDB");
    console.time("mongodb-max");
    const maxValue = await this.getMax();
    console.timeEnd("mongodb-max");
    console.info(`Max value is ${maxValue.value} at ${maxValue.date}`);

    console.info("Fetching min value from MongoDB");
    console.time("mongodb-min");
    const minValue = await this.getMin();
    console.timeEnd("mongodb-min");
    console.info(`Min value is ${minValue.value} at ${minValue.date}`);

    console.info("Disconnecting from MongoDB");
    console.time("mongodb-disconnect");
    await this.disconnect();
    console.timeEnd("mongodb-disconnect");

    return {
      max: { date: maxValue.date, value: maxValue.value },
      min: { date: minValue.date, value: minValue.value },
    };
  }
}

module.exports = MongoBackend;
