import express from "express";
import { createuser,searchuser,save } from "../controllers/user.controller.js";


const router = express.Router();

router.post("/create",createuser);
router.post("/search",searchuser);
router.post("/save-token",save)

export default router;
