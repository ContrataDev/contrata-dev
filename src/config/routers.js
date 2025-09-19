import { Router } from "express";

import AuthRouter from "../routers/auth-router.js";
import apiRouter from "../routers/api-router.js";

const router = Router();

router.get("/", (_, res) => {
  res.render("index");
});

router.use("/auth", AuthRouter);
router.use("/api", apiRouter);

router.use((_, res) => {
  res.status(404).render("404", { title: "404" });
});

export default router;
