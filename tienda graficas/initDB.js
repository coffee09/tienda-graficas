const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/tiendagraficas.db');

// Crear tablas en la base de datos
const createTables = () => {
  db.serialize(() => {
    // Crear tabla de productos
    db.run(`CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marca TEXT,
      modelo TEXT,
      precio DECIMAL,
      stock INTEGER
    )`);

    // Crear tabla de ventas
    db.run(`CREATE TABLE IF NOT EXISTS ventas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_producto INTEGER,
      cantidad INTEGER,
      total DECIMAL,
      fecha DATETIME,
      FOREIGN KEY(id_producto) REFERENCES productos(id) -- Relacionar con productos
    )`);

    // Crear tabla de proveedores
    db.run(`CREATE TABLE IF NOT EXISTS proveedores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      telefono TEXT,
      correo TEXT,
      direccion TEXT
    )`);

    // Crear tabla de clientes
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      email TEXT,
      telefono TEXT
    )`);

    // Crear tabla de categorías
    db.run(`CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT
    )`);

    // Crear tabla de detalles de ventas
    db.run(`CREATE TABLE IF NOT EXISTS ventas_detalles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_venta INTEGER,
      id_producto INTEGER,
      cantidad INTEGER,
      FOREIGN KEY(id_venta) REFERENCES ventas(id),
      FOREIGN KEY(id_producto) REFERENCES productos(id)
    )`);

    // Crear tabla de pagos
    db.run(`CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_venta INTEGER,
      monto DECIMAL,
      metodo_pago TEXT,
      FOREIGN KEY(id_venta) REFERENCES ventas(id)
    )`);

    // Crear tabla de devoluciones
    db.run(`CREATE TABLE IF NOT EXISTS devoluciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_venta INTEGER,
      id_producto INTEGER,
      cantidad INTEGER,
      FOREIGN KEY(id_venta) REFERENCES ventas(id),
      FOREIGN KEY(id_producto) REFERENCES productos(id)
    )`);

    // Crear tabla de promociones
    db.run(`CREATE TABLE IF NOT EXISTS promociones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      descuento DECIMAL
    )`);

    // Crear tabla de registros de usuarios
    db.run(`CREATE TABLE IF NOT EXISTS registros_usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre_usuario TEXT,
      password TEXT
    )`);
  });
};

// Llamada a la función para crear las tablas
createTables();

// Log para confirmar la creación de las tablas
console.log('Tablas creadas con éxito!');

// Cerrar la base de datos
db.close();
