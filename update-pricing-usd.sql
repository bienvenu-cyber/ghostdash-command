-- =====================================================
-- UPDATE PRICING TO USD
-- =====================================================

-- Mettre à jour la devise par défaut de la table
ALTER TABLE pricing ALTER COLUMN currency SET DEFAULT 'USD';

-- Mettre à jour les enregistrements existants
UPDATE pricing SET currency = 'USD' WHERE currency = 'EUR';

-- Vérifier les changements
SELECT * FROM pricing;
