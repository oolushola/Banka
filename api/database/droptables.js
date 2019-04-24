/* eslint-disable no-console */
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.CONNINFO,
});


const dropUsersTable = 'DROP TABLE users';
const dropAccountsTable = 'DROP TABLE accounts CASCADE';
const dropTransactionsTable = 'DROP TABLE transactions';

async function deleteTables() {
  try {
    await pool.query(dropUsersTable);
    await pool.query(dropAccountsTable);
    await pool.query(dropTransactionsTable);
    console.log('all tables dropped');
  } catch (error) {
    console.log('could not drop table');
  }
}

deleteTables();
