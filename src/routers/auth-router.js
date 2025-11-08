import { Router } from "express";
import passport from "passport";

import { createDeveloper } from "../controllers/developer-controller.js";

const router = Router();

router.get("/", (_, res) => {
	res.render("auth");
});

router.post(
	"/password",
	passport.authenticate("local", {
		successRedirect: "/homeD",
		failureRedirect: "/auth",
		failureMessage: true,
	})
);

router.post("/register", createDeveloper);

export default router;
