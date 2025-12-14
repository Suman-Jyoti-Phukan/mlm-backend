import { ValidationChain, validationResult } from "express-validator";

import { CustomError } from "../middleware/errorHandler";

import { Request, Response, NextFunction } from "express";

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new CustomError(
          errors
            .array()
            .map((err) => err.msg)
            .join(", "),
          400
        )
      );
    }
    next();
  };
};
