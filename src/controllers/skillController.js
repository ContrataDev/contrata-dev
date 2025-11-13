import models from "../models/index.js";
import createError from "http-errors";
import { Op } from "sequelize";

const Skill = models.Skill;

export async function createSkill(req, res, next) {
  try {
    const { name, category } = req.body;

    const existing = await Skill.findOne({ where: { name } });
    if (existing) return next(createError(409, "Skill já cadastrada"));

    const skill = await Skill.create({ name, category });
    res.status(201).json(skill);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function getAllSkills(req, res, next) {
  try {
    const { name, category } = req.query;
    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (category) where.category = { [Op.iLike]: `%${category}%` };

    const skills = await Skill.findAll({ where });
    res.json(skills);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function getSkillById(req, res, next) {
  try {
    const { id } = req.params;
    const skill = await Skill.findByPk(id);

    if (!skill) return next(createError(404, "Skill não encontrada"));

    res.json(skill);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function updateSkill(req, res, next) {
  try {
    const { id } = req.params;
    const { name, category } = req.body;

    const skill = await Skill.findByPk(id);
    if (!skill) return next(createError(404, "Skill não encontrada"));

    await skill.update({ name, category });
    res.json(skill);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function deleteSkill(req, res, next) {
  try {
    const { id } = req.params;
    const skill = await Skill.findByPk(id);
    if (!skill) return next(createError(404, "Skill não encontrada"));

    await skill.destroy();
    res.status(204).end();
  } catch (err) {
    next(createError(500, err.message));
  }
}
