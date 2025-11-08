import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";
import UserModel from "./user-model.js";

class ContractorModel extends UserModel {}
ContractorModel.init(
	{
		companyName: DataTypes.STRING,
		cnpj: DataTypes.STRING,
		cpf: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: "Contractor",
		tableName: "Contractors",
	}
);

export default ContractorModel;
