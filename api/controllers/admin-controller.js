/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import users from '../models/users';
import bankAccount from '../models/bankaccount';
import transactions from '../models/transaction';
import config from '../../config';

const filePath = path.join(__dirname, '../../UI/admin');

class adminController {
  static getAdminLogin(req, res) {
    fs.readFile(`${filePath}/index.html`, (err, contents) => {
      if (err) return res.status(404).send('Page not found');
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(contents, 'utf8');
    });
  }

  static adminLogin(req, res) {
    if (!req.body.email) return res.status(400).send({ status: 'failed', msg: 'email is required' });
    if (!req.body.password) return res.status(400).send({ status: 'failed', msg: 'password is required.' });

    const findUser = users.find(userdb => userdb.email === req.body.email);
    if (!findUser) return res.status(404).send({ status: 'failed', msg: 'user not found' });
    if (findUser.isAdmin !== true) res.status(404).send({ status: 'unauthorized', msg: 'Unauthorized user' });

    // Now get the password of the user and compare
    const passwordIsValid = bcrypt.compareSync(req.body.password, findUser.password);
    if (!passwordIsValid) return res.status(401).send({ auth: 'false', token: null });

    const token = jwt.sign({ id: findUser.id }, config.secret, { expiresIn: 86400 });
    return res.status(200).send({ auth: true, token, findUser });
  }

  static giveAccountNumber(req, res) {
    if (!req.body.id) return res.status(400).send({ status: 'failed', msg: 'user id is required.' });
    if (!req.body.accountNumber) return res.status(400).send({ status: 'failed', msg: 'account number is required' });

    const findUser = bankAccount.find(bankAccountDb => bankAccountDb.owner === Number(req.body.id));
    if (!findUser) return res.status(404).send({ status: 'failed', msg: 'user not found' });

    const accountNumberAssigned = {
      id: findUser.id,
      accountNumber: Number(req.body.accountNumber),
      created: findUser.created,
      owner: findUser.owner,
      dob: findUser.dob,
      accountType: findUser.accountType,
      status: findUser.status,
      openingBalance: findUser.openingBalance,
    };
    bankAccount.splice(findUser.index, 0, accountNumberAssigned);
    res.status(201).send({ status: 'success', msg: 'account number assigned', findUser });
  }

}

export default adminController;
