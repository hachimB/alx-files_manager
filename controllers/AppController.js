const redis = require('../utils/redis');
const db = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    res.status(200).json({
      redis: redis.isAlive(),
      db: db.isAlive(),
    });
  }

  static async getStats(req, res) {
    res.status(200).json({ users: await db.nbUsers(), files: await db.nbFiles() });
  }
}

module.exports = AppController;
