import express from "express";
import {
	getAllOffers,
	getOfferById,
	createOffer,
	updateOffer,
	deleteOffer,
} from "../controllers/OfferController.js";
import {
	isAuthenticated,
	isDeveloper,
	isOwnerOrAdmin,
} from "../../Middlewares/auth-middleware.js";

const router = express.Router();

router.get("/", getAllOffers);
router.get("/:id", getOfferById);

router.post(
	"/developers/:developerId/offers",
	isAuthenticated,
	isDeveloper,
	createOffer
);

router.put("/:id", isAuthenticated, isOwnerOrAdmin, updateOffer);
router.delete("/:id", isAuthenticated, isOwnerOrAdmin, deleteOffer);

export default router;
