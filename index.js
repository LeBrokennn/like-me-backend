const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  password: "1234",
  database: "likeme",
  port: 5432
});

app.get("/posts", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM posts ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los posts");
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { titulo, img, descripcion } = req.body;

    const consulta = `
      INSERT INTO posts (titulo, img, descripcion, likes)
      VALUES ($1, $2, $3, 0)
      RETURNING *
    `;

    const values = [titulo, img, descripcion];

    const { rows } = await pool.query(consulta, values);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el post");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
