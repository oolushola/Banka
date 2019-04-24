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
  
}


export default staffController;
