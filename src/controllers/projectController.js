import models from "../models/index.js";
import createError from "http-errors";
import { Op } from "sequelize";

const Project = models.Project;
const Developer = models.Developer;
const Client = models.Client;

export async function createProject(req, res, next) {
  try {
    const { clientId, title, description, budget, deadline, status } = req.body;

    const client = await Client.findByPk(clientId);
    if (!client) return next(createError(404, "Cliente não encontrado"));

    const project = await Project.create({
      clientId,
      title,
      description,
      budget,
      deadline,
      status: status || "draft",
    });

    res.status(201).json(project);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function getAllProjects(req, res, next) {
  try {
    const { status, minBudget, maxBudget, title } = req.query;

    const where = {};
    if (status) where.status = status;
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget)
        where.budget[models.Sequelize.Op.gte] = parseFloat(minBudget);
      if (maxBudget)
        where.budget[models.Sequelize.Op.lte] = parseFloat(maxBudget);
    }
    if (title) {
      where.title = { [models.Sequelize.Op.iLike]: `%${title}%` };
    }

    const projects = await Project.findAll({
      where,
      include: [{ model: Client, attributes: ["name", "email"] }],
    });

    res.json(projects);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [{ model: Client, attributes: ["name", "email"] }],
    });

    if (!project) return next(createError(404, "Projeto não encontrado"));

    res.json(project);
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, budget, deadline, status } = req.body;

    const project = await Project.findByPk(id);
    if (!project) return next(createError(404, "Projeto não encontrado"));

    await project.update({ title, description, budget, deadline, status });

    res.json(project);
  } catch (err) {
    next(createError(400, err.message));
  }
}

export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) return next(createError(404, "Projeto não encontrado"));

    await project.destroy();
    res.status(204).end();
  } catch (err) {
    next(createError(500, err.message));
  }
}

export async function recommendDevelopers(req, res, next) {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) return next(createError(404, "Projeto não encontrado"));

    // critérios básicos de recomendação
    const where = {};

    if (project.budget) {
      where.hourlyRate = { [Op.lte]: project.budget / 100 };
      // exemplo: se orçamento é total, divide por 100h
    }

    if (project.status === "open") {
      where.availability = { [Op.iLike]: "%disponível%" };
    }

    // exemplo simples: buscar por stack no título/descrição
    if (project.title || project.description) {
      const keywords = (
        project.title +
        " " +
        project.description
      ).toLowerCase();
      if (keywords.includes("node")) where.stack = { [Op.iLike]: "%node%" };
      if (keywords.includes("react")) where.stack = { [Op.iLike]: "%react%" };
      if (keywords.includes("python")) where.stack = { [Op.iLike]: "%python%" };
    }

    const developers = await Developer.findAll({
      where,
      limit: 10,
      include: [{ model: models.User, attributes: ["name", "email"] }],
    });

    res.json({
      project: { id: project.id, title: project.title },
      recommendations: developers,
    });
  } catch (err) {
    next(createError(500, err.message));
  }
}
