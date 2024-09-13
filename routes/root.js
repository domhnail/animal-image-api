import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Root route');
});

router.get('/hello', (req, res) => {
  res.send('Hello Express!');
});

export default router;