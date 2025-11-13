import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class OrganizationMembers extends Model {}

OrganizationMembers.init(
  {
    role: DataTypes.ENUM("owner", "admin", "member"),
  },
  {
    sequelize,
    modelName: "OrganizationMembers",
    tableName: "OrganizationMembers",
    timestamps: true,
  }
);

export default OrganizationMembers;
