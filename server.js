const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use(express.static(path.join(__dirname, "proyecto")));

const db = new sqlite3.Database(path.join(__dirname, "base_datos.db"), (err) => {
    if (err) {
        console.error("❌ Error al conectar con SQLite:", err.message);
    } else {
        console.log("✅ Conexión exitosa a SQLite (base_datos.db)");

        // Verificar tablas
        db.all(`SELECT name FROM sqlite_master WHERE type='table'`, [], (err, rows) => {
            if (err) console.error("❌ Error al leer tablas:", err.message);
            else console.log("📋 Tablas encontradas:", rows);
        });
    }
});

app.get("/candidatos", (req, res) => {
    db.all("SELECT * FROM candidatos", [], (err, rows) => {
        if (err) {
            console.error("❌ Error al obtener candidatos:", err.message);
            res.status(500).json({ error: "Error al obtener candidatos" });
        } else {
            res.json(rows);
        }
    });
});

app.post("/postular", (req, res) => {
    const { nombre, email, foto, cargo, propuestas } = req.body;

    if (!nombre || !email || !cargo || !propuestas) {
        return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }
    db.get(`SELECT * FROM candidatos WHERE email = ?`, [email], (err, row) => {
        if (err) {
            console.error("❌ Error en consulta:", err.message);
            return res.status(500).json({ mensaje: "Error en el servidor" });
        }
        if (row) {
            return res.status(400).json({ mensaje: "Ya existe un candidato con este correo" });
        }

        db.run(
            `INSERT INTO candidatos (nombre, email, foto, cargo, propuestas, votos) VALUES (?, ?, ?, ?, ?, 0)`,
            [nombre, email, foto, cargo, propuestas],
            function (err) {
                if (err) {
                    console.error("❌ Error al insertar:", err.message);
                    return res.status(500).json({ mensaje: "Error al guardar candidato" });
                }
                res.json({ mensaje: "✅ Candidato registrado con éxito" });
            }
        );
    });
});

app.post("/votar/:id", (req, res) => {
    const id = req.params.id;
    db.run(`UPDATE candidatos SET votos = votos + 1 WHERE id = ?`, [id], function (err) {
        if (err) {
            console.error("❌ Error al votar:", err.message);
            res.status(500).json({ mensaje: "Error al votar" });
        } else {
            res.json({ mensaje: "✅ Voto registrado" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
