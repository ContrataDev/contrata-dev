import SkillModel from "../models/SkillModel.js";

export const getAllSkills = async (req, res) => {
	try {
		const skills = await SkillModel.findAll();
		res.status(200).json(skills);
	} catch (error) {
		console.error("Erro ao buscar todas as habilidades:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const getSkillById = async (req, res) => {
	const { id } = req.params;
	try {
		// Incluindo quem usa essa skill (Developers e Projects)
		const skill = await SkillModel.findByPk(id, {
			include: ["developers", "projects"],
		});

		if (!skill) {
			return res
				.status(404)
				.json({ message: "Habilidade não encontrada." });
		}

		res.status(200).json(skill);
	} catch (error) {
		console.error(`Erro ao buscar habilidade com ID ${id}:`, error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const createSkill = async (req, res) => {
	const { name, description, icon_path } = req.body;
	// Esta rota deve ser protegida (Passport.js)
	try {
		const newSkill = await SkillModel.create({
			name,
			description,
			icon_path,
		});
		res.status(201).json(newSkill);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return res
				.status(400)
				.json({ message: error.errors.map((e) => e.message) });
		}
		console.error("Erro ao criar nova habilidade:", error);
		res.status(500).json({
			message: "Erro interno do servidor ao criar habilidade.",
		});
	}
};

export const updateSkill = async (req, res) => {
	const { id } = req.params;
	const updateData = req.body;
	// Esta rota deve ser protegida (Passport.js)
	try {
		const [updatedRowsCount, updatedSkills] = await SkillModel.update(
			updateData,
			{
				where: { id },
				returning: true,
			}
		);

		if (updatedRowsCount === 0) {
			return res.status(404).json({
				message: "Habilidade não encontrada para atualização.",
			});
		}

		res.status(200).json(updatedSkills[0]);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return res
				.status(400)
				.json({ message: error.errors.map((e) => e.message) });
		}
		console.error(`Erro ao atualizar habilidade com ID ${id}:`, error);
		res.status(500).json({
			message: "Erro interno do servidor ao atualizar habilidade.",
		});
	}
};

export const deleteSkill = async (req, res) => {
	const { id } = req.params;
	// Esta rota deve ser protegida (Passport.js)
	try {
		const deletedRowCount = await SkillModel.destroy({
			where: { id },
		});

		if (deletedRowCount === 0) {
			return res
				.status(404)
				.json({ message: "Habilidade não encontrada para exclusão." });
		}

		res.status(204).send();
	} catch (error) {
		console.error(`Erro ao deletar habilidade com ID ${id}:`, error);
		res.status(500).json({
			message: "Erro interno do servidor ao deletar habilidade.",
		});
	}
};
