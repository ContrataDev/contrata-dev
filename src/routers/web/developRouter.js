import { Router } from "express";
import models from "../../models/index.js";

const router = Router();

const { Developer, User, TechnologyStack, PortfolioItem, Certification } =
  models;

router.get("/dashboard", (req, res) => {
  res.render("develop/dashboard");
});

router.get("/edit-perfil", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const developer = await Developer.findOne({
      where: { userId },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: TechnologyStack },
        { model: PortfolioItem },
        { model: Certification },
      ],
    });

    res.render("develop/edit-perfil", { developer });
  } catch (err) {
    next(err);
  }
});

router.get("/perfil", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const developer = await Developer.findOne({
      where: { userId },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: TechnologyStack },
        { model: PortfolioItem },
        { model: Certification },
      ],
    });

    res.render("develop/perfil", { developer });
  } catch (err) {
    next(err);
  }
});

export default router;
