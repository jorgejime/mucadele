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
  customer_doc TEXT, -- Cédula o NIT para cuentas por cobrar
  order_state TEXT DEFAULT 'CREATED', -- 'CREATED' | 'ASSIGNED' | 'READY_TO_PICKUP' | 'ORDER_PICKED_UP' | 'ORDER_DELIVERED'
  delivered_at TIMESTAMP
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

-- 7. Control de Turnos y Arqueo de Caja POS
CREATE TABLE IF NOT EXISTS cash_shifts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cashier_username TEXT NOT NULL,
  cashier_name TEXT NOT NULL,
  opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP,
  initial_cash REAL NOT NULL DEFAULT 0,
  expected_cash REAL DEFAULT 0,
  actual_cash REAL,
  difference REAL,
  total_sales_cash REAL DEFAULT 0,
  total_sales_card REAL DEFAULT 0,
  total_sales_transfer REAL DEFAULT 0,
  total_sales_credit REAL DEFAULT 0,
  total_sales_combined REAL DEFAULT 0,
  total_expenses REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS cash_movements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shift_id INTEGER NOT NULL,
  movement_type TEXT NOT NULL,
  amount REAL NOT NULL,
  concept TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,
  FOREIGN KEY (shift_id) REFERENCES cash_shifts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cash_shifts_status ON cash_shifts(status, opened_at DESC);
CREATE INDEX IF NOT EXISTS idx_cash_movements_shift ON cash_movements(shift_id);

-- 8. Entidad Formal de Clientes Fiscales y Cartera
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doc_type TEXT NOT NULL DEFAULT 'CC',
  doc_number TEXT UNIQUE NOT NULL,
  dv TEXT DEFAULT '',
  name TEXT NOT NULL,
  commercial_name TEXT DEFAULT '',
  email TEXT,
  phone TEXT NOT NULL,
  address TEXT DEFAULT '',
  city_code TEXT DEFAULT '47001',
  tax_regime TEXT DEFAULT '49',
  fiscal_responsibility TEXT DEFAULT 'R-99-PN',
  credit_limit REAL DEFAULT 0,
  current_debt REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_customers_doc ON customers(doc_number);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 9. Facturación Electrónica DIAN UBL 2.1 (Software Propio)
CREATE TABLE IF NOT EXISTS dian_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  environment TEXT DEFAULT '2', -- '1' = Producción, '2' = Habilitación / Pruebas
  software_id TEXT DEFAULT '',
  software_pin TEXT DEFAULT '',
  test_set_id TEXT DEFAULT '',
  technical_key TEXT DEFAULT '',
  resolution_number TEXT DEFAULT '18760000001',
  resolution_date TEXT DEFAULT '2026-01-01',
  prefix TEXT DEFAULT 'SETP',
  range_from INTEGER DEFAULT 1,
  range_to INTEGER DEFAULT 500000,
  current_consecutive INTEGER DEFAULT 1,
  valid_until TEXT DEFAULT '2027-01-01',
  issuer_nit TEXT DEFAULT '901234567',
  issuer_dv TEXT DEFAULT '1',
  issuer_name TEXT DEFAULT 'MUCADELE LICORES S.A.S.',
  issuer_trade_name TEXT DEFAULT 'Mucadele Licores',
  issuer_address TEXT DEFAULT 'Calle 19 # 3-45, Santa Marta, Magdalena',
  issuer_phone TEXT DEFAULT '+573184131391',
  issuer_email TEXT DEFAULT 'facturacion@mucadele.com.co',
  issuer_tax_regime TEXT DEFAULT '48',
  issuer_economic_activity TEXT DEFAULT '4724',
  certificate_alias TEXT DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dian_invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_number TEXT,
  invoice_number TEXT UNIQUE NOT NULL,
  prefix TEXT NOT NULL,
  consecutive INTEGER NOT NULL,
  cufe TEXT NOT NULL,
  qr_data TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  issue_time TEXT NOT NULL,
  customer_id INTEGER,
  customer_name TEXT NOT NULL,
  customer_doc_type TEXT DEFAULT '13',
  customer_doc TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  payment_method TEXT DEFAULT '10',
  subtotal REAL NOT NULL,
  tax_iva REAL DEFAULT 0.0,
  tax_inc REAL DEFAULT 0.0,
  total REAL NOT NULL,
  status TEXT DEFAULT 'draft',
  dian_status_code TEXT,
  dian_response_xml TEXT,
  xml_signed TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_dian_invoices_order ON dian_invoices (order_number);
CREATE INDEX IF NOT EXISTS idx_dian_invoices_cufe ON dian_invoices (cufe);
CREATE INDEX IF NOT EXISTS idx_dian_invoices_created ON dian_invoices (created_at DESC);
