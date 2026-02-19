"use client";
import { API_BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";

interface Website {
    id: string;
    url: string;
    ticks: {
        id: string;
        createdAt: string;
        status: string;
        latency: number;
    }[];
}

export function useWebsites() {
    const { getToken, isSignedIn, isLoaded } = useAuth();
    const [websites, setWebsites] = useState<Website[]>([]);

    async function refreshWebsites() {
        const token = await getToken();
        console.log("useWebsites token:", token); // add this

        if (!token) {
            console.error("No token available");
            return;
        }

        const response = await axios.get(`${API_BACKEND_URL}/api/v1/websites`, {
            headers: {
                Authorization: token,
            },
        });

        setWebsites(response.data.websites);
    }

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return;

        refreshWebsites();

        const interval = setInterval(() => {
            refreshWebsites();
        }, 1000 * 60 * 1);

        return () => clearInterval(interval);
    }, [isLoaded, isSignedIn]);

    return { websites, refreshWebsites };
}