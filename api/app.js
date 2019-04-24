import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

import router from './routes/bankaroutes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

app.use(express.static(path.join(__dirname, '../UI')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`SERVER RUNNING ON PORT: ${PORT}`);
});

export default app;
