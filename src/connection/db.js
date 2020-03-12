const delay = require('delay');
const { MongoClient } = require('mongodb');
const logger = require('../utils/logger');

class Db {
  connect(uri, options) {
    this._client = new MongoClient(uri, options);
    return this._client.connect();
  }

  switchDatabase(dbName) {
    this._db = this._client.db(dbName);
    logger.info(`Switched to database [${dbName}]`);
  }

  collection(name) {
    return this._db.collection(name);
  }

  dropDatabase() {
    return this._db.dropDatabase();
  }

  close(force) {
    return this._client.close(force);
  }

  async initialize(uri, dbName, options, reconnectDelay) {
    try {
      await this.connect(uri, options);
      logger.info('Connected successfully to MongoDB');
      this.switchDatabase(dbName);
      return true;
    } catch (err) {
      logger.error(err);
      if (reconnectDelay) {
        logger.warn(`Unable to connect to MongoDB, retrying in ${reconnectDelay / 1000} seconds...`);
        this.close(true);
        await delay(reconnectDelay);
        return this.initialize(uri, dbName, options, reconnectDelay);
      }
      return false;
    }
  }
}

module.exports = new Db();
