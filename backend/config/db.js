import mongoose from "mongoose";

export const connectDB = async () => {
  
    await mongoose.connect('mongodb+srv://dilhara:2024@cluster0.2omjasf.mongodb.net/food-del').then(()=>console.log("DB connected"));
      
    }