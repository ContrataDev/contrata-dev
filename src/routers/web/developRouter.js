import { Router } from "express";
import models from "../../models/index.js";
import techIconMap from "../../utils/techIconMap.js";

const router = Router();

const { Developer, User, TechnologyStack, PortfolioItem, Certification, Project } =
  models;

router.get("/dashboard", async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: models.Client, attributes: ["id", "companyName"] }],
    });
    res.render("develop/dashboard", { projects: projects.map(p => p.toJSON()), techIconMap });
  } catch (err) {
    next(err);
  }
});

router.get("/edit-perfil", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    // ensure a Developer row exists for the logged in user so the edit page always has an id
    let developer = await Developer.findOne({
      where: { userId },
      include: [
        { model: User, attributes: ["name", "email"] },
        { model: TechnologyStack },
        { model: PortfolioItem },
        { model: Certification },
      ],
    });

    if (!developer) {
      // create a minimal developer row so the front-end can save/edit
      developer = await Developer.create({ userId });
      developer = await Developer.findByPk(developer.id, {
        include: [
          { model: User, attributes: ["name", "email"] },
          { model: TechnologyStack },
          { model: PortfolioItem },
          { model: Certification },
        ],
      });
    }

    // pass a plain object (not a Sequelize instance) so client-side JSON serialization
    // includes associations like TechnologyStacks and PortfolioItems reliably
    res.render("develop/edit-perfil", { developer: developer ? developer.toJSON() : null });
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

    // pass timestamp (query param t) so view can cache-bust avatar url
    const ts = req.query && req.query.t ? req.query.t : Date.now();
    res.render("develop/perfil", { developer: developer ? developer.toJSON() : null, ts });
  } catch (err) {
    next(err);
  }
});

export default router;
