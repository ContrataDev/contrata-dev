import models from "../models/index.js";
import createError from "http-errors";
import { Op } from "sequelize";

const TechnologyStack = models.TechnologyStack;
const Developer = models.Developer;
const Skill = models.Skill;

export async function createTechnologyStack(req, res, next) {
  try {
    const { developerId, name, experienceYears, proficiency, skills } =
      req.body;

    const developer = await Developer.findByPk(developerId);
    if (!developer)
      return next(createError(404, "Desenvolvedor não encontrado"));

    const stack = await TechnologyStack.create({
      developerId,
      name,
      experienceYears,
      proficiency,
    });

    // se vier lista de skills, associa
    if (skills && skills.length > 0) {
      const skillRecords = await Skill.findAll({ where: { id: skills } });
      await stack.setSkills(skillRecords);
    }

    res.status(201).json(stack);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function getAllTechnologyStacks(req, res, next) {
  try {
    const { name, proficiency, minYears, maxYears } = req.query;
    const where = {};

    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (proficiency) where.proficiency = proficiency;
    if (minYears || maxYears) {
      where.experienceYears = {};
      if (minYears) where.experienceYears[Op.gte] = parseInt(minYears);
      if (maxYears) where.experienceYears[Op.lte] = parseInt(maxYears);
    }

    const stacks = await TechnologyStack.findAll({
      where,
      include: [
        { model: Developer, attributes: ["id", "stack", "seniority"] },
        { model: Skill, attributes: ["id", "name", "category"] },
      ],
    });

    res.json(stacks);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function getTechnologyStackById(req, res, next) {
  try {
    const { id } = req.params;
    const stack = await TechnologyStack.findByPk(id, {
      include: [
        { model: Developer, attributes: ["id", "stack", "seniority"] },
        { model: Skill, attributes: ["id", "name", "category"] },
      ],
    });

    if (!stack) return next(createError(404, "Stack não encontrada"));

    res.json(stack);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function updateTechnologyStack(req, res, next) {
  try {
    const { id } = req.params;
    const { name, experienceYears, proficiency, skills } = req.body;

    const stack = await TechnologyStack.findByPk(id);
    if (!stack) return next(createError(404, "Stack não encontrada"));

    await stack.update({ name, experienceYears, proficiency });

    if (skills) {
      const skillRecords = await Skill.findAll({ where: { id: skills } });
      await stack.setSkills(skillRecords);
    }

    res.json(stack);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function deleteTechnologyStack(req, res, next) {
  try {
    const { id } = req.params;
    const stack = await TechnologyStack.findByPk(id);
    if (!stack) return next(createError(404, "Stack não encontrada"));

    await stack.destroy();
    res.status(204).end();
  } catch (err) {
    next(createError(500, err.message));
  }
}
