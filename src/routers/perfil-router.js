import { Router } from "express";

const router = Router();

// Página de perfil
router.get("/", (req, res) => {
	res.render("perfil", { title: "Meu Perfil" });
});

// Página de edição de perfil
router.get("/edit", (req, res) => {
	res.render("edit-perfil", { title: "Editar Perfil" });
});

export default router;
