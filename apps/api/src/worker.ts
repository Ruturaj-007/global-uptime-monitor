import "./env.js";
import { getPrismaClient } from "db/client";
import axios from "axios";

async function checkWebsites() {
    const prismaClient = getPrismaClient();
    
    const websites = await prismaClient.website.findMany({
        where: { disabled: false }
    });

    const validator = await prismaClient.validator.findFirst();
    if (!validator) {
        console.log("No validator found!");
        return;
    }

    for (const website of websites) {
        try {
            const start = Date.now();
            await axios.get(website.url, { timeout: 5000 });
            const latency = Date.now() - start;

            await prismaClient.websiteTick.create({
                data: {
                    websiteId: website.id,
                    validatorId: validator.id,
                    status: "GOOD",
                    latency,
                    createdAt: new Date(),
                }
            });
            console.log(`✅ ${website.url} - ${latency}ms`);
        } catch {
            await prismaClient.websiteTick.create({
                data: {
                    websiteId: website.id,
                    validatorId: validator.id,
                    status: "BAD",
                    latency: 0,
                    createdAt: new Date(),
                }
            });
            console.log(`❌ ${website.url} - DOWN`);
        }
    }
}

// Run every minute
checkWebsites();
setInterval(checkWebsites, 60 * 1000);
console.log("Worker started!");