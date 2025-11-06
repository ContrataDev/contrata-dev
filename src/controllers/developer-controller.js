import DeveloperModel from "../models/developer-model.js";
import UserModel from "../models/user-model.js";
import { createUser, updateUser, deleteUser } from "./user-controller.js";

// Criar desenvolvedor
export const createDeveloper = async (req, res) => {
	try {
		const { name, email, password, cpf } = req.body;

		const newUser = await createUser({ name, email, password });

		const newDeveloper = await DeveloperModel.create({
			userId: newUser.id,
			cpf,
		});

		res.status(201).json({
			message: "Desenvolvedor criado com sucesso!",
			user: newUser,
			developer: newDeveloper,
		});
	} catch (err) {
		console.error("Erro ao criar desenvolvedor:", err.message);
		res.status(500).json({ message: err.message });
	}
};

// Buscar todos os desenvolvedores
export const getAllDevelopers = async (req, res) => {
	try {
		const developers = await DeveloperModel.findAll({
			include: [
				{
					model: UserModel,
					as: "user",
					attributes: ["id", "name", "email"],
				},
			],
		});

		res.status(200).json(developers);
	} catch (err) {
		console.error("Erro ao buscar desenvolvedores:", err.message);
		res.status(500).json({ message: "Erro ao buscar desenvolvedores." });
	}
};

// Buscar por ID
export const getDeveloperById = async (req, res) => {
	try {
		const { id } = req.params;

		const developer = await DeveloperModel.findByPk(id, {
			include: [
				{
					model: UserModel,
					as: "user",
					attributes: ["id", "name", "email"],
				},
			],
		});

		if (!developer)
			return res
				.status(404)
				.json({ message: "Desenvolvedor não encontrado." });

		res.status(200).json(developer);
	} catch (err) {
		console.error("Erro ao buscar desenvolvedor:", err.message);
		res.status(500).json({
			message: "Erro interno ao buscar desenvolvedor.",
		});
	}
};

// Atualizar
export const updateDeveloper = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, cpf } = req.body;

		const developer = await DeveloperModel.findByPk(id);
		if (!developer)
			return res
				.status(404)
				.json({ message: "Desenvolvedor não encontrado." });

		if (name || email) {
			await updateUser(developer.userId, { name, email });
		}

		if (cpf) {
			await DeveloperModel.update({ cpf }, { where: { id } });
		}

		res.status(200).json({
			message: "Desenvolvedor atualizado com sucesso.",
		});
	} catch (err) {
		console.error("Erro ao atualizar desenvolvedor:", err.message);
		res.status(500).json({ message: "Erro ao atualizar desenvolvedor." });
	}
};

// Deletar
export const deleteDeveloper = async (req, res) => {
	try {
		const { id } = req.params;

		const developer = await DeveloperModel.findByPk(id);
		if (!developer)
			return res
				.status(404)
				.json({ message: "Desenvolvedor não encontrado." });

		// Exclui o usuário (e por cascade, o dev se apaga)
		await deleteUser(developer.userId);

		res.status(200).json({
			message: "Desenvolvedor deletado com sucesso.",
		});
	} catch (err) {
		console.error("Erro ao deletar desenvolvedor:", err.message);
		res.status(500).json({ message: "Erro ao deletar desenvolvedor." });
	}
};
