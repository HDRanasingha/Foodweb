import foodModel from "../models/foodModel.js";
import fs from "fs";
import path from "path";

// Add food item
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food item added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to add food item" });
  }
};

// List all food items
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find();
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to fetch food items" });
  }
};

// Remove food item
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    const imagePath = path.join('uploads', food.image);
    
    // Delete the image file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err);
      }
    });

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food item removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to remove food item" });
  }
};

export { addFood, listFood, removeFood };
