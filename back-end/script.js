import express from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({ origin: "http://127.0.0.1:5500"}))
app.use(express.json())


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Route test Neon DB : SELECT * FROM menu
app.get("/menu-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu");
    res.json(result.rows);
  } catch (error) {
    // console.error("Erreur Neon DB:", error);
    res.status(500).json({ error: "impossible de récupérer les menus depuis la base Neon", details: error.message, code: error.code });
  }
});
// route pour créer une commande et l'insérer dans la table orders
app.post("/orders-db", async (req, res) => {
  const { menu_id, client_name } = req.body;
  if (!menu_id || !client_name) {
    return res.status(400).json({ error: "menu_id et client_name sont requis" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO orders (menu_id, client_name) VALUES ($1, $2) RETURNING *",
      [menu_id, client_name]
    );
    res.status(201).json({ ok: true, order: result.rows[0] });
  } catch (error) {
    console.error("Erreur Neon DB (POST /orders-db):", error);
    res.status(500).json({ error: "Impossible d'enregistrer la commande", details: error.message });
  }
});

app.listen(3000, () => {  console.log("Serveur lancé sur http://localhost:3000");});
