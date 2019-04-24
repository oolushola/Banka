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


class adminController {
  static adminLogin(req, res, next) {
    const { email, password } = req.body;

    const checkLoginInfo = 'SELECT id, email, password, user_type, is_admin FROM users WHERE email = $1 ';
    pool.query(checkLoginInfo, [email], (err, result) => {
      if (err) return next(err);
      if (result.rows.length <= 0) return res.status(404).send({ auth: false, token: null, msg: 'Invalid login details ' });
      if ((result.rows[0].user_type !== 'admin') && (result.rows[0].is_admin !== true)) return res.status(401).send({ status: 401, auth: false, msg: 'unauthorized' });

      const getPassword = bcrypt.compareSync(password, result.rows[0].password);
      if (!getPassword) {
        return res.status(401).send({
          status: 401, auth: false, token: null, msg: 'invalid login details',
        });
      }

      const token = jwt.sign({ id: result.rows[0].id }, config.secret, { expiresIn: 86400 });
      return res.status(200).send({ status: 200, auth: true, token });
    });
  }
  
  static giveAccountNumber(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ status: 401, msg: 'no token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(500).send({
          status: 500, auth: false, token: null, msg: 'unverifiable token',
        });
      }

      const id = decoded;
      const { ownerId, accountNumber } = req.body;

      const checkUser = 'SELECT * FROM accounts WHERE owner = $1 ';
      pool.query(checkUser, [ownerId], (err, result) => {
        if (err) return res.status(500).send('internal server error');
        if (result.rows.length <= 0) return res.status(404).send({ status: 404, msg: 'user not found', id });

        const updateAccountNumber = 'UPDATE accounts SET account_number = $1 WHERE owner = $2';
        pool.query(updateAccountNumber, [accountNumber, ownerId], async (err, content) => {
          if (err) return res.status(500).send({ status: 500, msg: 'internal server error' });
          await res.status(201).send({ status: 201, msg: 'account number assigned', content });
        });
      });
    });
  }
}

export default adminController;
