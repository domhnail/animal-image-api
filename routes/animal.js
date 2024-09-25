import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

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
  
  res.status(200).json({message: 'Displaying all image entries.'});
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
  
  //404 when image not found
  if (!image) {
    res.status(404).json({message: 'Image not found.'});
  } else {
    res.status(200).json({message: `Image with id: ${id} found.`})
    res.json(image);
  }
});

//TODO: there's something up with validation here, where if I upload falsely (missing a value in the req.body), it still uploads the image and increments the ID
//run a delete on uploaded file and filename if post fails
//TODO: validate file extensions
//could do switch case for each given null?
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
    return res.status(200).json({message: 'Image successfully uploaded, database entry created.', image});
  } else { //400 when there are null fields submitted
    fs.unlink(`public/images/${filename}`, function (){
      console.log('Upload failed because of null field, deleting orphaned image.');
    });
    return res.status(400).json({message: 'One or more fields were not filled in.'});
  }
});

//TODO: validation, run a delete on the previous file when changing images out
//could do switch case for each given null?
//TODO: image deletion if a new image is uploaded, checking if an image was uploaded in the first place
// rec was to make a blank filename variable to assign the new or old image filename to
//UPDATING IMAGES
// .../api/photo/update
router.put('/update', upload.single('image'), async (req, res) => {

  const id = req.params.id;

  const filename = req.file ? req.file.filename: '';

  //receiving updated image description and tags etc.
  const {image_name,description,tags,animal,image_size,genre} = req.body;

  //updating record (replace && with ||'s? would make it so that just at least one field has to be filled to update)
  if (image_name || description || tags || animal || image_size || genre) {
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
    res.status(200).json({message: 'Image updated.'});
    res.json(updateImage);
  } else { //400 when fields aren't filled in (need to adjust this actually)
    return res.status(400).json({message: 'One or more fields were not filled in.'});
  }
});

//TODO: validation, 404
//TODO: delete associated image file
//DELETING IMAGES
// .../api/photo/delete
router.delete('/delete/:id', async (req, res) => {
  //getting ID
  const id = req.params.id;

  // const image = await prisma.image.findUnique({
  //   where: {
  //     id: parseInt(id),
  //   },
  // });

  //searching the table for the id
  const deleteImage = await prisma.image.delete({
    where: {
      id: parseInt(id),
    },
  });

  const filename = deleteImage.filename;
  
  fs.unlink(`public/images/${filename}`,function() {
    console.log("Image deleted.");
  });
  res.json(deleteImage);
});

//TODO: batch process to clean up orphaned images

export default router;