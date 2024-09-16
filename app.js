import express from 'express';
import animalRouter from './routes/animal.js';

const port = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//routes
app.use('/api/photo', animalRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});