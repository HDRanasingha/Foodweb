import express from 'express';
import { addFood,listFood,removeFood } from '../controllers/foodController.js';
import multer from 'multer';

const foodRouter = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // `uploads` is the directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Generate a unique file name
  }
});

const upload = multer({ storage: storage });

// Route to add food item with image upload
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list",listFood );
foodRouter.post("/remove",removeFood);


export default foodRouter;