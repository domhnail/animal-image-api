import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';

const router = express.Router();

//prisma setup (logging)
const prisma = new PrismaClient ({
  log: ['query', 'info', 'warn', 'error']
});

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
//GET ALL IMAGES
router.get('/all', (req, res) => {
  res.send('Get all animal images route.');
});

//TODO: enable users to search by tags, genre, animal and image size
// .../api/photo/:id
//GET AN IMAGE BY ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  res.send('Contact by id ' + id);
});

//TODO: make create, update and delete all actually work. Change update logic to work properly.

//ADDING NEW IMAGES
// .../api/photo/create
router.post('/create', upload.single('image'), async (req, res) => {
  
  //setting filename to blank
  const filename = req.file ? req.file.filename: '';
  
  //receiving image description and tags
  const {description,tags,animal,image_size,genre} = req.body;

  //using prisma to add new object to the DB
  const image = await prisma.image.create({
    data: {
      filename: filename,
      description: description,
      tags: tags,
      animal: animal,
      image_size: image_size,
      genre: genre
    },
  })

  //presenting results
  res.json(image);
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