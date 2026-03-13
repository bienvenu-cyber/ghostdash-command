-- Fix: Allow admins to insert subscriptions for any user
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Users can create subscription request" ON public.subscriptions;

-- Recreate with admin support
CREATE POLICY "Users and admins can create subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (
  user_id = auth.uid() OR public.is_admin(auth.uid())
);

