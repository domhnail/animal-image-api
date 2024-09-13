// import express from 'express';

// const port = process.env.PORT || 3000;
// const app = express();

// //middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

// //routes
// app.get('/', (req, res) => {
//   res.send('Hello Express!');
// });

// app.get('/bnnui', (req, res) => {
//   res.send('bnny...');
// });

// app.get('/bnnui/rabbit', (req, res) => {
//   res.send('bnny... RABBIT');
// });

// ^^ note this, could route all the different functions like '/api/photo/add', '/api/photo/delete', 'api/photo/modify'

// app.get('/no', (req, res) => {
//   res.send('yes');
// });

// app.get('/expresso', (req, res) => {
//   res.send('Hello Expresso!');
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

import express from 'express';
import rootRouter from './routes/root.js';

app.use('/',rootRouter);

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});