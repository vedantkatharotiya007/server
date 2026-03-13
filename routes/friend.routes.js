import express from "express";
import {addfriend } from "../controllers/friend.controller.js";


const router = express.Router();

router.post("/add",addfriend);



export default router;
