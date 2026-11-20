-- Owner-only persistent conversation history, project memory, and action audit log.
-- This migration creates storage only; the AI execution tools are added in later phases.

CREATE OR REPLACE FUNCTION public.is_mediazz_ai_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
      AND lower(role) = 'owner'
  );
$$;

REVOKE ALL ON FUNCTION public.is_mediazz_ai_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_mediazz_ai_owner() TO authenticated;

CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'New conversation',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'tool')),
  content text NOT NULL DEFAULT '',
  attachments jsonb NOT NULL DEFAULT '[]'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_project_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_key text NOT NULL,
  memory_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_conversation_id uuid REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (owner_id, memory_key)
);

CREATE TABLE IF NOT EXISTS public.ai_action_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id uuid REFERENCES public.ai_conversations(id) ON DELETE SET NULL,
  message_id uuid REFERENCES public.ai_messages(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  target text,
  status text NOT NULL CHECK (status IN ('planned', 'running', 'succeeded', 'failed', 'approval_required', 'cancelled')),
  request_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_conversations_owner_updated_idx
  ON public.ai_conversations (owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS ai_messages_conversation_created_idx
  ON public.ai_messages (conversation_id, created_at);
CREATE INDEX IF NOT EXISTS ai_project_memory_owner_idx
  ON public.ai_project_memory (owner_id);
CREATE INDEX IF NOT EXISTS ai_action_logs_owner_created_idx
  ON public.ai_action_logs (owner_id, created_at DESC);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_project_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_action_logs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_project_memory TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_action_logs TO authenticated;

DROP POLICY IF EXISTS "Owner manages own AI conversations" ON public.ai_conversations;
CREATE POLICY "Owner manages own AI conversations"
ON public.ai_conversations FOR ALL TO authenticated
USING (owner_id = auth.uid() AND public.is_mediazz_ai_owner())
WITH CHECK (owner_id = auth.uid() AND public.is_mediazz_ai_owner());

DROP POLICY IF EXISTS "Owner manages own AI messages" ON public.ai_messages;
CREATE POLICY "Owner manages own AI messages"
ON public.ai_messages FOR ALL TO authenticated
USING (owner_id = auth.uid() AND public.is_mediazz_ai_owner())
WITH CHECK (
  owner_id = auth.uid()
  AND public.is_mediazz_ai_owner()
  AND EXISTS (
    SELECT 1 FROM public.ai_conversations c
    WHERE c.id = conversation_id AND c.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owner manages own AI project memory" ON public.ai_project_memory;
CREATE POLICY "Owner manages own AI project memory"
ON public.ai_project_memory FOR ALL TO authenticated
USING (owner_id = auth.uid() AND public.is_mediazz_ai_owner())
WITH CHECK (owner_id = auth.uid() AND public.is_mediazz_ai_owner());

DROP POLICY IF EXISTS "Owner manages own AI action logs" ON public.ai_action_logs;
CREATE POLICY "Owner manages own AI action logs"
ON public.ai_action_logs FOR ALL TO authenticated
USING (owner_id = auth.uid() AND public.is_mediazz_ai_owner())
WITH CHECK (
  owner_id = auth.uid()
  AND public.is_mediazz_ai_owner()
  AND (
    conversation_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.ai_conversations c
      WHERE c.id = conversation_id AND c.owner_id = auth.uid()
    )
  )
);
