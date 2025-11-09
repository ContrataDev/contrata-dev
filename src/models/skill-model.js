import { DataTypes, Model } from "sequelize";

import sequelize from "../config/database.js";

class SkillModel extends Model {}
SkillModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: DataTypes.STRING,
		icon_path: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "Skill",
		tableName: "Skills",
	}
);

export default SkillModel;
