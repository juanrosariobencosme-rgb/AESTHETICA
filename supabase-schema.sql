-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  benefits JSONB NOT NULL,
  usage TEXT NOT NULL,
  image TEXT NOT NULL,
  concern TEXT NOT NULL,
  rating DECIMAL(3, 1) NOT NULL,
  texture TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotion Bundles table
CREATE TABLE IF NOT EXISTS promotion_bundles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  product_ids JSONB NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  value_price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  tag TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  category TEXT NOT NULL DEFAULT 'Promoción',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skin Types lookup table
CREATE TABLE IF NOT EXISTS skin_types (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Combos table
CREATE TABLE IF NOT EXISTS combos (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  product_ids JSONB NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  value_price DECIMAL(10, 2),
  image TEXT NOT NULL,
  tag TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Carousel / Banner table
CREATE TABLE IF NOT EXISTS carousel_banners (
  id TEXT PRIMARY KEY,
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  button_text TEXT,
  button_url TEXT,
  related_product_id TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  priority INTEGER NOT NULL DEFAULT 1,
  category TEXT NOT NULL DEFAULT 'Featured',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping Settings table
CREATE TABLE IF NOT EXISTS shipping_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  district_rate DECIMAL(10, 2) NOT NULL,
  outside_rate DECIMAL(10, 2) NOT NULL,
  district_keywords JSONB NOT NULL DEFAULT '["Distrito","Santo Domingo","Zona","Colonia"]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank Accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id TEXT PRIMARY KEY DEFAULT 'default',
  bank_type TEXT NOT NULL,
  beneficiary TEXT NOT NULL,
  account_number TEXT NOT NULL,
  clabe TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  shipping DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  shipping_zone TEXT,
  voucher_file_name TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cash Session table
CREATE TABLE IF NOT EXISTS cash_sessions (
  id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_open BOOLEAN NOT NULL DEFAULT true,
  opened_at TIMESTAMP WITH TIME ZONE NOT NULL,
  closed_at TIMESTAMP WITH TIME ZONE,
  starting_balance DECIMAL(10, 2) NOT NULL,
  sales_cash DECIMAL(10, 2) NOT NULL DEFAULT 0,
  sales_transfer DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_expenses DECIMAL(10, 2) NOT NULL DEFAULT 0,
  expected_balance DECIMAL(10, 2) NOT NULL,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Config table
CREATE TABLE IF NOT EXISTS social_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  whatsapp_phone TEXT NOT NULL,
  whatsapp_text TEXT NOT NULL,
  instagram_url TEXT NOT NULL,
  facebook_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_concern ON products(concern);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_cash_sessions_is_open ON cash_sessions(is_open);
CREATE INDEX IF NOT EXISTS idx_combos_active ON combos(active);
CREATE INDEX IF NOT EXISTS idx_carousel_banners_active_priority ON carousel_banners(active, priority);
CREATE INDEX IF NOT EXISTS idx_shipping_settings_id ON shipping_settings(id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_active ON bank_accounts(active);
CREATE INDEX IF NOT EXISTS idx_skin_types_name ON skin_types(name);

-- Insert default social config
INSERT INTO social_config (id, whatsapp_phone, whatsapp_text, instagram_url, facebook_url)
VALUES (
  'default',
  '18294855693',
  'Hola Aesthetica, me gustaría hacer una consulta sobre sus elixires.',
  'https://instagram.com',
  'https://facebook.com'
)
ON CONFLICT (id) DO NOTHING;

-- Insert default shipping settings
INSERT INTO shipping_settings (id, district_rate, outside_rate)
VALUES ('default', 200.00, 350.00)
ON CONFLICT (id) DO NOTHING;

-- Insert default bank account
INSERT INTO bank_accounts (id, bank_type, beneficiary, account_number, clabe, active)
VALUES (
  'default',
  'Banco Premium',
  'Aesthetica Rituals S.A. de C.V.',
  '012345678901234567',
  '012 345 6789 0123 4567',
  TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skin_types ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (you can restrict this later)
CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to promotion_bundles"
  ON promotion_bundles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to carousel_banners"
  ON carousel_banners FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to shipping_settings"
  ON shipping_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to bank_accounts"
  ON bank_accounts FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to skin_types"
  ON skin_types FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public read access to social_config"
  ON social_config FOR SELECT
  TO public
  USING (true);

-- Policies for admin operations (you'll need to implement proper auth)
CREATE POLICY "Allow all operations on products"
  ON products FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on promotion_bundles"
  ON promotion_bundles FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on orders"
  ON orders FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on expenses"
  ON expenses FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on cash_sessions"
  ON cash_sessions FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on social_config"
  ON social_config FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on combos"
  ON combos FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on carousel_banners"
  ON carousel_banners FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on shipping_settings"
  ON shipping_settings FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on bank_accounts"
  ON bank_accounts FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on skin_types"
  ON skin_types FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotion_bundles_updated_at
  BEFORE UPDATE ON promotion_bundles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cash_sessions_updated_at
  BEFORE UPDATE ON cash_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_config_updated_at
  BEFORE UPDATE ON social_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_combos_updated_at
  BEFORE UPDATE ON combos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carousel_banners_updated_at
  BEFORE UPDATE ON carousel_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_settings_updated_at
  BEFORE UPDATE ON shipping_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON bank_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skin_types_updated_at
  BEFORE UPDATE ON skin_types
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
