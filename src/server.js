require("dotenv").config();
const jsonServer = require("json-server");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const API_KEY = process.env.NEWS_API_KEY; 
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors(/* {
    origin: ["http://127.0.0.1:5500", "https://vasileiosinnovs.github.io/cryptoczar-project-"],
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type"]
} */));
app.use(express.json());

const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
app.use(middlewares);
app.use("/api", router);

app.get("/crypto-news", async (req, res) => {
    try {
        const response = await axios.get("https://newsapi.org/v2/everything", {
            params: {
                q: "bitcoin OR ethereum OR dogecoin OR solana OR tether OR cryptocurrency",
                pageSize: 10,
                apiKey: API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching news" });
    }
});

let cachedExchangeRates = null;
let lastFetchTime = 0;
let cachedCryptoData = null;
let lastCryptoFetch = 0;
const CACHE_TIME = 5 * 60 * 1000; 


app.get("/crypto-data", async (req, res) => {
    const now = Date.now();
    if (cachedCryptoData && now - lastCryptoFetch < CACHE_TIME) {
        console.log("Serving cached crypto data");
        return res.json(cachedCryptoData);
    }

    try {
        console.log("Fetching fresh crypto data...");
        const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 },
        });

        cachedCryptoData = response.data;
        lastCryptoFetch = now;
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching crypto data:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch crypto data" });
    }
});

app.get("/supported-currencies", async (req, res) => {
    try {
        console.log("Fetching supported currencies...");
        const response = await axios.get("https://api.coingecko.com/api/v3/simple/supported_vs_currencies");
        
        console.log("Supported currencies received:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching supported currencies:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch supported currencies" });
    }
});

  
app.get("/exchange_rates", async (req, res) => {
    const now = Date.now();
    if (cachedExchangeRates && now - lastRatesFetch < CACHE_TIME) {
        console.log("Serving cached exchange rates");
        return res.json(cachedExchangeRates);
    }

    try {
        console.log("Fetching fresh exchange rates...");
        const response = await axios.get("https://api.coingecko.com/api/v3/exchange_rates");

        cachedExchangeRates = response.data;
        lastRatesFetch = now;
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching exchange rates:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
});

app.get("/exchange_rates", async (req, res) => {
    const now = Date.now();
    
    if (cachedExchangeRates && now - lastFetchTime < CACHE_TIME) {
        return res.json(cachedExchangeRates);
    }

    try {
        const response = await axios.get("https://api.coingecko.com/api/v3/exchange_rates");
        cachedExchangeRates = response.data;
        lastFetchTime = now;
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching exchange rates:", error.message);
        res.status(500).json({ error: "Failed to fetch exchange rates" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    