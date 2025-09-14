-- Enable the pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Create documents table with embedding support
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_idx
ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create RPC function for document similarity search
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding VECTOR(1536),
    match_count INT DEFAULT 5
)
RETURNS TABLE(
    id BIGINT,
    title TEXT,
    content TEXT,
    embedding VECTOR(1536),
    similarity FLOAT
)
LANGUAGE SQL
AS $$
    SELECT
        documents.id,
        documents.title,
        documents.content,
        documents.embedding,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE documents.embedding IS NOT NULL
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create generation history table
CREATE TABLE IF NOT EXISTS generation_history (
    id BIGSERIAL PRIMARY KEY,
    topic TEXT NOT NULL,
    draft TEXT NOT NULL,
    citations JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on generation_history for efficient querying
CREATE INDEX IF NOT EXISTS generation_history_created_at_idx
ON generation_history (created_at DESC);

CREATE INDEX IF NOT EXISTS generation_history_topic_idx
ON generation_history (topic);