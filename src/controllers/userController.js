import bcrypt from "bcrypt";
import models from "../models/index.js";
import createError from "http-errors";

const User = models.User;

export async function createUser(req, res, next) {
  try {
    const {
      name,
      email,
      password,
      role,
      profilePicture,
      bio,
      location,
      language,
      preferences,
    } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      req.flash("error", "Email já cadastrado");
      res.redirect("/auth?sign-in");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await User.create({
      name,
      email,
      passwordHash,
      role,
      profilePicture,
      bio,
      location,
      language,
      preferences,
    });

    res.status(201).redirect("/auth?type=login");
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function getAllUsers(req, res, next) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return next(createError(404, "Usuário não encontrado"));

    res.json(user);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByPk(id);
    if (!user) return next(createError(404, "Usuário não encontrado"));

    await user.update(updates);
    res.json(user);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) return next(createError(404, "Usuário não encontrado"));

    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(createError(500, err.message));
  }
}
