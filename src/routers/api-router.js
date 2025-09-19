import { Router } from "express";

import contractorRouter from "./api/contractor-router.js";
import developerRouter from "./api/developer-router.js";

const router = Router();
const vesion1 = Router();

router.use("/v1", vesion1);

vesion1.use("/contractors", contractorRouter);
vesion1.use("/developers", developerRouter);

export default router;
