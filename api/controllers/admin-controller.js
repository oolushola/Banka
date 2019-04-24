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
}

export default adminController;
