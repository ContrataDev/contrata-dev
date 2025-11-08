import express from "express";
import {
	getAllSkills,
	getSkillById,
	createSkill,
	updateSkill,
	deleteSkill,
} from "../controllers/SkillController.js";
import {
	getDeveloperSkills,
	addSkillToDeveloper,
	removeSkillFromDeveloper,
} from "../controllers/DeveloperSkillController.js";
import {
	isAuthenticated,
	isDeveloperOrAdmin,
	isAdmin,
} from "../../Middlewares/auth-middleware.js";

const router = express.Router();

router.get("/", getAllSkills);
router.get("/:id", getSkillById);

router.post("/", isAuthenticated, isAdmin, createSkill);
router.put("/:id", isAuthenticated, isAdmin, updateSkill);
router.delete("/:id", isAuthenticated, isAdmin, deleteSkill);

router.get("/:developerId/skills", getDeveloperSkills);
router.post(
	"/:developerId/skills/:skillId",
	isAuthenticated,
	isDeveloperOrAdmin,
	addSkillToDeveloper
);
router.delete(
	"/:developerId/skills/:skillId",
	isAuthenticated,
	isDeveloperOrAdmin,
	removeSkillFromDeveloper
);

export default router;
