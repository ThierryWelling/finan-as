-- Drop existing table and recreate with camelCase columns
DROP TABLE IF EXISTS income CASCADE;

CREATE TABLE income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('salário', 'investimento', 'freelance', 'aluguel', 'outros')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT,
    date DATE NOT NULL,
    expectedDate DATE,
    recurring BOOLEAN DEFAULT false,
    frequency TEXT CHECK (frequency IN ('mensal', 'semanal', 'anual', 'único')) DEFAULT 'único',
    status TEXT CHECK (status IN ('pendente', 'recebido', 'atrasado')) DEFAULT 'pendente',
    userId UUID REFERENCES auth.users(id),
    createdAt TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes
CREATE INDEX income_userId_idx ON income("userId");
CREATE INDEX income_type_idx ON income(type);
CREATE INDEX income_date_idx ON income(date);
CREATE INDEX income_category_idx ON income(category);
CREATE INDEX income_status_idx ON income(status);
CREATE INDEX income_expectedDate_idx ON income("expectedDate");

-- Create trigger
CREATE TRIGGER update_income_updatedAt
    BEFORE UPDATE ON income
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 