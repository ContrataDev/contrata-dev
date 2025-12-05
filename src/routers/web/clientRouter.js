import { Router } from "express";
import { Op } from 'sequelize';
import models from "../../models/index.js";
import techIconMap from "../../utils/techIconMap.js";

const router = Router();

const { Client, User, Project } = models;
const { JobPosting, Proposal, Developer, TechnologyStack } = models;

router.get("/dashboard", async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const client = await Client.findOne({ where: { userId }, include: [{ model: Project }] });
    res.render("client/dashboard", { client: client ? client.toJSON() : null, techIconMap });
  } catch (err) {
    next(err);
  }
});

router.get("/create", (req, res) => {
  res.render("client/create");
});

router.get("/search", (req, res) => {
  res.render("client/search");
});

router.post('/solicitacoes', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.redirect('/');

    const client = await Client.findOne({ where: { userId } });
    if (!client) return res.redirect('/');

    const { titulo, descricao, tecnologias, budget, deadline } = req.body;

    await Project.create({
      clientId: client.id,
      title: titulo || 'Sem título',
      description: descricao || '',
      technologies: typeof tecnologias !== 'undefined' ? tecnologias : null,
      budget: budget || null,
      deadline: deadline || null,
      status: 'open',
    });

    res.redirect('/client/dashboard');
  } catch (err) {
    next(err);
  }
});

router.post('/solicitacoes/:id/delete', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.redirect('/');

    const client = await Client.findOne({ where: { userId } });
    if (!client) return res.redirect('/');

    const projectId = req.params.id;
    const project = await Project.findByPk(projectId);
    if (!project) return res.redirect('/client/dashboard');

    if (project.clientId !== client.id) return res.status(403).send('Forbidden');

    await project.destroy();
    res.redirect('/client/dashboard');
  } catch (err) {
    next(err);
  }
});

router.get('/edit-perfil', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    let client = await Client.findOne({ where: { userId }, include: [{ model: User, attributes: ['name','email'] }, { model: Project }] });

    if (!client) {
      client = await Client.create({ userId });
      client = await Client.findByPk(client.id, { include: [{ model: User, attributes: ['name','email'] }, { model: Project }] });
    }

      const clientObj = client ? client.toJSON() : null;
      if (client && client.get) {
        const raw = client.get('avatar');
        const mime = client.get('avatarMime') || 'image/png';
        try {
          if (raw && Buffer.isBuffer(raw)) {
            clientObj.avatar = `data:${mime};base64,${raw.toString('base64')}`;
          } else if (typeof raw === 'string' && (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http'))) {
            clientObj.avatar = raw;
          }
        } catch (e) {}
      }
      res.render('client/edit-perfil', { client: clientObj });
  } catch (err) { next(err); }
});

router.get('/perfil', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const client = await Client.findOne({ where: { userId }, include: [{ model: User, attributes: ['name','email'] }, { model: Project }] });
    const ts = req.query && req.query.t ? req.query.t : Date.now();
      const clientObj = client ? client.toJSON() : null;
      if (client && client.get) {
          const raw = client.get('avatar');
          const mime = client.get('avatarMime') || 'image/png';
          try {
            if (raw && Buffer.isBuffer(raw)) {
              clientObj.avatar = `data:${mime};base64,${raw.toString('base64')}`;
            } else if (typeof raw === 'string' && (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http'))) {
              clientObj.avatar = raw;
            }
          } catch(e) {}
        }
      res.render('client/perfil', { client: clientObj, ts, techIconMap });
  } catch (err) { next(err); }
});

// List developers who applied to a project's job postings (accessible only to project owner)
router.get('/applieds', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.redirect('/');

    const client = await Client.findOne({ where: { userId } });
    if (!client) return res.redirect('/');

    const projectId = req.query.projectId;
    if (!projectId) return res.redirect('/client/dashboard');

    const project = await Project.findByPk(projectId);
    if (!project) return res.redirect('/client/dashboard');

    if (project.clientId !== client.id) return res.status(403).send('Forbidden');

    // Find all job postings for this project and their proposals with developer info
    const jobPostings = await JobPosting.findAll({
      where: { projectId },
      include: [
        {
          model: Proposal,
          where: { status: { [Op.notIn]: ['withdrawn','rejected'] } },
          required: false,
          include: [
            {
              model: Developer,
              include: [
                { model: User, attributes: ['name'] },
                { model: TechnologyStack },
              ],
            },
          ],
        },
      ],
    });

    const devMap = new Map();
    // parse project technologies
    const projectTechs = (project.technologies || '')
      .split(',')
      .map((t) => (t || '').trim().toLowerCase())
      .filter(Boolean);
    for (const jp of jobPostings) {
      const proposals = jp.Proposals || jp.Proposal || [];
      const list = Array.isArray(proposals) ? proposals : [proposals];
      for (const p of list) {
        const dev = p && p.Developer ? p.Developer : null;
        if (!dev) continue;
        const id = dev.id;
          if (!devMap.has(id)) {
          const name = (dev.User && dev.User.name) || dev.name || 'Desenvolvedor';
          const techs = (dev.TechnologyStacks || []).map((t) => t.name).filter(Boolean);
          // calculate compatibility count
          const techSet = new Set(techs.map((x) => (x || '').trim().toLowerCase()));
          const matchCount = projectTechs.reduce((acc, t) => (techSet.has(t) ? acc + 1 : acc), 0);
          // avatar conversion if available
          let avatarUrl = null;
          try {
            const raw = dev.get && dev.get('avatar');
            const mime = dev.get && dev.get('avatarMime') ? dev.get('avatarMime') : 'image/png';
            if (raw && Buffer.isBuffer(raw)) {
              avatarUrl = `data:${mime};base64,${raw.toString('base64')}`;
            } else if (typeof raw === 'string' && (raw.startsWith('data:') || raw.startsWith('/') || raw.startsWith('http'))) {
              avatarUrl = raw;
            }
          } catch (e) {}

          devMap.set(id, { id, name, techs, matchCount, proposalId: p.id, avatar: avatarUrl });
        }
      }
    }

    let devs = Array.from(devMap.values());
    // sort by matchCount desc
    devs.sort((a, b) => (b.matchCount || 0) - (a.matchCount || 0));

    res.render('client/applieds', { devs, project, techIconMap });
  } catch (err) {
    next(err);
  }
});

// Accept a proposal (client chooses a developer)
router.post('/aceitar', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.redirect('/');

    const client = await Client.findOne({ where: { userId } });
    if (!client) return res.redirect('/');

    const { proposalId, projectId } = req.body;
    if (!proposalId || !projectId) return res.redirect('/client/dashboard');

    const proposal = await Proposal.findByPk(proposalId);
    if (!proposal) return res.redirect('/client/dashboard');

    // ensure proposal belongs to a job posting under this project
    const jobPosting = await JobPosting.findByPk(proposal.jobPostingId);
    if (!jobPosting || String(jobPosting.projectId) !== String(projectId)) return res.status(403).send('Forbidden');

    const project = await Project.findByPk(projectId);
    if (!project || project.clientId !== client.id) return res.status(403).send('Forbidden');

    // mark this proposal accepted
    await proposal.update({ status: 'accepted' });

    // reject other proposals for the same job posting
    await Proposal.update({ status: 'rejected' }, { where: { jobPostingId: jobPosting.id, id: { [Op.ne]: proposal.id } } });

    // after accepting, redirect to solicitation view
    res.redirect(`/solicitacao/${projectId}`);
  } catch (err) {
    next(err);
  }
});

// Reject a proposal (client declines a specific developer)
router.post('/recusar', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.redirect('/');

    const client = await Client.findOne({ where: { userId } });
    if (!client) return res.redirect('/');

    const { proposalId, projectId } = req.body;
    if (!proposalId || !projectId) return res.redirect('/client/dashboard');

    const proposal = await Proposal.findByPk(proposalId);
    if (!proposal) return res.redirect('/client/dashboard');

    const jobPosting = await JobPosting.findByPk(proposal.jobPostingId);
    if (!jobPosting || String(jobPosting.projectId) !== String(projectId)) return res.status(403).send('Forbidden');

    const project = await Project.findByPk(projectId);
    if (!project || project.clientId !== client.id) return res.status(403).send('Forbidden');

    await proposal.update({ status: 'rejected' });

    res.redirect(`/client/applieds?projectId=${projectId}`);
  } catch (err) {
    next(err);
  }
});

export default router;
