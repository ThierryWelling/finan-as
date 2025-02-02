-- Adicionar colunas faltantes na tabela transactions
ALTER TABLE transactions
    ADD COLUMN IF NOT EXISTS type TEXT,
    ADD COLUMN IF NOT EXISTS payment_method TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente';

-- Adicionar colunas faltantes na tabela income
ALTER TABLE income
    ADD COLUMN IF NOT EXISTS type TEXT,
    ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT 'único',
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente';

-- Adicionar colunas faltantes na tabela budgets
ALTER TABLE budgets
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo',
    ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0;

-- Adicionar colunas faltantes na tabela alerts
ALTER TABLE alerts
    ADD COLUMN IF NOT EXISTS type TEXT,
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'novo',
    ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'média';

-- Adicionar colunas faltantes na tabela suggestions
ALTER TABLE suggestions
    ADD COLUMN IF NOT EXISTS impact TEXT DEFAULT 'médio',
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente'; 