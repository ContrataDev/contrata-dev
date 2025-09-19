import ContractorModel from "../models/contractor-model.js";
import UserModel from "../models/user-model.js";
import { createUser, updateUser, deleteUser } from "./user-controller.js";

// Criar novo contratante com usuário
export const createContractor = async (req, res) => {
  try {
    const { name, email, password, companyName, cnpj } = req.body;

    // Cria usuário usando userController
    const newUser = await createUser({ name, email, password });

    // Cria contratante vinculado ao user
    const newContractor = await ContractorModel.create({
      userId: newUser.id,
      companyName,
      cnpj,
    });

    res.status(201).json({
      message: "Contratante criado com sucesso!",
      user: newUser,
      contractor: newContractor,
    });
  } catch (error) {
    console.error("Erro ao criar contratante:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Buscar todos os contratantes
export const getAllContractors = async (req, res) => {
  try {
    const contractors = await ContractorModel.findAll({
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(200).json(contractors);
  } catch (error) {
    console.error("Erro ao buscar contratantes:", error.message);
    res.status(500).json({ message: "Erro ao buscar contratantes." });
  }
};

// Buscar contratante por ID
export const getContractorById = async (req, res) => {
  try {
    const { id } = req.params;

    const contractor = await ContractorModel.findOne({
      where: { id },
      include: [
        {
          model: UserModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!contractor)
      return res.status(404).json({ message: "Contratante não encontrado." });

    res.status(200).json(contractor);
  } catch (error) {
    console.error("Erro ao buscar contratante:", error.message);
    res.status(500).json({ message: "Erro ao buscar contratante." });
  }
};

// Atualizar contratante
export const updateContractor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, companyName, cnpj } = req.body;

    const contractor = await ContractorModel.findByPk(id);
    if (!contractor)
      return res.status(404).json({ message: "Contratante não encontrado." });

    // Atualizar usuário vinculado
    if (name || email) {
      await updateUser(contractor.userId, { name, email });
    }

    // Atualizar dados do contratante
    await ContractorModel.update({ companyName, cnpj }, { where: { id } });

    res.status(200).json({ message: "Contratante atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar contratante:", error.message);
    res.status(500).json({ message: "Erro ao atualizar contratante." });
  }
};

// Deletar contratante
export const deleteContractor = async (req, res) => {
  try {
    const { id } = req.params;

    const contractor = await ContractorModel.findByPk(id);

    if (!contractor)
      return res.status(404).json({ message: "Contratante não encontrado." });

    // Remove o usuário (ação em cascata removerá contractor)
    await deleteUser(contractor.userId);

    res.status(200).json({ message: "Contratante deletado com sucesso!" });
  } catch (error) {
    console.error("Erro ao deletar contratante:", error.message);
    res.status(500).json({ message: "Erro ao deletar contratante." });
  }
};
