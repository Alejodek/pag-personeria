const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: 'localhost',         // o IP si es remoto
  user: 'tu_usuario',        // ← el mismo que en HeidiSQL
  password: 'tu_contraseña', // ← tu contraseña
  database: 'votaciones'     // ← la base de datos que creaste
});

conexion.connect((err) => {
    if (err) {
    console.error('❌ Error al conectar:', err.message);
    return;
}
console.log('✅ Conexión exitosa a la base de datos');
  conexion.end(); // Cerramos conexión
});
