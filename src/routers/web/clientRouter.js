import { Router } from "express";

const router = Router();

router.get("/dashboard", (req, res) => {
  res.render("client/dashboard");
});

router.get("/create", (req, res) => {
  res.render("client/create");
});

router.get("/search", (req, res) => {
  res.render("client/search");
});

export default router;
