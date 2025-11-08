import ProjectModel from "../models/ProjectModel.js";

export const getProjectSkills = async (req, res) => {
	const { projectId } = req.params;
	try {
		const project = await ProjectModel.findByPk(projectId);

		if (!project) {
			return res.status(404).json({ message: "Projeto não encontrado." });
		}

		const skills = await project.getSkills();

		res.status(200).json(skills);
	} catch (error) {
		console.error("Erro ao buscar skills do projeto:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const addSkillToProject = async (req, res) => {
	const { projectId, skillId } = req.params;

	try {
		const project = await ProjectModel.findByPk(projectId);

		if (!project) {
			return res.status(404).json({ message: "Projeto não encontrado." });
		}

		await project.addSkill(skillId);

		const updatedSkills = await project.getSkills();

		res.status(200).json({
			message: "Skill adicionada ao projeto com sucesso.",
			skills: updatedSkills,
		});
	} catch (error) {
		console.error("Erro ao adicionar skill ao projeto:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const removeSkillFromProject = async (req, res) => {
	const { projectId, skillId } = req.params;

	try {
		const project = await ProjectModel.findByPk(projectId);

		if (!project) {
			return res.status(404).json({ message: "Projeto não encontrado." });
		}

		await project.removeSkill(skillId);

		const updatedSkills = await project.getSkills();

		res.status(200).json({
			message: "Skill removida do projeto com sucesso.",
			skills: updatedSkills,
		});
	} catch (error) {
		console.error("Erro ao remover skill do projeto:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};
