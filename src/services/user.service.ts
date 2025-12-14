import { prisma } from "../db/prisma";

import { comparePassword, generateToken, hashPassword } from "../lib/jwt";

import { CustomError } from "../middleware/errorHandler";

const ensureUniqueUserId = async (baseUserId: string): Promise<string> => {
  let userId = baseUserId;

  let counter = 1;

  while (await prisma.user.findUnique({ where: { userId } })) {
    userId = `${baseUserId}-${counter}`;
    counter++;
  }

  return userId;
};

export interface RegisterUserData {
  fullName: string;
  fatherName: string;
  city: string;
  state: string;
  currentAddress: string;
  pincode: string;
  phoneNumber: string;
  email: string;
  aadharNumber: string;
  panNumber: string;
  dateOfBirth: Date;
  referralId?: string | null;
  nomineeName?: string | null;
  nomineeRelation?: string | null;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}

const generateUserId = (
  city: string,
  pincode: string,
  phoneNumber: string
): string => {
  const cityInitials = city.substring(0, 2).toUpperCase();

  const lastFourDigits = phoneNumber.slice(-4);

  return `${cityInitials}-${pincode}-${lastFourDigits}`;
};

export const registerUser = async (
  data: RegisterUserData
): Promise<{
  user: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  token: string;
}> => {
  const existingEmail = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingEmail) {
    throw new CustomError("Email already registered", 400);
  }

  const existingPhone = await prisma.user.findUnique({
    where: { phoneNumber: data.phoneNumber },
  });
  if (existingPhone) {
    throw new CustomError("Phone number already registered", 400);
  }

  const existingAadhar = await prisma.user.findUnique({
    where: { aadharNumber: data.aadharNumber },
  });
  if (existingAadhar) {
    throw new CustomError("Aadhar number already registered", 400);
  }

  const existingPan = await prisma.user.findUnique({
    where: { panNumber: data.panNumber },
  });
  if (existingPan) {
    throw new CustomError("PAN number already registered", 400);
  }

  if (data.referralId) {
    const referrer = await prisma.user.findUnique({
      where: { userId: data.referralId },
    });
    if (!referrer) {
      throw new CustomError("Invalid referral ID", 400);
    }
  }

  const baseUserId = generateUserId(data.city, data.pincode, data.phoneNumber);

  const userId = await ensureUniqueUserId(baseUserId);

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      userId,
      fullName: data.fullName,
      fatherName: data.fatherName,
      city: data.city,
      state: data.state,
      currentAddress: data.currentAddress,
      pincode: data.pincode,
      phoneNumber: data.phoneNumber,
      email: data.email,
      aadharNumber: data.aadharNumber,
      panNumber: data.panNumber,
      dateOfBirth: data.dateOfBirth,
      referralId: data.referralId || null,
      nomineeName: data.nomineeName || null,
      nomineeRelation: data.nomineeRelation || null,
      password: hashedPassword,
      isActive: true,
    },
    select: {
      id: true,
      userId: true,
      fullName: true,
      email: true,
      phoneNumber: true,
    },
  });

  const token = generateToken(user.id, user.userId, user.email);

  return { user, token };
};

export const loginUser = async (
  data: LoginUserData
): Promise<{
  user: {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  token: string;
}> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new CustomError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new CustomError("User account is inactive", 401);
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    throw new CustomError("Invalid email or password", 401);
  }

  const token = generateToken(user.id, user.userId, user.email);

  return {
    user: {
      id: user.id,
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
    token,
  };
};

export interface BankDetailsData {
  bankName: string;
  accountHolderName: string;
  ifsc: string;
  branchName: string;
  accountNumber: string;
}

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      bankDetails: true,
    },
  });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return user;
};

export const addBankDetails = async (
  userId: string,
  data: BankDetailsData
): Promise<{
  id: string;
  bankName: string;
  accountHolderName: string;
  ifsc: string;
  branchName: string;
  accountNumber: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const existingBankDetails = await prisma.bankDetails.findUnique({
    where: { userId },
  });

  if (existingBankDetails) {
    throw new CustomError(
      "Bank details already exist. Use update endpoint instead.",
      400
    );
  }

  const bankDetails = await prisma.bankDetails.create({
    data: {
      bankName: data.bankName,
      accountHolderName: data.accountHolderName,
      ifsc: data.ifsc.toUpperCase(),
      branchName: data.branchName,
      accountNumber: data.accountNumber,
      userId,
    },
  });

  return bankDetails;
};

export const updateBankDetails = async (
  userId: string,
  data: BankDetailsData
): Promise<{
  id: string;
  bankName: string;
  accountHolderName: string;
  ifsc: string;
  branchName: string;
  accountNumber: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  const existingBankDetails = await prisma.bankDetails.findUnique({
    where: { userId },
  });

  if (!existingBankDetails) {
    throw new CustomError(
      "Bank details not found. Use add endpoint instead.",
      404
    );
  }

  const bankDetails = await prisma.bankDetails.update({
    where: { userId },
    data: {
      bankName: data.bankName,
      accountHolderName: data.accountHolderName,
      ifsc: data.ifsc.toUpperCase(),
      branchName: data.branchName,
      accountNumber: data.accountNumber,
    },
  });

  return bankDetails;
};
