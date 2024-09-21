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
  const image = await prisma.image.findMany();
  
  res.json(image);
});

//TODO: enable users to search by tags, genre, animal and image size
// .../api/photo/:id
//GET AN IMAGE BY ID
router.get('/read/:id', async (req, res) => {
  //getting ID
  const id = req.params.id;

  //searching the table for the id
  const image = await prisma.image.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!image) {
    res.status(404).send('Image not found.');
  } else {
    res.json(image);
  }
});

//TODO: there's something up with validation here, where if I upload falsely (missing a value in the req.body), it still uploads the image and increments the ID
//ADDING NEW IMAGES
// .../api/photo/create
router.post('/create', upload.single('image'), async (req, res) => {
  
  //setting filename to blank if no file was uploaded
  const filename = req.file ? req.file.filename: '';
  
  //receiving image description and tags
  const {image_name,description,tags,animal,image_size,genre} = req.body;

  if (image_name && description && tags && animal && image_size && genre) {
    //using prisma to add new object to the DB
    const image = await prisma.image.create({
      data: {
        image_name: image_name,
        description: description,
        tags: tags,
        animal: animal,
        image_size: image_size,
        genre: genre,
        filename: filename
      },
    });
    //presenting results
    res.json(image);
  } else {
    return res.status(400).send('One or more fields were not filled in.');
  }
});

//TODO: validation, run a delete on the previous file when changing images out
//UPDATING IMAGES
// .../api/photo/update
router.put('/update', upload.single('image'), async (req, res) => {

  const filename = req.file ? req.file.filename: '';

  //receiving updated image description and tags etc.
  const {id,image_name,description,tags,animal,image_size,genre} = req.body;

  //updating record
  if (image_name && description && tags && animal && image_size && genre) {
    const updateImage = await prisma.image.update({
      //searching by the id
      where: {
        id: parseInt(id),
      },
      //passing in the updated record
      data: {
        image_name: image_name,
        description: description,
        tags: tags,
        animal: animal,
        image_size: image_size,
        genre: genre,
        filename: filename
      },
    })
    res.send(updateImage);
  } else {
    return res.status(400).send('One or more fields were not filled in.');
  }
});

//TODO: validation, 404
//TODO: delete associated image file
//DELETING IMAGES
// .../api/photo/delete
router.delete('/delete/:id', async (req, res) => {
  //getting ID
  const id = req.params.id;

  //searching the table for the id
  const deleteImage = await prisma.image.delete({
    where: {
      id: parseInt(id),
    },
  });
  res.json(deleteImage);
});

export default router;