import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";
import UserModel from "./user-model.js";

class DeveloperModel extends UserModel {}
DeveloperModel.init(
	{
		cpf: DataTypes.STRING,
	},
	{
		sequelize,
		modelName: "Developer",
		tableName: "Developers",
	}
);

export default DeveloperModel;
