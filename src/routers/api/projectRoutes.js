import express from "express";
import {
	getAllProjects,
	getProjectById,
	createProject,
	updateProject,
	deleteProject,
} from "../controllers/ProjectController.js";
import {
	getProjectSkills,
	addSkillToProject,
	removeSkillFromProject,
} from "../controllers/ProjectSkillController.js";
import {
	isAuthenticated,
	isClientOrAdmin,
	isOwnerOrAdmin,
} from "../../Middlewares/auth-middleware.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/:id", getProjectById);

router.post("/", isAuthenticated, isClientOrAdmin, createProject);
router.put("/:id", isAuthenticated, isOwnerOrAdmin, updateProject);
router.delete("/:id", isAuthenticated, isOwnerOrAdmin, deleteProject);

router.get("/:projectId/skills", getProjectSkills);
router.post(
	"/:projectId/skills/:skillId",
	isAuthenticated,
	isOwnerOrAdmin,
	addSkillToProject
);
router.delete(
	"/:projectId/skills/:skillId",
	isAuthenticated,
	isOwnerOrAdmin,
	removeSkillFromProject
);

export default router;
