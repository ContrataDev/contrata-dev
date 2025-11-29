import bcrypt from "bcrypt";
import { Op } from "sequelize";
import models from "../models/index.js";
import createError from "http-errors";
import path from 'path';
import fs from 'fs';

const Developer = models.Developer;
const User = models.User;

export async function createDeveloper(req, res, next) {
  try {
    const {
      userId,
      name,
      email,
      password,
      role = "developer",
      stack,
      seniority,
      availability,
      hourlyRate,
    } = req.body;

    let user;

    if (userId) {
      // tenta buscar pelo ID
      user = await User.findByPk(userId);
      if (!user) return next(createError(404, "Usuário não encontrado"));
    } else if (email) {
      // tenta buscar pelo email
      user = await User.findOne({ where: { email } });
      if (!user) {
        // cria novo usuário
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

    const existingDev = await Developer.findOne({ where: { userId: user.id } });
    if (existingDev) {
      return res.status(200).json({
        message: "Developer já existente para este usuário",
        developer: existingDev,
      });
    }

    const developer = await Developer.create({
      userId: user.id,
      stack,
      seniority,
      availability,
      hourlyRate,
    });

    res.status(201).json({ developer, user });
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
      include: [
        { model: User, attributes: ["name", "email", "role"] },
        { model: models.TechnologyStack },
        { model: models.PortfolioItem },
      ],
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
    const { stack, seniority, availability, hourlyRate, phone, country, technologyStacks, portfolioItems } = req.body;

    const developer = await Developer.findByPk(id);
    if (!developer)
      return next(createError(404, "Desenvolvedor não encontrado"));

    await developer.update({ stack, seniority, availability, hourlyRate, phone, country });

    // handle technology stacks (replace existing)
    if (Array.isArray(technologyStacks)) {
      // remove existing and recreate
      await models.TechnologyStack.destroy({ where: { developerId: developer.id } });
      const stacksToCreate = technologyStacks
        .filter((s) => s && (typeof s === 'string' || s.name))
        .map((s) => (typeof s === 'string' ? { name: s.trim() } : s))
        .map((s) => ({ ...s, developerId: developer.id }));
      if (stacksToCreate.length) await models.TechnologyStack.bulkCreate(stacksToCreate);
    }

    // handle portfolio items
    if (Array.isArray(portfolioItems)) {
      await models.PortfolioItem.destroy({ where: { developerId: developer.id } });
      const itemsToCreate = portfolioItems
        .filter((p) => p && (p.title || p.url))
        .map((p) => ({ ...p, developerId: developer.id }));
      if (itemsToCreate.length) await models.PortfolioItem.bulkCreate(itemsToCreate);
    }

    const updated = await Developer.findByPk(id, {
      include: [
        { model: User, attributes: ["name", "email", "role"] },
        { model: models.TechnologyStack },
        { model: models.PortfolioItem },
      ],
    });

    res.json(updated);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function updateDeveloperAvatar(req, res, next) {
  try {
    const { id } = req.params;
    const developer = await Developer.findByPk(id);
    if (!developer) return next(createError(404, 'Desenvolvedor não encontrado'));

    if (!req.file) return next(createError(400, 'Arquivo não informado'));

    // build public url path for stored file
    const publicPath = `/uploads/avatars/${req.file.filename}`;

    // optionally remove previous avatar file (if it was stored locally)
    if (developer.avatar && developer.avatar.startsWith('/uploads/avatars/')) {
      try {
        const oldFilename = path.basename(developer.avatar);
        const oldPath = path.resolve(process.cwd(), 'public', 'uploads', 'avatars', oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        // ignore errors while deleting old file
        console.warn('could not remove old avatar', err.message || err);
      }
    }

    await developer.update({ avatar: publicPath });

    res.json({ id: developer.id, avatar: developer.avatar });
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function getOrCreateDeveloperForCurrentUser(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Usuário não autenticado' });

    let developer = await Developer.findOne({ where: { userId } });
    if (!developer) {
      developer = await Developer.create({ userId });
    }

    // return full developer with associations
    const full = await Developer.findByPk(developer.id, {
      include: [
        { model: User, attributes: ['name', 'email', 'role'] },
        { model: models.TechnologyStack },
        { model: models.PortfolioItem },
      ],
    });

    res.json(full);
  } catch (err) {
    next(createError(500, err.message));
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
