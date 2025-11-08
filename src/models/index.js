import sequelize from "../config/database.js";

import UserModel from "./user-model.js";
import ContractorModel from "./contractor-model.js";
import DeveloperModel from "./developer-model.js";
import SkillModel from "./skill-model.js";
import ProjectModel from "./projects-model.js";
import OfferModel from "./offer-model.js";

// User -> Contractor
UserModel.hasOne(ContractorModel, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	as: "contractor",
});
ContractorModel.belongsTo(UserModel, {
	foreignKey: "userId",
	as: "user",
});

// User -> Developer
UserModel.hasOne(DeveloperModel, {
	foreignKey: "userId",
	onDelete: "CASCADE",
	as: "developer",
});
DeveloperModel.belongsTo(UserModel, {
	foreignKey: "userId",
	as: "user",
});

// Contractor -> Projects
ContractorModel.hasMany(ProjectModel, {
	foreignKey: "contractorId",
	onDelete: "CASCADE",
	as: "projects",
});
ProjectModel.belongsTo(ContractorModel, {
	foreignKey: "contractorId",
	as: "contractor",
});

// Developer <-> Skill
DeveloperModel.belongsToMany(SkillModel, {
	through: "DevSkill",
	foreignKey: "developerId",
	otherKey: "skillId",
	as: "skills",
});
SkillModel.belongsToMany(DeveloperModel, {
	through: "DevSkill",
	foreignKey: "skillId",
	otherKey: "developerId",
	as: "developers",
});

// Project <-> Skill
ProjectModel.belongsToMany(SkillModel, {
	through: "ProjectSkill",
	foreignKey: "projectId",
	otherKey: "skillId",
	as: "skills",
});
SkillModel.belongsToMany(ProjectModel, {
	through: "ProjectSkill",
	foreignKey: "skillId",
	otherKey: "projectId",
	as: "projects",
});

// Developer -> Offers
DeveloperModel.hasMany(OfferModel, {
	foreignKey: "developerId",
	onDelete: "CASCADE",
	as: "offers",
});
OfferModel.belongsTo(DeveloperModel, {
	foreignKey: "developerId",
	as: "developer",
});

// Project <-> Offer
ProjectModel.belongsToMany(OfferModel, {
	through: "ProjectOffer",
	foreignKey: "projectId",
	otherKey: "offerId",
	as: "offers",
});
OfferModel.belongsToMany(ProjectModel, {
	through: "ProjectOffer",
	foreignKey: "offerId",
	otherKey: "projectId",
	as: "projects",
});

try {
	await sequelize.authenticate({ logging: false });
	console.log("Conexão com Banco de Dados bem sucedida");
} catch (error) {
	console.error("Não foi possível conectar no Banco de Dados", error);
	process.exit(1);
}

await sequelize.sync({ alter: true });
