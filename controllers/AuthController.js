const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ error: 'No credentials sent!' });
    }
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [email, password] = auth.split(':');
    const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');

    const user = await dbClient.client.db(dbClient.database).collection('users').findOne({ email, password: hashedPassword });
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const token = uuidv4();
    const key = `auth_${token}`;
    await redisClient.set(key, user._id.toString(), 24 * 60 * 60);
    return res.status(200).send({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['X-Token'];
    if (!token) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    const user = await redisClient.get(key);
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    await redisClient.del(key);
    return res.status(204).send();
  }
}

module.exports = AuthController;
