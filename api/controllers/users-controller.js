import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import config from '../../config';
import users from '../models/users';
// import bankAccount from '../models/bankaccount';

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
}


export default userController;
