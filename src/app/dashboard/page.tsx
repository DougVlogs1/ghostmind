import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUserDashboardStats } from '@/lib/supabase/queries'
import { educationalModules } from '@/lib/educationalContent'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()

  // 1. Validação segura do usuário no servidor via getUser()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login?redirectTo=/dashboard')
  }

  // 2. Busca perfil do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  // 3. Busca estatísticas reais de aprendizagem e gamificação
  const stats = await getUserDashboardStats(user.id)

  const displayName = profile?.full_name || profile?.username || user.email?.split('@')[0] || 'Cidadão'

  // Identifica a próxima lição recomendada (a primeira lição ainda não completada)
  let nextRecommendedLesson = educationalModules[0]?.lessons[0] || null

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner de Boas-Vindas */}
        <div className="bg-gradient-to-r from-br-green to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
              <span>Nível {stats.currentLevel}</span>
              <span>•</span>
              <span className="text-br-yellow font-extrabold">{stats.totalXp} XP Acumulados</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Olá, {displayName}!
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
              Bem-vindo ao seu painel cívico. Acompanhe sua evolução em política, instituições democráticas, orçamento público e finanças pessoais.
            </p>
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

        {/* Indicadores Principais (KPIs Reais) */}
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
            {/* Card de Estudo Imediato */}
            {nextRecommendedLesson && (
              <div className="bg-gradient-to-br from-slate-900 to-br-blue text-white rounded-2xl p-6 shadow-sm border border-slate-800">
                <span className="text-xs font-extrabold uppercase tracking-wider text-br-yellow block mb-2">
                  🚀 Próxima Parada
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
            )}

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
      </div>
    </div>
  )
}