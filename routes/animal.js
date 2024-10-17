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
  //message: 'Displaying all image entries.',
  res.status(200).json({image});
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
    res.status(200).json({message: `Image with id: ${id} found.`, image})
  }
});

//TODO: there's something up with validation here, where if I upload falsely (missing a value in the req.body), it still increments the ID
//could do switch case for each given null?
//ADDING NEW IMAGES
// .../api/photo/create
router.post('/create', upload.single('image'), async (req, res) => {
  
  //checking if a file was uploaded and setting filename to blank if no file was uploaded
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

//UPDATING IMAGES
// .../api/photo/update
router.put('/update/:id', upload.single('image'), async (req, res) => {
  let updatedImage;
  //getting id from the request
  const id = req.params.id;

  //checking if a file was uploaded and setting filename to blank if no file was uploaded
  //nulling the filename here serves as a check for whether an image file was uploaded or not later
  const filename = req.file ? req.file.filename: '';

  //receiving updated image description and tags etc.
  const {image_name,description,tags,animal,image_size,genre} = req.body;

  //validating all inputs are filled
  if (image_name && description && tags && animal && image_size && genre) {
    //get image by id. return 404 if not found.
    const image = await prisma.image.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!image) {
      res.status(404).json({message: 'Image not found.'});
    }
    //if an image file is uploaded
    else if (filename) { 
      //getting the filename to save in database
      const oldFilename = image.filename;
      //deleting the old image
      fs.unlink(`public/images/${oldFilename}`, function (){
        console.log('Image was updated, old image deleted.');
      });
        updatedImage = await prisma.image.update({
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
      });
      return res.status(200).json({message: 'New image successfully uploaded, database entry fields updated.', updatedImage});
    }
    //if an image file is not uploaded
    else {
        updatedImage = await prisma.image.update({
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
          genre: genre
        },
      });
      return res.status(200).json({message: 'Database entry fields updated.', updatedImage});
    }
  } else { //when any fields are null, removing everything
    fs.unlink(`public/images/${filename}`, function (){
      console.log('Image uploaded without a table entry, orphaned image deleted.');
    });
    return res.status(400).json({message: 'One or more fields were not filled in.'});
  }
});

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

  //checking that the image to delete actually exists
  if (deleteImage) {
    //getting the filename of the image to delete.
    const filename = deleteImage.filename;
    fs.unlink(`public/images/${filename}`,function() {
      console.log("Image deleted.");
    });
    return res.status(200).json({message: 'Image deleted successfully.', deleteImage}); 
  } else {
    return res.status(404).json({message: 'Image not found.'});
  }
});

//TODO: batch process to clean up orphaned images

export default router;