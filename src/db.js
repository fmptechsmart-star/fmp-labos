// db.js - Conexión y configuración de SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Definimos la ruta de la base de datos
const dbPath = path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite en:', dbPath);
    }
});

// Crear tablas automáticamente al iniciar
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        identificacion TEXT UNIQUE,
        tipo_cliente TEXT,
        aceptacion_lopdp BOOLEAN
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ordenes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER,
        estado TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;