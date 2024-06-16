const sha1 = require('sha1');
const db = require('../utils/db');

class UsersController {
  static postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    if (db.client.db(db.database).collection('users').findOne({ email })) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = sha1(password);
    return db.client.db(db.database).collection('users').insertOne({ email, password: hashedPassword });
  }
}
module.exports = UsersController;
