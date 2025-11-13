import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/database.js";

class Skill extends Model {
  static associate(models) {
    Skill.belongsToMany(models.TechnologyStack, { through: "StackSkills" });
  }
}

Skill.init(
  {
    name: { type: DataTypes.STRING, unique: true },
    category: DataTypes.STRING, // ex: frontend, backend, devops
  },
  {
    sequelize,
    modelName: "Skill",
    tableName: "Skills",
    timestamps: false,
  }
);

export default Skill;
