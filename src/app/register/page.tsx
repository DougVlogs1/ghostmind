'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.')
      setLoading(false)
      return
    }

    try {
      const emailRedirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=/dashboard`
        : '/dashboard'

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            avatar_url: '',
          },
          emailRedirectTo,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // Se a sessão já foi estabelecida imediatamente (confirmação desabilitada)
      if (data?.session) {
        router.push('/dashboard')
        router.refresh()
        return
      }

      setSuccess('Conta criada com sucesso! Verifique sua caixa de entrada para confirmar o registro.')
      setName('')
      setEmail('')
      setPassword('')
    } catch (err: any) {
      console.error('Erro no cadastro:', err)
      setError(err.message || 'Falha ao criar a conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-br-green flex items-center justify-center mx-auto mb-3 font-bold text-xl">
            🇧🇷
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Crie sua Conta Gratuita
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Junte-se a cidadãos conscientes construindo um país mais informado
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-6 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
            />
          </div>

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
            <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-1">
              Senha (mínimo 6 caracteres)
            </label>
            <input
              type="password"
              id="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha segura"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-br-yellow hover:bg-yellow-300 text-br-blue font-bold text-sm shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Criando conta...' : 'Cadastrar e Começar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-bold text-br-green hover:underline">
            Entre aqui
          </Link>
        </div>
      </div>
    </div>
  )
}