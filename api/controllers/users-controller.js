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

}


export default userController;
