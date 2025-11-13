import { Router } from "express";

import userRouter from "./userRouter.js";
import developerRouter from "./developerRouter.js";
import projectRouter from "./projectRouter.js";
import clientRouter from "./clientRouter.js";
import technologyStackRouter from "./technologyStackRouter.js";

const router = Router();

router.use("/v1/users", userRouter);
router.use("/v1/developers", developerRouter);
router.use("/v1/projects", projectRouter);
router.use("/v1/clients", clientRouter);
router.use("/v1/technologyStacks", technologyStackRouter);

export default router;
