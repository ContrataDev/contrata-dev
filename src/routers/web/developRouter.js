import { Router } from "express";

const router = Router();

router.get("/dashboard", (req, res) => {
  res.render("develop/dashboard");
});

router.get("/edit-perfil", (req, res) => {
  res.render("develop/edit-perfil");
});

router.get("/perfil", (req, res) => {
  res.render("develop/perfil");
});

export default router;
