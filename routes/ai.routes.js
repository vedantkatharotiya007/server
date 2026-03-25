import express from "express";


import {ai,suggestMessages} from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/ai",ai);
router.post("/ai/suggest",suggestMessages);




export default router;