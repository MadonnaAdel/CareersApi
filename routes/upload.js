const express = require("express");
const router = express.Router();
const multer =require("multer")
const path = require("path")
const usersModel = require("../models/userModel");


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../images"))
    },
    filename:function(req,file,cb){
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage})



router.post("/", upload.single("image"),(req,res) => {
    usersModel.create({profilePhoto: req.file.originalname})
    .then(result => res.json(result))
    .catch(err => console.log(err))

res.status(200).json({message: "UPLOADED"});
})


module.exports=router;
