/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import users from '../models/users';
import bankAccount from '../models/bankaccount';
import transactions from '../models/transaction';
import config from '../../config';

const filePath = path.join(__dirname, '../../UI/staff');

class staffController {
  static getStaffLogin(req, res) {
    fs.readFile(`${filePath}/index.html`, (err, contents) => {
      if (err) return res.status(404).send('Page not found');
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(contents, 'utf8');
    });
  }

  static staffLogin(req, res) {
    if (!req.body.email) return res.status(400).send({ status: 'failed', msg: 'email is required' });
    if (!req.body.password) return res.status(400).send({ status: 'failed', msg: 'password is required.' });

    const findUser = users.find(userdb => userdb.email === req.body.email);
    if (!findUser) return res.status(404).send({ status: 'failed', msg: 'user not found' });
    if (findUser.type !== 'staff') res.status(404).send({ status: 'unauthorized', msg: 'Unauthorized user' });

    // Now get the password of the user and compare
    const passwordIsValid = bcrypt.compareSync(req.body.password, findUser.password);
    if (!passwordIsValid) return res.status(401).send({ auth: 'false', token: null });

    const token = jwt.sign({ id: findUser.id }, config.secret, { expiresIn: 86400 });
    return res.status(200).send({ auth: true, token, findUser });
  }

  static creditAccount(req, res) {
    if (!req.body.accountNumber) return res.status(400).send({ status: 'failed', msg: 'account number' });
    if (!req.body.amount) return res.status(400).send({ status: 'failed', msg: 'amount is required.' });

    const getUserAccNum = bankAccount.find(bankAccountdb => bankAccountdb.accountNumber === Number(req.body.accountNumber));
    if (!getUserAccNum) return res.status(404).send({ status: 'failed', msg: 'account number not found' });

    // go and check if this account exists in the transaction table and get the last transaction of the user

    let transactionFound;
    let transactionIndex;

    transactions.map((getTransactions, index) => {
      transactionFound = getTransactions;
      transactionIndex = index;
    });


    const oldBalance = transactionFound.newBalance;
    const newBalance = parseFloat(oldBalance + Number(req.body.amount));

    const transaction = {
      id: transactions.length + 1,
      createdOn: new Date(),
      type: req.body.type,
      accountNumber: Number(req.body.accountNumber),
      cahsier: Number(req.body.id),
      amount: parseFloat(req.body.amount),
      oldBalance,
      newBalance,
    };
    // since the transaction has been successful, push to the transaction array.
    transactions.push(transaction);
    res.status(201).send({
      status: 'success', msg: 'transaction successful', account: getUserAccNum, transaction,
    });
  }

  static debitAccount(req, res) {
    if (!req.body.accountNumber) return res.status(400).send({ status: 'failed', msg: 'account number' });
    if (!req.body.amount) return res.status(400).send({ status: 'failed', msg: 'amount is required.' });

    const getUserAccNum = bankAccount.find(bankAccountdb => bankAccountdb.accountNumber === Number(req.body.accountNumber));
    if (!getUserAccNum) return res.status(404).send({ status: 'failed', msg: 'account number not found' });

    // go and check if this account exists in the transaction table and get the last transaction of the user

    let transactionFound;
    let transactionIndex;

    transactions.map((getTransactions, index) => {
      transactionFound = getTransactions;
      transactionIndex = index;
    });

    // const oldBalance;
    // let newBalance;

    if (transactionFound.newBalance < parseFloat(req.body.amount)) { return res.status(403).send({ status: 'failed', msg: 'amount is greater than old balance' }); }
    const oldBalance = transactionFound.newBalance;
    const newBalance = parseFloat(oldBalance - req.body.amount);


    const transaction = {
      id: transactions.length + 1,
      createdOn: new Date(),
      type: req.body.type,
      accountNumber: Number(req.body.accountNumber),
      cahsier: Number(req.body.id),
      amount: parseFloat(req.body.amount),
      oldBalance,
      newBalance,
    };
    // since the transaction has been successful, push to the transaction array.
    transactions.push(transaction);
    res.status(201).send({
      status: 'success', msg: 'transaction successful', account: getUserAccNum, transaction,
    });
  }

  static deleteAccount(req, res) {
    const accNo = req.params.accountNumber;
    const userAccount = bankAccount.find(useracc => useracc.accountNumber === Number(accNo));
    if (!userAccount) return res.status(404).send({ status: 'failed', msg: 'user not found' });
    const deleteUser = bankAccount.splice(userAccount.index, 1);
    res.status(200).send({
      status: 'success', msg: 'account deleted.', deleteUser, userAccount,
    });
  }
}
export default staffController;
