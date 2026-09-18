'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase/client'
import { BRAZILIAN_STATES, formatPhoneNumber, isValidPhone } from '@/lib/constants/brazil'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'MASCULINO' | 'FEMININO' | ''>('')
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      try {
        const { data: { user: currentUser }, error: authErr } = await supabase.auth.getUser()

        if (authErr || !currentUser) {
          router.push('/login?redirectTo=/profile')
          return
        }

        setUser(currentUser)

        // Extrai metadados do cadastro inicial
        const meta = currentUser.user_metadata || {}
        setFullName(meta.full_name || '')
        setPhone(meta.phone ? formatPhoneNumber(meta.phone) : '')
        setGender((meta.gender as any) || '')
        setState(meta.state || '')
        setCity(meta.city || '')
        setAvatarUrl(meta.avatar_url || '')

        // Busca dados adicionais da tabela profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        if (profile) {
          if (profile.full_name) setFullName(profile.full_name)
          if (profile.avatar_url) {
            setAvatarUrl(profile.avatar_url)
            if (typeof window !== 'undefined') localStorage.setItem('pb_avatar_url', profile.avatar_url)
          }
          setUsername(profile.username || '')
          setBio(profile.bio || '')
          setWebsite(profile.website || '')

          // Se a tabela tiver colunas phone/gender/state/city adicionadas
          if ((profile as any).phone) setPhone(formatPhoneNumber((profile as any).phone))
          if ((profile as any).gender) setGender((profile as any).gender)
          if ((profile as any).state) setState((profile as any).state)
          if ((profile as any).city) setCity((profile as any).city)
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  // Manipulador de Upload de Foto de Perfil (Desktop / Galeria do Celular)
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido (JPG, PNG, WEBP).')
      return
    }

    // Validação de tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem de perfil deve ter no máximo 5MB.')
      return
    }

    setUploadingAvatar(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Falha ao processar upload da foto.')
      }

      setAvatarUrl(result.avatarUrl)
      if (typeof window !== 'undefined') {
        localStorage.setItem('pb_avatar_url', result.avatarUrl)
      }
      setSuccess('Foto de perfil atualizada e salva com sucesso no Supabase!')
      setTimeout(() => setSuccess(''), 4500)

      // Força o cliente a recarregar a sessão com os metadados atualizados do servidor
      // Isso garante que o avatar persista após reload da página
      const { data: refreshData } = await supabase.auth.refreshSession()
      if (refreshData?.user) {
        setUser(refreshData.user)
      }

      // Notifica o Navbar para atualizar o avatar em tempo real (sem reload)
      window.dispatchEvent(new CustomEvent('pense-brasil-avatar-updated', { detail: { avatarUrl: result.avatarUrl } }))
    } catch (err: any) {
      console.error('Erro ao carregar avatar:', err)
      setError(err.message || 'Não foi possível carregar a imagem. Tente novamente.')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Remove a foto de perfil e volta para o avatar de gênero
  const handleRemoveAvatar = async () => {
    if (!user) return
    setUploadingAvatar(true)
    setError('')
    setSuccess('')
    try {
      // 1. Limpa no Supabase Auth metadata
      await supabase.auth.updateUser({ data: { avatar_url: '' } })

      // 2. Limpa na tabela profiles
      await supabase
        .from('profiles')
        .update({ avatar_url: '' })
        .eq('id', user.id)

      setAvatarUrl('')
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pb_avatar_url')
      }
      setSuccess('Foto de perfil removida com sucesso!')
      setTimeout(() => setSuccess(''), 4000)

      // Recarrega a sessão para persistir a remoção nos metadados
      const { data: refreshData } = await supabase.auth.refreshSession()
      if (refreshData?.user) {
        setUser(refreshData.user)
      }

      // Notifica o Navbar em tempo real
      window.dispatchEvent(new CustomEvent('pense-brasil-avatar-updated', { detail: { avatarUrl: '' } }))
    } catch (err: any) {
      console.error('Erro ao remover avatar:', err)
      setError(err.message || 'Não foi possível remover a foto. Tente novamente.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setUpdating(true)
    setError('')
    setSuccess('')

    if (!fullName.trim()) {
      setError('Por favor, informe seu nome completo.')
      setUpdating(false)
      return
    }

    if (phone.trim() && !isValidPhone(phone)) {
      setError('Por favor, informe um telefone válido com DDD (ex: (11) 98765-4321).')
      setUpdating(false)
      return
    }

    const trimmedUsername = username.trim()
    if (trimmedUsername.length > 0 && trimmedUsername.length < 3) {
      setError('O nome de usuário deve ter pelo menos 3 caracteres (ou pode ser deixado em branco).')
      setUpdating(false)
      return
    }

    try {
      const metadataUpdates = {
        full_name: fullName.trim(),
        phone: phone.trim(),
        gender: gender,
        state: state.trim(),
        city: city.trim(),
        avatar_url: avatarUrl,
      }

      // 1. Atualiza metadados do usuário no Supabase Auth
      const { error: authUpdateErr } = await supabase.auth.updateUser({
        data: metadataUpdates,
      })

      if (authUpdateErr) {
        console.warn('Aviso ao atualizar metadados do auth:', authUpdateErr.message)
      }

      // 2. Atualiza tabela profiles
      const profilePayload: any = {
        id: user.id,
        full_name: fullName.trim(),
        username: trimmedUsername.length >= 3 ? trimmedUsername : null,
        avatar_url: avatarUrl,
        bio: bio.trim(),
        website: website.trim(),
        updated_at: new Date().toISOString(),
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })

      if (upsertError) {
        throw new Error(upsertError.message)
      }

      setSuccess('Dados do perfil salvos com sucesso!')
      setTimeout(() => setSuccess(''), 4500)
    } catch (err: any) {
      console.error('Erro ao salvar dados do perfil:', err)
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
          <h2 className="text-xl font-bold text-slate-800">Carregando seus dados...</h2>
        </div>
      </div>
    )
  }

  const initial = (fullName || user?.email || 'C').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-slate-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navegação de Retorno */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-semibold text-slate-600 hover:text-br-blue transition-colors group"
          >
            <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">←</span>
            Voltar ao Painel Cívico
          </Link>

          <span className="text-xs font-bold text-slate-500 bg-slate-200/80 px-3 py-1 rounded-full">
            Perfil do Cidadão
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          {/* Top Banner com Foto Interativa */}
          <div className="bg-gradient-to-r from-br-green via-emerald-800 to-teal-900 p-6 sm:p-8 text-white relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Foto de Perfil com botão de upload */}
              <div className="relative group flex-shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/90 shadow-md bg-emerald-700 flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName || 'Foto de Perfil'}
                      className="w-full h-full object-cover"
                    />
                  ) : gender === 'MASCULINO' ? (
                    <span className="text-5xl leading-none select-none">👨</span>
                  ) : gender === 'FEMININO' ? (
                    <span className="text-5xl leading-none select-none">👩</span>
                  ) : (
                    <span className="text-3xl font-black text-br-yellow">
                      {initial}
                    </span>
                  )}

                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* Botão de Trocar Foto (Abre galeria do celular ou arquivo do PC) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-br-yellow hover:bg-yellow-300 text-br-blue flex items-center justify-center shadow-md transition-transform hover:scale-110 disabled:opacity-50"
                  title="Carregar foto do computador ou galeria do celular"
                >
                  📷
                </button>

                {/* Input Invisível para Galeria/Câmera */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
                  onChange={handleAvatarFileSelect}
                  className="hidden"
                />
              </div>

              {/* Informações Resumidas do Usuário */}
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-black text-white">
                  {fullName || 'Cidadão Consciente'}
                </h1>
                <p className="text-sm text-emerald-100 mt-0.5">{user?.email}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                  {gender && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                      {gender === 'MASCULINO' ? '👨 Masculino' : '👩 Feminino'}
                    </span>
                  )}
                  {city && state && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                      📍 {city} - {state}
                    </span>
                  )}
                  {phone && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                      📞 {phone}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all border border-white/30 backdrop-blur-xs disabled:opacity-50"
                  >
                    <span>{uploadingAvatar ? 'Processando...' : '📸 Alterar Foto de Perfil'}</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={uploadingAvatar}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white text-xs font-bold transition-all border border-rose-400/50 backdrop-blur-xs disabled:opacity-50"
                    >
                      <span>🗑️ Remover Foto</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Edição do Perfil */}
          <div className="p-6 sm:p-8">
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm mb-6 flex items-start gap-2.5">
                <span className="text-base font-bold">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm mb-6 flex items-start gap-2.5 font-medium">
                <span className="text-base font-bold">✓</span>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-extrabold text-slate-800 mb-1">
                  Dados de Identificação do Cidadão
                </h2>
                <p className="text-xs text-slate-500">
                  Estas informações são salvas na sua conta e ajudam a regionalizar as estatísticas de aprendizado.
                </p>
              </div>

              {/* Nome Completo e E-mail */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full_name" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    E-mail Cadastrado
                  </label>
                  <input
                    type="email"
                    id="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              {/* Telefone e Sexo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Número de Telefone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Número de Telefone Celular
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800 font-medium"
                  />
                </div>

                {/* Sexo (MASCULINO / FEMININO) */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Sexo
                  </label>
                  <div className="grid grid-cols-2 gap-2 h-[42px]">
                    <button
                      type="button"
                      onClick={() => setGender('MASCULINO')}
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
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
                      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Estado (UF) */}
                <div className="sm:col-span-1">
                  <label htmlFor="state" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Estado (UF)
                  </label>
                  <select
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800 font-medium bg-white"
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
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Nome de Usuário e Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label htmlFor="username" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Nome de Usuário (opcional)
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: douglasbecker (mínimo 3 caracteres)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Identificador público nas conquistas e ranking.
                  </span>
                </div>

                <div>
                  <label htmlFor="website" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                    Website ou Rede Social (opcional)
                  </label>
                  <input
                    type="url"
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://instagram.com/seu.perfil"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Biografia / Interesses */}
              <div>
                <label htmlFor="bio" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                  Biografia ou Interesses Cívicos
                </label>
                <textarea
                  id="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Compartilhe seus objetivos de estudo (ex: entender o orçamento público, planejamento financeiro)..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-br-green/50 focus:border-br-green text-sm text-slate-800 resize-none"
                />
              </div>

              {/* Ações */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500 text-center sm:text-left">
                  Seus dados são protegidos e utilizados para seu aprendizado.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Link
                    href="/dashboard"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors text-center"
                  >
                    Voltar
                  </Link>

                  <button
                    type="submit"
                    disabled={updating || uploadingAvatar}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-br-green hover:bg-br-green-dark text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Salvando...</span>
                      </>
                    ) : (
                      <span>Salvar Alterações</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}