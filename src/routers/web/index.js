import { Router } from "express";
import authRouter from "./authRouter.js";
import developRouter from "./developRouter.js";
import clientRouter from "./clientRouter.js";

import { isClient, isDeveloper } from "../../middlewares/authenticator.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("public/index");
});

router.use("/auth", authRouter);
router.use("/develop", isDeveloper, developRouter);
router.use("/client", isClient, clientRouter);

export default router;
