-- Aesthetica Skincare - Fix / Align Supabase schema
-- --------------------------------------------------
-- Este script es seguro de ejecutar varias veces (idempotente).
-- �salo si YA tienes tablas creadas pero el frontend marca errores tipo:
-- - column ... does not exist (42703)
-- - Could not find the '...' column ... in the schema cache (PGRST204)
--
-- Instrucciones:
-- 1) Supabase Dashboard ? SQL Editor
-- 2) Pega y ejecuta este archivo COMPLETO
-- 3) (Opcional) Ejecuta tambi�n `supabase-schema.sql` para crear lo que falte
--
-- Nota: este script intenta:
-- - Renombrar columnas legacy (ej: isopen ? is_open)
-- - Agregar columnas faltantes con defaults razonables
-- - Insertar el registro default de social_config si falta
-- - Forzar reload del schema cache de PostgREST (API)

-- Force the trigger function to target `updated_at` instead of legacy camelCase.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -------------------------
-- CASH SESSIONS
-- -------------------------
DO $$
BEGIN
  -- Renombres legacy ? snake_case
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='isopen')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='is_open') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN isopen TO is_open';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='openedat')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='opened_at') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN openedat TO opened_at';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='closedat')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='closed_at') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN closedat TO closed_at';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='startingbalance')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='starting_balance') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN startingbalance TO starting_balance';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='salescash')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='sales_cash') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN salescash TO sales_cash';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='salestransfer')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='sales_transfer') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN salestransfer TO sales_transfer';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='totalexpenses')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='total_expenses') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN totalexpenses TO total_expenses';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='expectedbalance')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='cash_sessions' AND column_name='expected_balance') THEN
    EXECUTE 'ALTER TABLE public.cash_sessions RENAME COLUMN expectedbalance TO expected_balance';
  END IF;
END $$;

ALTER TABLE public.cash_sessions
  ADD COLUMN IF NOT EXISTS is_open BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS starting_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sales_cash NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sales_transfer NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_expenses NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expected_balance NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS history JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -------------------------
-- PRODUCTS
-- -------------------------
-- Si tu tabla `products` fue creada con un esquema anterior, aquí agregamos
-- las columnas que el frontend intenta upsert (name, subtitle, concern, rating, texture, stock, etc.)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS size TEXT,
  ADD COLUMN IF NOT EXISTS ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS usage TEXT,
  ADD COLUMN IF NOT EXISTS image TEXT,
  ADD COLUMN IF NOT EXISTS concern TEXT,
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS texture TEXT,
  ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Backfill para evitar nulos en campos que el frontend asume presentes
UPDATE public.products
SET
  ingredients = COALESCE(ingredients, '[]'::jsonb),
  benefits = COALESCE(benefits, '[]'::jsonb),
  rating = COALESCE(rating, 0),
  stock = COALESCE(stock, 0)
WHERE TRUE;

-- -------------------------
-- ORDERS
-- -------------------------
DO $$
BEGIN
  -- Renombres legacy → snake_case (si existen)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customername')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customer_name') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN customername TO customer_name';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customeremail')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customer_email') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN customeremail TO customer_email';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='paymentmethod')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='payment_method') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN paymentmethod TO payment_method';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shippingzone')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shipping_zone') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN shippingzone TO shipping_zone';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='voucherfilename')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='voucher_file_name') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN voucherfilename TO voucher_file_name';
  END IF;
END $$;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_zone TEXT,
  ADD COLUMN IF NOT EXISTS voucher_file_name TEXT,
  ADD COLUMN IF NOT EXISTS date TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'PENDIENTE',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.orders
SET
  items = COALESCE(items, '[]'::jsonb),
  subtotal = COALESCE(subtotal, 0),
  tax = COALESCE(tax, 0),
  shipping = COALESCE(shipping, 0),
  total = COALESCE(total, 0),
  status = COALESCE(status, 'PENDIENTE')
WHERE TRUE;

-- -------------------------
-- COMBOS
-- -------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='combos' AND column_name='productids')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='combos' AND column_name='product_ids') THEN
    EXECUTE 'ALTER TABLE public.combos RENAME COLUMN productids TO product_ids';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='combos' AND column_name='valueprice')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='combos' AND column_name='value_price') THEN
    EXECUTE 'ALTER TABLE public.combos RENAME COLUMN valueprice TO value_price';
  END IF;
END $$;

ALTER TABLE public.combos
  ADD COLUMN IF NOT EXISTS subtitle TEXT,
  ADD COLUMN IF NOT EXISTS product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS value_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS tag TEXT,
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -------------------------
-- CAROUSEL BANNERS
-- -------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='carousel_banners' AND column_name='buttontext')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='carousel_banners' AND column_name='button_text') THEN
    EXECUTE 'ALTER TABLE public.carousel_banners RENAME COLUMN buttontext TO button_text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='carousel_banners' AND column_name='buttonurl')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='carousel_banners' AND column_name='button_url') THEN
    EXECUTE 'ALTER TABLE public.carousel_banners RENAME COLUMN buttonurl TO button_url';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='carousel_banners' AND column_name='relatedproductid')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='carousel_banners' AND column_name='related_product_id') THEN
    EXECUTE 'ALTER TABLE public.carousel_banners RENAME COLUMN relatedproductid TO related_product_id';
  END IF;
END $$;

ALTER TABLE public.carousel_banners
  ADD COLUMN IF NOT EXISTS button_text TEXT,
  ADD COLUMN IF NOT EXISTS button_url TEXT,
  ADD COLUMN IF NOT EXISTS related_product_id TEXT,
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Featured',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -------------------------
-- SOCIAL CONFIG
-- -------------------------
DO $$
BEGIN
  -- Renombres legacy ? snake_case
  -- Variantes comunes legacy: whatsappphone / whatsapptext / instagramurl / facebookurl
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsappphone')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsapp_phone') THEN
    EXECUTE 'ALTER TABLE public.social_config RENAME COLUMN whatsappphone TO whatsapp_phone';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsapp')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsapp_phone') THEN
    EXECUTE 'ALTER TABLE public.social_config RENAME COLUMN whatsapp TO whatsapp_phone';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsapptext')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsapp_text') THEN
    EXECUTE 'ALTER TABLE public.social_config RENAME COLUMN whatsapptext TO whatsapp_text';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='instagramurl')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='instagram_url') THEN
    EXECUTE 'ALTER TABLE public.social_config RENAME COLUMN instagramurl TO instagram_url';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='instagram')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='instagram_url') THEN
    EXECUTE 'ALTER TABLE public.social_config RENAME COLUMN instagram TO instagram_url';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='facebookurl')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='facebook_url') THEN
    EXECUTE 'ALTER TABLE public.social_config RENAME COLUMN facebookurl TO facebook_url';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='facebook')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='facebook_url') THEN
    EXECUTE 'ALTER TABLE public.social_config RENAME COLUMN facebook TO facebook_url';
  END IF;
END $$;

ALTER TABLE public.social_config
  ADD COLUMN IF NOT EXISTS whatsapp_phone TEXT NOT NULL DEFAULT '18294855693',
  ADD COLUMN IF NOT EXISTS whatsapp_text TEXT NOT NULL DEFAULT 'Hola Aesthetica, me gustar�a hacer una consulta sobre sus elixires.',
  ADD COLUMN IF NOT EXISTS instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com',
  ADD COLUMN IF NOT EXISTS facebook_url TEXT NOT NULL DEFAULT 'https://facebook.com',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Si quedaron columnas legacy NO renombradas (porque ya exist�a la nueva),
-- les ponemos defaults para no romper inserts/upserts.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsappphone') THEN
    EXECUTE 'ALTER TABLE public.social_config ALTER COLUMN whatsappphone SET DEFAULT ''18294855693''';
    EXECUTE 'UPDATE public.social_config SET whatsappphone = COALESCE(whatsappphone, whatsapp_phone, ''18294855693'') WHERE id = ''default'' OR whatsappphone IS NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='whatsapptext') THEN
    EXECUTE 'ALTER TABLE public.social_config ALTER COLUMN whatsapptext SET DEFAULT ''Hola Aesthetica, me gustar�a hacer una consulta sobre sus elixires.''';
    EXECUTE 'UPDATE public.social_config SET whatsapptext = COALESCE(whatsapptext, whatsapp_text, ''Hola Aesthetica, me gustar�a hacer una consulta sobre sus elixires.'') WHERE id = ''default'' OR whatsapptext IS NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='instagramurl') THEN
    EXECUTE 'ALTER TABLE public.social_config ALTER COLUMN instagramurl SET DEFAULT ''https://instagram.com''';
    EXECUTE 'UPDATE public.social_config SET instagramurl = COALESCE(instagramurl, instagram_url, ''https://instagram.com'') WHERE id = ''default'' OR instagramurl IS NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='social_config' AND column_name='facebookurl') THEN
    EXECUTE 'ALTER TABLE public.social_config ALTER COLUMN facebookurl SET DEFAULT ''https://facebook.com''';
    EXECUTE 'UPDATE public.social_config SET facebookurl = COALESCE(facebookurl, facebook_url, ''https://facebook.com'') WHERE id = ''default'' OR facebookurl IS NULL';
  END IF;
END $$;

-- Crea/actualiza el registro default con las columnas canonical (snake_case)
INSERT INTO public.social_config (id, whatsapp_phone, whatsapp_text, instagram_url, facebook_url)
VALUES (
  'default',
  '18294855693',
  'Hola Aesthetica, me gustar�a hacer una consulta sobre sus elixires.',
  'https://instagram.com',
  'https://facebook.com'
)
ON CONFLICT (id) DO UPDATE SET
  whatsapp_phone = EXCLUDED.whatsapp_phone,
  whatsapp_text = EXCLUDED.whatsapp_text,
  instagram_url = EXCLUDED.instagram_url,
  facebook_url = EXCLUDED.facebook_url;

-- -------------------------
-- PRODUCTS
-- -------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.products
SET stock = 0
WHERE stock IS NULL;

ALTER TABLE public.products
  ALTER COLUMN stock SET DEFAULT 0;

-- -------------------------
-- PROMOTIONS
-- -------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='productids')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='product_ids') THEN
    EXECUTE 'ALTER TABLE public.promotions RENAME COLUMN productids TO product_ids';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='valueprice')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='value_price') THEN
    EXECUTE 'ALTER TABLE public.promotions RENAME COLUMN valueprice TO value_price';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='productids')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='product_ids') THEN
    EXECUTE 'UPDATE public.promotions SET product_ids = COALESCE(product_ids, productids) WHERE product_ids IS NULL OR product_ids = ''[]''::jsonb';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='valueprice')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='promotions' AND column_name='value_price') THEN
    EXECUTE 'UPDATE public.promotions SET value_price = COALESCE(value_price, valueprice) WHERE value_price IS NULL';
  END IF;
END $$;

ALTER TABLE public.promotions
  ADD COLUMN IF NOT EXISTS product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS value_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -------------------------
-- ORDERS
-- -------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customeremail')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customer_email') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN customeremail TO customer_email';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='paymentmethod')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='payment_method') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN paymentmethod TO payment_method';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shippingzone')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shipping_zone') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN shippingzone TO shipping_zone';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='voucherfilename')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='voucher_file_name') THEN
    EXECUTE 'ALTER TABLE public.orders RENAME COLUMN voucherfilename TO voucher_file_name';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customeremail')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='customer_email') THEN
    EXECUTE 'UPDATE public.orders SET customer_email = COALESCE(customer_email, customeremail) WHERE customer_email IS NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='paymentmethod')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='payment_method') THEN
    EXECUTE 'UPDATE public.orders SET payment_method = COALESCE(payment_method, paymentmethod) WHERE payment_method IS NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shippingzone')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='shipping_zone') THEN
    EXECUTE 'UPDATE public.orders SET shipping_zone = COALESCE(shipping_zone, shippingzone) WHERE shipping_zone IS NULL';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='voucherfilename')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='orders' AND column_name='voucher_file_name') THEN
    EXECUTE 'UPDATE public.orders SET voucher_file_name = COALESCE(voucher_file_name, voucherfilename) WHERE voucher_file_name IS NULL';
  END IF;
END $$;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total NUMERIC(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_zone TEXT,
  ADD COLUMN IF NOT EXISTS voucher_file_name TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -------------------------
-- BANK ACCOUNTS
-- -------------------------
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bank_accounts' AND column_name='banktype')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bank_accounts' AND column_name='bank_type') THEN
    EXECUTE 'ALTER TABLE public.bank_accounts RENAME COLUMN banktype TO bank_type';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bank_accounts' AND column_name='accountnumber')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bank_accounts' AND column_name='account_number') THEN
    EXECUTE 'ALTER TABLE public.bank_accounts RENAME COLUMN accountnumber TO account_number';
  END IF;
END $$;

ALTER TABLE public.bank_accounts
  ADD COLUMN IF NOT EXISTS account_number TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

UPDATE public.bank_accounts
SET account_number = ''
WHERE account_number IS NULL;

-- -------------------------
-- Reload schema cache (PostgREST)
-- -------------------------
NOTIFY pgrst, 'reload schema';
