-- QORAPP Supabase Auth schema.
-- Passwords are stored by Supabase in auth.users, not in public.users.
-- This file is safe to run again: it creates missing objects and replaces policies.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS public.user_passwords;
DROP TABLE IF EXISTS public.app_sessions;

CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  phone text UNIQUE,
  business_name text NOT NULL,
  wallet_balance numeric DEFAULT 0,
  dashboard_route text DEFAULT '/dashboard/inventory'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  ref_code text GENERATED ALWAYS AS (substr(regexp_replace(id::text, '[^0-9]', '', 'g'), 1, 6)) STORED,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.users'::regclass
      AND conname = 'users_ref_code_key'
  ) THEN
    ALTER TABLE public.users ADD CONSTRAINT users_ref_code_key UNIQUE (ref_code);
  END IF;
END$$;

ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, phone, business_name, wallet_balance, dashboard_route)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(NEW.raw_user_meta_data ->> 'phone', ''),
    COALESCE(
      NULLIF(NEW.raw_user_meta_data ->> 'business_name', ''),
      NULLIF(NEW.raw_user_meta_data ->> 'businessName', ''),
      'My Business'
    ),
    0,
    '/inventory'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS qorapp_create_profile_on_signup ON auth.users;
CREATE TRIGGER qorapp_create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

INSERT INTO public.users (id, email, phone, business_name, wallet_balance, dashboard_route)
SELECT
  id,
  email,
  NULLIF(raw_user_meta_data ->> 'phone', ''),
  COALESCE(
    NULLIF(raw_user_meta_data ->> 'business_name', ''),
    NULLIF(raw_user_meta_data ->> 'businessName', ''),
    'My Business'
  ),
  0,
  '/inventory'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  price numeric NOT NULL DEFAULT 0,
  status text DEFAULT 'Full'::text CHECK (status = ANY (ARRAY['Full'::text, 'Low Stock'::text, 'Out of Stock'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Safe to re-run: adds the price column to an inventory table that already exists
-- from a previous version of this schema (price is stored in USD, same as transactions.amount).
ALTER TABLE public.inventory ADD COLUMN IF NOT EXISTS price numeric NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['sale'::text, 'expense'::text, 'transfer_in'::text, 'transfer_out'::text])),
  amount numeric NOT NULL,
  payment_method text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY[
    'money_sent'::text,
    'money_received'::text,
    'sale_recorded'::text,
    'expense_recorded'::text,
    'inventory'::text,
    'system'::text
  ])),
  title text NOT NULL,
  message text NOT NULL,
  href text,
  is_read boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.notification_settings (
  user_id uuid NOT NULL,
  money_sent boolean NOT NULL DEFAULT true,
  money_received boolean NOT NULL DEFAULT true,
  sales boolean NOT NULL DEFAULT true,
  expenses boolean NOT NULL DEFAULT true,
  inventory boolean NOT NULL DEFAULT true,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notification_settings_pkey PRIMARY KEY (user_id),
  CONSTRAINT notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_settings TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qorapp user can manage own profile" ON public.users;
DROP POLICY IF EXISTS "qorapp user can manage own transactions" ON public.transactions;
DROP POLICY IF EXISTS "qorapp user can manage own inventory" ON public.inventory;
DROP POLICY IF EXISTS "qorapp anon can manage users" ON public.users;
DROP POLICY IF EXISTS "qorapp anon can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "qorapp anon can manage inventory" ON public.inventory;
DROP POLICY IF EXISTS "qorapp user can manage own notifications" ON public.notifications;
DROP POLICY IF EXISTS "qorapp user can manage own notification settings" ON public.notification_settings;

CREATE POLICY "qorapp user can manage own profile"
ON public.users
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "qorapp user can manage own transactions"
ON public.transactions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "qorapp user can manage own inventory"
ON public.inventory
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "qorapp user can manage own notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "qorapp user can manage own notification settings"
ON public.notification_settings
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

INSERT INTO public.notification_settings (user_id)
SELECT id
FROM public.users
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.transfer_funds(
  sender_id uuid,
  recipient_ref_code text,
  amount numeric,
  payment_method text,
  note text
)
RETURNS void AS $$
DECLARE
  recipient public.users%ROWTYPE;
  sender_balance numeric;
  sender_business_name text;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> sender_id THEN
    RAISE EXCEPTION 'Unable to identify sender account';
  END IF;

  SELECT * INTO recipient
  FROM public.users
  WHERE public.users.ref_code = recipient_ref_code
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recipient code not found';
  END IF;

  IF recipient.id = sender_id THEN
    RAISE EXCEPTION 'Cannot send money to yourself';
  END IF;

  SELECT wallet_balance, business_name INTO sender_balance, sender_business_name
  FROM public.users
  WHERE public.users.id = sender_id;

  IF sender_balance IS NULL THEN
    RAISE EXCEPTION 'Sender account not found';
  END IF;

  IF sender_balance < amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE public.users
  SET wallet_balance = wallet_balance - amount
  WHERE public.users.id = sender_id;

  UPDATE public.users
  SET wallet_balance = wallet_balance + amount
  WHERE public.users.id = recipient.id;

  INSERT INTO public.transactions (user_id, type, amount, payment_method, description)
  VALUES (sender_id, 'transfer_out', amount, payment_method, note || ' to ' || recipient.business_name);

  INSERT INTO public.transactions (user_id, type, amount, payment_method, description)
  VALUES (recipient.id, 'transfer_in', amount, payment_method, note || ' from ' || sender_business_name);

  IF EXISTS (
    SELECT 1 FROM public.notification_settings
    WHERE user_id = sender_id AND money_sent = true
  ) THEN
    INSERT INTO public.notifications (user_id, type, title, message, href, metadata)
    VALUES (
      sender_id,
      'money_sent',
      'Money sent',
      'You sent $' || amount::text || ' to ' || recipient.business_name || '.',
      '/profile',
      jsonb_build_object('amount', amount, 'recipient_id', recipient.id, 'recipient_name', recipient.business_name)
    );
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.notification_settings
    WHERE user_id = recipient.id AND money_received = true
  ) THEN
    INSERT INTO public.notifications (user_id, type, title, message, href, metadata)
    VALUES (
      recipient.id,
      'money_received',
      'Money received',
      sender_business_name || ' sent you $' || amount::text || '.',
      '/profile',
      jsonb_build_object('amount', amount, 'sender_id', sender_id, 'sender_name', sender_business_name)
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.transfer_funds(uuid, text, numeric, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_by_ref_code(recipient_ref_code text)
RETURNS TABLE(id uuid, business_name text, ref_code text) AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.business_name, u.ref_code
  FROM public.users AS u
  WHERE u.ref_code = recipient_ref_code
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_user_by_ref_code(text) TO authenticated;

