import { Router } from "express";
import passport from "passport";

import { createDeveloper } from "../../controllers/developerController.js";
import { createClient } from "../../controllers/clientController.js";

const router = Router();

router.get(
  "/",
  (req, res, next) => {
    if (!req.user) {
      next();
    }
    if (req.user.role === "developer") {
      return res.redirect("/develop/dashboard");
    }

    if (req.user.role === "client") {
      return res.redirect("/client/dashboard");
    }
    next();
  },
  (req, res) => {
    res.render("public/auth");
  }
);

router.post(
  "/password",
  passport.authenticate("local", {
    failureRedirect: "/auth",
    failureFlash: true,
  }),
  (req, res) => {
    if (!req.user) {
      return res.redirect("/auth");
    }
    if (req.user.role === "developer") {
      return res.redirect("/develop/dashboard");
    }

    if (req.user.role === "client") {
      return res.redirect("/client/dashboard");
    }

    res.redirect("/auth");
  }
);
router.post("/register/develop", createDeveloper);
router.post("/register/client", createClient);

export default router;
