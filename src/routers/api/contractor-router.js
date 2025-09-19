import { Router } from "express";

import {
  createContractor,
  getAllContractors,
  getContractorById,
  updateContractor,
  deleteContractor,
} from "../../controllers/contractor-controller.js";

const router = Router();

router.post("/", createContractor);
router.get("/", getAllContractors);
router.get("/:id", getContractorById);
router.put("/:id", updateContractor);
router.delete("/:id", deleteContractor);

export default router;
