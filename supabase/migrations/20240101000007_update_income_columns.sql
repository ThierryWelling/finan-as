-- Renomear colunas para camelCase
ALTER TABLE income 
  RENAME COLUMN expected_date TO expectedDate;

-- Renomear índices
DROP INDEX IF EXISTS income_expected_date_idx;
CREATE INDEX income_expectedDate_idx ON income("expectedDate");

-- Atualizar trigger
DROP TRIGGER IF EXISTS update_income_updated_at ON income;
ALTER TABLE income RENAME COLUMN updated_at TO updatedAt;
ALTER TABLE income RENAME COLUMN created_at TO createdAt;

CREATE TRIGGER update_income_updatedAt
    BEFORE UPDATE ON income
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 