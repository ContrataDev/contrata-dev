import { Router } from "express";
import {
  createDeveloper,
  getAllDevelopers,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
  updateDeveloperAvatar,
  getOrCreateDeveloperForCurrentUser,
} from "../../controllers/developerController.js";

const router = Router();

router.post("/", createDeveloper);
router.get("/", getAllDevelopers);
router.get("/:id", getDeveloperById);
router.put("/:id", updateDeveloper);
router.delete("/:id", deleteDeveloper);

import multer from 'multer';

// use memory storage so uploaded file buffer is available on req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });
router.post('/:id/avatar', upload.single('avatar'), updateDeveloperAvatar);
// create or return current logged-in user's developer record
router.post('/me', (req, res, next) => {
  // Ensure request is authenticated via session (passport)
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.status(401).json({ error: 'Usuário não autenticado' });
  return getOrCreateDeveloperForCurrentUser(req, res, next);
});

export default router;
