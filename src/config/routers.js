import { Router } from "express";

import AuthRouter from "../routers/auth-router.js";
import apiRouter from "../routers/api-router.js";
import perfilRouter from "../routers/perfil-router.js";
import homeDRouter from "../routers/homeD-router.js";
import homeERouter from "../routers/homeE-router.js";

const router = Router();

router.get("/", (_, res) => {
  res.render("index", { title: "Página Inicial" });
});

router.use("/auth", AuthRouter);
router.use("/perfil", perfilRouter);
router.use("/homeD", homeDRouter);
router.use("/api", apiRouter);
router.use("/homeE", homeERouter);

router.use((_, res) => {
  res.status(404).render("404", { title: "404" });
});

export default router;
