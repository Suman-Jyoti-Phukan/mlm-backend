import { Request, Response, NextFunction } from "express";

import {
  registerUser,
  loginUser,
  getUserProfile,
  addBankDetails,
  updateBankDetails,
} from "../services/user.service";

import { asyncHandler } from "../middleware/errorHandler";

import { AuthRequest } from "../auth/middleware";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser({
    fullName: req.body.fullName,
    fatherName: req.body.fatherName,
    city: req.body.city,
    state: req.body.state,
    currentAddress: req.body.currentAddress,
    pincode: req.body.pincode,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    aadharNumber: req.body.aadharNumber,
    panNumber: req.body.panNumber,
    dateOfBirth: new Date(req.body.dateOfBirth),
    referralId: req.body.referralId || null,
    nomineeName: req.body.nomineeName || null,
    nomineeRelation: req.body.nomineeRelation || null,
    password: req.body.password,
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser({
    email: req.body.email,
    password: req.body.password,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const getProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const profile = await getUserProfile(req.user.id);

    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: profile,
    });
  }
);

export const addBankDetailsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const result = await addBankDetails(req.user.id, {
      bankName: req.body.bankName,
      accountHolderName: req.body.accountHolderName,
      ifsc: req.body.ifsc,
      branchName: req.body.branchName,
      accountNumber: req.body.accountNumber,
    });

    res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      data: result,
    });
  }
);

export const updateBankDetailsController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw new Error("User not authenticated");
    }

    const result = await updateBankDetails(req.user.id, {
      bankName: req.body.bankName,
      accountHolderName: req.body.accountHolderName,
      ifsc: req.body.ifsc,
      branchName: req.body.branchName,
      accountNumber: req.body.accountNumber,
    });

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: result,
    });
  }
);
