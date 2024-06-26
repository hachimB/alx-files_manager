const { ObjectId } = require('mongodb');
const crypto = require('crypto');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
// const { ObjectId } = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).send({ error: 'Missing email' });
    }

    if (!password) {
      return res.status(400).send({ error: 'Missing password' });
    }

    try {
      const existingUser = await dbClient.client.db(dbClient.database).collection('users').findOne({ email });

      if (existingUser) {
        return res.status(400).send({ error: 'Already exist' });
      }

      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

      const result = await dbClient.client.db(dbClient.database).collection('users').insertOne({ email, password: hashedPassword });

      return res.status(201).send({ id: result.insertedId, email });
    } catch (err) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    try {
      const user = await dbClient.client.db(dbClient.database).collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
      return res.status(200).send({ id: user._id, email: user.email });
    } catch (err) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }
}
module.exports = UsersController;
