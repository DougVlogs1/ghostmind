'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getModuleByIdOrSlug, ModuleWithLessons } from '@/lib/supabase/queries'

export default function ModuleDetailPage() {
  const params = useParams()
  const rawId = (params?.id as string) || ''

  const [module, setModule] = useState<ModuleWithLessons | null>(null)
  const [completedCount, setCompletedCount] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadModule() {
      if (!rawId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getModuleByIdOrSlug(rawId)

        if (data.module) {
          setModule(data.module)
          setCompletedCount(data.completedCount)
          setProgressPercentage(data.progressPercentage)
          setIsAuthenticated(data.isAuthenticated)
        } else {
          setModule(null)
        }
      } catch (err) {
        console.error('Erro ao carregar detalhe do módulo:', err)
        setError('Não foi possível carregar as informações do módulo no momento.')
      } finally {
        setLoading(false)
      }
    }

    loadModule()
  }, [rawId])

  // 1. Estado de Carregamento (Loading Skeleton)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="h-5 w-44 bg-slate-200 rounded mb-6"></div>

          {/* Banner Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-8 shadow-sm">
            <div className="p-8 bg-slate-800 space-y-4">
              <div className="flex gap-3">
                <div className="h-6 w-24 bg-slate-700 rounded"></div>
                <div className="h-6 w-28 bg-slate-700 rounded"></div>
              </div>
              <div className="h-9 w-3/4 bg-slate-700 rounded"></div>
              <div className="h-5 w-full max-w-xl bg-slate-700/80 rounded"></div>
              <div className="h-16 w-full max-w-md bg-slate-700/50 rounded-xl mt-6"></div>
            </div>
            {/* List Skeleton */}
            <div className="p-8 space-y-4">
              <div className="h-6 w-48 bg-slate-200 rounded mb-6"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-xl border border-slate-200"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Estado de Erro de Conexão
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Erro de Carregamento</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-br-blue text-white font-medium hover:bg-br-blue-dark transition-colors shadow-sm"
            >
              Tentar Novamente
            </button>
            <Link
              href="/modules"
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
            >
              Voltar ao Catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 3. Estado de Módulo Inexistente (404 Real)
  if (!module) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            🔍
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Módulo não encontrado</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            O identificador informado não corresponde a nenhuma trilha cadastrada em nossa plataforma.
          </p>
          <Link
            href="/modules"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-br-green text-white font-bold hover:bg-br-green-dark transition-colors shadow-sm"
          >
            ← Ver Todos os Módulos Disponíveis
          </Link>
        </div>
      </div>
    )
  }

  // Encontra a primeira lição pendente para o CTA principal
  const firstUncompletedLesson = module.lessons.find((l) => !l.completed) || module.lessons[0]
  const isAllCompleted = completedCount === module.lessons.length && module.lessons.length > 0
  const hasStarted = completedCount > 0

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegação Superior / Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/modules"
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-br-blue transition-colors group"
          >
            <svg
              className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Catálogo de Módulos
          </Link>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-700">
            {module.lessons.length} Aulas Interativas
          </span>
        </div>

        {/* Banner do Módulo */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div
            className={`p-6 sm:p-8 text-white relative ${
              module.color === 'br-green'
                ? 'bg-gradient-to-r from-br-green to-emerald-800'
                : module.color === 'br-blue'
                ? 'bg-gradient-to-r from-br-blue to-blue-900'
                : 'bg-gradient-to-r from-amber-500 to-amber-700'
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-md">
                Módulo {module.orderIndex}
              </span>
              <span className="text-xs font-medium bg-black/20 text-white px-2.5 py-1 rounded-md">
                ⏱ {module.duration} estimados
              </span>
              <span className="text-xs font-medium bg-white/20 text-white px-2.5 py-1 rounded-md">
                🎯 Trilha Apartidária
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
              {module.title}
            </h1>
            <p className="text-sm sm:text-base text-white/90 leading-relaxed mb-6 max-w-2xl">
              {module.description}
            </p>

            {/* Caixa de Progresso / Status do Aluno */}
            {isAuthenticated ? (
              <div className="bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/15 max-w-md">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5 text-white">
                  <span>Seu Progresso:</span>
                  <span>
                    {completedCount} de {module.lessons.length} aulas ({progressPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-br-yellow h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div className="bg-black/25 backdrop-blur-sm p-4 rounded-xl border border-white/20 max-w-lg">
                <div className="flex items-start gap-3">
                  <span className="text-xl">🔓</span>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-0.5">
                      Trilha de Acesso Aberto ao Cidadão
                    </h2>
                    <p className="text-xs text-white/90 leading-relaxed">
                      Você pode estudar as lições e fazer os exercícios gratuitamente. Para salvar seu progresso e acumular XP,{' '}
                      <Link href={`/register?redirectTo=/modules/${rawId}`} className="underline font-bold text-white hover:text-amber-200">
                        crie sua conta gratuita
                      </Link>.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Banner de Boas-Vindas para Convidado (Deslogado) */}
          {!isAuthenticated && (
            <div className="bg-emerald-50 border-b border-emerald-100 p-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-900">
                  Quer acompanhar sua evolução e emitir certificados cívicos?
                </p>
                <p className="text-xs text-emerald-700">
                  Crie sua conta em 30 segundos ou faça login para manter seu histórico salvo.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/register?redirectTo=/modules/${rawId}`}
                  className="px-3.5 py-1.5 rounded-lg bg-br-green text-white text-xs font-bold hover:bg-br-green-dark transition-colors shadow-sm"
                >
                  Criar Conta Grátis
                </Link>
                <Link
                  href={`/login?redirectTo=/modules/${rawId}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100/50 transition-colors"
                >
                  Entrar
                </Link>
              </div>
            </div>
          )}

          {/* Ação Principal Superior */}
          <div className="p-6 sm:px-8 bg-slate-50/50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {isAllCompleted
                  ? 'Você concluiu todas as lições deste módulo!'
                  : hasStarted
                  ? `Próxima aula: ${firstUncompletedLesson.title}`
                  : 'Comece pelo início da trilha formativa'}
              </h2>
              <p className="text-xs text-slate-500">
                Lições em linguagem clara, objetiva e com questionários práticos ao final.
              </p>
            </div>

            {firstUncompletedLesson && (
              <Link
                href={`/lesson/${firstUncompletedLesson.id}`}
                className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-center shadow-sm transition-all ${
                  isAllCompleted
                    ? 'bg-slate-800 hover:bg-slate-900 text-white'
                    : hasStarted
                    ? 'bg-br-blue hover:bg-br-blue-dark text-white'
                    : 'bg-br-green hover:bg-br-green-dark text-white'
                }`}
              >
                {isAllCompleted
                  ? 'Revisar Conteúdo da Trilha'
                  : hasStarted
                  ? 'Continuar Estudos →'
                  : 'Começar Primeira Aula →'}
              </Link>
            )}
          </div>

          {/* Ementa de Aulas */}
          <div className="p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center justify-between">
              <span>Conteúdo Programático</span>
              <span className="text-xs font-semibold text-slate-500">
                {module.lessons.length} aulas ordenadas
              </span>
            </h2>

            <div className="space-y-4">
              {module.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    lesson.completed
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        lesson.completed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {lesson.completed ? '✓' : idx + 1}
                    </span>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {lesson.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-2">
                        {lesson.summary}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span>⏱ {lesson.duration}</span>
                        <span>•</span>
                        <span className="text-br-blue font-semibold">
                          📝 Questionário ({lesson.questions.length} questões)
                        </span>
                        {lesson.completed && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 font-bold">✓ Concluída</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações da Lição */}
                  <div className="flex items-center gap-2 sm:self-center flex-shrink-0">
                    <Link
                      href={`/lesson/${lesson.id}`}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-colors ${
                        lesson.completed
                          ? 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          : 'bg-br-green hover:bg-br-green-dark text-white'
                      }`}
                    >
                      {lesson.completed ? 'Revisar Aula' : 'Estudar Aula →'}
                    </Link>

                    <Link
                      href={`/quiz/${lesson.id}`}
                      className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      title="Fazer Quiz Prático"
                    >
                      Quiz
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seção Educacional: O que você vai aprender */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-12">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-br-green">💡</span> Metodologia e Competências Desenvolvidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Rigor Técnico</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Conteúdos fundamentados na Constituição Federal, leis orçamentárias e indicadores macroeconômicos oficiais.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Total Apartidarismo</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Foco no funcionamento das instituições republicanas e na análise crítica de dados, sem vieses ideológicos.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-1">Prática e Fixação</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Cada aula possui simulados com respostas comentadas para garantir fixação imediata do aprendizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}