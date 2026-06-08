

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Create sample table with vector column
CREATE TABLE items (
    id SERIAL PRIMARY KEY, -- unique identifier
    name VARCHAR(255) NOT NULL, -- item name
    item_data JSONB, -- additional data in JSON format
    embedding vector(384) -- vector data
);
