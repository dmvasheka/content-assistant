-- Create generation_history table
CREATE TABLE IF NOT EXISTS public.generation_history (
    id SERIAL PRIMARY KEY,
    topic VARCHAR(500) NOT NULL,
    draft TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for better performance when ordering
CREATE INDEX IF NOT EXISTS idx_generation_history_created_at ON public.generation_history (created_at DESC);

-- Create an index on topic for search performance
CREATE INDEX IF NOT EXISTS idx_generation_history_topic ON public.generation_history USING GIN (to_tsvector('russian', topic));

-- Create an index on draft for full-text search
CREATE INDEX IF NOT EXISTS idx_generation_history_draft ON public.generation_history USING GIN (to_tsvector('russian', draft));

-- Grant necessary permissions
ALTER TABLE public.generation_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable all operations for all users" ON public.generation_history FOR ALL USING (true);