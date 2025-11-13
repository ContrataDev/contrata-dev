import { Router } from "express";
import {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from "../../controllers/skillController.js";

const router = Router();

router.post("/", createSkill);
router.get("/", getAllSkills);
router.get("/:id", getSkillById);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
