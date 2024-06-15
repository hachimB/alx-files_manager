const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.url = `mongodb://${this.host}:${this.port}/${this.database}`;
    this.client = new MongoClient(this.url, { useUnifiedTopology: true });
  }

  isAlive() {
    return this.client && this.client.isConnected();
  }

  async nbUsers() {
    return new Promise((resolve, reject) => {
      this.client.db(this.database).collection('users').countDocuments({}, (err, count) => {
        if (err) reject(err);
        resolve(count);
      });
    });
  }

  async nbFiles() {
    return new Promise((resolve, reject) => {
      this.client.db(this.database).collection('files').countDocuments({}, (err, count) => {
        if (err) reject(err);
        resolve(count);
      });
    });
  }
}
const dbClient = new DBClient();

module.exports = dbClient;
