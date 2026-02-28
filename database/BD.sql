use seguritygaby;
-- Tabla para gestionar usuarios (Admin y Clientes)
CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('Admin', 'Cliente') NOT NULL,
    intentos_fallidos INT DEFAULT 0,
    fecha_bloqueo DATETIME NULL
);

-- Tabla para categorías de productos
CREATE TABLE Categoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de productos
CREATE TABLE Producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    stock INT NOT NULL DEFAULT 0,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_url VARCHAR(255),
    estado ENUM('visible', 'oculto') DEFAULT 'visible',
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES Categoria(id)
);

-- Tabla para el carrito (asociado a un cliente)
CREATE TABLE Carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    FOREIGN KEY (cliente_id) REFERENCES Usuario(id)
);

-- Detalle del carrito
CREATE TABLE DetalleCarrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    carrito_id INT,
    producto_id INT,
    cantidad INT NOT NULL,
    FOREIGN KEY (carrito_id) REFERENCES Carrito(id),
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);

-- Lista de deseos
CREATE TABLE ListaDeseos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    producto_id INT,
    FOREIGN KEY (cliente_id) REFERENCES Usuario(id),
    FOREIGN KEY (producto_id) REFERENCES Producto(id)
);

-- Ventas
CREATE TABLE Venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('activa', 'anulada') DEFAULT 'activa',
    FOREIGN KEY (cliente_id) REFERENCES Usuario(id)
);

-- Justificación de anulación
CREATE TABLE JustificacionAnulacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT,
    admin_id INT,
    motivo TEXT NOT NULL,
    fecha_anulacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (venta_id) REFERENCES Venta(id),
    FOREIGN KEY (admin_id) REFERENCES Usuario(id)
);