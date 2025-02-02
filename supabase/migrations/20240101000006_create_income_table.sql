-- Create income table
CREATE TABLE IF NOT EXISTS income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('salário', 'investimento', 'freelance', 'aluguel', 'outros')),
    amount DECIMAL(10,2) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    category TEXT,
    date DATE NOT NULL,
    expected_date DATE,
    recurring BOOLEAN DEFAULT false,
    frequency TEXT CHECK (frequency IN ('mensal', 'semanal', 'anual', 'único')) DEFAULT 'único',
    status TEXT CHECK (status IN ('pendente', 'recebido', 'atrasado')) DEFAULT 'pendente',
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS income_user_id_idx ON income(user_id);
CREATE INDEX IF NOT EXISTS income_type_idx ON income(type);
CREATE INDEX IF NOT EXISTS income_date_idx ON income(date);
CREATE INDEX IF NOT EXISTS income_category_idx ON income(category);
CREATE INDEX IF NOT EXISTS income_status_idx ON income(status);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_income_updated_at
    BEFORE UPDATE ON income
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 