import { DataTypes, Model } from "sequelize";

import sequelize from "../config/database.js";

class UserModel extends Model {}
UserModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(),
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		hashed_password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "User",
		tableName: "Users",
	}
);

export default UserModel;
