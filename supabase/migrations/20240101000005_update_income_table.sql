-- Atualizar a tabela income
ALTER TABLE income
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS expected_date DATE,
ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS frequency TEXT CHECK (frequency IN ('mensal', 'semanal', 'anual', 'único')) DEFAULT 'único',
ADD COLUMN IF NOT EXISTS status TEXT CHECK (status IN ('pendente', 'recebido', 'atrasado')) DEFAULT 'pendente';

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS income_category_idx ON income(category);
CREATE INDEX IF NOT EXISTS income_expected_date_idx ON income(expected_date);
CREATE INDEX IF NOT EXISTS income_status_idx ON income(status); 