import bcrypt from "bcrypt";
import models from "../models/index.js";
import createError from "http-errors";

const Client = models.Client;
const User = models.User;

export async function createClient(req, res, next) {
  try {
    const {
      userId,
      name,
      email,
      password,
      role = "client",
      companyName,
      budgetRange,
    } = req.body;

    let user;

    if (userId) {
      user = await User.findByPk(userId);
      if (!user) return next(createError(404, "Usuário não encontrado"));
    } else if (email) {
      user = await User.findOne({ where: { email } });
      if (!user) {
        const passwordHash = await bcrypt.hash(password, 10);
        user = await User.create({
          name,
          email,
          passwordHash,
          role,
        });
      }
    } else {
      return next(createError(400, "É necessário informar userId ou email"));
    }

    const existingClient = await Client.findOne({ where: { userId: user.id } });
    if (existingClient) {
      return res.status(200).json({
        message: "Client já existente para este usuário",
        client: existingClient,
      });
    }

    const client = await Client.create({
      userId: user.id,
      companyName,
      budgetRange,
    });

    res.status(201).json({ client, user });
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
