import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
    jwksUri: "https://funny-garfish-74.clerk.accounts.dev/.well-known/jwks.json",
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
            callback(err ?? new Error("No key found"), undefined);
            return;
        }
        callback(null, key.getPublicKey());
    });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err || !decoded || typeof decoded === 'string' || !decoded.sub) {
            console.error("JWT verification failed:", err?.message);
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userId = decoded.sub as string;
        next();
    });
}