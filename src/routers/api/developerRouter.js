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
import fs from 'fs';
import path from 'path';

// ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'avatars');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // keep original extension
    const ext = path.extname(file.originalname) || '';
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });
router.post('/:id/avatar', upload.single('avatar'), updateDeveloperAvatar);
// create or return current logged-in user's developer record
router.post('/me', (req, res, next) => {
  // Ensure request is authenticated via session (passport)
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.status(401).json({ error: 'Usuário não autenticado' });
  return getOrCreateDeveloperForCurrentUser(req, res, next);
});

export default router;
