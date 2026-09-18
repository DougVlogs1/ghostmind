'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const messageParam = searchParams.get('message')
  const redirectToParam = searchParams.get('redirectTo') || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!email || !password) {
      setError('Por favor, informe seu e-mail e sua senha.')
      setLoading(false)
      return
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (signInError) {
        throw signInError
      }

      // Sincroniza os Server Components e navega
      router.push(redirectToParam)
      router.refresh()
    } catch (err: any) {
      console.error('Erro no login:', err)
      setError(err.message || 'Falha ao autenticar. Verifique suas credenciais.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-br-green flex items-center justify-center mx-auto mb-3 font-bold text-xl">
          🇧🇷
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Acesse sua Conta
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Continue sua evolução na plataforma Pense Brasil
        </p>
      </div>

      {messageParam && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-br-blue text-sm mb-6">
          {messageParam}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">
            E-mail
          </label>
          <input
            type="email"
            id="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-bold text-slate-700">
              Senha
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-br-blue hover:text-br-green transition-colors"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha de acesso"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
        >
          {loading ? 'Autenticando...' : 'Entrar na Plataforma'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Não possui uma conta?{' '}
        <Link href="/register" className="font-bold text-br-green hover:underline">
          Cadastre-se gratuitamente
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm text-slate-500">Carregando formulário de acesso...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}