import { Router } from "express";
import passport from "passport";

import { createDeveloper } from "../../controllers/developerController.js";
import { createClient } from "../../controllers/clientController.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("public/auth");
});

router.post(
  "/password",
  passport.authenticate("local", {
    successRedirect: "/develop/dashboard",
    failureRedirect: "/auth",
    failureFlash: true,
  })
);

router.post("/register/dev", createDeveloper);
router.post("/register/client", createClient);

export default router;
