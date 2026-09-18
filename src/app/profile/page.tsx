'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()

        if (!currentUser) {
          router.push('/login?redirectTo=/profile')
          return
        }

        setUser(currentUser)

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (profile) {
          setFullName(profile.full_name || '')
          setUsername(profile.username || '')
          setBio(profile.bio || '')
          setWebsite(profile.website || '')
        } else {
          setFullName(currentUser.user_metadata?.full_name || '')
        }
      } catch (err) {
        console.error('Erro ao carregar dados do perfil:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUpdating(true)
    setError('')
    setSuccess('')

    // Validação da constraint de username: mínimo 3 caracteres ou nulo
    const trimmedUsername = username.trim()
    if (trimmedUsername.length > 0 && trimmedUsername.length < 3) {
      setError('O nome de usuário deve ter pelo menos 3 caracteres (ou pode ser deixado em branco).')
      setUpdating(false)
      return
    }

    try {
      const { error: upsertError } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          full_name: fullName.trim(),
          username: trimmedUsername.length >= 3 ? trimmedUsername : null,
          bio: bio.trim(),
          website: website.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )

      if (upsertError) {
        throw new Error(upsertError.message)
      }

      setSuccess('Perfil salvo com sucesso!')
      setTimeout(() => setSuccess(''), 4000)
    } catch (err: any) {
      console.error('Erro ao atualizar perfil:', err)
      setError(err.message || 'Ocorreu um erro ao atualizar os dados. Tente novamente.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 border-4 border-br-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-slate-800">Carregando seu perfil...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-br-blue transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar ao Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-br-green to-emerald-800 p-6 sm:p-8 text-white flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-br-yellow text-br-blue flex items-center justify-center font-extrabold text-2xl shadow-sm flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'C'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Configurações do Perfil</h1>
              <p className="text-sm text-emerald-100 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-6 flex items-center gap-2">
                <span>✕</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm mb-6 flex items-center gap-2 font-medium">
                <span>✓</span>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Nome de Usuário (opcional)
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ex: joaosilva (mínimo 3 caracteres)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
                />
                <span className="text-xs text-slate-500 mt-1 block">
                  Identificador único usado nas conquistas e comunidade.
                </span>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Biografia ou Apresentação
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Conte um pouco sobre seus interesses em cidadania ou economia..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800 resize-none"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Website ou Rede Social
                </label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50"
                >
                  {updating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}