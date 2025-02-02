-- Create suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL CHECK (tipo IN ('economia', 'investimento', 'orcamento', 'objetivo')),
    descricao TEXT NOT NULL,
    impacto_estimado DECIMAL(10,2) NOT NULL,
    prioridade TEXT NOT NULL CHECK (prioridade IN ('alta', 'media', 'baixa')),
    status TEXT NOT NULL DEFAULT 'nova' CHECK (status IN ('nova', 'implementada', 'ignorada')),
    data_geracao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS suggestions_user_id_idx ON suggestions(user_id);
CREATE INDEX IF NOT EXISTS suggestions_tipo_idx ON suggestions(tipo);
CREATE INDEX IF NOT EXISTS suggestions_status_idx ON suggestions(status);
CREATE INDEX IF NOT EXISTS suggestions_prioridade_idx ON suggestions(prioridade);
CREATE INDEX IF NOT EXISTS suggestions_data_geracao_idx ON suggestions(data_geracao);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_suggestions_updated_at
    BEFORE UPDATE ON suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 