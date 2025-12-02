import { Router } from "express";
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  updateClientAvatar,
  getOrCreateClientForCurrentUser,
} from "../../controllers/clientController.js";

const router = Router();

router.post("/", createClient);
router.get("/", getAllClients);
router.get("/:id", getClientById);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

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
    const ext = path.extname(file.originalname) || '';
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({ storage });

router.post('/:id/avatar', upload.single('avatar'), updateClientAvatar);
router.post('/me', (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.status(401).json({ error: 'Usuário não autenticado' });
  return getOrCreateClientForCurrentUser(req, res, next);
});

export default router;
