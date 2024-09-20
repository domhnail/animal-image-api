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
router.get('/all', async (req, res) => {
  const images = await prisma.images.findMany();

  res.json(images);
});

//TODO: enable users to search by tags, genre, animal and image size
//TODO: make the id search actually work
// .../api/photo/:id
//GET AN IMAGE BY ID
router.get('/get/:id', async (req, res) => {
  //getting ID
  const id = req.params.id;

  //searching the table for the id
  const images = await prisma.images.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(images);
});

//TODO: update the create to better reflect how the filenames are actually handled. user wont be setting filenames I guess.

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