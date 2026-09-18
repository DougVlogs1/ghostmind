'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { BRAZILIAN_STATES, formatPhoneNumber, isValidPhone } from '@/lib/constants/brazil'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'MASCULINO' | 'FEMININO' | ''>('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // 1. Validações básicas
    if (!name.trim()) {
      setError('Por favor, informe seu nome completo.')
      setLoading(false)
      return
    }

    if (!email.trim()) {
      setError('Por favor, informe um e-mail válido.')
      setLoading(false)
      return
    }

    if (!phone.trim() || !isValidPhone(phone)) {
      setError('Por favor, informe um número de telefone válido com DDD (ex: (11) 98765-4321).')
      setLoading(false)
      return
    }

    if (!gender) {
      setError('Por favor, selecione seu sexo (Masculino ou Feminino).')
      setLoading(false)
      return
    }

    if (!state) {
      setError('Por favor, selecione seu Estado (UF).')
      setLoading(false)
      return
    }

    if (!city.trim()) {
      setError('Por favor, informe sua cidade.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas informadas não coincidem.')
      setLoading(false)
      return
    }

    try {
      const emailRedirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : redirectTo

      const metadataPayload = {
        full_name: name.trim(),
        phone: phone.trim(),
        gender: gender,
        state: state.trim(),
        city: city.trim(),
        avatar_url: '',
      }

      // 2. Registro no Supabase Auth com todos os metadados solicitados
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadataPayload,
          emailRedirectTo,
        },
      })

      if (signUpError) {
        throw signUpError
      }

      // 3. Atualiza tabela profiles se a sessão já estiver ativa
      if (data?.user) {
        try {
          await supabase.from('profiles').upsert(
            {
              id: data.user.id,
              full_name: name.trim(),
              avatar_url: '',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          )
        } catch {
          // profiles atualizado pelo trigger handle_new_user
        }
      }

      // Se a sessão já foi estabelecida imediatamente (login automático sem confirmação de email)
      if (data?.session) {
        router.push(redirectTo)
        router.refresh()
        return
      }

      setSuccess('Conta criada com sucesso! Verifique sua caixa de entrada para confirmar seu cadastro, ou faça login.')
      setTimeout(() => {
        router.push(`/login?registered=true&redirectTo=${encodeURIComponent(redirectTo)}`)
      }, 2000)
    } catch (err: any) {
      console.error('Erro no cadastro:', err)
      setError(err.message || 'Falha ao criar a conta. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Image
              src="/images/pense-brasil-logo-educacao-politica-financeira.webp"
              alt="Pense Brasil - Logo Educação Política e Financeira"
              width={64}
              height={64}
              className="h-16 w-16 object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Crie sua Conta Cidadã
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Educação política e financeira gratuita para transformar seu futuro
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-6 flex items-start gap-2.5">
            <span className="text-base font-bold">⚠️</span>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm mb-6 flex items-start gap-2.5 font-medium">
            <span className="text-base font-bold">✓</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome Completo */}
          <div>
            <label htmlFor="name" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              Nome Completo <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Douglas Felipe Becker"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
              E-mail <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Telefone e Sexo em Linha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Número de Telefone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Telefone Celular <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                required
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Sexo (MASCULINO / FEMININO) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Sexo <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 h-[42px]">
                <button
                  type="button"
                  onClick={() => setGender('MASCULINO')}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                    gender === 'MASCULINO'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>👨</span>
                  <span>Masculino</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGender('FEMININO')}
                  className={`flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl text-xs font-bold transition-all border ${
                    gender === 'FEMININO'
                      ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span>👩</span>
                  <span>Feminino</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estado e Cidade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Estado (UF) */}
            <div className="sm:col-span-1">
              <label htmlFor="state" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Estado (UF) <span className="text-rose-500">*</span>
              </label>
              <select
                id="state"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-900 bg-white"
              >
                <option value="">Selecione...</option>
                {BRAZILIAN_STATES.map((s) => (
                  <option key={s.uf} value={s.uf}>
                    {s.uf} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cidade */}
            <div className="sm:col-span-2">
              <label htmlFor="city" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Cidade <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Senha e Confirmação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="password" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Senha <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-900 placeholder:text-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
                  title={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                Confirmar Senha <span className="text-rose-500">*</span>
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-br-yellow hover:bg-yellow-300 text-br-blue font-extrabold text-sm shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-br-blue border-t-transparent rounded-full animate-spin"></div>
                  <span>Cadastrando...</span>
                </>
              ) : (
                <span>Criar Conta e Começar Trilha</span>
              )}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Já tem uma conta cadastrada?{' '}
          <Link href={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="font-bold text-br-green hover:underline">
            Entre aqui
          </Link>
        </div>
      </div>
    </div>
  )
}