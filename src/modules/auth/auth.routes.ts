import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post('/signUp', authController.signUp);
// router.post('/signIn', )

export const authRoutes = router;