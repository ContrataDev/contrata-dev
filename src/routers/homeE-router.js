import { Router } from "express";

const router = Router();

// Página inicial do Home E
router.get("/", (req, res) => {
	res.render("homeEmpresa", { title: "Home Empresa" });
});

export default router;
