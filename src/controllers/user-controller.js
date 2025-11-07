import bcrypt from "bcrypt";
import UserModel from "../models/user-model.js";

export const createUser = async ({ name, email, password }) => {
	const existingUser = await UserModel.findOne({ where: { email } });
	if (existingUser) {
		throw new Error("E-mail já está em uso.");
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await UserModel.create({
		name,
		email,
		hashed_password: hashedPassword,
	});

	return newUser;
};

export const getUserById = async (id) => {
	const user = await UserModel.findByPk(id);
	if (!user) throw new Error("Usuário não encontrado.");
	return user;
};

export const updateUser = async (id, updateData) => {
	const [updated] = await UserModel.update(updateData, {
		where: { id },
		returning: true,
	});

	if (!updated) throw new Error("Usuário não encontrado para atualização.");

	const updatedUser = await UserModel.findByPk(id);
	return updatedUser;
};

export const deleteUser = async (id) => {
	const deleted = await UserModel.destroy({ where: { id } });
	if (!deleted) throw new Error("Usuário não encontrado para exclusão.");
	return true;
};
