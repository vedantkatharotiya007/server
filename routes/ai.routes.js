import express from "express";


import {ai} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/ai",ai);




export default router;