const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // para servir los HTML y JS

// Conexión SQLite
const db = new sqlite3.Database("base_datos.db", (err) => {
    if (err) {
        console.error("❌ Error conectando a SQLite:", err.message);
    } else {
        console.log("✅ Conectado a SQLite (base_datos.db)");
    }
});

// Crear tablas si no existen
db.run(`CREATE TABLE IF NOT EXISTS candidatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT UNIQUE,
    cargo TEXT,
    votos INTEGER DEFAULT 0
)`);

db.run(`CREATE TABLE IF NOT EXISTS votos_blanco (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cargo TEXT,
    votos INTEGER DEFAULT 0
)`);

db.run(`CREATE TABLE IF NOT EXISTS historial_votos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT UNIQUE
)`);

// 📌 Ruta para obtener candidatos
app.get("/candidatos", (req, res) => {
    db.all("SELECT * FROM candidatos", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ mensaje: "Error al obtener candidatos" });
        }
        res.json(rows);
    });
});

// 📌 Ruta para votar por un candidato
app.post("/votar/:id", (req, res) => {
    const { id } = req.params;
    const { usuario } = req.body;

    if (!usuario) {
        return res.status(400).json({ mensaje: "Usuario requerido para votar" });
    }

    // Verificar si ya votó
    db.get("SELECT * FROM historial_votos WHERE usuario = ?", [usuario], (err, row) => {
        if (row) {
            return res.status(400).json({ mensaje: "Ya has votado" });
        }

        // Sumar voto
        db.run("UPDATE candidatos SET votos = votos + 1 WHERE id = ?", [id], function (err) {
            if (err) {
                return res.status(500).json({ mensaje: "Error al registrar voto" });
            }

            // Guardar historial
            db.run("INSERT INTO historial_votos (usuario) VALUES (?)", [usuario]);
            res.json({ mensaje: "Voto registrado correctamente" });
        });
    });
});

// 📌 Ruta para votar en blanco
app.post("/votar-blanco", (req, res) => {
    const { usuario, cargo } = req.body;

    if (!usuario || !cargo) {
        return res.status(400).json({ mensaje: "Usuario y cargo son requeridos" });
    }

    // Verificar si ya votó
    db.get("SELECT * FROM historial_votos WHERE usuario = ?", [usuario], (err, row) => {
        if (row) {
            return res.status(400).json({ mensaje: "Ya has votado en esta elección" });
        }

        // Sumar voto en blanco
        db.run(
            "INSERT INTO votos_blanco (cargo, votos) VALUES (?, 1) ON CONFLICT(cargo) DO UPDATE SET votos = votos + 1",
            [cargo],
            function (err) {
                if (err) {
                    return res.status(500).json({ mensaje: "Error al registrar voto en blanco" });
                }

                // Guardar historial
                db.run("INSERT INTO historial_votos (usuario) VALUES (?)", [usuario]);
                res.json({ mensaje: "Voto en blanco registrado" });
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en https://pag-personeria-1.onrender.com${PORT}`);
});
