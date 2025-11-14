import { Router } from "express";

const router = Router();

router.get("/dashboard", (req, res) => {
  res.render("client/dashboard");
});

export default router;
