-- Criação das tabelas para o projeto de educação política e financeira

-- Tabela de perfis (extensão da tabela de usuários do auth)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  constraint username_length check (char_length(username) >= 3)
);

-- Tabela de módulos
create table modules (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  duration text,
  lessons_count integer default 0,
  order_index integer
);

-- Tabela de lições
create table lessons (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  module_id integer references modules(id) on delete cascade not null,
  title text not null,
  content text,
  summary text,
  duration text,
  order_index integer
);

-- Tabela de perguntas
create table questions (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  lesson_id integer references lessons(id) on delete cascade not null,
  text text not null,
  order_index integer
);

-- Tabela de respostas
create table answers (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  question_id integer references questions(id) on delete cascade not null,
  text text not null,
  is_correct boolean default false,
  explanation text,
  order_index integer
);

-- Tabela de progresso do usuário
create table user_progress (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id integer references lessons(id) on delete cascade not null,
  completed boolean default false,
  completion_date timestamp with time zone,
  unique(user_id, lesson_id)
);

-- Tabela de pontuações do usuário
create table user_scores (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  lesson_id integer references lessons(id) on delete cascade not null,
  score numeric(5,2),
  max_score numeric(5,2),
  unique(user_id, lesson_id)
);

-- Tabela de conquistas
create table achievements (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  description text,
  icon_url text
);

-- Tabela de conquistas do usuário
create table user_achievements (
  id serial primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  achievement_id integer references achievements(id) on delete cascade not null,
  earned_date timestamp with time zone,
  unique(user_id, achievement_id)
);

-- Índices
create index profiles_user_id_idx on profiles (id);
create index modules_order_idx on modules (order_index);
create index lessons_module_id_idx on lessons (module_id);
create index questions_lesson_id_idx on questions (lesson_id);
create index answers_question_id_idx on answers (question_id);
create index user_progress_user_id_idx on user_progress (user_id);
create index user_progress_lesson_id_idx on user_progress (lesson_id);
create index user_scores_user_id_idx on user_scores (user_id);
create index user_scores_lesson_id_idx on user_scores (lesson_id);
create index user_achievements_user_id_idx on user_achievements (user_id);
create index user_achievements_achievement_id_idx on user_achievements (achievement_id);

-- Funções para atualizar timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
   NEW.updated_at = now();
   return NEW;
end;
$$ language 'plpgsql';

-- Triggers para atualizar timestamps
create trigger update_profiles_updated_at before update on profiles
  for each row execute procedure update_updated_at_column();

-- Políticas de segurança (RLS)
alter table profiles enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;
alter table user_progress enable row level security;
alter table user_scores enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;

-- Políticas para perfis
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Políticas para módulos
create policy "Modules are viewable by everyone."
  on modules for select
  using ( true );

-- Políticas para lições
create policy "Lessons are viewable by everyone."
  on lessons for select
  using ( true );

-- Políticas para perguntas
create policy "Questions are viewable by everyone."
  on questions for select
  using ( true );

-- Políticas para respostas
create policy "Answers are viewable by everyone."
  on answers for select
  using ( true );

-- Políticas para progresso do usuário
create policy "User progress is viewable by user."
  on user_progress for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own progress."
  on user_progress for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own progress."
  on user_progress for update
  using ( auth.uid() = user_id );

-- Políticas para pontuações do usuário
create policy "User scores are viewable by user."
  on user_scores for select
  using ( auth.uid() = user_id );

create policy "System can insert user scores."
  on user_scores for insert
  with check ( true );

create policy "System can update user scores."
  on user_scores for update
  using ( true );

-- Políticas para conquistas
create policy "Achievements are viewable by everyone."
  on achievements for select
  using ( true );

-- Políticas para conquistas do usuário
create policy "User achievements are viewable by user."
  on user_achievements for select
  using ( auth.uid() = user_id );

create policy "System can insert user achievements."
  on user_achievements for insert
  with check ( true );