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

  static userLogin(req, res, next) {
    const { email, password } = req.body;
    const checkLoginInfo = 'SELECT id, email, password, user_type, is_admin FROM users WHERE email = $1 AND user_type = $2';
    pool.query(checkLoginInfo, [email, 'client'], (err, result) => {
      if (err) return next(err);
      if (result.rows.length <= 0) {
        return res.status(404).send({
          status: 404, auth: false, token: null, msg: 'not match',
        });
      }

      const getPassword = bcrypt.compareSync(password, result.rows[0].password);
      if (!getPassword) {
        return res.status(401).send({
          status: 401, auth: false, token: null, msg: 'incorrect login details',
        });
      }

      const token = jwt.sign({ id: result.rows[0].id }, config.secret, { expiresIn: 86400 });
      return res.status(200).send({ status: 200, auth: true, token });
    });
  }
}


export default userController;
