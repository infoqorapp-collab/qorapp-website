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

CREATE TABLE IF NOT EXISTS public.inventory (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  status text DEFAULT 'Full'::text CHECK (status = ANY (ARRAY['Full'::text, 'Low Stock'::text, 'Out of Stock'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

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

GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO authenticated;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "qorapp user can manage own profile" ON public.users;
DROP POLICY IF EXISTS "qorapp user can manage own transactions" ON public.transactions;
DROP POLICY IF EXISTS "qorapp user can manage own inventory" ON public.inventory;
DROP POLICY IF EXISTS "qorapp anon can manage users" ON public.users;
DROP POLICY IF EXISTS "qorapp anon can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "qorapp anon can manage inventory" ON public.inventory;

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
BEGIN
  SELECT * INTO recipient
  FROM public.users
  WHERE ref_code = recipient_ref_code
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Recipient code not found';
  END IF;

  IF recipient.id = sender_id THEN
    RAISE EXCEPTION 'Cannot send money to yourself';
  END IF;

  SELECT wallet_balance INTO sender_balance
  FROM public.users
  WHERE id = sender_id;

  IF sender_balance IS NULL THEN
    RAISE EXCEPTION 'Sender account not found';
  END IF;

  IF sender_balance < amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE public.users
  SET wallet_balance = wallet_balance - amount
  WHERE id = sender_id;

  UPDATE public.users
  SET wallet_balance = wallet_balance + amount
  WHERE id = recipient.id;

  INSERT INTO public.transactions (user_id, type, amount, payment_method, description)
  VALUES (sender_id, 'transfer_out', amount, payment_method, note || ' to ' || recipient.business_name);

  INSERT INTO public.transactions (user_id, type, amount, payment_method, description)
  VALUES (recipient.id, 'transfer_in', amount, payment_method, note || ' from ' || (SELECT business_name FROM public.users WHERE id = sender_id));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.transfer_funds(uuid, text, numeric, text, text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_user_by_ref_code(recipient_ref_code text)
RETURNS TABLE(id uuid, business_name text, ref_code text) AS $$
BEGIN
  RETURN QUERY
  SELECT id, business_name, ref_code
  FROM public.users
  WHERE ref_code = recipient_ref_code
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_by_ref_code(text) TO authenticated;
