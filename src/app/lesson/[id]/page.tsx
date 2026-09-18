'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getLessonByIdOrSlug, markLessonCompleted } from '@/lib/supabase/queries'
import { Lesson, EducationalModule } from '@/lib/educationalContent'

export default function LessonPage() {
  const params = useParams()
  const rawId = (params?.id as string) || ''

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [module, setModule] = useState<EducationalModule | null>(null)
  const [prevLesson, setPrevLesson] = useState<Lesson | null>(null)
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [completing, setCompleting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [xpEarnedNotice, setXpEarnedNotice] = useState<number | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  // Controla se o quiz desta lição foi aprovado (≥70%)
  const [quizPassed, setQuizPassed] = useState(false)

  useEffect(() => {
    async function loadLesson() {
      if (!rawId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await getLessonByIdOrSlug(rawId)
        if (data.lesson && data.module) {
          setLesson(data.lesson)
          setModule(data.module)
          setPrevLesson(data.previousLesson)
          setNextLesson(data.nextLesson)
          setIsCompleted(data.isCompleted)
          setIsAuthenticated(data.isAuthenticated)

          // Verifica se o quiz desta lição já foi aprovado (persiste entre visitas)
          const passed = localStorage.getItem(`quiz_passed_${data.lesson.id}`) === 'true'
          setQuizPassed(passed)
        } else {
          setLesson(null)
          setModule(null)
        }
      } catch (err) {
        console.error('Erro ao carregar lição:', err)
        setError('Não foi possível carregar a lição no momento.')
      } finally {
        setLoading(false)
      }
    }

    loadLesson()
  }, [rawId])

  const handleMarkAsCompleted = async () => {
    if (!lesson) return

    // Se o usuário estiver deslogado, convida a criar conta/logar com modal didático
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    if (isCompleted || completing) return
    setCompleting(true)

    try {
      const result = await markLessonCompleted(lesson.id)
      if (result.requiresAuth) {
        setShowAuthModal(true)
      } else if (result.success) {
        setIsCompleted(true)
        if (result.xpEarned > 0) {
          setXpEarnedNotice(result.xpEarned)
          setTimeout(() => setXpEarnedNotice(null), 4500)
        }
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('pense-brasil-xp-updated', {
              detail: { xpEarned: result.xpEarned, lessonId: lesson.id }
            })
          )
        }
      }
    } catch (err) {
      console.error('Erro ao salvar progresso:', err)
    } finally {
      setCompleting(false)
    }
  }

  // 1. Estado de Carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-4xl mx-auto">
          <div className="h-5 w-48 bg-slate-200 rounded mb-6"></div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 bg-slate-800 space-y-4">
              <div className="h-6 w-32 bg-slate-700 rounded"></div>
              <div className="h-8 w-2/3 bg-slate-700 rounded"></div>
              <div className="h-5 w-1/2 bg-slate-700/80 rounded"></div>
            </div>
            <div className="p-8 space-y-4">
              <div className="h-4 w-full bg-slate-200 rounded"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
              <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
              <div className="h-24 bg-slate-100 rounded-xl my-6"></div>
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Erro ao carregar lição</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl bg-br-blue text-white font-medium hover:bg-br-blue-dark transition-colors shadow-sm"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  // 3. Estado de Lição Inexistente (404 Real)
  if (!lesson || !module) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            🔍
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Lição não encontrada</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            A lição solicitada não foi localizada no catálogo ou o link informado está incorreto.
          </p>
          <Link
            href="/modules"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-br-green text-white font-medium hover:bg-br-green-dark transition-colors shadow-sm"
          >
            ← Voltar para o Catálogo de Módulos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegação Superior */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href={`/modules/${module.id}`}
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
            Voltar para {module.title}
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700">
              Lição {lesson.orderIndex} de {module.lessonsCount}
            </span>
            {!isAuthenticated && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Acesso Aberto
              </span>
            )}
          </div>
        </div>

        {/* Aviso flutuante de XP Ganho */}
        {xpEarnedNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-600 text-white shadow-lg flex items-center justify-between animate-fade-in border border-emerald-500">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold text-base">Lição concluída com sucesso!</p>
                <p className="text-xs text-emerald-100">
                  +{xpEarnedNotice} XP creditados à sua evolução no Pense Brasil.
                </p>
              </div>
            </div>
            <Link
              href={`/quiz/${lesson.id}`}
              className="px-3.5 py-1.5 rounded-lg bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm"
            >
              Fazer Quiz Agora →
            </Link>
          </div>
        )}

        {/* Cartão Principal da Lição */}
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Cabeçalho */}
          <header className="bg-gradient-to-r from-br-green to-emerald-800 text-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-1 rounded-md">
                {module.title}
              </span>
              <span className="text-xs text-emerald-100 flex items-center bg-black/20 px-2.5 py-1 rounded-md">
                ⏱ {lesson.duration} de estudo
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              {lesson.title}
            </h1>
            <p className="text-emerald-50 text-sm sm:text-base leading-relaxed max-w-3xl">
              {lesson.summary}
            </p>
          </header>

          {/* Banner Didático para Visitantes Deslogados */}
          {!isAuthenticated && (
            <div className="bg-amber-50 border-b border-amber-200/70 p-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-amber-900">
                <span className="text-lg">💡</span>
                <span>
                  Você está estudando como <strong>visitante</strong>. Toda a lição está liberada!
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/register?redirectTo=/lesson/${lesson.id}`}
                  className="px-3 py-1.5 rounded-lg bg-br-green text-white text-xs font-bold hover:bg-br-green-dark transition-colors"
                >
                  Criar Conta para Salvar XP
                </Link>
              </div>
            </div>
          )}

          {/* Conteúdo Didático */}
          <div className="p-6 sm:p-10">
            <div
              className="lesson-article max-w-none"
              dangerouslySetInnerHTML={{ __html: lesson.content }}
            />

            {/* Ação de Conclusão da Lição */}
            <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {isCompleted ? '✓ Você já concluiu esta lição' : 'Concluiu a leitura deste conteúdo?'}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isCompleted
                    ? 'Seu progresso está registrado. Agora faça o quiz para desbloquear a próxima lição.'
                    : isAuthenticated
                    ? 'Marque como concluída para registrar seu progresso e receber +20 XP.'
                    : 'Salve seu aprendizado e registre sua conquista na sua conta de cidadão.'}
                </p>
              </div>

              {!isCompleted ? (
                <button
                  onClick={handleMarkAsCompleted}
                  disabled={completing}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-all duration-150 disabled:opacity-50 flex-shrink-0"
                >
                  {completing ? 'Salvando...' : '✓ Marcar como Concluída (+20 XP)'}
                </button>
              ) : (
                <span className="inline-flex items-center px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200 flex-shrink-0">
                  ✓ Lição Concluída (+20 XP)
                </span>
              )}
            </div>

            {/* ─── CARD DE QUIZ OBRIGATÓRIO ─── */}
            {nextLesson && !quizPassed && (
              <div className="mt-6 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-extrabold text-amber-900 mb-1">
                      Próxima lição bloqueada — faça o Quiz primeiro!
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Para avançar para a próxima lição, você precisa concluir o quiz desta aula com aproveitamento mínimo de <strong>70%</strong>. Isso garante que você realmente dominou o conteúdo antes de prosseguir.
                    </p>
                  </div>
                  <Link
                    href={`/quiz/${lesson.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all hover:scale-105"
                  >
                    📝 Fazer Quiz Agora
                  </Link>
                </div>
              </div>
            )}

            {/* ─── DESBLOQUEADO: Quiz já aprovado ─── */}
            {nextLesson && quizPassed && (
              <div className="mt-6 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-extrabold text-emerald-900 mb-1">
                      Quiz aprovado! Próxima lição desbloqueada
                    </h3>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Excelente! Você demonstrou domínio do conteúdo. Continue sua trilha de aprendizado!
                    </p>
                  </div>
                  <Link
                    href={`/lesson/${nextLesson.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-extrabold text-sm shadow-md transition-all hover:scale-105"
                  >
                    Próxima Lição →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé de Navegação entre Lições e Quiz */}
          <footer className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            {prevLesson ? (
              <Link
                href={`/lesson/${prevLesson.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-white text-sm font-semibold transition-colors"
              >
                ← Lição Anterior
              </Link>
            ) : (
              <div className="hidden sm:block"></div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              {/* Botão do Quiz — sempre visível */}
              <Link
                href={`/quiz/${lesson.id}`}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-extrabold text-sm shadow-sm transition-colors ${
                  quizPassed
                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                    : 'bg-br-yellow hover:bg-yellow-400 text-br-blue'
                }`}
              >
                {quizPassed ? '✓ Quiz Concluído' : `📝 Fazer Quiz (${lesson.questions.length} questões)`}
              </Link>

              {/* Próxima Lição — só aparece se quiz aprovado */}
              {nextLesson && quizPassed && (
                <Link
                  href={`/lesson/${nextLesson.id}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-br-blue hover:bg-br-blue-dark text-white font-bold text-sm shadow-sm transition-colors"
                >
                  Próxima Lição →
                </Link>
              )}

              {/* Indicador bloqueado — se houver próxima e não passou no quiz */}
              {nextLesson && !quizPassed && (
                <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed select-none border border-slate-300">
                  🔒 Próxima Lição
                </span>
              )}
            </div>
          </footer>
        </article>

        {/* Modal Convidativo de Autenticação para Visitantes */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center relative">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
                title="Fechar"
              >
                ✕
              </button>

              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                🎯
              </div>

              <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                Salve seu Progresso e Ganhe XP
              </h2>
              <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                Você finalizou a leitura desta aula! Para marcar como concluída, acumular pontos de cidadania (XP) e desbloquear conquistas, acesse sua conta gratuita.
              </p>

              <div className="space-y-3">
                <Link
                  href={`/register?redirectTo=/lesson/${lesson.id}`}
                  className="w-full block py-3 px-4 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-colors"
                >
                  CRIAR CONTA GRATUITA
                </Link>

                <Link
                  href={`/login?redirectTo=/lesson/${lesson.id}`}
                  className="w-full block py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
                >
                  JÁ TENHO UMA CONTA / ENTRAR
                </Link>

                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-full block py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Continuar estudando como visitante
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}