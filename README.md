# Finanças IA - Gerenciador Financeiro Inteligente

Um aplicativo de administração financeira inteligente que utiliza IA para gerenciar automaticamente receitas, despesas e objetivos financeiros.

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase (Banco de dados e Autenticação)
- OpenAI GPT-4 (Recomendações inteligentes)
- React Hook Form
- Zod (Validação)
- Radix UI (Componentes de interface)

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Copie o arquivo `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

4. Configure as variáveis de ambiente no arquivo `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `OPENAI_API_KEY`: Chave da API da OpenAI

5. Configure o banco de dados Supabase:
- Crie as tabelas necessárias no Supabase:
  - transactions
  - budgets
  - financial_goals
  - ai_recommendations

6. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Funcionalidades

- Dashboard com visão geral das finanças
- Gerenciamento de transações (receitas e despesas)
- Definição e acompanhamento de objetivos financeiros
- Orçamentos por categoria
- Recomendações inteligentes baseadas em IA
- Sincronização automática entre frontend e backend
- Interface responsiva e moderna

## Estrutura do Projeto

```
src/
  ├── app/              # Páginas da aplicação
  ├── components/       # Componentes reutilizáveis
  ├── lib/             # Configurações e utilitários
  ├── types/           # Definições de tipos TypeScript
  └── styles/          # Estilos globais
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 