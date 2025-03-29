/* const jsonServer = require('json-server')

const server = jsonServer.create()

const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use('/api', router)
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://vasileiosinnovs.github.io/cryptoczar-project-/') // The URL you put here is for the web application that you have deployed using Github Pages
    res.header('Access-Control-Allow-Headers', '*')
    next()
})
server.listen(process.env.PORT || 5000, () => {
    console.log('JSON Server is running')
}) */

    require("dotenv").config();
    const jsonServer = require("json-server");
    const express = require("express");
    const axios = require("axios");
    const cors = require("cors");
    
    const API_KEY = process.env.add4c8b134724a6d9ebd90930a86980b; 
    const PORT = process.env.PORT || 5000;
    
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    const router = jsonServer.router("db.json");
    const middlewares = jsonServer.defaults();
    app.use(middlewares);
    app.use("/api", router);
    
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "https://vasileiosinnovs.github.io/cryptoczar-project-/"); 
        res.header("Access-Control-Allow-Headers", "*");
        next();
    });
    
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

    app.get("/crypto-data", async (req, res) => {
        try {
          const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: { vs_currency: "usd", order: "market_cap_desc", per_page: 10, page: 1 },
          });
          res.json(response.data);
        } catch (error) {
          res.status(500).json({ error: "Failed to fetch data" });
        }
      });
      
    app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
    