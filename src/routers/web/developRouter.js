import { Router } from "express";
import { ensureAuthenticated } from "../../middlewares/authenticator.js";

const router = Router();

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("develop/dashboard");
});

export default router;
