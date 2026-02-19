import "./env.js";

import express from "express";
import { authMiddleware } from "./middleware.js";
import { getPrismaClient } from "db/client";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

// CREATE WEBSITE
app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const prismaClient = getPrismaClient();
  const userId = req.userId!;
  const { url } = req.body;

  await prismaClient.user.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId },
  });

  const data = await prismaClient.website.create({
    data: { url, userId },
  });

  res.json({ id: data.id });
});

// GET WEBSITE STATUS
app.get("/api/v1/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId as string;
  const prismaClient = getPrismaClient();
  const userId = req.userId;

  const data = await prismaClient.website.findFirst({
    where: { id: websiteId, userId, disabled: false },
    include: { ticks: true },
  });

  res.json(data);
});

// LIST ALL WEBSITES
app.get("/api/v1/websites", authMiddleware, async (req, res) => {
  const prismaClient = getPrismaClient();
  const userId = req.userId!;

  const websites = await prismaClient.website.findMany({
    where: { userId, disabled: false },
    include: { ticks: true },
  });

  res.json({ websites });
});

// STOP MONITORING WEBSITE
app.delete("/api/v1/website/", authMiddleware, async (req, res) => {
  const websiteId = req.body.websiteId;
  const prismaClient = getPrismaClient();
  const userId = req.userId!;

  await prismaClient.website.update({
    where: { id: websiteId, userId },
    data: { disabled: true },
  });

  res.json({ message: "Deleted website successfully" });
});

app.listen(8080, () => {
  console.log("API running on port 8080");
});