import express from 'express';

const router = express.Router();

// .../api/animals
router.get('/', (req, res) => {
  res.send('Animal image route');
});

// .../api/photo/all
// Get all images
router.get('/all', (req, res) => {
  res.send('Get all animal images route.');
});

// .../api/photo/:id
// Get an image by id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send('Contact by id ' + id);
});

//TODO: make create, update and delete all actually work.

// .../api/photo/create
router.post('/create', (req, res) => {
  res.send('Add a new animal image.');
});

// .../api/photo/update
router.put('/update', (req, res) => {
  res.send('Update an existing animal image.');
});

// .../api/photo/delete
router.delete('/delete', (req, res) => {
  res.send('Delete an existing animal image.');
});

export default router;