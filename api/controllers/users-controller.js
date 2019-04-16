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
      res.status(422).json({ status: 422, msg: 'email is required.' });
    }
    if (!req.body.password) {
      res.status(422).json({ status: 422, msg: 'password is required.' });
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const user = {
      id: users.length + 1,
      email: req.body.email,
      password: hashedPassword,
    };

    // check if a user with that email already exists;
    const findEmail = users.find(userdb => userdb.email === user.email);
    if (findEmail) return res.status(409).send({ status: 409, msg: 'user exists' });

    users.push(user);
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
    return res.status(201).send({ status: 201, auth: true, email: user.email, token });
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
    if (!userFound) return res.status(404).send({ status: 404, msg: 'user not found.' });

    const passwordIsValid = bcrypt.compareSync(req.body.password, userFound.password);
    if (!passwordIsValid) return res.status(422).send({ status: 422, auth: 'false', token: null });

    const token = jwt.sign({ id: userFound.id }, config.secret, { expiresIn: 86400 });
    return res.status(200).send({ status: 200, auth: true, token, email: userFound.email });
  }

  static getUserUpdateProfile(req, res) {
    res.send('render the user update form page');
  }

  static updateProfile(req, res) {
    if (!req.body.firstname) return res.status(422).send({ status: 422, msg: 'first name is required.' });
    if (!req.body.lastname) return res.status(422).send({ status: 422, msg: 'last name is required.' });
    if (!req.body.phone_no) return res.status(422).send({ status: 422, msg: 'phone number is required.' });

    const { id } = req.params;

    const userFound = users.find(userdb => userdb.id === Number(id));
    if (!userFound) return res.status(404).send({ status: 404, msg: 'User not found' });

    const updateRecord = {
      id: userFound.id,
      email: userFound.email,
      password: userFound.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone_no: req.body.phone_no,
      state: req.body.state,
      city: req.body.city,
      occupation: req.body.occupation,
      gender: req.body.gender,
      address: req.body.address,
      type: 'client',
      isAdmin: false,
      joined: req.body.joined,
    };

    users.splice(userFound, 0, updateRecord);
    return res.status(201).send({ status: 201, message: 'User information updated successfully.', updateRecord });
  }

  static getResetPassword(req, res) {
    res.send('render the password reset page');
  }

  static resetPassword(req, res) {
    if (!req.body.email) return res.status(422).send({ status: 422 , msg: 'email is required.' });
    const user = req.body.email;
    const getUser = users.find(userdb => userdb.email === user);
    if (!getUser) return res.status(404).send({ status: 404, msg: 'user not found...' });
    return res.status(200).send({ status: 200, msg: 'user found' });
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
    if (!user) return res.status(404).send({ status: 404, msg: 'user not found' });

    if (!req.body.dob) return res.status(422).send({ status: 422, msg: 'Date of Birth is required.' });
    if (!req.body.accountType) return res.status(422).send({ status: 422, msg: 'account type is required.' });
    if (!req.body.balance) return res.status(422).send({ status: 422, msg: 'opening balance is required.' });

    const bankaccount = {
      id: bankAccount.length + 1,
      accountNumber: '',
      createdOn: new Date(),
      owner: Number(id),
      dob: req.body.dob,
      accountType: req.body.accountType,
      status: '',
      openingBalance: req.body.balance,
    };

    bankAccount.push(bankaccount);
    return res.status(201).send({ status: 201, msg: 'account created', bankaccount });
  }

  static specificUser(req, res) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ status: 401, auth: false, message: 'no token provided.' });

    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) return res.status(500).send({ status: 500, auth: false, message: 'Failed to authenticate token.' });
      // res.status(200).send(decoded);
      const getUser = users.find(userdb => userdb.id === decoded.id);
      if (!getUser) return res.status(404).send({ status: 404, msg: 'No user found' });
      return res.status(200).send({ status: 200, msg: getUser });
    });
  }

  static changePassword(req, res) {
    const { id } = req.params;
    const userFound = users.find(userdb => userdb.id === Number(id));
    if (!userFound) return res.status(404).send({ status: 404, msg: 'user not found' });

    const newPassword = {
      id: userFound.id,
      password: req.body.password,
    };
    users.splice(userFound.index, 1, newPassword);
    return res.status(201).send({ status: 201, msg: 'password updated' });
  }
}


export default userController;
