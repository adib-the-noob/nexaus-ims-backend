import express from "express";
import {
  createCommittee,
  getAllCommittees,
  getCommitteeById,
  updateCommittee,
  deleteCommittee,
} from "../controllers/committeeController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createCommittee);
router.get("/", getAllCommittees);
router.get("/:id", getCommitteeById);
router.put("/:id", updateCommittee);
router.delete("/:id", deleteCommittee);

export default router;