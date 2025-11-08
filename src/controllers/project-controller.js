import ProjectModel from "../models/ProjectModel.js";

export const getAllProjects = async (req, res) => {
	try {
		const projects = await ProjectModel.findAll({
			include: ["skills"],
		});
		res.status(200).json(projects);
	} catch (error) {
		console.error("Erro ao buscar todos os projetos:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const getProjectById = async (req, res) => {
	const { id } = req.params;
	try {
		const project = await ProjectModel.findByPk(id, {
			include: ["skills"],
		});

		if (!project) {
			return res.status(404).json({ message: "Projeto não encontrado." });
		}

		res.status(200).json(project);
	} catch (error) {
		console.error(`Erro ao buscar projeto com ID ${id}:`, error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const createProject = async (req, res) => {
	const { title, description, budget, deadline, status } = req.body;

	try {
		const newProject = await ProjectModel.create({
			title,
			description,
			budget,
			deadline,
			status,
		});
		res.status(201).json(newProject);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return res
				.status(400)
				.json({ message: error.errors.map((e) => e.message) });
		}
		console.error("Erro ao criar novo projeto:", error);
		res.status(500).json({
			message: "Erro interno do servidor ao criar projeto.",
		});
	}
};

export const updateProject = async (req, res) => {
	const { id } = req.params;
	const updateData = req.body;

	try {
		const [updatedRowsCount, updatedProjects] = await ProjectModel.update(
			updateData,
			{
				where: { id },
				returning: true,
			}
		);

		if (updatedRowsCount === 0) {
			return res
				.status(404)
				.json({ message: "Projeto não encontrado para atualização." });
		}

		res.status(200).json(updatedProjects[0]);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return res
				.status(400)
				.json({ message: error.errors.map((e) => e.message) });
		}
		console.error(`Erro ao atualizar projeto com ID ${id}:`, error);
		res.status(500).json({
			message: "Erro interno do servidor ao atualizar projeto.",
		});
	}
};

export const deleteProject = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedRowCount = await ProjectModel.destroy({
			where: { id },
		});

		if (deletedRowCount === 0) {
			return res
				.status(404)
				.json({ message: "Projeto não encontrado para exclusão." });
		}

		res.status(204).send();
	} catch (error) {
		console.error(`Erro ao deletar projeto com ID ${id}:`, error);
		res.status(500).json({
			message: "Erro interno do servidor ao deletar projeto.",
		});
	}
};
