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

  static getTransactionHistory(req, res) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        status: 401, msg: 'no token', token: null, auth: false,
      });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ status: 401, auth: false, msg: 'failed to authenticate token' });
      const { accountNumber } = req.params;

      const checkQuery = 'SELECT * FROM accounts WHERE account_number = $1 AND owner = $2';
      pool.query(checkQuery, [accountNumber, decoded.id], (err, result) => {
        if (result.rows.length <= 0) {
          return res.status(404).send({ status: 404, msg: 'account number not found' });
        }
        const transQuery = 'SELECT * FROM transactions WHERE account_number = $1 ORDER BY created_on ASC';
        pool.query(transQuery, [accountNumber], async (err, result) => {
          if (err) return res.status(500).send('internal server error');
          if (result.rows.length <= 0) {
            return res.status(200).send({ status: 200, msg: 'no transaction record' });
          }
          await res.status(200).send({ status: 200, msg: result.rows });
        });
      });
    });
  }

  static getSpecificUserTransaction(req, res) {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({
        status: 401, msg: 'no token', token: null, auth: false,
      });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ status: 401, auth: false, msg: 'failed to authenticate token' });
      const { transactionid } = req.params;
      const { id } = decoded;

      console.log(typeof transactionid)

      const checkAccountNumber = 'SELECT * FROM accounts WHERE owner = $1';
      pool.query(checkAccountNumber, [id], (err, result)=>{
        if (err) return res.send('cant get transaction');
        const accountNumber = result.rows[0].account_number;
        const getTransHistory = 'SELECT a.created_on, a.transaction_type, a.amount, a.old_balance, a.new_balance, b.first_name, b.last_name FROM transactions a JOIN users b ON a.cashier = b.id WHERE a.id = $1 AND a.account_number = $2';
        pool.query(getTransHistory, [transactionid, accountNumber], (err, content)=>{
          return res.status(200).send({status: 200, data: content.rows});
        });
      });
    });
  }

  

  static updateProfile(req, res) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ status: 401, auth: false, message: 'Invalid token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ status: 401, auth: false, msg: 'failed to authenticate token' });

      const {
        firstName, lastName, phoneNo, state, city, occupation, gender, address,
      } = req.body;

      const { id } = decoded;

      const checkUser = 'SELECT * FROM users where id = $1 AND user_type = $2';
      pool.query(checkUser, [id, 'client'], async (error, result) => {
        if (error) return res.status(500).send({ status: 500, msg: 'internal server error' });
        if (result.rows.length <= 0) await res.status(404).send({ status: 404, msg: 'user not found' });

        const updatedTime = new Date();
        const updateUserRecord = 'UPDATE users SET first_name = $1, last_name = $2, phone_no = $3, state = $4, city = $5, occupation = $6, gender = $7, address = $8, updated_at = $9 WHERE id = $10';
        pool.query(updateUserRecord, [firstName, lastName, phoneNo, state, city, occupation, gender, address, updatedTime, id], () => res.status(201).send({ status: 201, msg: 'profile updated' }));
      });
    });
  }

  static createBankAccount(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ status: 401, auth: false, msg: 'no token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ status: 401, auth: false, msg: 'invalid token' });

      const { id } = decoded;

      const getUser = 'SELECT owner FROM accounts WHERE owner = $1';
      pool.query(getUser, [id], (error, result) => {
        if (error) { return next(error); }
        if (result.rows.length > 0) return res.status(409).send({ status: 409, msg: 'account exist' });

        const { dob, accountType } = req.body;
        const balance = Number(req.body.balance);

        const insertQuery = 'INSERT INTO accounts (owner, dob, account_type, balance) VALUES ($1, $2, $3, $4) ';
        pool.query(insertQuery, [id, dob, accountType, balance], (err) => {
          if (error) throw err;
          return res.status(201).send({ status: 201, msg: 'account created' });
        });
      });
    });
  }


  static resetPassword(req, res) {
    if (!req.body.email) return res.status(422).send({ status: 422, msg: 'email is required.' });
    const user = req.body.email;
    const getUser = users.find(userdb => userdb.email === user);
    if (!getUser) return res.status(404).send({ status: 404, msg: 'user not found.' });
    return res.status(200).send({ status: 200, msg: 'user found.' });
  }

  static changePassword(req, res) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send({ status: 401, auth: false, msg: 'invalid token' });
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(500).send({ status: 500, auth: false, msg: 'failed to verify token' });

      const { id } = decoded;

      const checkUser = 'SELECT id, password FROM users WHERE id = $1 AND user_type = $2';
      pool.query(checkUser, [id, 'client'], (err, result) => {
        if (result.rows.length <= 0) return res.status(404).send({ status: 404, msg: 'user not found' });

        const { oldPassword, newPassword } = req.body;

        const confirmOldPassword = bcrypt.compareSync(oldPassword, result.rows[0].password);
        if (!confirmOldPassword) return res.status(400).send({ status: 400, msg: 'previous password is incorrect' });

        const hashedPassword = bcrypt.hashSync(newPassword, 8);

        const passwordQuery = 'UPDATE users SET password = $1 WHERE id = $2';
        pool.query(passwordQuery, [hashedPassword, id], () => res.status(201).send({ status: 201, msg: 'password updated' }));
      });
    });
  }
}


export default userController;
