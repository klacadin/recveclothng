-- Create user_approvals table to track user approval status
CREATE TABLE IF NOT EXISTS public.user_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_approvals
ALTER TABLE public.user_approvals ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_approvals
-- Users can view their own approval status
CREATE POLICY "Users can view their own approval status"
ON public.user_approvals
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all approval statuses
CREATE POLICY "Admins can view all approval statuses"
ON public.user_approvals
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update approval statuses
CREATE POLICY "Admins can update approval statuses"
ON public.user_approvals
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- System can insert approval records (via trigger)
CREATE POLICY "System can insert approval records"
ON public.user_approvals
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create function to automatically create pending approval on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_approvals (user_id, status)
  VALUES (NEW.id, 'pending')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to check if user is approved
CREATE OR REPLACE FUNCTION public.is_user_approved(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT status = 'approved' FROM public.user_approvals WHERE user_id = _user_id),
    false
  );
$$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_approvals_user_id ON public.user_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_user_approvals_status ON public.user_approvals(status);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.user_approvals TO authenticated;

