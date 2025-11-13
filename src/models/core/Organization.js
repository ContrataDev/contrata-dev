import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Organization extends Model {
  static associate(models) {
    Organization.belongsToMany(models.User, {
      through: models.OrganizationMembers,
    });
    Organization.hasMany(models.Project, { foreignKey: "organizationId" });
  }
}

Organization.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    billingInfo: DataTypes.JSON,
    permissions: DataTypes.JSON,
  },
  {
    sequelize,
    modelName: "Organization",
    tableName: "Organizations",
    timestamps: true,
  }
);

export default Organization;
