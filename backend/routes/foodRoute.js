import express from "express"
import { addFood,listFood,removeFood } from "../controllers/foodController.js"
import multer from "multer"

const foodRouter = express.Router();
//image storage engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)  //datenow for unique file name
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood)   //these are api endpoints 
foodRouter.get("/list",listFood)
foodRouter.post("/remove",removeFood);






export default foodRouter;