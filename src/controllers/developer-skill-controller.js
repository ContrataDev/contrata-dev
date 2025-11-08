import DeveloperModel from "../models/DeveloperModel.js";
// Supondo que você tenha o DeveloperModel

/**
 * @route GET /developers/:developerId/skills
 * @desc Retorna todas as Skills de um Desenvolvedor específico
 * @access Público
 */
export const getDeveloperSkills = async (req, res) => {
	const { developerId } = req.params;
	try {
		const developer = await DeveloperModel.findByPk(developerId, {
			// Usa o 'as' definido no relacionamento: as: "skills"
			include: ["skills"],
		});

		if (!developer) {
			return res
				.status(404)
				.json({ message: "Desenvolvedor não encontrado." });
		}

		res.status(200).json(developer.skills);
	} catch (error) {
		console.error("Erro ao buscar skills do desenvolvedor:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

/**
 * @route POST /developers/:developerId/skills/:skillId
 * @desc Adiciona uma Skill a um Desenvolvedor
 * @access Privado (Somente o próprio dev ou admin, protegido por Passport)
 */
export const addSkillToDeveloper = async (req, res) => {
	const { developerId, skillId } = req.params;

	// **Proteção:** Aqui você verificaria se o usuário logado (via Passport)
	// é o developerId ou um admin.

	try {
		const developer = await DeveloperModel.findByPk(developerId);

		if (!developer) {
			return res
				.status(404)
				.json({ message: "Desenvolvedor não encontrado." });
		}

		// Sequelize usa o método gerado 'addSkill' (singular)
		await developer.addSkill(skillId);

		// Retorna a lista atualizada de skills do desenvolvedor
		const updatedSkills = await developer.getSkills();

		res.status(200).json({
			message: "Habilidade adicionada com sucesso.",
			skills: updatedSkills,
		});
	} catch (error) {
		console.error("Erro ao adicionar skill ao desenvolvedor:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

/**
 * @route DELETE /developers/:developerId/skills/:skillId
 * @desc Remove uma Skill de um Desenvolvedor
 * @access Privado (Protegido por Passport)
 */
export const removeSkillFromDeveloper = async (req, res) => {
	const { developerId, skillId } = req.params;

	try {
		const developer = await DeveloperModel.findByPk(developerId);

		if (!developer) {
			return res
				.status(404)
				.json({ message: "Desenvolvedor não encontrado." });
		}

		// Sequelize usa o método gerado 'removeSkill' (singular)
		await developer.removeSkill(skillId);

		// Retorna a lista atualizada de skills do desenvolvedor
		const updatedSkills = await developer.getSkills();

		res.status(200).json({
			message: "Habilidade removida com sucesso.",
			skills: updatedSkills,
		});
	} catch (error) {
		console.error("Erro ao remover skill do desenvolvedor:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};
