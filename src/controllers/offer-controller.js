import OfferModel from "../models/OfferModel.js";
import DeveloperModel from "../models/DeveloperModel.js";
import ProjectModel from "../models/ProjectModel.js";

export const getAllOffers = async (req, res) => {
	try {
		const offers = await OfferModel.findAll({
			include: ["developer", "projects"],
		});
		res.status(200).json(offers);
	} catch (error) {
		console.error("Erro ao buscar todas as propostas:", error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const getOfferById = async (req, res) => {
	const { id } = req.params;
	try {
		const offer = await OfferModel.findByPk(id, {
			include: ["developer", "projects"],
		});

		if (!offer) {
			return res
				.status(404)
				.json({ message: "Proposta não encontrada." });
		}

		res.status(200).json(offer);
	} catch (error) {
		console.error(`Erro ao buscar proposta com ID ${id}:`, error);
		res.status(500).json({ message: "Erro interno do servidor." });
	}
};

export const createOffer = async (req, res) => {
	const { developerId } = req.params;
	const { budget, projectId } = req.body;

	if (!projectId) {
		return res.status(400).json({
			message: "É necessário informar o projectId para a proposta.",
		});
	}

	try {
		const developer = await DeveloperModel.findByPk(developerId);
		if (!developer) {
			return res
				.status(404)
				.json({ message: "Desenvolvedor não encontrado." });
		}

		const newOffer = await OfferModel.create({
			budget,
			developerId: developer.id,
		});

		const project = await ProjectModel.findByPk(projectId);
		if (!project) {
			await newOffer.destroy();
			return res.status(404).json({
				message: "Projeto não encontrado. Proposta não submetida.",
			});
		}

		await newOffer.addProject(projectId);

		res.status(201).json(newOffer);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return res
				.status(400)
				.json({ message: error.errors.map((e) => e.message) });
		}
		console.error("Erro ao criar nova proposta:", error);
		res.status(500).json({
			message: "Erro interno do servidor ao criar proposta.",
		});
	}
};

export const updateOffer = async (req, res) => {
	const { id } = req.params;
	const { budget } = req.body;

	try {
		const [updatedRowsCount, updatedOffers] = await OfferModel.update(
			{ budget },
			{
				where: { id },
				returning: true,
			}
		);

		if (updatedRowsCount === 0) {
			return res
				.status(404)
				.json({ message: "Proposta não encontrada para atualização." });
		}

		res.status(200).json(updatedOffers[0]);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			return res
				.status(400)
				.json({ message: error.errors.map((e) => e.message) });
		}
		console.error(`Erro ao atualizar proposta com ID ${id}:`, error);
		res.status(500).json({
			message: "Erro interno do servidor ao atualizar proposta.",
		});
	}
};

export const deleteOffer = async (req, res) => {
	const { id } = req.params;

	try {
		const deletedRowCount = await OfferModel.destroy({
			where: { id },
		});

		if (deletedRowCount === 0) {
			return res
				.status(404)
				.json({ message: "Proposta não encontrada para exclusão." });
		}

		res.status(204).send();
	} catch (error) {
		console.error(`Erro ao deletar proposta com ID ${id}:`, error);
		res.status(500).json({
			message: "Erro interno do servidor ao deletar proposta.",
		});
	}
};
