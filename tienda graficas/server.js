const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./database/tiendagraficas.db');

// Configura Express para servir archivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear los datos del formulario (POST)
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Para manejar solicitudes JSON

// Ruta para la página principal (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Ruta para la página de inventario (inventario.html)
app.get('/inventario', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'inventario.html'));
});

// Ruta para la página de ventas (ventas.html)
app.get('/ventas', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'ventas.html'));
});

// Ruta para la página de proveedores (proveedores.html)
app.get('/proveedores', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'proveedores.html'));
});

// Ruta para registrar venta (registrar_venta.html)
app.get('/registrar_venta', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'registrar_venta.html'));
});

// Ruta para manejar el registro de una venta (POST)
app.post('/registrar_venta', (req, res) => {
  const { producto, cantidad, total } = req.body;

  // Verificar si el producto existe
  const sql = 'SELECT * FROM productos WHERE id = ?';
  db.get(sql, [producto], (err, row) => {
    if (err) {
      console.error('Error al obtener el producto:', err);
      return res.status(500).send('Error al obtener el producto');
    }

    if (!row) {
      return res.status(404).send('Producto no encontrado');
    }

    // Verificar si hay suficiente stock
    if (row.stock < cantidad) {
      return res.status(400).send('No hay suficiente stock');
    }

    // Actualizar el stock después de registrar la venta
    const newStock = row.stock - cantidad;
    const updateSql = 'UPDATE productos SET stock = ? WHERE id = ?';
    db.run(updateSql, [newStock, producto], function (err) {
      if (err) {
        console.error('Error al actualizar el stock:', err);
        return res.status(500).send('Error al actualizar el stock');
      }

      // Insertar la venta en la tabla ventas
      const insertVentaSql = 'INSERT INTO ventas (id_producto, cantidad, total, fecha) VALUES (?, ?, ?, ?)';
      const params = [producto, cantidad, total, new Date()];
      db.run(insertVentaSql, params, function (err) {
        if (err) {
          console.error('Error al registrar la venta:', err);
          return res.status(500).send('Error al registrar la venta');
        }
        res.redirect('/ventas');
      });
    });
  });
});

// API para obtener todas las ventas
app.get('/api/ventas', (req, res) => {
  db.all('SELECT * FROM ventas', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API para registrar una venta
app.post('/api/ventas', (req, res) => {
  const { id_producto, cantidad_vendida, total } = req.body;
  const sql = 'INSERT INTO ventas (id_producto, cantidad, total, fecha) VALUES (?, ?, ?, ?)';
  const params = [id_producto, cantidad_vendida, total, new Date()];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error al registrar la venta:', err);
      return res.status(500).json({ message: 'Error al registrar la venta' });
    }
    res.status(201).json({ id: this.lastID, message: 'Venta registrada correctamente' });
  });
});

// Ruta de cierre de sesión (Logout)
app.get('/logout', (req, res) => {
  res.redirect('/');
});

// Inicia el servidor en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
