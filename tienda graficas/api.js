const express = require('express');
const router = express.Router();
const db = require('./db');  // Conexión a la base de datos SQLite

// Ruta para obtener todos los productos en inventario
router.get('/inventario', (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener el inventario:', err);
      return res.status(500).send('Error al obtener el inventario');
    }
    res.json(rows);
  });
});

// Ruta para registrar una venta
router.post('/ventas', (req, res) => {
  const { id_producto, cantidad_vendida, total } = req.body;

  // Verificar si hay suficiente stock
  db.get('SELECT stock FROM productos WHERE id = ?', [id_producto], (err, producto) => {
    if (err) {
      console.error('Error al verificar stock:', err);
      return res.status(500).send('Error al verificar stock');
    }

    if (producto.stock < cantidad_vendida) {
      return res.status(400).send('No hay suficiente stock');
    }

    // Actualizar el stock
    const nuevoStock = producto.stock - cantidad_vendida;
    db.run('UPDATE productos SET stock = ? WHERE id = ?', [nuevoStock, id_producto], function(err) {
      if (err) {
        console.error('Error al actualizar el stock:', err);
        return res.status(500).send('Error al actualizar el stock');
      }

      // Registrar la venta
      const sqlVenta = 'INSERT INTO ventas (id_producto, cantidad_vendida, total, fecha) VALUES (?, ?, ?, ?)';
      const paramsVenta = [id_producto, cantidad_vendida, total, new Date()];

      db.run(sqlVenta, paramsVenta, function(err) {
        if (err) {
          console.error('Error al registrar la venta:', err);
          return res.status(500).send('Error al registrar la venta');
        }
        res.status(201).json({ message: 'Venta registrada con éxito', id: this.lastID });
      });
    });
  });
});

module.exports = router;
