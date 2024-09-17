import express from 'express';
import multer from 'multer';

const router = express.Router();

//multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/'); // save uploaded files in `public/images` folder
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop(); // get file extension
    const uniqueFilename = Date.now() + '-' + Math.round(Math.random() * 1000) + '.' + ext; // generate unique filename - current timestamp + random number between 0 and 1000.
    cb(null, uniqueFilename);
  }
});
const upload = multer({ storage: storage });

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

//TODO: make create, update and delete all actually work. Change update logic to work properly.

//ADDING NEW IMAGES
// .../api/photo/create
router.post('/create', upload.single('image'), (req, res) => {
  //checking if filename is null, setting it to blank if it is
  const filename = req.file ? req.file.filename: '';
  console.log('Uploaded file: ');
  res.send('Add a new animal image.');
});

//UPDATING IMAGES
// .../api/photo/update
router.put('/update', upload.single('image'), (req, res) => {
  res.send('Update an existing animal image.');
});

//DELETING IMAGES
// .../api/photo/delete
router.delete('/delete', (req, res) => {
  res.send('Delete an existing animal image.');
});

export default router;