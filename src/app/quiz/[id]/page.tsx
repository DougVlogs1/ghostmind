'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getLessonByIdOrSlug, saveQuizScore } from '@/lib/supabase/queries'
import { Lesson, Question, EducationalModule } from '@/lib/educationalContent'

export default function QuizPage() {
  const params = useParams()
  const rawId = (params?.id as string) || ''

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [module, setModule] = useState<EducationalModule | null>(null)
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState<number>(0)
  const [xpEarned, setXpEarned] = useState<number>(0)
  const [savingScore, setSavingScore] = useState(false)

  useEffect(() => {
    async function loadQuiz() {
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
          setNextLesson(data.nextLesson)
          setIsAuthenticated(data.isAuthenticated)
        } else {
          setLesson(null)
          setModule(null)
        }
      } catch (err) {
        console.error('Erro ao carregar quiz:', err)
        setError('Não foi possível carregar a avaliação no momento.')
      } finally {
        setLoading(false)
      }
    }

    loadQuiz()
  }, [rawId])

  // 1. Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="max-w-3xl mx-auto">
          <div className="h-5 w-40 bg-slate-200 rounded mb-6"></div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 bg-slate-100 border-b border-slate-200 flex justify-between">
              <div className="h-6 w-1/3 bg-slate-200 rounded"></div>
              <div className="h-6 w-24 bg-slate-200 rounded"></div>
            </div>
            <div className="p-8 space-y-4">
              <div className="h-7 w-3/4 bg-slate-200 rounded mb-6"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-14 bg-slate-50 border border-slate-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 2. Erro de Conexão
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Erro ao carregar quiz</h2>
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

  // 3. Lição ou Questões Inexistentes (404 Real)
  if (!lesson || !module || !lesson.questions || lesson.questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-blue-100 text-br-blue rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            ❓
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz não localizado</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Não encontramos perguntas cadastradas para esta lição ou o link informado está incorreto.
          </p>
          <Link
            href="/modules"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-br-blue text-white font-medium hover:bg-br-blue-dark transition-colors shadow-sm"
          >
            ← Voltar para o Catálogo
          </Link>
        </div>
      </div>
    )
  }

  const questions = lesson.questions
  const currentQuestion: Question = questions[currentIndex]
  const totalQuestions = questions.length

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    let correctCount = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount += 1
      }
    })

    const finalScore = Math.round((correctCount / totalQuestions) * 100)
    setScore(finalScore)
    setIsSubmitted(true)

    // Se estiver logado, persiste pontuação e concede XP no Supabase
    if (isAuthenticated) {
      setSavingScore(true)
      try {
        const result = await saveQuizScore(lesson.id, finalScore, {
          selectedAnswers,
          correctCount,
          totalQuestions,
        })
        setXpEarned(result.xpEarned)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('pense-brasil-xp-updated', {
              detail: { xpEarned: result.xpEarned, lessonId: lesson.id }
            })
          )
        }
      } catch (err) {
        console.warn('Erro ao registrar pontuação no Supabase:', err)
      } finally {
        setSavingScore(false)
      }
    } else {
      // Para convidados, calcula o potencial de XP sem erro de autenticação
      const potentialXp = Math.round(30 + finalScore * 0.5)
      setXpEarned(potentialXp)
    }
  }

  const handleRetry = () => {
    setSelectedAnswers({})
    setIsSubmitted(false)
    setCurrentIndex(0)
    setScore(0)
  }

  const isCurrentAnswered = selectedAnswers[currentIndex] !== undefined
  const allAnswered = questions.every((_, idx) => selectedAnswers[idx] !== undefined)
  const isPassed = score >= 70

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho de Navegação */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/lesson/${lesson.id}`}
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
            Voltar para a Aula
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700">
              {module.title}
            </span>
            {!isAuthenticated && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                Simulado Aberto
              </span>
            )}
          </div>
        </div>

        {/* TELA DE RESULTADOS COM EXPLICAÇÃO EDUCATIVA COMPLETA */}
        {isSubmitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header do Resultado */}
            <div
              className={`p-8 text-white text-center ${
                isPassed
                  ? 'bg-gradient-to-r from-emerald-600 to-br-green'
                  : 'bg-gradient-to-r from-slate-700 to-br-blue'
              }`}
            >
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">{isPassed ? '🏆' : '📚'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">
                {isPassed ? 'Parabéns! Excelente Desempenho!' : 'Continue praticando! Quase lá!'}
              </h1>
              <p className="text-sm sm:text-base text-white/90 max-w-lg mx-auto leading-relaxed">
                {isPassed
                  ? 'Você demonstrou sólido domínio dos conceitos cívicos e institucionais abordados nesta aula.'
                  : 'A aprendizagem cívica é um processo contínuo. Revise os fundamentos comentados abaixo para fixar o conteúdo.'}
              </p>

              <div className="mt-6 inline-flex items-center gap-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20">
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/80 font-medium">Aproveitamento</span>
                  <span className="text-3xl font-extrabold">{score}%</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <div>
                  <span className="block text-xs uppercase tracking-wider text-white/80 font-medium">
                    {isAuthenticated ? 'XP Conquistado' : 'XP em Potencial'}
                  </span>
                  <span className="text-3xl font-extrabold text-br-yellow">+{xpEarned} XP</span>
                </div>
              </div>
            </div>

            {/* Banner Convidativo para Convidado (Deslogado) */}
            {!isAuthenticated && (
              <div className="bg-amber-50 border-b border-amber-200/80 p-5 sm:p-6 text-slate-800">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                      <span>⭐</span> Salve este resultado na sua Ficha Cidadã
                    </h2>
                    <p className="text-xs text-amber-800 leading-relaxed max-w-xl">
                      Você completou o questionário como convidado. Crie uma conta gratuita para registrar sua nota de <strong>{score}%</strong>, acumular <strong>+{xpEarned} XP</strong> e subir de nível cívico.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
                    <Link
                      href={`/register?redirectTo=/quiz/${lesson.id}`}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-xs shadow-sm transition-colors text-center"
                    >
                      CRIAR CONTA GRÁTIS
                    </Link>
                    <Link
                      href={`/login?redirectTo=/quiz/${lesson.id}`}
                      className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100/50 transition-colors text-center"
                    >
                      ENTRAR
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Gabarito Detalhado e Explicativo */}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center">
                <span>Gabarito Comentado e Explicações</span>
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Entenda o fundamento constitucional e técnico de cada resposta para fixar o aprendizado:
              </p>

              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx]
                  const isCorrect = userAnswer === q.correctAnswer

                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-xl border ${
                        isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                          }`}
                        >
                          {isCorrect ? '✓' : '✕'}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Questão {idx + 1}
                          </span>
                          <h3 className="text-base font-semibold text-slate-900 leading-snug">
                            {q.text}
                          </h3>
                        </div>
                      </div>

                      <div className="ml-9 space-y-2 text-sm">
                        <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                          <span className="text-xs font-semibold text-slate-500 block">Sua resposta:</span>
                          <span className={`font-medium ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {userAnswer !== undefined ? q.options[userAnswer] : 'Não respondida'}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                            <span className="text-xs font-semibold text-emerald-800 block">Resposta correta:</span>
                            <span className="font-medium text-emerald-900">
                              {q.options[q.correctAnswer]}
                            </span>
                          </div>
                        )}

                        {/* Explicação Didática */}
                        <div className="mt-3 p-3.5 rounded-lg bg-slate-100/90 border border-slate-200 text-slate-700">
                          <span className="text-xs font-bold uppercase tracking-wider text-br-blue block mb-1">
                            💡 Fundamento e Explicação Pedagógica:
                          </span>
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                            {q.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Botões de Ação Pós-Resultado */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleRetry}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors"
                >
                  🔄 Refazer Simulado
                </button>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                  <Link
                    href={`/modules/${module.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-br-blue text-br-blue hover:bg-blue-50 font-bold text-sm transition-colors"
                  >
                    Ver Ementa do Módulo
                  </Link>

                  {nextLesson && (
                    <Link
                      href={`/lesson/${nextLesson.id}`}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-colors"
                    >
                      Avançar para Próxima Lição →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TELA DE RESOLUÇÃO DO QUIZ */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Barra de Progresso do Quiz */}
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Avaliação Prática
                </span>
                <h1 className="text-base sm:text-lg font-bold text-slate-800 line-clamp-1">
                  {lesson.title}
                </h1>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs font-bold text-br-blue bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                  Questão {currentIndex + 1} de {totalQuestions}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-200 h-1.5">
              <div
                className="bg-br-green h-1.5 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>

            {/* Pergunta Atual */}
            <div className="p-6 sm:p-8">
              <span className="inline-block text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-br-blue mb-3">
                Pergunta #{currentIndex + 1}
              </span>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug mb-6">
                {currentQuestion.text}
              </h2>

              {/* Alternativas */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((optionText, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-br-green bg-emerald-50/50 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs mt-0.5 border ${
                          isSelected
                            ? 'bg-br-green text-white border-br-green'
                            : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span
                        className={`text-sm sm:text-base leading-relaxed ${
                          isSelected ? 'font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {optionText}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Controles de Navegação */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                  ← Anterior
                </button>

                {currentIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isCurrentAnswered}
                    className="px-6 py-2.5 rounded-xl bg-br-blue hover:bg-br-blue-dark text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-40"
                  >
                    Próxima Questão →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={!allAnswered || savingScore}
                    className="px-6 py-2.5 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-all disabled:opacity-40 flex items-center gap-2"
                  >
                    {savingScore ? 'Salvando nota...' : '✓ Finalizar e Ver Gabarito'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}