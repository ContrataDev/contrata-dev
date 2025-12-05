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

    // prepare plain object for view; convert avatar blob to data URL if present
    const devObj = developer ? developer.toJSON() : null;
    if (developer && developer.get) {
      const raw = developer.get('avatar');
      const mime = developer.get('avatarMime') || 'image/png';
      try {
        if (raw && Buffer.isBuffer(raw)) {
          devObj.avatar = `data:${mime};base64,${raw.toString('base64')}`;
        } else if (typeof raw === 'string' && (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http')) ) {
          // existing string URL or data URL - pass through
          devObj.avatar = raw;
        }
      } catch (e) {
        // leave avatar unset on error
      }
    }

    res.render("develop/edit-perfil", { developer: devObj, techIconMap });
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
    const devObj = developer ? developer.toJSON() : null;
    if (developer && developer.get) {
      const raw = developer.get('avatar');
      const mime = developer.get('avatarMime') || 'image/png';
      try {
        if (raw && Buffer.isBuffer(raw)) {
          devObj.avatar = `data:${mime};base64,${raw.toString('base64')}`;
        } else if (typeof raw === 'string' && (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http')) ) {
          devObj.avatar = raw;
        }
      } catch (e) {
        // ignore
      }
    }
    res.render("develop/perfil", { developer: devObj, ts, techIconMap });
  } catch (err) {
    next(err);
  }
});

export default router;
