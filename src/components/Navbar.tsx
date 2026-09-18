'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import XPStatusBar from '@/components/XPStatusBar'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // 1. Obtém a sessão inicial
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (err) {
        setUser(null)
      } finally {
        setLoadingUser(false)
      }
    }

    checkUser()

    // 2. Escuta mudanças na autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setLoadingUser(false)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error('Erro ao sair:', err)
    }
  }

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Módulos', path: '/modules' },
    { name: 'Sobre o Projeto', path: '/about' },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-md text-slate-900 border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/images/logo.png"
                alt="Pense Brasil Logo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain group-hover:scale-105 transition-transform flex-shrink-0"
                priority
              />
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-br-green">Pense</span>
                <span className="text-br-blue"> Brasil</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.path ? 'text-br-green font-bold' : 'text-slate-600 hover:text-br-blue'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Botões de Ação Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {!loadingUser && (
              user ? (
                <div className="flex items-center space-x-3">
                  <XPStatusBar userId={user.id} />
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 rounded-xl bg-br-green hover:bg-br-green-dark text-white text-sm font-bold shadow-sm transition-colors"
                  >
                    Painel Cívico
                  </Link>
                  <Link
                    href="/profile"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors"
                  >
                    Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm text-slate-500 hover:text-rose-600 font-semibold transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-slate-700 hover:text-br-blue text-sm font-bold transition-colors"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-xl bg-br-yellow hover:bg-yellow-300 text-br-blue text-sm font-bold shadow-sm transition-colors"
                  >
                    Cadastre-se
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Botão Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Abrir menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-semibold ${
                  pathname === link.path
                    ? 'bg-emerald-50 text-br-green font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <div className="pb-1">
                  <XPStatusBar userId={user.id} isMobile />
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-br-green text-white font-bold text-sm shadow-sm"
                >
                  Painel Cívico
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm"
                >
                  Meu Perfil
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    handleLogout()
                  }}
                  className="block w-full text-center px-4 py-2 text-rose-600 font-semibold text-sm"
                >
                  Encerrar Sessão
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-sm"
                >
                  Entrar na Conta
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-br-yellow text-br-blue font-bold text-sm shadow-sm"
                >
                  Criar Conta Gratuita
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}