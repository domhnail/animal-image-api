import express from 'express';

const router = express.Router();

// .../api/animals
router.get('/', (req, res) => {
  res.send('Animal image route');
});

// .../api/animals/all
router.get('/all', (req, res) => {
  res.send('Get all animal images route.');
});

// .../api/animals/add
router.post('/add', (req, res) => {
  res.send('Add a new animal image.');
});
//^^ note the '.post', as opposed to '.get' all the different requests work this way, using the various request name, .get, .post, .put, .delete, etc etc.

export default router;