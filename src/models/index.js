import sequelize from "../config/database.js";

// Core entities
import User from "./core/User.js";
import Client from "./core/Client.js";
import Developer from "./core/Developer.js";
import Organization from "./core/Organization.js";
import OrganizationMembers from "./core/OrganizationMembers.js";

// Marketplace workflow entities
import Project from "./marketplace/Project.js";
import JobPosting from "./marketplace/JobPosting.js";
import Proposal from "./marketplace/Proposal.js";
import Contract from "./marketplace/Contract.js";
import Milestone from "./marketplace/Milestone.js";
import Deliverable from "./marketplace/Deliverable.js";
import Timesheet from "./marketplace/Timesheet.js";

// Profile and qualification entities
import Skill from "./profile/Skill.js";
import TechnologyStack from "./profile/TechnologyStack.js";
import Certification from "./profile/Certification.js";
import PortfolioItem from "./profile/PortfolioItem.js";
import Availability from "./profile/Availability.js";
import RateCard from "./profile/RateCard.js";

const models = {
  User,
  Client,
  Developer,
  Organization,
  OrganizationMembers,
  Project,
  JobPosting,
  Proposal,
  Contract,
  Milestone,
  Deliverable,
  Timesheet,
  Skill,
  TechnologyStack,
  Certification,
  PortfolioItem,
  Availability,
  RateCard,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { sequelize };
export default models;
