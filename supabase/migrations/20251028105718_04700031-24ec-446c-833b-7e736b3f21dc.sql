-- Create profiles table for agent information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  codename TEXT NOT NULL,
  agent_id TEXT NOT NULL UNIQUE,
  rank_tier TEXT DEFAULT 'Initiate',
  rank_progress INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create messages table with auto-expiration
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '5 minutes')
);

-- Enable RLS on messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Messages policies - all authenticated users can read and create
CREATE POLICY "Authenticated users can view messages"
  ON public.messages FOR SELECT
  TO authenticated
  USING (expires_at > now());

CREATE POLICY "Authenticated users can create messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  random_codename TEXT;
  random_agent_id TEXT;
BEGIN
  -- Generate random codename (you can customize this list)
  random_codename := (ARRAY['Shadow', 'Cipher', 'Raven', 'Ghost', 'Phoenix', 'Viper', 'Echo', 'Blade'])[floor(random() * 8 + 1)];
  
  -- Generate random agent ID (5 character alphanumeric)
  random_agent_id := lower(substring(md5(random()::text) from 1 for 5));
  
  INSERT INTO public.profiles (id, codename, agent_id)
  VALUES (new.id, random_codename, random_agent_id);
  
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to delete expired messages
CREATE OR REPLACE FUNCTION public.delete_expired_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  DELETE FROM public.messages WHERE expires_at <= now();
END;
$$;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Create index for faster expiration queries
CREATE INDEX idx_messages_expires_at ON public.messages(expires_at);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);