import { Router } from "express";
import models from "../../models/index.js";
import techIconMap from "../../utils/techIconMap.js";

const router = Router();

const { Developer, User, TechnologyStack, PortfolioItem, Certification, Project, JobPosting, Proposal } =
  models;

import { Op } from 'sequelize';

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

// Developer applies to a project (creates a JobPosting if needed and a Proposal)
router.post('/apply', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.redirect('/auth/login');

    const developer = await Developer.findOne({ where: { userId } });
    if (!developer) return res.redirect('/develop/dashboard');

    const projectId = req.body.projectId || req.query.projectId;
    if (!projectId) return res.redirect('/develop/dashboard');

    const project = await Project.findByPk(projectId);
    if (!project) return res.redirect('/develop/dashboard');

    // Prevent duplicate applications: check if developer already has a proposal for any job posting of this project
    const existing = await Proposal.findOne({
      include: [{ model: JobPosting, where: { projectId } }],
      where: { developerId: developer.id },
    });
    if (existing) {
      // already applied - redirect back
      return res.redirect(`/solicitacao/${projectId}`);
    }

    // create a JobPosting for this developer application (so client.applieds can find it)
    const jobPosting = await JobPosting.create({
      projectId: project.id,
      title: `Candidatura - ${developer.id}`,
      description: `Candidatura automática enviada pelo desenvolvedor ${developer.id}`,
      priceRange: null,
      contractType: 'fixed',
      level: 'pleno',
      isActive: true,
    });

    // create proposal associated with the new jobPosting
    await Proposal.create({
      jobPostingId: jobPosting.id,
      developerId: developer.id,
      price: null,
      estimatedTime: null,
      coverLetter: 'Candidate interessado',
      status: 'pending',
    });

    res.redirect(`/solicitacao/${projectId}`);
  } catch (err) {
    next(err);
  }
});

export default router;
