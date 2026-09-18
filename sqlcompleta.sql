-- =============================================================================
-- sqlcompleta.sql
-- PENSE BRASIL — Script SQL Único, Consolidado e Idempotente
-- =============================================================================
-- INSTRUÇÕES:
--   1. Abra o Supabase → SQL Editor
--   2. Cole este arquivo inteiro e clique em "Run"
--   3. Toda a estrutura será criada/atualizada sem riscos (totalmente idempotente)
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 1: EXTENSÕES
-- ─────────────────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 2: TABELAS FUNDAMENTAIS
-- ─────────────────────────────────────────────────────────────────────────────

-- 2.1 Perfis públicos dos usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username    CITEXT      UNIQUE,
  full_name   TEXT,
  avatar_url  TEXT,
  website     TEXT,
  bio         TEXT,
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT  username_length CHECK (username IS NULL OR CHAR_LENGTH(username) >= 3)
);

-- 2.2 Módulos Educacionais
CREATE TABLE IF NOT EXISTS public.modules (
  id              SERIAL      PRIMARY KEY,
  title           TEXT        NOT NULL,
  slug            TEXT        UNIQUE NOT NULL,
  description     TEXT,
  duration        TEXT,
  lessons_count   INTEGER     DEFAULT 0,
  order_index     INTEGER     DEFAULT 1,
  color           TEXT        DEFAULT 'br-green',
  is_published    BOOLEAN     DEFAULT TRUE,
  cover_image_url TEXT,
  created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2.3 Lições de cada módulo
CREATE TABLE IF NOT EXISTS public.lessons (
  id           SERIAL      PRIMARY KEY,
  module_id    INTEGER     REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title        TEXT        NOT NULL,
  slug         TEXT        UNIQUE NOT NULL,
  summary      TEXT,
  content      TEXT        NOT NULL DEFAULT '',
  duration     TEXT        DEFAULT '20 min',
  order_index  INTEGER     DEFAULT 1,
  is_published BOOLEAN     DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2.4 Questões de quiz por lição
CREATE TABLE IF NOT EXISTS public.questions (
  id               SERIAL      PRIMARY KEY,
  lesson_id        INTEGER     REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  text             TEXT        NOT NULL,
  explanation      TEXT,
  order_index      INTEGER     DEFAULT 1,
  difficulty_level INTEGER     DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2.5 Alternativas de resposta
CREATE TABLE IF NOT EXISTS public.answers (
  id          SERIAL      PRIMARY KEY,
  question_id INTEGER     REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  text        TEXT        NOT NULL,
  is_correct  BOOLEAN     DEFAULT FALSE,
  explanation TEXT,
  order_index INTEGER     DEFAULT 1,
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2.6 Progresso de lições por usuário
CREATE TABLE IF NOT EXISTS public.user_progress (
  id              SERIAL      PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lesson_id       INTEGER     REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed       BOOLEAN     DEFAULT FALSE,
  completion_date TIMESTAMPTZ,
  last_accessed   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, lesson_id)
);

-- 2.7 Pontuações de quizzes
CREATE TABLE IF NOT EXISTS public.user_scores (
  id          SERIAL        PRIMARY KEY,
  user_id     UUID          REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lesson_id   INTEGER       REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  score       NUMERIC(5,2)  NOT NULL DEFAULT 0.00,
  max_score   NUMERIC(5,2)  DEFAULT 100.00,
  attempts    INTEGER       DEFAULT 1,
  quiz_data   JSONB,
  created_at  TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, lesson_id)
);

-- 2.8 Conquistas (catálogo global)
CREATE TABLE IF NOT EXISTS public.achievements (
  id          SERIAL      PRIMARY KEY,
  name        TEXT        NOT NULL,
  slug        TEXT        UNIQUE NOT NULL,
  description TEXT,
  icon_url    TEXT,
  icon_emoji  TEXT        DEFAULT 'medal',
  points      INTEGER     DEFAULT 20,
  category    TEXT        DEFAULT 'geral',
  created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2.9 Conquistas obtidas por usuário
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id             SERIAL      PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  achievement_id INTEGER     REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_date    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  progress       INTEGER     DEFAULT 100,
  created_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, achievement_id)
);

-- 2.10 Níveis e XP do usuário
CREATE TABLE IF NOT EXISTS public.user_levels (
  id               SERIAL      PRIMARY KEY,
  user_id          UUID        REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  current_level    INTEGER     DEFAULT 1,
  total_xp         INTEGER     DEFAULT 0,
  xp_to_next_level INTEGER     DEFAULT 100,
  level_progress   INTEGER     DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 3: ÍNDICES DE PERFORMANCE
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_username        ON public.profiles         (username);
CREATE INDEX IF NOT EXISTS idx_modules_slug             ON public.modules           (slug);
CREATE INDEX IF NOT EXISTS idx_modules_order            ON public.modules           (order_index);
CREATE INDEX IF NOT EXISTS idx_modules_published        ON public.modules           (is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id        ON public.lessons           (module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_slug             ON public.lessons           (slug);
CREATE INDEX IF NOT EXISTS idx_lessons_order            ON public.lessons           (order_index);
CREATE INDEX IF NOT EXISTS idx_questions_lesson_id      ON public.questions         (lesson_id);
CREATE INDEX IF NOT EXISTS idx_answers_question_id      ON public.answers           (question_id);
CREATE INDEX IF NOT EXISTS idx_answers_is_correct       ON public.answers           (question_id, is_correct);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id    ON public.user_progress     (user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id  ON public.user_progress     (lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed  ON public.user_progress     (user_id, completed);
CREATE INDEX IF NOT EXISTS idx_user_scores_user_id      ON public.user_scores       (user_id);
CREATE INDEX IF NOT EXISTS idx_user_scores_lesson_id    ON public.user_scores       (lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_levels_user_id      ON public.user_levels       (user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user   ON public.user_achievements  (user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_slug        ON public.achievements       (slug);


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 4: FUNÇÕES E TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────

-- 4.1 Função genérica de atualização de updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_updated_at          ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_modules_updated_at           ON public.modules;
CREATE TRIGGER trg_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_lessons_updated_at           ON public.lessons;
CREATE TRIGGER trg_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_questions_updated_at         ON public.questions;
CREATE TRIGGER trg_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_answers_updated_at           ON public.answers;
CREATE TRIGGER trg_answers_updated_at
  BEFORE UPDATE ON public.answers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_progress_updated_at     ON public.user_progress;
CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_scores_updated_at       ON public.user_scores;
CREATE TRIGGER trg_user_scores_updated_at
  BEFORE UPDATE ON public.user_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_levels_updated_at       ON public.user_levels;
CREATE TRIGGER trg_user_levels_updated_at
  BEFORE UPDATE ON public.user_levels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_achievements_updated_at      ON public.achievements;
CREATE TRIGGER trg_achievements_updated_at
  BEFORE UPDATE ON public.achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_achievements_updated_at ON public.user_achievements;
CREATE TRIGGER trg_user_achievements_updated_at
  BEFORE UPDATE ON public.user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 4.2 Função de criação automática de perfil no signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_levels (user_id, current_level, total_xp, xp_to_next_level, level_progress)
  VALUES (NEW.id, 1, 0, 100, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 4.3 Função para manter lessons_count atualizado automaticamente
CREATE OR REPLACE FUNCTION public.update_module_lesson_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.modules SET lessons_count = (
      SELECT COUNT(*) FROM public.lessons WHERE module_id = OLD.module_id
    ) WHERE id = OLD.module_id;
    RETURN OLD;
  ELSE
    UPDATE public.modules SET lessons_count = (
      SELECT COUNT(*) FROM public.lessons WHERE module_id = NEW.module_id
    ) WHERE id = NEW.module_id;
    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_module_lesson_count ON public.lessons;
CREATE TRIGGER trg_update_module_lesson_count
  AFTER INSERT OR DELETE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_module_lesson_count();


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 5: ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.answers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scores       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_levels       ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "Perfis publicos sao visiveis por todos"       ON public.profiles;
DROP POLICY IF EXISTS "Usuarios podem inserir seu proprio perfil"    ON public.profiles;
DROP POLICY IF EXISTS "Usuarios podem atualizar seu proprio perfil"  ON public.profiles;
CREATE POLICY "Perfis publicos sao visiveis por todos"
  ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "Usuarios podem inserir seu proprio perfil"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Usuarios podem atualizar seu proprio perfil"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- conteúdo educacional (público para conteúdo publicado)
DROP POLICY IF EXISTS "Modulos visiveis por todos"    ON public.modules;
DROP POLICY IF EXISTS "Licoes visiveis por todos"     ON public.lessons;
DROP POLICY IF EXISTS "Perguntas visiveis por todos"  ON public.questions;
DROP POLICY IF EXISTS "Respostas visiveis por todos"  ON public.answers;
DROP POLICY IF EXISTS "Conquistas visiveis por todos" ON public.achievements;

CREATE POLICY "Modulos visiveis por todos"    
  ON public.modules FOR SELECT 
  USING (is_published = TRUE);

CREATE POLICY "Licoes visiveis por todos"     
  ON public.lessons FOR SELECT 
  USING (is_published = TRUE);

CREATE POLICY "Perguntas visiveis por todos"  
  ON public.questions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons
      WHERE public.lessons.id = public.questions.lesson_id
        AND public.lessons.is_published = TRUE
    )
  );

CREATE POLICY "Respostas visiveis por todos"  
  ON public.answers FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.questions
      JOIN public.lessons ON public.lessons.id = public.questions.lesson_id
      WHERE public.questions.id = public.answers.question_id
        AND public.lessons.is_published = TRUE
    )
  );

CREATE POLICY "Conquistas visiveis por todos" 
  ON public.achievements FOR SELECT 
  USING (TRUE);

-- user_progress
DROP POLICY IF EXISTS "Progresso visiivel pelo proprio usuario"  ON public.user_progress;
DROP POLICY IF EXISTS "Usuarios podem registrar seu progresso"   ON public.user_progress;
DROP POLICY IF EXISTS "Usuarios podem atualizar seu progresso"   ON public.user_progress;
CREATE POLICY "Progresso visiivel pelo proprio usuario"
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios podem registrar seu progresso"
  ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios podem atualizar seu progresso"
  ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- user_scores
DROP POLICY IF EXISTS "Scores visiveis pelo proprio usuario"  ON public.user_scores;
DROP POLICY IF EXISTS "Usuarios podem registrar seus scores"  ON public.user_scores;
DROP POLICY IF EXISTS "Usuarios podem atualizar seus scores"  ON public.user_scores;
CREATE POLICY "Scores visiveis pelo proprio usuario"
  ON public.user_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios podem registrar seus scores"
  ON public.user_scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuarios podem atualizar seus scores"
  ON public.user_scores FOR UPDATE USING (auth.uid() = user_id);

-- user_levels
DROP POLICY IF EXISTS "Niveis visiveis pelo proprio usuario"   ON public.user_levels;
DROP POLICY IF EXISTS "Usuarios podem gerenciar seus niveis"   ON public.user_levels;
CREATE POLICY "Niveis visiveis pelo proprio usuario"
  ON public.user_levels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios podem gerenciar seus niveis"
  ON public.user_levels FOR ALL USING (auth.uid() = user_id);

-- user_achievements
DROP POLICY IF EXISTS "Conquistas do usuario visiveis"           ON public.user_achievements;
DROP POLICY IF EXISTS "Usuarios podem gerenciar suas conquistas" ON public.user_achievements;
CREATE POLICY "Conquistas do usuario visiveis"
  ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuarios podem gerenciar suas conquistas"
  ON public.user_achievements FOR ALL USING (auth.uid() = user_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 6: SEED — 5 MÓDULOS EDUCACIONAIS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.modules (title, slug, description, duration, lessons_count, order_index, color, is_published) VALUES
  ('Fundamentos Políticos', 'fundamentos-politicos',
   'Entenda como funciona o sistema político brasileiro, os limites constitucionais dos governantes e a democracia representativa.',
   '4 horas', 5, 1, 'br-green', TRUE),
  ('Como Funciona o Estado Brasileiro', 'estado-brasileiro',
   'A organização do pacto federativo: União, Estados, Municípios, o papel do Judiciário e a cidadania participativa.',
   '3.5 horas', 4, 2, 'br-blue', TRUE),
  ('Educação Financeira Real', 'educacao-financeira',
   'Domine a inflação, o poder dos juros compostos, crédito responsável, reserva de emergência e investimentos fundamentais.',
   '4.5 horas', 5, 3, 'br-yellow', TRUE),
  ('Economia na Prática', 'economia-pratica',
   'Como o PIB, a Taxa Selic, o câmbio, o desemprego e a tributação influenciam o preço das coisas e os salários.',
   '4 horas', 5, 4, 'br-blue', TRUE),
  ('Pensamento Crítico e Análise de Informações', 'pensamento-critico',
   'Aprenda a diferenciar fatos de opiniões, identificar falácias argumentativas, desarmar vieses e interpretar dados estatísticos com rigor.',
   '3.5 horas', 5, 5, 'br-green', TRUE)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, description = EXCLUDED.description, duration = EXCLUDED.duration,
  lessons_count = EXCLUDED.lessons_count, order_index = EXCLUDED.order_index,
  color = EXCLUDED.color, updated_at = CURRENT_TIMESTAMP;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 7: SEED — 24 LIÇÕES (5+4+5+5+5)
-- ─────────────────────────────────────────────────────────────────────────────

-- Módulo 1
INSERT INTO public.lessons (module_id, title, slug, summary, duration, order_index) VALUES
  ((SELECT id FROM public.modules WHERE slug='fundamentos-politicos'),
   'O que o Presidente pode e não pode fazer','presidente-poderes-limites',
   'Compreenda as atribuições do Chefe do Executivo e o sistema de freios e contrapesos na República.','20 min',1),
  ((SELECT id FROM public.modules WHERE slug='fundamentos-politicos'),
   'Separação dos Poderes: Executivo, Legislativo e Judiciário','separacao-dos-poderes',
   'Entenda as funções típicas e atípicas dos três poderes que sustentam o Estado democrático.','25 min',2),
  ((SELECT id FROM public.modules WHERE slug='fundamentos-politicos'),
   'Como as Leis são criadas no Brasil','processo-legislativo-criacao-leis',
   'A jornada de um projeto de lei da iniciativa popular ou parlamentar até a publicação no Diário Oficial.','25 min',3),
  ((SELECT id FROM public.modules WHERE slug='fundamentos-politicos'),
   'O Orçamento Público: De onde vem e para onde vai o dinheiro','orcamento-publico-tributos',
   'PPA, LDO e LOA: entenda como o dinheiro arrecadado em impostos é planejado e fiscalizado.','30 min',4),
  ((SELECT id FROM public.modules WHERE slug='fundamentos-politicos'),
   'Partidos Políticos e Sistemas Eleitorais','partidos-sistemas-eleitorais',
   'Diferença entre sistema majoritário e proporcional, quociente eleitoral e o funcionamento das eleições.','25 min',5)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, duration=EXCLUDED.duration, order_index=EXCLUDED.order_index, updated_at=CURRENT_TIMESTAMP;

-- Módulo 2
INSERT INTO public.lessons (module_id, title, slug, summary, duration, order_index) VALUES
  ((SELECT id FROM public.modules WHERE slug='estado-brasileiro'),
   'Pacto Federativo: União, Estados e Municípios','pacto-federativo-competencias',
   'Quem é responsável por o quê: saúde, educação básica, segurança pública e iluminação das cidades.','25 min',1),
  ((SELECT id FROM public.modules WHERE slug='estado-brasileiro'),
   'O Poder Judiciário e o Papel do STF','judiciario-stf-guardiao-constituicao',
   'A estrutura dos tribunais, as instâncias recursais e o controle concentrado de constitucionalidade.','30 min',2),
  ((SELECT id FROM public.modules WHERE slug='estado-brasileiro'),
   'Ministérios, Autarquias e Agências Reguladoras','ministerios-agencias-reguladoras',
   'Entenda como a máquina pública funciona além dos políticos eleitos: Anvisa, Anatel, Banco Central e Ibama.','20 min',3),
  ((SELECT id FROM public.modules WHERE slug='estado-brasileiro'),
   'Cidadania Ativa: Como Fiscalizar e Participar','cidadania-ativa-fiscalizacao',
   'Portais de Transparência, Lei de Acesso à Informação (LAI), ouvidorias e conselhos municipais.','20 min',4)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, duration=EXCLUDED.duration, order_index=EXCLUDED.order_index, updated_at=CURRENT_TIMESTAMP;

-- Módulo 3
INSERT INTO public.lessons (module_id, title, slug, summary, duration, order_index) VALUES
  ((SELECT id FROM public.modules WHERE slug='educacao-financeira'),
   'Inflação e o Poder de Compra','inflacao-poder-de-compra',
   'Entenda como o IPCA é medido, por que os preços sobem e como proteger seu dinheiro da corrosão inflacionária.','25 min',1),
  ((SELECT id FROM public.modules WHERE slug='educacao-financeira'),
   'A Matemática dos Juros: Simples vs. Compostos','juros-simples-e-compostos',
   'Compreenda a força dos juros sobre juros nos investimentos e o perigo do efeito bola de neve nas dívidas.','30 min',2),
  ((SELECT id FROM public.modules WHERE slug='educacao-financeira'),
   'Crédito e Endividamento Consciente','credito-cet-endividamento',
   'O que é CET (Custo Efetivo Total), cheque especial, financiamentos e como sair do endividamento.','25 min',3),
  ((SELECT id FROM public.modules WHERE slug='educacao-financeira'),
   'Construindo sua Reserva de Emergência','reserva-de-emergencia',
   'Onde guardar, quanto acumular e por que liquidez diária e segurança superam a busca por alta rentabilidade aqui.','25 min',4),
  ((SELECT id FROM public.modules WHERE slug='educacao-financeira'),
   'Planejamento Financeiro: O Método 50/30/20','metodo-orcamentario-50-30-20',
   'Como organizar sua receita mensal entre necessidades básicas, estilo de vida e metas de futuro.','25 min',5)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, duration=EXCLUDED.duration, order_index=EXCLUDED.order_index, updated_at=CURRENT_TIMESTAMP;

-- Módulo 4
INSERT INTO public.lessons (module_id, title, slug, summary, duration, order_index) VALUES
  ((SELECT id FROM public.modules WHERE slug='economia-pratica'),
   'O que é o PIB e por que ele importa?','o-que-e-o-pib',
   'Produto Interno Bruto: como a riqueza de um país é gerada e medida.','25 min',1),
  ((SELECT id FROM public.modules WHERE slug='economia-pratica'),
   'Política Monetária e a Taxa Selic','politica-monetaria-taxa-selic',
   'Como o Copom utiliza a taxa básica de juros para frear a inflação ou estimular o crescimento.','30 min',2),
  ((SELECT id FROM public.modules WHERE slug='economia-pratica'),
   'Câmbio, Dólar e o Comércio Exterior','cambio-dolar-comercio-exterior',
   'Por que a cotação da moeda americana mexe com o pãozinho na padaria e os combustíveis.','25 min',3),
  ((SELECT id FROM public.modules WHERE slug='economia-pratica'),
   'Emprego, Produtividade e Renda','emprego-produtividade-renda',
   'A relação direta entre produtividade do trabalho, educação técnica e salários reais sustentáveis.','25 min',4),
  ((SELECT id FROM public.modules WHERE slug='economia-pratica'),
   'Arrecadação, Impostos e Carga Tributária','arrecadacao-impostos-carga-tributaria',
   'Entenda de onde vêm as receitas do governo: IR, ICMS, INSS, IOF e como eles afetam seu bolso.','30 min',5)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, duration=EXCLUDED.duration, order_index=EXCLUDED.order_index, updated_at=CURRENT_TIMESTAMP;

-- Módulo 5
INSERT INTO public.lessons (module_id, title, slug, summary, duration, order_index) VALUES
  ((SELECT id FROM public.modules WHERE slug='pensamento-critico'),
   'Fatos, Opiniões e Interpretações','fatos-opinioes-interpretacoes',
   'Aprenda a separar o que é dado objetivo do que é julgamento subjetivo e construir argumentos mais sólidos.','25 min',1),
  ((SELECT id FROM public.modules WHERE slug='pensamento-critico'),
   'As Principais Falácias Argumentativas','falacias-argumentativas',
   'Reconheça os erros lógicos mais usados em debates políticos e notícias para não ser enganado.','30 min',2),
  ((SELECT id FROM public.modules WHERE slug='pensamento-critico'),
   'Vieses Cognitivos e Como Nos Enganamos','vieses-cognitivos',
   'Confirmação, ancoragem, efeito halo: como o nosso cérebro nos sabota na hora de julgar informações.','25 min',3),
  ((SELECT id FROM public.modules WHERE slug='pensamento-critico'),
   'Como Verificar Fontes e Combater Desinformação','verificacao-fontes-desinformacao',
   'Técnicas práticas de checagem de fatos para proteger-se de fake news e desinformação viral.','25 min',4),
  ((SELECT id FROM public.modules WHERE slug='pensamento-critico'),
   'Estatísticas para Cidadãos: Leia Gráficos e Dados','estatisticas-para-cidadaos',
   'Aprenda a interpretar gráficos, médias, porcentagens e pesquisas de opinião sem ser induzido ao erro.','30 min',5)
ON CONFLICT (slug) DO UPDATE SET title=EXCLUDED.title, summary=EXCLUDED.summary, duration=EXCLUDED.duration, order_index=EXCLUDED.order_index, updated_at=CURRENT_TIMESTAMP;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 8: SEED — 12 CONQUISTAS
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.achievements (name, slug, description, icon_emoji, points, category) VALUES
  ('Primeiros Passos',       'primeiros-passos',       'Concluiu sua primeira lição na plataforma',                 'seedling',    20,  'iniciante'),
  ('Estudioso Cívico',       'estudioso-civico',        'Concluiu 5 lições completas',                               'books',       50,  'engajamento'),
  ('Cidadão Dedicado',       'cidadao-dedicado',        'Concluiu 10 lições completas',                              'muscle',      100, 'engajamento'),
  ('Mestre da República',    'mestre-da-republica',     'Concluiu todos os módulos de política e estado',            'classical',   150, 'conclusao'),
  ('Investidor Consciente',  'investidor-consciente',   'Concluiu o módulo de Educação Financeira Real',             'money',       100, 'financas'),
  ('Mente Crítica',          'mente-critica',           'Gabaritou um quiz com 100% de aproveitamento',              'brain',       50,  'desempenho'),
  ('Maratonista do Saber',   'maratonista-do-saber',    'Concluiu todos os 24 lições do currículo completo',         'medal',       200, 'conclusao'),
  ('Questionador Perspicaz', 'questionador-perspicaz',  'Realizou mais de 10 quizzes na plataforma',                 'question',    75,  'engajamento'),
  ('Nota Máxima',            'nota-maxima',             'Obteve 100% em qualquer quiz de alta dificuldade',          'star',        80,  'desempenho'),
  ('Economista Popular',     'economista-popular',      'Concluiu o módulo de Economia na Prática',                  'chart',       100, 'economia'),
  ('Detector de Fake News',  'detector-fake-news',      'Concluiu o módulo de Pensamento Crítico',                   'magnifier',   100, 'habilidade'),
  ('Nível 5 Alcançado',      'nivel-5',                 'Atingiu o Nível 5 na plataforma acumulando XP suficiente',  'rocket',      120, 'nivel')
ON CONFLICT (slug) DO UPDATE SET
  name=EXCLUDED.name, description=EXCLUDED.description, icon_emoji=EXCLUDED.icon_emoji,
  points=EXCLUDED.points, category=EXCLUDED.category, updated_at=CURRENT_TIMESTAMP;


-- =============================================================================
-- VERIFICAÇÃO FINAL (descomente para checar após executar)
-- =============================================================================
-- SELECT 'modules'  AS tabela, COUNT(*) AS total FROM public.modules
-- UNION ALL
-- SELECT 'lessons',  COUNT(*) FROM public.lessons
-- UNION ALL
-- SELECT 'achievements', COUNT(*) FROM public.achievements;
-- =============================================================================
-- FIM DO SCRIPT — PENSE BRASIL | sqlcompleta.sql
-- =============================================================================
