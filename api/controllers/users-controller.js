import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import config from '../../config';
import '@babel/polyfill';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.CONNINFO,
});

class userController {
  static index(req, res) {
    res.send('Welcome to banka');
  }

  static userSignUp(req, res) {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const checkQueryText = 'SELECT email FROM users where email = $1';
    pool.query(checkQueryText, [email], (err, result) => {
      if (err) throw err;
      if (result.rows.length >= 1) {
        return res.status(409).send({ status: 409, msg: 'record exists' });
      }
      const insertQuery = 'INSERT INTO users (email, password, user_type, is_admin) VALUES ($1, $2, $3, $4)';
      pool.query(insertQuery, [email, hashedPassword, 'client', false], (error) => {
        if (error) throw error;
        const token = jwt.sign({ email }, config.secret, { expiresIn: 86400 });
        return res.status(201).send({ status: 201, auth: true, token });
      });
    });
  }
}


export default userController;
