-- Atualizar a tabela income
ALTER TABLE income
    ALTER COLUMN type TYPE TEXT,
    ALTER COLUMN type SET NOT NULL,
    DROP CONSTRAINT IF EXISTS income_type_check,
    ADD CONSTRAINT income_type_check CHECK (type IN ('salário', 'investimento', 'freelance', 'aluguel', 'outros')),
    ALTER COLUMN frequency TYPE TEXT,
    DROP CONSTRAINT IF EXISTS income_frequency_check,
    ADD CONSTRAINT income_frequency_check CHECK (frequency IN ('mensal', 'semanal', 'anual', 'único')),
    ALTER COLUMN status TYPE TEXT,
    DROP CONSTRAINT IF EXISTS income_status_check,
    ADD CONSTRAINT income_status_check CHECK (status IN ('pendente', 'recebido', 'atrasado'));

-- Atualizar a tabela transactions
ALTER TABLE transactions
    ALTER COLUMN type TYPE TEXT,
    ALTER COLUMN type SET NOT NULL,
    DROP CONSTRAINT IF EXISTS transactions_type_check,
    ADD CONSTRAINT transactions_type_check CHECK (type IN ('entrada', 'saída')),
    ALTER COLUMN payment_method TYPE TEXT,
    ALTER COLUMN payment_method SET NOT NULL,
    DROP CONSTRAINT IF EXISTS transactions_payment_method_check,
    ADD CONSTRAINT transactions_payment_method_check CHECK (payment_method IN ('dinheiro', 'cartão', 'pix', 'transferência')),
    ALTER COLUMN status TYPE TEXT,
    DROP CONSTRAINT IF EXISTS transactions_status_check,
    ADD CONSTRAINT transactions_status_check CHECK (status IN ('concluída', 'pendente', 'cancelada'));

-- Atualizar a tabela budgets
ALTER TABLE budgets
    ALTER COLUMN status TYPE TEXT,
    DROP CONSTRAINT IF EXISTS budgets_status_check,
    ADD CONSTRAINT budgets_status_check CHECK (status IN ('ativo', 'concluído', 'cancelado')),
    ALTER COLUMN progress TYPE INTEGER,
    DROP CONSTRAINT IF EXISTS budgets_progress_check,
    ADD CONSTRAINT budgets_progress_check CHECK (progress >= 0 AND progress <= 100);

-- Atualizar a tabela alerts
ALTER TABLE alerts
    ALTER COLUMN type TYPE TEXT,
    ALTER COLUMN type SET NOT NULL,
    DROP CONSTRAINT IF EXISTS alerts_type_check,
    ADD CONSTRAINT alerts_type_check CHECK (type IN ('info', 'warning', 'danger')),
    ALTER COLUMN status TYPE TEXT,
    DROP CONSTRAINT IF EXISTS alerts_status_check,
    ADD CONSTRAINT alerts_status_check CHECK (status IN ('novo', 'lido', 'arquivado')),
    ALTER COLUMN priority TYPE TEXT,
    DROP CONSTRAINT IF EXISTS alerts_priority_check,
    ADD CONSTRAINT alerts_priority_check CHECK (priority IN ('baixa', 'média', 'alta'));

-- Atualizar a tabela suggestions
ALTER TABLE suggestions
    ALTER COLUMN impact TYPE TEXT,
    DROP CONSTRAINT IF EXISTS suggestions_impact_check,
    ADD CONSTRAINT suggestions_impact_check CHECK (impact IN ('baixo', 'médio', 'alto')),
    ALTER COLUMN status TYPE TEXT,
    DROP CONSTRAINT IF EXISTS suggestions_status_check,
    ADD CONSTRAINT suggestions_status_check CHECK (status IN ('pendente', 'implementada', 'rejeitada')); 