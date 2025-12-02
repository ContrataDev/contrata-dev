import { Router } from "express";
import models from "../../models/index.js";

const router = Router();

const { Client, User, Project } = models;

router.get("/dashboard", (req, res) => {
  res.render("client/dashboard");
});

router.get("/create", (req, res) => {
  res.render("client/create");
});

router.get("/search", (req, res) => {
  res.render("client/search");
});

router.get('/edit-perfil', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    let client = await Client.findOne({ where: { userId }, include: [{ model: User, attributes: ['name','email'] }, { model: Project }] });

    if (!client) {
      client = await Client.create({ userId });
      client = await Client.findByPk(client.id, { include: [{ model: User, attributes: ['name','email'] }, { model: Project }] });
    }

    res.render('client/edit-perfil', { client: client ? client.toJSON() : null });
  } catch (err) { next(err); }
});

router.get('/perfil', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const client = await Client.findOne({ where: { userId }, include: [{ model: User, attributes: ['name','email'] }, { model: Project }] });
    const ts = req.query && req.query.t ? req.query.t : Date.now();
    res.render('client/perfil', { client: client ? client.toJSON() : null, ts });
  } catch (err) { next(err); }
});

export default router;
