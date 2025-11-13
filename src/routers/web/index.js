import { Router } from "express";
import authRouter from "./authRouter.js";
import developRouter from "./developRouter.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("public/index");
});

router.use("/auth", authRouter);
router.use("/develop", developRouter);

export default router;
