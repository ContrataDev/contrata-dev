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

// use memory storage so uploaded file buffer is available on req.file.buffer
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/:id/avatar', upload.single('avatar'), updateClientAvatar);
router.post('/me', (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) return res.status(401).json({ error: 'Usuário não autenticado' });
  return getOrCreateClientForCurrentUser(req, res, next);
});

export default router;
