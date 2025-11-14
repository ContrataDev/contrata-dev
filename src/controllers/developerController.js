import bcrypt from "bcrypt";
import models from "../models/index.js";
import createError from "http-errors";

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
