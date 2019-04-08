import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import users from '../models/users';
import bankAccount from '../models/bankaccount';

const filePath = path.join(__dirname, '../../UI');

class userController {
  static index(req, res) {
    res.redirect('/api/v1/register');
  }

  static getSignUp(req, res, next) {
    fs.readFile(`${filePath}/index.html`, (err, contents) => {
      if (err) {
        return next(err);
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(contents, 'utf8');
    });
  }

  static userSignUp(req, res) {
    if (!req.body.email) {
      res.status(401).json({ status: 'failed', msg: 'email is required.' });
    }
    if (!req.body.password) {
      res.status(401).json({ status: 'failed', msg: 'password is required.' });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = {
      id: users.length + 1,
      email: req.body.email,
      password: hashedPassword,
    };

    // check if a user with that email already exists;
    const findEmail = users.find(userdb => userdb.email === user.email);
    if (findEmail) return res.status(401).json({ status: 'failed', msg: `user with email ${user.email} exists` });

    users.push(user);
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
    return res.status(201).send({ auth: true, user, token });
  }

  static getUserLogin(req, res, next) {
    fs.readFile(`${filePath}/user-sign-in.html`, (err, contents) => {
      if (err) {
        return next(err);
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(contents, 'utf8');
    });
  }

  static userLogin(req, res) {
    // validate for user email;
    // validate for password request;
    const userFound = users.find(userdb => userdb.email === req.body.email);
    if (!userFound) return res.status(404).send({ status: 'failed', msg: 'user not found.' });

    const passwordIsValid = bcrypt.compareSync(req.body.password, userFound.password);
    if (!passwordIsValid) return res.status(401).send({ auth: 'false', token: null });

    const token = jwt.sign({ id: userFound.id }, config.secret, { expiresIn: 86400 });
    return res.status(200).send({ auth: true, token, userFound });
  }

  static getResetPassword(req, res) {
    res.send('render the password reset page');
  }

  static resetPassword(req, res) {
    if (!req.body.email) return res.status(400).send({ status: 'failed', msg: 'email is required.' });
    const user = req.body.email;
    const getUser = users.find(userdb => userdb.email === user);
    if (!getUser) return res.status(404).send({ status: 'failed', msg: 'user not found...' });
    return res.status(200).send({ status: 'success', msg: 'user found' });
  }

  static getCreateBankAccount(req, res) {
    fs.readFile(`${filePath}/index.html`, (err, contents) => {
      if (err) {
        return next(err);
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(contents, 'utf8');
    });
  }

  static createBankAccount(req, res) {
    const { id } = req.params;
    const user = users.find(userdb => userdb.id === Number(id));
    if (!user) return res.status(404).send({ status: 'failed', msg: 'user not found' });

    if (!req.body.dob) return res.status(400).send({ status: 'failed', msg: 'Date of Birth is required.' });
    if (!req.body.accountType) return res.status(400).send({ status: 'failed', msg: 'account type is required.' });
    if (!req.body.balance) return res.status(400).send({ status: 'failed', msg: 'opening balance is required.' });

    const bankaccount = {
      id: bankAccount.length + 1,
      accountNumber: '',
      createdOn: new Date(),
      owner: Number(id),
      dob: req.body.dob,
      accountType: req.body.accountType,
      status: '',
      balance: req.body.balance,
    };

    bankAccount.push(bankaccount);
    return res.status(201).send({ status: 'success', msg: 'account created', bankaccount });
  }

  static specificUser(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'no token provided.' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      // res.status(200).send(decoded);
      const getUser = users.find(userdb => userdb.id === decoded.id);
      if (!getUser) return res.status(400).send('No user found');
      return res.status(200).send(getUser);
    });
  }

  static getAllUsers(req, res) {
    res.status(200).json({ status: 'success', msg: 'Users List', users });
  }

  static changePassword(req, res) {
    const { id } = req.params;
    const userFound = users.find(userdb => userdb.id === Number(id));
    if (!userFound) return res.status(404).send({ status: 'failed', msg: 'user not found' });

    const newPassword = {
      id: userFound.id,
      password: req.body.password,
    };
    users.splice(userFound.index, 1, newPassword);
    return res.status(201).send({ status: 'success', msg: 'password updated', newPassword });
  }
}


export default userController;
