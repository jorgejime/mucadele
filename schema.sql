-- ====================================================================
-- Esquema Oficial Cloudflare D1: mucadele-db
-- Base de datos para Tienda y POS Mucadele Licores (Santa Marta, Colombia)
-- ====================================================================

-- 1. Tabla de Proveedores (Distribuidores de licores)
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  contact_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,
  delivery_days TEXT DEFAULT 'Lunes a Sábado',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Catálogo de Productos e Inventario
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  presentation TEXT DEFAULT 'Unidad',
  category TEXT DEFAULT 'otros',
  imageUrl TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 6,
  reorder_qty INTEGER DEFAULT 12,
  supplier_id INTEGER,
  active INTEGER DEFAULT 1,
  sort_order INTEGER DEFAULT 100,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- 3. Tabla de Órdenes de Compra Automáticas (OC-AUTO) y Manuales
CREATE TABLE IF NOT EXISTS purchase_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  po_number TEXT UNIQUE NOT NULL,
  supplier_id INTEGER,
  supplier_name TEXT NOT NULL,
  supplier_phone TEXT NOT NULL,
  items_json TEXT NOT NULL,
  total_units INTEGER NOT NULL,
  status TEXT DEFAULT 'enviada', -- 'enviada' | 'recibida'
  received_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- 4. Tabla de Domiciliarios y Motorizados
CREATE TABLE IF NOT EXISTS carriers (
  id INTEGER PRIMARY KEY, -- Shipday carrier ID o timestamp local
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  is_default INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabla de Órdenes y Ventas (Tienda Online y POS Mostrador)
CREATE TABLE IF NOT EXISTS orders (
  order_number TEXT PRIMARY KEY,
  shipday_order_id INTEGER,
  order_type TEXT NOT NULL, -- 'delivery' | 'pickup' | 'pos_counter'
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  payment_method TEXT NOT NULL, -- 'efectivo' | 'tarjeta_credito' | 'tarjeta_debito' | 'transferencia' | 'combinado' | 'credito' | 'otros'
  subtotal REAL NOT NULL,
  delivery_fee REAL DEFAULT 0,
  total REAL NOT NULL,
  carrier_id INTEGER,
  carrier_name TEXT,
  tracking_link TEXT,
  items_json TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  payment_status TEXT DEFAULT 'paid', -- 'paid' | 'pending' | 'cancelled'
  payment_details TEXT, -- JSON con desglose de combinado, referencias de transferencia, etc.
  customer_doc TEXT -- Cédula o NIT para cuentas por cobrar
);

-- 6. Tabla de Control de Rate Limiting y Mitigación de Fuerza Bruta
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER DEFAULT 1,
  first_attempt INTEGER,
  blocked_until INTEGER DEFAULT 0
);

-- Índices de Rendimiento y Búsqueda Rápida
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock, min_stock);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_rate_limits_blocked ON rate_limits(blocked_until);
