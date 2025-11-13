import { Router } from "express";
import {
  createTechnologyStack,
  getAllTechnologyStacks,
  getTechnologyStackById,
  updateTechnologyStack,
  deleteTechnologyStack,
} from "../../controllers/technologyStackController.js";

const router = Router();

router.post("/", createTechnologyStack);
router.get("/", getAllTechnologyStacks);
router.get("/:id", getTechnologyStackById);
router.put("/:id", updateTechnologyStack);
router.delete("/:id", deleteTechnologyStack);

export default router;
