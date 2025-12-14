import { Router } from "express";

import {
  register,
  login,
  getProfile,
  addBankDetailsController,
  updateBankDetailsController,
} from "../controller/user.controller";

import {
  loginValidation,
  registerValidation,
  bankDetailsValidation,
} from "../auth/validation";

import { validate } from "../lib/validator";

import { authMiddleware } from "../auth/middleware";

const router = Router();

router.post("/register", validate(registerValidation), register);

router.post("/login", validate(loginValidation), login);

router.get("/profile", authMiddleware, getProfile);

router.post(
  "/bank-details",
  authMiddleware,
  validate(bankDetailsValidation),
  addBankDetailsController
);

router.put(
  "/bank-details",
  authMiddleware,
  validate(bankDetailsValidation),
  updateBankDetailsController
);

export default router;
