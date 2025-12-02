import { Router } from "express";
import {
  createProject,
  getAllProjects,
  getProjectsByUser,
  getProjectById,
  updateProject,
  deleteProject,
  recommendDevelopers,
} from "../../controllers/projectController.js";

const router = Router();

router.post("/", createProject);
router.get("/", getAllProjects);
router.get("/my", getProjectsByUser);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/recommendations", recommendDevelopers);

export default router;
