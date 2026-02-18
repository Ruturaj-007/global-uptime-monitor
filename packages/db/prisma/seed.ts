import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { getPrismaClient } from "../src";

const USER_ID = "1"; // using 1 since that's what you created in Prisma Studio

async function seed() {
    const prismaClient = getPrismaClient();

    const website = await prismaClient.website.create({
        data: {
            url: "https://test.com",
            userId: USER_ID
        }
    })


    const validator = await prismaClient.validator.create({
        data: {
            publicKey: "0x12341223123",
            location: "Delhi",
            ip: "127.0.0.1",
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            status: "GOOD",
            createdAt: new Date(),
            latency: 100,
            validatorId: validator.id
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            status: "GOOD",
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
            latency: 100,
            validatorId: validator.id
        }
    })

    await prismaClient.websiteTick.create({
        data: {
            websiteId: website.id,
            status: "BAD",
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            latency: 100,
            validatorId: validator.id
        }
    })

    console.log("Seeded successfully!");
}

seed();