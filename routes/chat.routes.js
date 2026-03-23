import express from "express";
import {addmessage,getmessage } from "../controllers/message.controller.js";
import { upload } from "../config/multer.js";


const router = express.Router();

router.post("/addmessage",upload.single("file"),addmessage);
router.post("/getmessage",getmessage);



export default router;
