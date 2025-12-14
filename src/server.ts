import express from "express";

import cors from "cors";

import userRoutes from "../src/routes/user.routes";

import app from "./config/express.config";

import { env } from "./config/env.config";

import { notFound } from "./middleware/notFound";

import "./config/env.config";

import { errorHandler } from "./middleware/errorHandler";

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get("/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use(notFound);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
