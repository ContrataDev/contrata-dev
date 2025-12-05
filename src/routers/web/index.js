import { Router } from "express";
import authRouter from "./authRouter.js";
import developRouter from "./developRouter.js";
import clientRouter from "./clientRouter.js";
import models from "../../models/index.js";

import { isClient, isDeveloper } from "../../middlewares/authenticator.js";
import techIconMap from '../../utils/techIconMap.js';
import { Op } from 'sequelize';

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

    // find accepted proposals' developers for this project
    const jobPostings = await models.JobPosting.findAll({ where: { projectId: project.id }, include: [ { model: models.Proposal, where: { status: 'accepted' }, required: false, include: [{ model: models.Developer, include: [{ model: models.User, attributes: ['name'] }, { model: models.TechnologyStack }] }] } ] });

    const acceptedDevs = [];
    for (const jp of jobPostings) {
      const proposals = jp.Proposals || jp.Proposal || [];
      const list = Array.isArray(proposals) ? proposals : [proposals];
      for (const p of list) {
        if (p && p.Developer) {
          const dev = p.Developer;
          const name = (dev.User && dev.User.name) || dev.name || 'Desenvolvedor';
          const techs = (dev.TechnologyStacks || []).map(t => t.name).filter(Boolean);
          // avatar
          let avatar = null;
          try {
            const raw = dev.get && dev.get('avatar');
            const mime = dev.get && dev.get('avatarMime') ? dev.get('avatarMime') : 'image/png';
            if (raw && Buffer.isBuffer(raw)) avatar = `data:${mime};base64,${raw.toString('base64')}`;
            else if (typeof raw === 'string' && (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http'))) avatar = raw;
          } catch(e) {}
          acceptedDevs.push({ id: dev.id, name, techs, avatar });
        }
      }
    }

    res.render("public/viewSoli", { project: projectObj, canDelete, techIconMap, acceptedDevs });
  } catch (err) {
    next(err);
  }
});

// public developer profile view
router.get('/developer/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const developer = await models.Developer.findByPk(id, { include: [ { model: models.User, attributes: ['name','email'] }, { model: models.TechnologyStack }, { model: models.PortfolioItem }, { model: models.Certification } ] });
    if (!developer) return res.status(404).render('public/error', { message: 'Desenvolvedor não encontrado', error: {} });
    const devObj = developer.toJSON();
    if (developer && developer.get) {
      const raw = developer.get('avatar');
      const mime = developer.get('avatarMime') || 'image/png';
      try {
        if (raw && Buffer.isBuffer(raw)) devObj.avatar = `data:${mime};base64,${raw.toString('base64')}`;
        else if (typeof raw === 'string' && (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http'))) devObj.avatar = raw;
      } catch(e) {}
    }

    const isOwner = !!(req.user && req.user.id && developer.userId && req.user.id === developer.userId);
    const ts = Date.now();
    res.render('develop/perfil', { developer: devObj, ts, techIconMap, isOwner });
  } catch (err) {
    next(err);
  }
});

// root route already defined above

router.use("/auth", authRouter);
router.use("/develop", isDeveloper, developRouter);
router.use("/client", isClient, clientRouter);

export default router;
