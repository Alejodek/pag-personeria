const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "proyecto", "index.html"));
});

app.use(express.static(path.join(__dirname, "proyecto")));

const db = new sqlite3.Database(path.join(__dirname, "base_datos.db"), (err) => {
    if (err) {
        console.error("❌ Error al conectar con SQLite:", err.message);
    } else {
        console.log("✅ Conectado a la base de datos SQLite.");
    }
});

app.get("/candidatos", (req, res) => {
    db.all("SELECT * FROM candidatos", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener candidatos" });
        }
        res.json(rows);
    });
});

app.post("/votos/:id", (req, res) => {
    const id = req.params.id;
    db.run("UPDATE candidatos SET votos = votos + 1 WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Error al registrar voto" });
        }
        res.json({ mensaje: "Voto registrado correctamente" });
    });
});

app.post("/postular", (req, res) => {
    const { nombre, email, foto, cargo, propuestas } = req.body;
    const sql = `INSERT INTO candidatos (nombre, email, foto, cargo, propuestas, total_votos) VALUES (?, ?, ?, ?, ?, 0)`;
    db.run(sql, [nombre, email, foto, cargo, propuestas], function(err) {
        if (err) return res.status(500).json({ mensaje: "Error al guardar candidato" });
        res.json({ mensaje: "Postulación registrada" });
    });
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
