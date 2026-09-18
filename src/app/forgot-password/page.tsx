'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=/profile`
        : '/dashboard'

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      })

      if (resetError) {
        throw resetError
      }

      setMessage('Enviamos um link de recuperação para o seu e-mail. Verifique sua caixa de entrada e spam.')
    } catch (err: any) {
      setError(err.message || 'Não foi possível solicitar a recuperação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-br-blue flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            🔒
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Recuperação de Senha
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Digite seu e-mail cadastrado para receber as instruções de redefinição
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-6 font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-blue/50 focus:border-br-blue text-sm text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-br-blue hover:bg-br-blue-dark text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Enviando link...' : 'Enviar Link de Recuperação'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Lembrou sua senha?{' '}
          <Link href="/login" className="font-bold text-br-green hover:underline">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  )
}
