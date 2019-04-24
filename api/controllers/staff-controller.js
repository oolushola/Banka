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


const makeTransaction = (type, oldBalance, amount) => {
  let newBalance;

  if (type === 'credit') {
    newBalance = Number(oldBalance) + Number(amount);
  }

  if (type === 'debit') {
    newBalance = Number(oldBalance) - Number(amount);
  }
  return newBalance;
};

class staffController {
  static staffLogin(req, res, next) {
    const { email, password } = req.body;

    const checkLoginInfo = 'SELECT id, email, password, user_type, is_admin FROM users WHERE email = $1 ';
    pool.query(checkLoginInfo, [email], (err, result) => {
      if (err) return next(err);
      if (result.rows.length <= 0) {
        return res.status(404).send({
          status: 404, auth: false, token: null, msg: 'user not found',
        });
      }

      const trimUserType = result.rows[0].user_type;
      const userType = trimUserType.replace(/\s/g, '');
      if (userType !== 'staff') return res.status(401).send({ status: 401, auth: false, msg: 'unauthorized' });

      const getPassword = bcrypt.compareSync(password, result.rows[0].password);
      if (!getPassword) {
        return res.status(401).send({
          status: 401, auth: false, token: null, msg: 'invalid login',
        });
      }
      const token = jwt.sign({ id: result.rows[0].id }, config.secret, { expiresIn: 86400 });
      return res.status(200).send({
        status: 200, auth: true, token, msg: 'login successful',
      });
    });
  }

  static transactions(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ status: 401, auth: false, msg: 'no token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ status: 401, auth: false, msg: 'unverifiable token' });
      const {
        accountNumber, amount, transactionType, confirmation,
      } = req.body;

      const checkAccountNumber = 'SELECT account_number, account_status, owner FROM accounts WHERE account_number = $1 AND account_status = $2 ';
      pool.query(checkAccountNumber, [accountNumber, 'active'], (error, result) => {
        if (error) return next(error);
        if (result.rows.length <= 0) return res.status(404).send({ status: 404, msg: 'invalid account' });
      });

      let oldBalance;
      let newBalance;
      const createdOn = new Date();

      const transaction = 'SELECT * FROM transactions WHERE account_number = $1';
      pool.query(transaction, [accountNumber], (err, content) => {
        if (err) return next(err);
        if (content.rows.length <= 0) {
          const getOpeningBalance = 'SELECT * FROM accounts WHERE account_number = $1';
          pool.query(getOpeningBalance, [accountNumber], (err, accountInfo) => {
            if (err) return next(err);

            if (transactionType === 'debit' && Number(amount) > Number(accountInfo.rows[0].balance)) { return res.status(400).send({ status: 400, msg: 'Insufficent fund' }); }

            newBalance = makeTransaction(transactionType, accountInfo.rows[0].balance, amount);
            oldBalance = accountInfo.rows[0].balance;

            const saveTransactions = 'INSERT INTO transactions (created_on, transaction_type, account_number, cashier, amount, old_balance, new_balance) VALUES ($1, $2, $3, $4, $5, $6, $7)';
            pool.query(saveTransactions, [createdOn, transactionType, accountNumber, decoded.id, amount, oldBalance, newBalance], (err, content) => {
              if (err) return next(err);
              return res.status(201).send({ status: 201, msg: 'transaction successful' });
            });
          });
        } else {
          let transactionFound;
          let transactionIndex;

          const transactionRecord = content.rows;
          transactionRecord.map((lastTransaction, index) => {
            transactionFound = lastTransaction;
            transactionIndex = index;
          });

          newBalance = makeTransaction(transactionType, transactionFound.new_balance, amount);
          oldBalance = transactionFound.new_balance;

          if (transactionType === 'debit' && Number(amount) > Number(transactionFound.new_balance)) { return res.status(400).send({ status: 400, msg: 'Insufficent fund' }); }

          const saveTransactions = 'INSERT INTO transactions (created_on, transaction_type, account_number, cashier, amount, old_balance, new_balance) VALUES ($1, $2, $3, $4, $5, $6, $7)';
          pool.query(saveTransactions, [createdOn, transactionType, accountNumber, decoded.id, amount, oldBalance, newBalance], (err, content) => {
            if (err) return next(err);
            return res.status(201).send({ status: 201, msg: 'transaction successful' });
          });
        }
      });
    });
  }

  static deleteAccount(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) res.status(401).send({ status: 401, auth: false, msg: 'no token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ status: 401, auth: false, msg: 'unverifiable token' });
      const checkUser = 'SELECT email, user_type, is_admin  FROM users WHERE id = $1 AND (user_type = $2 OR is_admin = $3)';
      pool.query(checkUser, [decoded.id, 'staff', true], (err, content) => {
        if (err) return next(err);
        if (content.rows.length <= 0) return res.status(401).send({ status: 401, msg: 'unauthorized user' });
      });
      const { accountNumber } = req.params;
      const checkAccountNumber = 'SELECT account_number FROM accounts WHERE account_number = $1 ';
      pool.query(checkAccountNumber, [accountNumber], (err, result) => {
        if (err) return res.status(500).send({ status: 500, msg: 'internal server error' });
        if (result.rows.length <= 0) return res.status(400).send({ status: 400, msg: 'account number not recognized' });

        const deleteQuery = 'DELETE FROM accounts WHERE account_number = $1';
        pool.query(deleteQuery, [accountNumber], async (error, result) => {
          await res.status(200).send({ status: 200, msg: 'account deleted' });
        });
      });
    });
  }

  static allBankAccounts(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) res.status(401).send({ status: 401, msg: 'no token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) res.status(401).send({ status: 401, msg: 'unverifiable token' });
      const { id } = decoded;

      const checkUser = 'SELECT email, user_type, is_admin  FROM users WHERE id = $1 AND (user_type = $2 OR is_admin = $3)';
      pool.query(checkUser, [id, 'staff', true], (err, content) => {
        if (err) return next(err);
        if (content.rows.length <= 0) return res.status(401).send({ status: 401, msg: 'unauthorized user' });
      });

      const getAllAccounts = 'SELECT a.last_name, a.first_name, a.email, a.phone_no, b.account_number, b.created_on, b.account_type, b.account_status, b.balance FROM users a LEFT JOIN accounts b ON a.id = b.owner WHERE a.user_type = $1 ORDER BY a.last_name ASC';
      pool.query(getAllAccounts, ['client'], async (error, result) => {
        if (error) return next(error);
        await res.status(200).send({ status: 200, data: result.rows });
      });
    });
  }

  static getSpecificAccount(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ status: 401, msg: 'no token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(401).send({ status: 401, msg: 'unverifiable token' });

      const { id } = decoded;
      const { accountNumber } = req.params;

      const checkUser = 'SELECT email, user_type, is_admin  FROM users WHERE id = $1 AND (user_type = $2 OR is_admin = $3)';
      pool.query(checkUser, [id, 'staff', true], (err, content) => {
        if (err) return next(err);
        if (content.rows.length <= 0) return res.status(401).send({ status: 401, msg: 'unauthorized user' });
      });

      const getUserAccount = 'SELECT a.last_name, a.first_name, a.email, a.phone_no, b.account_number, b.created_on, b.account_type, b.account_status, b.balance FROM users a LEFT JOIN accounts b ON a.id = b.owner WHERE account_number = $1 AND a.user_type = $2';
      pool.query(getUserAccount, [accountNumber, 'client'], (err, result) => {
        if (err) return next(err);
        if (result.rows.length <= 0) return res.status(404).send({ status: 404, msg: 'user not found' });

        const userInfo = result.rows;

        const getUserTransHistory = 'SELECT * FROM transactions WHERE account_number = $1 ORDER BY created_on DESC';
        pool.query(getUserTransHistory, [accountNumber], async (err, content) => {
          if (err) return res.status(500).send({ status: 500, msg: 'internal server error' });
          await res.status(200).send({ status: 200, userInfo, transactionInfo: content.rows });
        });
      });
    });
  }
  
  static getAccountByStatus(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ status: 401, msg: 'no token' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) res.status(401).send({ status: 401, msg: 'unverifiable token' });
      const { status } = req.params;
      const { id } = decoded;


      const checkUser = 'SELECT email, user_type, is_admin  FROM users WHERE id = $1 AND (user_type = $2 OR is_admin = $3)';
      pool.query(checkUser, [id, 'staff', true], (err, content) => {
        if (err) return next(err);
        if (content.rows.length <= 0) return res.status(401).send({ status: 401, msg: 'unauthorized user' });
      });

      const getAccountByStatus = 'SELECT a.last_name, a.first_name, a.email, a.phone_no, b.account_number, b.created_on, b.account_type, b.account_status, b.balance FROM users a LEFT JOIN accounts b ON a.id = b.owner WHERE a.user_type = $1 AND b.account_status = $2 ORDER BY a.last_name ASC';
      pool.query(getAccountByStatus, ['client', status], async (error, result) => {
        if (error) return next(error);
        await res.status(200).send({ status: 200, data: result.rows });
      });
    });
  }
}


export default staffController;
