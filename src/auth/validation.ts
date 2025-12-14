import { body } from "express-validator";

export const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("fatherName")
    .trim()
    .notEmpty()
    .withMessage("Father name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Father name must be between 2 and 100 characters"),
  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),
  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),
  body("currentAddress")
    .trim()
    .notEmpty()
    .withMessage("Current address is required")
    .isLength({ min: 5, max: 200 })
    .withMessage("Current address must be between 5 and 200 characters"),
  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .matches(/^\d{6}$/)
    .withMessage("Pincode must be exactly 6 digits"),
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be exactly 10 digits"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("aadharNumber")
    .trim()
    .notEmpty()
    .withMessage("Aadhar number is required")
    .matches(/^\d{12}$/)
    .withMessage("Aadhar number must be exactly 12 digits"),
  body("panNumber")
    .trim()
    .notEmpty()
    .withMessage("PAN number is required")
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)
    .withMessage("PAN number must be in format: ABCDE1234F"),
  body("dateOfBirth")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      if (age < 18) {
        throw new Error("User must be at least 18 years old");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("referralId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Referral ID cannot be empty if provided"),
  body("nomineeName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nominee name must be between 2 and 100 characters"),
  body("nomineeRelation")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Nominee relation must be between 2 and 50 characters"),
];

export const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password").trim().notEmpty().withMessage("Password is required"),
];

export const bankDetailsValidation = [
  body("bankName")
    .trim()
    .notEmpty()
    .withMessage("Bank name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Bank name must be between 2 and 100 characters"),
  body("accountHolderName")
    .trim()
    .notEmpty()
    .withMessage("Account holder name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Account holder name must be between 2 and 100 characters"),
  body("ifsc")
    .trim()
    .notEmpty()
    .withMessage("IFSC code is required")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/)
    .withMessage("IFSC code must be in format: ABCD0123456"),
  body("branchName")
    .trim()
    .notEmpty()
    .withMessage("Branch name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Branch name must be between 2 and 100 characters"),
  body("accountNumber")
    .trim()
    .notEmpty()
    .withMessage("Account number is required")
    .matches(/^\d{9,18}$/)
    .withMessage("Account number must be between 9 and 18 digits"),
];
