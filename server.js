const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Conexión a SQLite
const db = new sqlite3.Database(path.join(__dirname, "base_datos.db"), (err) => {
    if (err) {
        console.error("❌ Error al conectar con SQLite:", err.message);
    } else {
        console.log("✅ Conexión exitosa a SQLite");
    }
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS candidatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    foto TEXT,
    cargo TEXT NOT NULL,
    propuestas TEXT,
    votos INTEGER DEFAULT 0
)`);

// Ruta para obtener todos los candidatos
app.get("/candidatos", (req, res) => {
    db.all("SELECT * FROM candidatos", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener candidatos" });
        }
        res.json(rows);
    });
});

// Ruta para agregar un nuevo candidato
app.post("/postular", (req, res) => {
    const { nombre, email, foto, cargo, propuestas } = req.body;

    if (!nombre || !email || !cargo || !propuestas) {
        return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
    }

    const sql = `INSERT INTO candidatos (nombre, email, foto, cargo, propuestas, votos) VALUES (?, ?, ?, ?, ?, 0)`;
    db.run(sql, [nombre, email, foto, cargo, propuestas], function (err) {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return res.status(400).json({ mensaje: "Este email ya está registrado" });
            }
            return res.status(500).json({ mensaje: "Error al guardar candidato" });
        }
        res.json({ mensaje: "Postulación registrada con éxito" });
    });
});

// Servir index.html por defecto
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "proyecto", "index.html"));
});
app.get(path.join(__dirname, "proyecto"));

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
