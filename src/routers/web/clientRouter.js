import { Router } from "express";

const router = Router();

router.get("/dashboard", (req, res) => {
  res.render("client/dashboard");
});

router.get("/create", (req, res) => {
  res.render("client/create");
});

export default router;
