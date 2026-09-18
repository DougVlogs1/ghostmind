'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllModulesWithProgress } from '@/lib/supabase/queries'
import { EducationalModule } from '@/lib/educationalContent'

type ModuleWithProgress = EducationalModule & {
  completedLessons: number
  progressPercentage: number
}

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleWithProgress[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadModules() {
      try {
        const { modules: loadedModules, isAuthenticated: authStatus } = await getAllModulesWithProgress()
        setModules(loadedModules)
        setIsAuthenticated(authStatus)
      } catch (err) {
        console.error('Erro ao carregar módulos:', err)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 border-4 border-br-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800">Carregando catálogo educacional...</h2>
          <p className="text-sm text-slate-500 mt-1">Sincronizando trilhas de aprendizagem cívica</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Convidativo para Visitante */}
        {!isAuthenticated && (
          <div className="max-w-4xl mx-auto mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="text-2xl flex-shrink-0">🎓</span>
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Bem-vindo ao Catálogo Aberto Pense Brasil
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Todas as 5 trilhas e 24 aulas estão disponíveis para degustação. Crie uma conta gratuita para registrar seu progresso, acumular XP e liberar certificados.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
              <Link
                href="/register?redirectTo=/modules"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-br-green hover:bg-br-green-dark text-white text-xs font-bold shadow-sm transition-colors text-center"
              >
                Criar Conta Gratuita
              </Link>
              <Link
                href="/login?redirectTo=/modules"
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors text-center"
              >
                Entrar
              </Link>
            </div>
          </div>
        )}

        {/* Cabeçalho da Página */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-br-green bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
            Trilhas de Cidadania e Economia
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Módulos Educacionais Pense Brasil
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Uma jornada progressiva, apartidária e didática para compreender a República, o funcionamento do Estado, o orçamento público e as finanças do dia a dia.
          </p>
        </div>

        {/* Grade com os 5 Módulos Reais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod) => {
            const isCompleted = mod.progressPercentage === 100
            const hasStarted = mod.completedLessons > 0

            return (
              <div
                key={mod.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden group"
              >
                {/* Faixa decorativa com a cor brasileira do módulo */}
                <div
                  className={`h-2.5 w-full ${
                    mod.color === 'br-green'
                      ? 'bg-br-green'
                      : mod.color === 'br-blue'
                      ? 'bg-br-blue'
                      : 'bg-br-yellow'
                  }`}
                />

                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Módulo {mod.orderIndex}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        ⏱ {mod.duration}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-br-blue transition-colors">
                      {mod.title}
                    </h2>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {mod.description}
                    </p>
                  </div>

                  {/* Barra de Progresso Real */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                      <span>
                        {mod.completedLessons} de {mod.lessonsCount} aulas concluídas
                      </span>
                      <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-700'}>
                        {mod.progressPercentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2 mb-5 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          mod.color === 'br-green'
                            ? 'bg-br-green'
                            : mod.color === 'br-blue'
                            ? 'bg-br-blue'
                            : 'bg-amber-400'
                        }`}
                        style={{ width: `${mod.progressPercentage}%` }}
                      ></div>
                    </div>

                    <Link
                      href={`/modules/${mod.id}`}
                      className={`w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : hasStarted
                          ? 'bg-br-blue hover:bg-br-blue-dark text-white'
                          : 'bg-br-green hover:bg-br-green-dark text-white'
                      }`}
                    >
                      {isCompleted ? '✓ Revisar Conteúdo' : hasStarted ? 'Continuar Trilha →' : 'Começar Módulo →'}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}