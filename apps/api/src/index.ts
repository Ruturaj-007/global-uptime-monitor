import express from "express";
import { authMiddleware } from "./middleware.js";
import { prismaClient } from "db/client"

const app = express();
app.use(express.json())

// * CREATE WEBSITE
// User registers a website to monitor & ownership is enforced via userId website url will be saved and 
// it will be attach to logged-in user 
app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;
  
  const data = await prismaClient.website.create({
    data: {
      userId,
      url
    }
  })

  res.json({
    id: data.id
  })
})

// * GET WEBSITE STATUS
// Checks website is down or not and returns health of the website
app.get("/api/v1/website/status", authMiddleware,  async(req, res) => {
  const websiteId = req.query.websiteId! as unknown as string;
  const userId = req.userId;

  const data = await prismaClient.website.findFirst({
    where: {
      id: websiteId,
      userId,
      disabled: false   // (Soft delete) If user deleted website → don’t show it anymore But we don’t delete data from DB
    },
    include: {
      ticks: true
    }
  })

  res.json(data)
})

// * LIST ALL WEBSITES
// Shows active website of the user deleted websites stay hidden 
app.get("/api/v1/websites", authMiddleware,  async (req, res) => {
    const userId = req.userId!;

    const websites = await prismaClient.website.findMany({
      where: {
        userId,
        disabled: false   // Means website is active 
      }
    })

    res.json({
      websites
    })
})

// * STOP MONITORING WEBSITE
// Useful to recover data later helpful to analyze downtime
app.delete("/api/v1/website/", authMiddleware, async (req, res)=> {
  const websiteId = req.body.websiteId;
  const userId = req.userId!;

  await prismaClient.website.update({
    where: {
      id: websiteId,
      userId
    },
    data:{
      disabled: true
    }
  })

  res.json({
    message: "Deleted website successfully"
  })
})

app.listen(3000, () => {
  console.log("API running on port 3000");
});
