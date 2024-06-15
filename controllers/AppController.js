const redis = require('../utils/redis');
const db = require('../utils/db');

class AppController {
  static getStatus(req, res) {
    res.status(200).json({
      redis: redis.isAlive(),
      db: db.isAlive(),
    });
  }

  static getStats(req, res) {
    res.status(200).json({ users: db.nbUsers(), files: db.nbFiles() });
  }
}

module.exports = AppController;
