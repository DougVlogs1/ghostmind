# Plataforma de Educação Política e Financeira

Uma plataforma educacional 100% gratuita, focada em educação política e financeira prática para o Brasil, com linguagem simples, didática, neutra e baseada em fatos históricos e dados.

## 🎯 Objetivo do Produto

- Tornar o usuário mais consciente politicamente
- Tornar o usuário mais inteligente financeiramente
- Combater desinformação
- Usar gamificação, simulações e testes interativos
- Ser acessível, responsivo e escalável
- Funcionar perfeitamente com Vercel + Supabase

## 🧱 Tecnologias Utilizadas

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database + RLS)
- PostgreSQL (via Supabase)
- Deploy compatível com Vercel

## 🚀 Como rodar o projeto localmente

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   ```bash
   cp .env.example .env.local
   ```
   Edite o arquivo `.env.local` com suas credenciais do Supabase:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🛠️ Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.io/)
2. Execute o script SQL em `supabase_schema.sql` no editor SQL do Supabase
3. Configure o Auth com email/password
4. Configure as políticas RLS conforme necessário

## 📁 Estrutura do Projeto

```
├── src/
│   ├── app/                 # App Router do Next.js
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   ├── dashboard/       # Dashboard do usuário
│   │   ├── modules/         # Lista de módulos
│   │   │   └── [id]/        # Detalhe do módulo
│   │   ├── lesson/          # Lições individuais
│   │   │   └── [id]/        # Detalhe da lição
│   │   ├── quiz/            # Testes/quizzes
│   │   │   └── [id]/        # Detalhe do quiz
│   │   ├── profile/         # Perfil do usuário
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Página inicial
│   ├── components/          # Componentes reutilizáveis
│   ├── lib/                 # Bibliotecas e utilitários
│   │   └── supabaseClient.ts # Cliente do Supabase
│   └── styles/              # Estilos globais
├── supabase_schema.sql      # Schema do banco de dados
└── README.md               # Este arquivo
```

## 🎮 Gamificação

O sistema inclui:

- Sistema de XP (experiência)
- Níveis de progresso
- Conquistas (badges)
- Ranking opcional
- Progresso visual por módulo

## 🧠 Conteúdo Educacional

### Módulo 1 — Fundamentos Políticos
- O que o presidente pode e não pode fazer
- Separação dos poderes
- Como leis são criadas
- Promessas vs realidade
- Populismo explicado com exemplos reais
- Casos internacionais (Argentina, Venezuela, Alemanha)

### Módulo 2 — Como Funciona o Estado Brasileiro
- Executivo, Legislativo e Judiciário
- Função de prefeitos, governadores e presidente
- Orçamento público
- Carga tributária explicada

### Módulo 3 — Educação Financeira Real
- Por que trabalhar não garante riqueza
- Inflação como perda invisível
- Juros e crédito
- Dívidas
- Cartão de crédito
- Reserva de emergência

### Módulo 4 — Economia na Prática
- Oferta e demanda
- Crises econômicas
- Como decisões políticas afetam preços
- Por que países quebram

### Módulo 5 — Pensamento Crítico
- Como identificar fake news
- Como políticos manipulam emoções
- Como não cair em golpes financeiros

## 🛡️ Neutralidade Política

A plataforma segue princípios estritos de neutralidade:
- Não usa nomes de partidos
- Não faz propaganda ideológica
- Não expressa opiniões pessoais
- Baseia-se em dados históricos
- Foca em consequências práticas
- Usa análises comparativas
- Mantém linguagem imparcial

## 🚀 Deploy

O projeto está configurado para deploy fácil no Vercel:

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no dashboard do Vercel
3. Faça o deploy automático em cada push

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estas etapas:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📧 Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.