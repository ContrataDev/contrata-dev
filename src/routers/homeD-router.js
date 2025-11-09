import { Router } from "express";

const router = Router();

// Página inicial do Home D
router.get("/", (req, res) => {
	res.render("homeDev", { title: "home Dev" });
});

export default router;
