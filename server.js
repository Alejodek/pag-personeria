//prueba gitub 

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(require("cors")());
app.use(express.static(__dirname + "/proyecto"));
app.use(express.static(path.join(__dirname, 'proyecto')));

const db = new sqlite3.Database(path.join(__dirname, 'base_datos.db'), err => {
if (err) {
    console.error('❌ Error al conectar a SQLite:', err.message);
} else {
    console.log('✅ Conexión exitosa a SQLite');
    db.run(`
    CREATE TABLE IF NOT EXISTS candidatos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT,
        email TEXT UNIQUE,
        foto TEXT,
        cargo TEXT,
        propuestas TEXT,
        total_votos INTEGER DEFAULT 0
    )
    `);
    db.run(`
    CREATE TABLE IF NOT EXISTS votos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        candidato_id INTEGER,
        FOREIGN KEY(candidato_id) REFERENCES candidatos(id)
    )
    `);
}
});


app.get('/candidatos', (req, res) => {
  db.all('SELECT * FROM candidatos', [], (err, rows) => {
    if (err) return res.status(500).json({ mensaje: 'Error al obtener candidatos' });
    res.json(rows);
});
});

app.post('/postular', (req, res) => {
    const { nombre, email, foto, cargo, propuestas } = req.body;
    const stmt = db.prepare(
    'INSERT INTO candidatos (nombre, email, foto, cargo, propuestas) VALUES (?, ?, ?, ?, ?)'
);
stmt.run([nombre, email, foto, cargo, propuestas], function(err) {
    if (err) return res.status(400).json({ mensaje: '⚠️ Ya existe una postulación con ese correo' });
    res.json({ mensaje: '✅ Postulación guardada correctamente' });
    });
});

app.listen(3000, () => {
    console.log("✅ Conectado a SQLite (base_datos.db)");
    console.log("🚀 Servidor escuchando en http://localhost:3000");
});

app.post('/votar', (req, res) => {
const { candidato } = req.body;
db.run(
    'UPDATE candidatos SET total_votos = total_votos + 1 WHERE nombre = ?',
    [candidato],
    function(err) {
    if (err || this.changes === 0) return res.status(400).json({ mensaje: '❌ Error al votar' });
    res.json({ mensaje: `✅ Voto registrado para ${candidato}` });
    }
);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
