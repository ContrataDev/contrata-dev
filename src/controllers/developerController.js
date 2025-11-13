import { Op } from "sequelize";
import models from "../models/index.js";
import createError from "http-errors";

const Developer = models.Developer;
const User = models.User;

export async function createDeveloper(req, res, next) {
  try {
    const { userId, stack, seniority, availability, hourlyRate } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return next(createError(404, "Usuário não encontrado"));

    const developer = await Developer.create({
      userId,
      stack,
      seniority,
      availability,
      hourlyRate,
    });

    res.status(201).json(developer);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function getAllDevelopers(req, res, next) {
  try {
    const { stack, seniority, availability, minRate, maxRate, name } =
      req.query;

    const where = {};

    if (stack) {
      where.stack = { [Op.iLike]: `%${stack}%` };
    }

    if (seniority) {
      where.seniority = seniority;
    }

    if (availability) {
      where.availability = { [Op.iLike]: `%${availability}%` };
    }

    if (minRate || maxRate) {
      where.hourlyRate = {};
      if (minRate) where.hourlyRate[Op.gte] = parseFloat(minRate);
      if (maxRate) where.hourlyRate[Op.lte] = parseFloat(maxRate);
    }

    const include = [];
    if (name) {
      include.push({
        model: User,
        attributes: ["name", "email"],
        where: { name: { [Op.iLike]: `%${name}%` } },
      });
    } else {
      include.push({ model: User, attributes: ["name", "email"] });
    }

    const developers = await Developer.findAll({ where, include });

    res.json(developers);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function getDeveloperById(req, res, next) {
  try {
    const { id } = req.params;
    const developer = await Developer.findByPk(id, {
      include: [{ model: User, attributes: ["name", "email", "role"] }],
    });

    if (!developer)
      return next(createError(404, "Desenvolvedor não encontrado"));

    res.json(developer);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function updateDeveloper(req, res, next) {
  try {
    const { id } = req.params;
    const { stack, seniority, availability, hourlyRate } = req.body;

    const developer = await Developer.findByPk(id);
    if (!developer)
      return next(createError(404, "Desenvolvedor não encontrado"));

    await developer.update({ stack, seniority, availability, hourlyRate });

    res.json(developer);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function deleteDeveloper(req, res, next) {
  try {
    const { id } = req.params;
    const developer = await Developer.findByPk(id);
    if (!developer)
      return next(createError(404, "Desenvolvedor não encontrado"));

    await developer.destroy();
    res.status(204).end();
  } catch (err) {
    next(createError(500, err.message));
  }
}
