import { Router } from "express";

import {
	createDeveloper,
	getAllDevelopers,
	getDeveloperById,
	updateDeveloper,
	deleteDeveloper,
} from "../../controllers/developer-controller.js";

const router = Router();

router.post("/", createDeveloper);
router.get("/", getAllDevelopers);
router.get("/:id", getDeveloperById);
router.put("/:id", updateDeveloper);
router.delete("/:id", deleteDeveloper);

export default router;
