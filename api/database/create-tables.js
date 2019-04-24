import { Pool } from 'pg';
import dotenv from 'dotenv';
import transactions from '../models/transaction';
import accounts from '../models/bankaccount';
import users from '../models/users';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.CONNINFO,
});

const Tables = `CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name TEXT,
      last_name TEXT,
      user_type TEXT NOT NULL,
      is_admin BOOLEAN,
      phone_no VARCHAR(50),
      state TEXT,
      city TEXT,
      occupation TEXT,
      gender TEXT,
      address TEXT,
      photo VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    );
  CREATE TABLE IF NOT EXISTS accounts(
    id SERIAL PRIMARY KEY NOT NULL,
    account_number VARCHAR(50),
    created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    owner int UNIQUE NOT NULL,
    dob VARCHAR(50) NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    account_status VARCHAR(50),
    balance REAL NOT NULL
  );
  CREATE TABLE IF NOT EXISTS transactions(
    id SERIAL PRIMARY KEY NOT NULL,
    created_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    transaction_type text NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    cashier INT NOT NULL,
    amount REAL NOT NULL,
    old_balance REAL NOT NULL,
    new_balance REAL NOT NULL
  )`;

const queryDb = async (query) => {
  const res = await pool.query(query);
  return res;
};

const create = async (arr, table) => {
  try {
    await pool.query(Tables);
    for (let i = 0, len = arr.length; i < len; i += 1) {
      const values = Object.values(arr[i]);
      const keys = Object.keys(arr[i]);
      const query = `INSERT INTO ${table} (${keys}) VALUES (${values})`;
      queryDb(query);
    }
  } catch (error) {
    const { log } = console;
    log(error);
  }
};

const createAllTables = async () => {
  try {
    await create(users, 'users');
    await create(accounts, 'accounts');
    await create(transactions, 'transactions');
    console.log('all tables has been created');
  } catch (error) {
    console.log(error);
  }
};

createAllTables();
