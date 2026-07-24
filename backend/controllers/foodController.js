import foodModel from "../models/foodModel.js";
import fs from 'fs'

//add food item
const addFood = async (req, res) => {
  const image_filename = `${req.file.filename}`;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename
  })
  try {
    await food.save();
    res.json({success: true, message: "Food Added"})
  } catch (error) {
    console.log(error)
    res.json({success: false, message: error.message || "Error"})
  }
}

// all foodlist 
const listFood = async (req, res) => {
 try {
  const foods = await foodModel.find({});
  res.json({success: true, data: foods})
 } catch (error) {
  console.log(error);
  res.json({success: false, message: "Error"})
 }
}

//remove food item 
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);     //is food remove krne wali api me body me kya daalna hai  
    if (food) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.log('File delete error:', err);
      });
      await foodModel.findByIdAndDelete(req.body.id);
      res.json({success: true, message: "food removed"})
    } else {
      res.json({success: false, message: "Food not found"})
    }
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message || "Error"})
  }
}

export {addFood, listFood, removeFood}
