import express from "express";
import {addgroup } from "../controllers/group.controller.js";


const router = express.Router();

router.post("/create",addgroup);



export default router;
