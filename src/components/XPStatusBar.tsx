'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { computeLevelFromXp } from '@/lib/supabase/queries'

interface XPStatusBarProps {
  userId: string
  isMobile?: boolean
}

export default function XPStatusBar({ userId, isMobile = false }: XPStatusBarProps) {
  const [level, setLevel] = useState(1)
  const [totalXp, setTotalXp] = useState(0)
  const [xpToNext, setXpToNext] = useState(100)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [pulse, setPulse] = useState(false)
  const [xpBadgeText, setXpBadgeText] = useState<string | null>(null)

  // Referência atômica para totalXp
  const totalXpRef = useRef(0)
  totalXpRef.current = totalXp

  const applyXpData = useCallback((data: { current_level?: number; total_xp?: number; xp_to_next_level?: number; level_progress?: number } | null) => {
    if (!data) return

    const raw = Number(data.total_xp) || 0
    const { level: lvl, levelProgress: lp, xpToNextLevel: xtn } = computeLevelFromXp(raw)

    setLevel(lvl)
    setTotalXp(raw)
    setXpToNext(xtn)
    setProgress(lp)
  }, [])

  const fetchUserLevel = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .select('current_level, total_xp, xp_to_next_level, level_progress')
        .eq('user_id', userId)
        .maybeSingle()

      if (data && !error) {
        applyXpData(data)
      } else {
        // Fallback resiliente: conta lições completadas
        const { data: progressRows } = await supabase
          .from('user_progress')
          .select('completed')
          .eq('user_id', userId)
          .eq('completed', true)

        const count = progressRows?.length ?? 0
        const estimatedXp = count * 20
        const { level: lvl, levelProgress: lp, xpToNextLevel: xtn } = computeLevelFromXp(estimatedXp)
        setLevel(lvl)
        setTotalXp(estimatedXp)
        setXpToNext(xtn)
        setProgress(lp)
      }
    } catch (err) {
      console.warn('Erro ao carregar nível do usuário:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, applyXpData])

  useEffect(() => {
    if (!userId) return
    let isMounted = true

    // 1. Busca dados iniciais
    fetchUserLevel()

    // 2. Realtime subscription para sincronização instantânea
    const channel = supabase
      .channel(`user-xp-bar-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_levels',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (!isMounted || !payload.new) return
          applyXpData(payload.new as any)
          setPulse(true)
          setTimeout(() => { if (isMounted) setPulse(false) }, 2500)
        }
      )
      .subscribe()

    // 3. Atualização otimista imediata: anima no exato milissegundo do evento
    const handleLocalXpUpdate = (e: Event) => {
      if (!isMounted) return
      const customEvent = e as CustomEvent<{ xpEarned?: number }>
      const delta = customEvent?.detail?.xpEarned

      if (typeof delta === 'number' && delta > 0) {
        const nextTotal = totalXpRef.current + delta
        const { level: lvl, levelProgress: lp, xpToNextLevel: xtn } = computeLevelFromXp(nextTotal)

        setLevel(lvl)
        setTotalXp(nextTotal)
        setXpToNext(xtn)
        setProgress(lp)
        setXpBadgeText(`+${delta} XP!`)
        setPulse(true)

        setTimeout(() => {
          if (isMounted) {
            setPulse(false)
            setXpBadgeText(null)
          }
        }, 3000)
      }

      // Reconcilia com os dados gravados no banco
      setTimeout(() => {
        if (isMounted) {
          fetchUserLevel()
        }
      }, 500)
    }

    window.addEventListener('pense-brasil-xp-updated', handleLocalXpUpdate)

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
      window.removeEventListener('pense-brasil-xp-updated', handleLocalXpUpdate)
    }
  }, [userId, fetchUserLevel, applyXpData])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 animate-pulse">
        <div className="w-12 h-4 bg-slate-200 rounded"></div>
        <div className="w-14 h-2 bg-slate-200 rounded-full"></div>
      </div>
    )
  }

  // Versão Mobile (Card expandido e rico no drawer/menu)
  if (isMobile) {
    return (
      <Link
        href="/dashboard"
        className={`block p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/80 border border-emerald-200 transition-all shadow-xs ${
          pulse ? 'ring-2 ring-emerald-400 scale-[1.02] shadow-md bg-emerald-100/70' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg bg-br-green text-white text-xs font-black tracking-wider uppercase shadow-xs">
              Nível {level}
            </span>
            <span className="text-xs font-bold text-slate-700">Cidadão Consciente</span>
          </div>
          <div className="flex items-center gap-1.5">
            {xpBadgeText && (
              <span className="animate-bounce text-xs font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                {xpBadgeText}
              </span>
            )}
            <span className="text-xs font-extrabold text-emerald-800">
              {totalXp} XP
            </span>
          </div>
        </div>

        {/* Barra de Progresso Mobile */}
        <div className="w-full bg-slate-200/90 rounded-full h-2.5 overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-br-green via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-xs"
            style={{ width: `${Math.max(4, Math.min(100, progress))}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 font-medium">
          <span>Progresso do Nível ({progress}%)</span>
          <span>
            {xpToNext - totalXp > 0
              ? `${xpToNext - totalXp} XP para Nível ${level + 1}`
              : 'Nível Máximo Alcançado'}
          </span>
        </div>
      </Link>
    )
  }

  // Versão Desktop (Pill refinado, interativo e com feedback tátil na Navbar)
  return (
    <Link
      href="/dashboard"
      title={`Nível ${level} • ${totalXp} XP acumulados (${Math.max(0, xpToNext - totalXp)} XP para o próximo nível)`}
      className={`group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-emerald-50/90 border border-emerald-200/80 hover:border-emerald-300 hover:shadow-xs transition-all duration-300 relative ${
        pulse ? 'ring-2 ring-emerald-400 bg-emerald-100 scale-105 shadow-sm' : ''
      }`}
    >
      {/* Badge de Nível */}
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-br-green text-white text-[11px] font-black tracking-wider uppercase shadow-xs group-hover:bg-br-green-dark transition-colors">
        Nv. {level}
      </span>

      {/* Barra de Progresso + Contagem Numérica */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 leading-none">
          <span className="text-emerald-800 font-extrabold">{totalXp}</span>
          <span className="text-slate-400 text-[9px] font-medium ml-1">/ {xpToNext} XP</span>
        </div>
        <div className="w-20 sm:w-24 h-2 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-br-green to-emerald-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
          />
        </div>
      </div>

      {/* Feedback animado de XP Ganho */}
      {xpBadgeText ? (
        <span className="animate-bounce text-[11px] font-black text-emerald-700 bg-emerald-100/90 border border-emerald-300 px-1.5 py-0.5 rounded-full shadow-xs">
          {xpBadgeText}
        </span>
      ) : pulse ? (
        <span className="animate-pulse text-[10px] font-extrabold text-emerald-600">
          +XP!
        </span>
      ) : null}
    </Link>
  )
}


