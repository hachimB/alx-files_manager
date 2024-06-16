const crypto = require('crypto');
const db = require('../utils/db');

class UsersController {
  static postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }
    const existingUser = db.client.db(db.database).collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Already exist' });
    }
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const user = db.client.db(db.database).collection('users').insertOne({ email, password: hashedPassword }).save();
    return res.status(201).send({ id: user.id, email: user.email });
  }
}
module.exports = UsersController;
