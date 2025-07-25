import express from "express";
import {
  addInstitutionInfo,
  getInstitutionInfo,
} from "../controllers/institutionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/institution-info", addInstitutionInfo);
router.get("/institution-info/:id", getInstitutionInfo);

export default router;