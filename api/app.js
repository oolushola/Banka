import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import 'dotenv/config';

// const routes = require('./routes/master_route');

const app = express();

// Parse incoming request data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', (req, res) => {
  res.send('Hey, lets go with transpiler');
});
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`SERVER RUNNING ON PORT: ${PORT}`);
});

export default app;
