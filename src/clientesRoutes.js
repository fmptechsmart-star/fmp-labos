const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware de validación para la creación de un cliente
const validarCliente = (req, res, next) => {
    const { nombre, identificacion, tipo_cliente, lopdp_aceptada } = req.body;

    if (!nombre || !identificacion || !tipo_cliente) {
        return res.status(400).json({ error: 'Los campos nombre, identificacion y tipo_cliente son obligatorios.' });
    }

    // 1. Validar que el campo exista
    if (lopdp_aceptada === undefined) {
        return res.status(400).json({ error: 'El campo lopdp_aceptada es obligatorio.' });
    }

    // 2. Validar que el campo sea un booleano
    if (typeof lopdp_aceptada !== 'boolean') {
        return res.status(400).json({ error: 'El campo lopdp_aceptada debe ser un valor booleano (true o false).' });
    }

    // 3. Validar que el usuario haya aceptado explícitamente (true)
    if (lopdp_aceptada !== true) {
        return res.status(400).json({ error: 'Debe aceptar la LOPDP para continuar.' });
    }

    // Si pasa todas las validaciones, continuamos al controlador
    next();
};

// Endpoint para crear un nuevo cliente
router.post('/', validarCliente, (req, res) => {
    const { nombre, identificacion, tipo_cliente, lopdp_aceptada } = req.body;
    
    // El campo en la base de datos es 'aceptacion_lopdp'
    const query = `INSERT INTO clientes (nombre, identificacion, tipo_cliente, aceptacion_lopdp) VALUES (?, ?, ?, ?)`;
    const values = [nombre, identificacion, tipo_cliente, lopdp_aceptada];

    db.run(query, values, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Ya existe un cliente con esta identificación.' });
            }
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).json({ error: 'Error interno al registrar el cliente.' });
        }
        
        res.status(201).json({ 
            message: 'Cliente registrado exitosamente.',
            cliente: {
                id: this.lastID,
                nombre,
                identificacion,
                tipo_cliente,
                lopdp_aceptada
            }
        });
    });
});

module.exports = router;