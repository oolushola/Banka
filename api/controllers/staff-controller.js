/* eslint-disable max-len */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import users from '../models/users';
// import bankAccount from '../models/bankaccount';
// import transactions from '../models/transaction';
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
}
export default staffController;
