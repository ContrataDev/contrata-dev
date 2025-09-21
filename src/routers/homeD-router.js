import { Router } from "express";

const router = Router();

// Página inicial do Home D
router.get("/", (req, res) => {
  res.render("homeDev", { title: "Home D" });
});



export default router;
