const express = require('express');
const app = express();
const db = require('./db'); 
const clientesRoutes = require('./clientesRoutes'); // Como app y clientesRoutes están en 'src', esto DEBE funcionar

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Servidor OK" });
});

app.use('/api/clientes', clientesRoutes);

app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});