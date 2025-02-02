-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL CHECK (tipo IN ('vencimento', 'oportunidade', 'mudanca')),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    data_vencimento TIMESTAMP WITH TIME ZONE,
    prioridade TEXT NOT NULL CHECK (prioridade IN ('alta', 'media', 'baixa')),
    status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo', 'lido', 'arquivado')),
    valor DECIMAL(10,2),
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS alerts_user_id_idx ON alerts(user_id);
CREATE INDEX IF NOT EXISTS alerts_tipo_idx ON alerts(tipo);
CREATE INDEX IF NOT EXISTS alerts_status_idx ON alerts(status);
CREATE INDEX IF NOT EXISTS alerts_prioridade_idx ON alerts(prioridade);
CREATE INDEX IF NOT EXISTS alerts_data_criacao_idx ON alerts(data_criacao);
CREATE INDEX IF NOT EXISTS alerts_data_vencimento_idx ON alerts(data_vencimento);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 