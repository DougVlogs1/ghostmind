import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserDashboardStats } from '@/lib/supabase/queries'
import { educationalModules } from '@/lib/educationalContent'

// Garante que o Painel Cívico NUNCA utilize cache estático obsoleto
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  // 1. Validação segura do usuário no servidor via getUser()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login?redirectTo=/dashboard')
  }

  // 2. Busca perfil do usuário garantindo acesso irrestrito no servidor
  const adminClient = getSupabaseAdmin()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // 3. Busca estatísticas reais de aprendizagem e gamificação via AdminClient (evita RLS nulo no SSR)
  const stats = await getUserDashboardStats(user.id, adminClient)

  const displayName = profile?.full_name || profile?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Cidadão'
  const userAvatar = profile?.avatar_url || user.user_metadata?.avatar_url || ''
  const userCity = profile?.city || user.user_metadata?.city || ''
  const userState = profile?.state || user.user_metadata?.state || ''
  const userGender = profile?.gender || user.user_metadata?.gender || ''
  const locationTag = userCity && userState ? `${userCity} - ${userState}` : userState || ''

  // 4. Identifica a próxima lição recomendada de forma dinâmica (primeira aula que o usuário ainda NÃO completou)
  const allLessons = educationalModules.flatMap((m) => m.lessons)
  const nextRecommendedLesson = allLessons.find((l) => !stats.completedLessonIds.includes(l.id)) || allLessons[0]
  const allCompleted = stats.completedLessonsCount >= allLessons.length && allLessons.length > 0

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner de Boas-Vindas */}
        <div className="bg-gradient-to-r from-br-green via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Foto de Perfil no Dashboard com Fallback por Sexo */}
            <Link href="/profile" className="relative group flex-shrink-0" title="Ver ou editar perfil">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/80 shadow-md bg-emerald-700 flex items-center justify-center group-hover:border-br-yellow transition-all">
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : userGender === 'MASCULINO' ? (
                  <span className="text-4xl select-none">👨</span>
                ) : userGender === 'FEMININO' ? (
                  <span className="text-4xl select-none">👩</span>
                ) : (
                  <span className="text-3xl font-black text-br-yellow">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-br-yellow text-br-blue text-xs flex items-center justify-center font-bold shadow-xs">
                ✎
              </span>
            </Link>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                  <span>Nível {stats.currentLevel}</span>
                  <span>•</span>
                  <span className="text-br-yellow font-extrabold">{stats.totalXp} XP</span>
                </div>
                {locationTag && (
                  <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-100">
                    📍 {locationTag}
                  </span>
                )}
                {userGender && (
                  <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-emerald-100">
                    {userGender === 'MASCULINO' ? '👨 Masculino' : '👩 Feminino'}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Olá, {displayName}!
              </h1>
              <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
                Acompanhe sua evolução em política, instituições democráticas, orçamento público e finanças pessoais.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/modules"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-br-yellow text-br-blue font-bold text-sm hover:bg-yellow-300 transition-colors shadow-sm"
            >
              Explorar Trilhas →
            </Link>
            <Link
              href="/profile"
              className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-colors"
            >
              Editar Perfil
            </Link>
          </div>
        </div>

        {/* Indicadores Principais (KPIs Reais do Banco) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Aulas Concluídas */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-br-green flex items-center justify-center font-bold text-xl flex-shrink-0">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Lições Concluídas
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold text-slate-900">{stats.completedLessonsCount}</span>
                <span className="text-xs text-slate-500">de {stats.totalLessonsCount}</span>
              </div>
            </div>
          </div>

          {/* Nível e XP */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
              ⚡
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Nível {stats.currentLevel}
                </span>
                <span className="text-xs font-bold text-amber-600">{stats.totalXp} XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full"
                  style={{ width: `${stats.levelProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quizzes e Média */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-br-blue flex items-center justify-center font-bold text-xl flex-shrink-0">
              📊
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Média nos Quizzes
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold text-slate-900">
                  {stats.quizzesTaken > 0 ? `${stats.averageScore}%` : '—'}
                </span>
                <span className="text-xs text-slate-500">({stats.quizzesTaken} realizados)</span>
              </div>
            </div>
          </div>

          {/* Conquistas Cívicas */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
              🎖
            </div>
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Conquistas Ativas
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-extrabold text-slate-900">{stats.achievementsCount}</span>
                <span className="text-xs text-slate-500">distintivos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Central: Progresso nas Trilhas e Próxima Atividade */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progresso por Módulo (2 Colunas) */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Seu Progresso por Módulo</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Conclusão geral do currículo cívico e financeiro: <strong>{stats.overallProgressPercentage}%</strong>
                </p>
              </div>
              <Link
                href="/modules"
                className="text-xs sm:text-sm font-bold text-br-blue hover:text-br-green transition-colors"
              >
                Ver todos →
              </Link>
            </div>

            <div className="space-y-6">
              {stats.modulesProgress.map((mod) => (
                <div key={mod.moduleId} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <Link
                      href={`/modules/${mod.moduleId}`}
                      className="font-bold text-slate-800 hover:text-br-blue transition-colors flex items-center gap-2"
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          mod.color === 'br-green'
                            ? 'bg-br-green'
                            : mod.color === 'br-blue'
                            ? 'bg-br-blue'
                            : 'bg-amber-400'
                        }`}
                      />
                      {mod.title}
                    </Link>
                    <span className="text-xs font-semibold text-slate-600">
                      {mod.completedCount}/{mod.totalCount} aulas ({mod.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        mod.color === 'br-green'
                          ? 'bg-br-green'
                          : mod.color === 'br-blue'
                          ? 'bg-br-blue'
                          : 'bg-amber-400'
                      }`}
                      style={{ width: `${mod.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Próxima Lição Recomendada e Dica Cívica (1 Coluna) */}
          <div className="space-y-6">
            {/* Card de Estudo Imediato - Dinâmico */}
            {allCompleted ? (
              <div className="bg-gradient-to-br from-emerald-900 to-teal-800 text-white rounded-2xl p-6 shadow-sm border border-emerald-700">
                <span className="text-xs font-extrabold uppercase tracking-wider text-br-yellow block mb-2">
                  🏆 Parabéns, Cidadão Completo!
                </span>
                <h3 className="text-lg font-bold mb-2">
                  Currículo Cívico 100% Concluído!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 mb-5">
                  Você concluiu todas as 24 aulas da plataforma. Continue revisando os conceitos e praticando os quizzes para manter sua pontuação afiada!
                </p>
                <Link
                  href="/modules"
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-br-yellow text-br-blue font-bold text-sm shadow-sm hover:bg-yellow-300 transition-colors"
                >
                  Revisar Módulos →
                </Link>
              </div>
            ) : nextRecommendedLesson ? (
              <div className="bg-gradient-to-br from-slate-900 to-br-blue text-white rounded-2xl p-6 shadow-sm border border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-br-yellow block mb-2">
                  🚀 Próxima Parada Recomendada
                </span>
                <h3 className="text-lg font-bold mb-2">
                  {nextRecommendedLesson.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-5 line-clamp-2">
                  {nextRecommendedLesson.summary}
                </p>
                <Link
                  href={`/lesson/${nextRecommendedLesson.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-colors"
                >
                  Continuar Aprendendo →
                </Link>
              </div>
            ) : null}

            {/* Dica de Cidadania */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-amber-900">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 block mb-1">
                💡 Pílula de Cidadania
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-amber-950">
                O orçamento público do Brasil não é ilimitado: mais de 90% das receitas estão comprometidas com despesas obrigatórias. Entender o orçamento é o primeiro passo para fiscalizar com consciência.
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Distintivos e Conquistas Cívicas Ativas */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>🎖</span> Seus Distintivos Cívicos Desbloqueados
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Reconhecimentos oficiais pela sua dedicação ao conhecimento da cidadania e economia
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 self-start sm:self-auto">
              {stats.achievementsCount} de 12 desbloqueados
            </span>
          </div>

          {stats.achievementsList && stats.achievementsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.achievementsList.map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white hover:border-emerald-300 transition-all shadow-xs"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                    {ach.icon_emoji === 'seedling' && '🌱'}
                    {ach.icon_emoji === 'books' && '📚'}
                    {ach.icon_emoji === 'muscle' && '💪'}
                    {ach.icon_emoji === 'classical' && '🏛️'}
                    {ach.icon_emoji === 'money' && '💰'}
                    {ach.icon_emoji === 'brain' && '🧠'}
                    {ach.icon_emoji === 'medal' && '🏅'}
                    {ach.icon_emoji === 'question' && '❓'}
                    {ach.icon_emoji === 'star' && '⭐'}
                    {ach.icon_emoji === 'chart' && '📊'}
                    {ach.icon_emoji === 'magnifier' && '🔍'}
                    {ach.icon_emoji === 'rocket' && '🚀'}
                    {!['seedling', 'books', 'muscle', 'classical', 'money', 'brain', 'medal', 'question', 'star', 'chart', 'magnifier', 'rocket'].includes(ach.icon_emoji) && '🎖️'}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{ach.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        +{ach.points} XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ach.description}</p>
                    <span className="text-[10px] text-slate-400 mt-2 block">
                      Desbloqueado em {new Date(ach.earned_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-3xl block mb-2">🎯</span>
              <h4 className="text-sm font-bold text-slate-700">Nenhum distintivo conquistado ainda</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Conclua sua primeira lição e faça o quiz correspondente para desbloquear seu primeiro distintivo cívico!
              </p>
              <Link
                href="/modules"
                className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-br-green text-white font-bold text-xs hover:bg-br-green-dark transition-colors shadow-xs"
              >
                Começar Primeira Aula
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}