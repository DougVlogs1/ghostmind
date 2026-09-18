'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

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

  useEffect(() => {
    if (!userId) return

    let isMounted = true

    // 1. Busca dados iniciais de nível e XP
    const fetchUserLevel = async () => {
      try {
        const { data, error } = await supabase
          .from('user_levels')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()

        if (!isMounted) return

        if (data && !error) {
          setLevel(data.current_level || 1)
          setTotalXp(data.total_xp || 0)
          setXpToNext(data.xp_to_next_level || 100)
          setProgress(data.level_progress ?? Math.min(100, Math.round(((data.total_xp || 0) / (data.xp_to_next_level || 100)) * 100)))
        } else {
          // Fallback: calcular pelas lições completadas
          const { data: progressRows } = await supabase
            .from('user_progress')
            .select('completed')
            .eq('user_id', userId)
            .eq('completed', true)

          if (isMounted) {
            const count = progressRows?.length || 0
            const calculatedXp = count * 20
            const calculatedLevel = Math.max(1, Math.floor(calculatedXp / 100) + 1)
            const targetXp = 100 * calculatedLevel
            setLevel(calculatedLevel)
            setTotalXp(calculatedXp)
            setXpToNext(targetXp)
            setProgress(Math.min(100, Math.round((calculatedXp / targetXp) * 100)))
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar nível do usuário:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchUserLevel()

    // 2. Realtime subscription na tabela user_levels
    const channel = supabase
      .channel(`user-xp-status-${userId}`)
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
          const newRow = payload.new as {
            current_level?: number
            total_xp?: number
            xp_to_next_level?: number
            level_progress?: number
          }

          setLevel(newRow.current_level || 1)
          setTotalXp(newRow.total_xp || 0)
          setXpToNext(newRow.xp_to_next_level || 100)
          setProgress(newRow.level_progress ?? Math.min(100, Math.round(((newRow.total_xp || 0) / (newRow.xp_to_next_level || 100)) * 100)))

          // Dispara micro-animação de conquista
          setPulse(true)
          setTimeout(() => {
            if (isMounted) setPulse(false)
          }, 2500)
        }
      )
      .subscribe()

    // 3. Listener para evento disparado na mesma aba (ex: conclusão imediata da lição ou quiz)
    const handleLocalXpUpdate = () => {
      fetchUserLevel()
      setPulse(true)
      setTimeout(() => {
        if (isMounted) setPulse(false)
      }, 2500)
    }

    window.addEventListener('pense-brasil-xp-updated', handleLocalXpUpdate)

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
      window.removeEventListener('pense-brasil-xp-updated', handleLocalXpUpdate)
    }
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 animate-pulse">
        <div className="w-12 h-4 bg-slate-200 rounded"></div>
        <div className="w-14 h-2 bg-slate-200 rounded-full"></div>
      </div>
    )
  }

  // Versão Mobile (Card expandido no menu)
  if (isMobile) {
    return (
      <Link
        href="/dashboard"
        className={`block p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 transition-all ${
          pulse ? 'ring-2 ring-emerald-400 scale-[1.02]' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-br-green text-white text-xs font-black tracking-wider uppercase shadow-xs">
              Nível {level}
            </span>
            <span className="text-xs font-bold text-slate-700">Cidadão Consciente</span>
          </div>
          <span className="text-xs font-extrabold text-emerald-800">
            {totalXp} XP
          </span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-br-green to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(5, Math.min(100, progress))}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
          <span>Progresso do Nível</span>
          <span>{xpToNext - totalXp > 0 ? `${xpToNext - totalXp} XP para Nível ${level + 1}` : 'Nível Máximo'}</span>
        </div>
      </Link>
    )
  }

  // Versão Desktop (Pill compacto e premium na Navbar)
  return (
    <Link
      href="/dashboard"
      title={`Nível ${level} • ${totalXp} XP acumulados (${Math.max(0, xpToNext - totalXp)} XP para o próximo nível)`}
      className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50/90 to-teal-50/90 border border-emerald-200/80 hover:border-emerald-300 hover:shadow-xs transition-all duration-300 ${
        pulse ? 'ring-2 ring-emerald-400 bg-emerald-100 scale-105' : ''
      }`}
    >
      {/* Badge de Nível */}
      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-br-green text-white text-[11px] font-black tracking-wider uppercase shadow-xs group-hover:bg-br-green-dark transition-colors">
        Nv. {level}
      </span>

      {/* Barra de Progresso + Contagem */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 leading-none">
          <span className="text-emerald-800 font-extrabold">{totalXp}</span>
          <span className="text-slate-400 text-[9px] font-medium ml-1">/ {xpToNext} XP</span>
        </div>
        <div className="w-16 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-br-green to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(6, Math.min(100, progress))}%` }}
          />
        </div>
      </div>

      {pulse && (
        <span className="animate-bounce text-[10px] font-extrabold text-emerald-600">
          +XP!
        </span>
      )}
    </Link>
  )
}
