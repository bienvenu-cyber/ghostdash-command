-- =====================================================
-- AUTO-EXPIRATION DES ABONNEMENTS
-- Fonction pour désactiver automatiquement les abonnements expirés
-- =====================================================

-- 1. Créer la fonction pour désactiver les abonnements expirés
CREATE OR REPLACE FUNCTION public.deactivate_expired_subscriptions()
RETURNS TABLE(deactivated_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  count INTEGER;
BEGIN
  -- Désactiver les abonnements expirés
  UPDATE public.subscriptions
  SET status = 'inactive'
  WHERE status = 'active'
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
  
  GET DIAGNOSTICS count = ROW_COUNT;
  
  RETURN QUERY SELECT count;
END;
$$;

-- 2. Créer une extension pour les cron jobs (si pas déjà installée)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 3. Planifier l'exécution automatique tous les jours à minuit
SELECT cron.schedule(
  'deactivate-expired-subscriptions',  -- nom du job
  '0 0 * * *',                         -- tous les jours à minuit (cron syntax)
  'SELECT public.deactivate_expired_subscriptions();'
);

-- =====================================================
-- VÉRIFICATION ET TESTS
-- =====================================================

-- Tester la fonction manuellement
SELECT public.deactivate_expired_subscriptions();

-- Voir tous les cron jobs planifiés
SELECT * FROM cron.job;

-- Voir l'historique d'exécution des cron jobs
SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Voir les abonnements qui vont expirer dans les 7 prochains jours
SELECT 
  p.email,
  s.status,
  s.amount,
  s.expires_at,
  EXTRACT(DAY FROM (s.expires_at - NOW())) as days_remaining
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'active'
  AND s.expires_at IS NOT NULL
  AND s.expires_at > NOW()
  AND s.expires_at < NOW() + INTERVAL '7 days'
ORDER BY s.expires_at ASC;

-- Voir tous les abonnements actifs avec leur date d'expiration
SELECT 
  p.email,
  s.amount,
  s.status,
  s.created_at,
  s.expires_at,
  CASE 
    WHEN s.expires_at IS NULL THEN 'Lifetime'
    WHEN s.expires_at > NOW() THEN CONCAT(EXTRACT(DAY FROM (s.expires_at - NOW())), ' days left')
    ELSE 'EXPIRED'
  END as validity
FROM subscriptions s
JOIN profiles p ON s.user_id = p.id
WHERE s.status = 'active'
ORDER BY s.expires_at ASC NULLS LAST;

-- =====================================================
-- DÉSINSTALLATION (si besoin)
-- =====================================================

-- Supprimer le cron job
-- SELECT cron.unschedule('deactivate-expired-subscriptions');

-- Supprimer la fonction
-- DROP FUNCTION IF EXISTS public.deactivate_expired_subscriptions();
