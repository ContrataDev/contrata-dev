import models from "../models/index.js";
import createError from "http-errors";

const Client = models.Client;
const User = models.User;
const Project = models.Project;

export async function createClient(req, res, next) {
  try {
    const { userId, companyName, budgetRange } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return next(createError(404, "Usuário não encontrado"));

    const client = await Client.create({
      userId,
      companyName,
      budgetRange,
    });

    res.status(201).json(client);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function getAllClients(req, res, next) {
  try {
    const clients = await Client.findAll({
      include: [
        { model: User, attributes: ["name", "email", "role"] },
        { model: Project, attributes: ["title", "status", "budget"] },
      ],
    });
    res.json(clients);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function getClientById(req, res, next) {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id, {
      include: [
        { model: User, attributes: ["name", "email", "role"] },
        { model: Project, attributes: ["title", "status", "budget"] },
      ],
    });

    if (!client) return next(createError(404, "Cliente não encontrado"));

    res.json(client);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function updateClient(req, res, next) {
  try {
    const { id } = req.params;
    const { companyName, budgetRange } = req.body;

    const client = await Client.findByPk(id);
    if (!client) return next(createError(404, "Cliente não encontrado"));

    await client.update({ companyName, budgetRange });

    res.json(client);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function deleteClient(req, res, next) {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) return next(createError(404, "Cliente não encontrado"));

    await client.destroy();
    res.status(204).end();
  } catch (err) {
    next(createError(500, err.message));
  }
}
