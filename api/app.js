import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import router from './routes/bankaroutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

app.all('*', (req, res) => {
  res.status(404).json({ status: 404, error: 'not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) throw err;
  // eslint-disable-next-line no-console
  console.log(`SERVER RUNNING ON PORT: ${PORT}`);
});

export default app;
