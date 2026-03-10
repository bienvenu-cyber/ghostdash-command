-- =====================================================
-- GHOSTDASH - ADMIN SETUP
-- Exécute ces commandes dans Supabase SQL Editor
-- =====================================================

-- 1. Créer la table user_roles si elle n'existe pas
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'admin', 'super_admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- 3. Activer RLS sur user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Users peuvent voir leur propre rôle
CREATE POLICY "Users can view their own role"
ON user_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 5. Policy: Seuls les super_admin peuvent modifier les rôles
CREATE POLICY "Only super_admin can manage roles"
ON user_roles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'super_admin'
  )
);

-- 6. Créer la fonction is_admin
CREATE OR REPLACE FUNCTION is_admin(_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id
    AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Ajouter ton compte comme super_admin
-- IMPORTANT: Remplace l'email par ton vrai email
INSERT INTO user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = '[email]'
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Vérifie que tout fonctionne :

-- Voir tous les admins
SELECT u.email, ur.role, ur.created_at
FROM user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role IN ('admin', 'super_admin');

-- Tester la fonction is_admin avec ton user_id
-- SELECT is_admin('ton-user-id-ici');
