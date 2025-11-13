import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Certification extends Model {
  static associate(models) {
    Certification.belongsTo(models.Developer, { foreignKey: "developerId" });
  }
}

Certification.init(
  {
    title: DataTypes.STRING,
    issuer: DataTypes.STRING,
    issuedAt: DataTypes.DATE,
    url: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "Certification",
    tableName: "Certifications",
    timestamps: true,
  }
);

export default Certification;
