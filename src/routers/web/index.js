import { Router } from "express";
import authRouter from "./authRouter.js";
import developRouter from "./developRouter.js";
import clientRouter from "./clientRouter.js";
import models from "../../models/index.js";

import { isClient, isDeveloper } from "../../middlewares/authenticator.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("public/index");
});

router.get("/solicitacao/:id", async (req, res, next) => {
  try {
    const project = await models.Project.findByPk(req.params.id, {
      include: [{ model: models.Client }],
    });

    if (!project) {
      return res.status(404).render("public/error", { message: "Solicitação não encontrada", error: {} });
    }

    const projectObj = project.toJSON();
    const canDelete = !!(req.user && projectObj.Client && projectObj.Client.userId && req.user.id === projectObj.Client.userId);

    res.render("public/viewSoli", { project: projectObj, canDelete, techIconMap: (await import('../../utils/techIconMap.js')).default });
  } catch (err) {
    next(err);
  }
});

// root route already defined above

router.use("/auth", authRouter);
router.use("/develop", isDeveloper, developRouter);
router.use("/client", isClient, clientRouter);

export default router;
