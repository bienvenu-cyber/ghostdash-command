-- =====================================================
-- PRICING TABLE SETUP
-- =====================================================

-- 1. Créer la table pricing
CREATE TABLE IF NOT EXISTS pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  duration_days INTEGER NOT NULL,
  description TEXT,
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing(is_active);
CREATE INDEX IF NOT EXISTS idx_pricing_plan_name ON pricing(plan_name);

-- 3. Activer RLS sur pricing
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Tous les utilisateurs authentifiés peuvent voir les plans actifs
DROP POLICY IF EXISTS "Users can view active pricing" ON pricing;
CREATE POLICY "Users can view active pricing"
ON pricing FOR SELECT
TO authenticated
USING (is_active = true);

-- 5. Policy: Seuls les admins peuvent modifier les prix
DROP POLICY IF EXISTS "Only admins can manage pricing" ON pricing;
CREATE POLICY "Only admins can manage pricing"
ON pricing FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles
    WHERE role = 'super_admin'
  )
);

-- 6. Insérer le plan mensuel par défaut
INSERT INTO pricing (plan_name, price, currency, duration_days, description, features, is_active)
VALUES (
  'Monthly',
  79.00,
  'USD',
  30,
  'Full dashboard access with all features',
  ARRAY['Full dashboard access', 'All metrics editable', 'Screenshot export', 'Email support', 'Monthly updates'],
  true
)
ON CONFLICT (plan_name) DO UPDATE SET
  price = 79.00,
  currency = 'USD',
  duration_days = 30,
  is_active = true;

-- =====================================================
-- VÉRIFICATION
-- =====================================================

-- Voir tous les plans de pricing
SELECT * FROM pricing;

-- Voir les plans actifs
SELECT * FROM pricing WHERE is_active = true;
