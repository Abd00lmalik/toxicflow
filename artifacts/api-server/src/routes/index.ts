import { Router, type IRouter } from "express";
import healthRouter from "./health";
import diagnosticsRouter from "./diagnostics";
import resolverRouter from "./resolver";
import quoteRouter from "./quote";
import eventsRouter from "./events";
import evidenceRouter from "./evidence";
import demoSetTierRouter from "./demoSetTier";
import keeperhubRouter from "./keeperhub";
import liquidityRouter from "./liquidity";

const router: IRouter = Router();

router.use(healthRouter);
router.use(diagnosticsRouter);
router.use(resolverRouter);
router.use(quoteRouter);
router.use(eventsRouter);
router.use(evidenceRouter);
router.use(demoSetTierRouter);
router.use(keeperhubRouter);
router.use(liquidityRouter);

export default router;
