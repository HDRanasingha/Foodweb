import userModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import validator from "validator";


//login user
const loginUser = async (req, res) => {
    
}

//register user
const registerUser = async (req, res) => {
    const{name,password,email} = req.body;
    try{
const exists = await userModel.findOne({email:email})


    }catch(error){

    }
}
export { loginUser, registerUser };
