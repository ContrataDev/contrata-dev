import { Router } from "express";
import models from "../../models/index.js";
import techIconMap from "../../utils/techIconMap.js";

const router = Router();

const { Client, User, Project } = models;

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

export default router;
