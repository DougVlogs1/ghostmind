import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // 1. Valida autenticação do usuário
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado. Por favor, faça login novamente.' },
        { status: 401 }
      )
    }

    // 2. Extrai arquivo do FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo de imagem foi enviado.' },
        { status: 400 }
      )
    }

    // 3. Validações de tipo e tamanho
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'O arquivo selecionado deve ser uma imagem válida (PNG, JPG, WEBP, GIF).' },
        { status: 400 }
      )
    }

    const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'A imagem deve ter no máximo 5MB.' },
        { status: 400 }
      )
    }

    // 4. Determina extensão segura
    const extMatch = file.name.match(/\.([a-zA-Z0-9]+)$/)
    let extension = extMatch ? extMatch[1].toLowerCase() : 'jpg'
    if (extension === 'jpeg') extension = 'jpg'

    const fileName = `avatar-${Date.now()}.${extension}`
    const filePath = `${user.id}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 5. Upload seguro via Supabase Admin (Storage 'avatars')
    const admin = getSupabaseAdmin()

    const { error: uploadError } = await admin.storage
      .from('avatars')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      })

    if (uploadError) {
      console.error('Erro ao fazer upload no Supabase Storage:', uploadError)
      return NextResponse.json(
        { error: `Falha no armazenamento da imagem: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // 6. Obtém a URL pública do avatar
    const { data: publicUrlData } = admin.storage
      .from('avatars')
      .getPublicUrl(filePath)

    const avatarUrl = publicUrlData?.publicUrl

    if (!avatarUrl) {
      return NextResponse.json(
        { error: 'Não foi possível gerar o link público da imagem.' },
        { status: 500 }
      )
    }

    // 7. Atualiza a tabela profiles
    await admin.from('profiles').upsert(
      {
        id: user.id,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    // 8. Atualiza os metadados do usuário no Auth
    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...(user.user_metadata || {}),
        avatar_url: avatarUrl,
      },
    })

    return NextResponse.json({
      success: true,
      avatarUrl,
      message: 'Foto de perfil atualizada com sucesso!',
    })
  } catch (err: any) {
    console.error('Erro no processamento da foto de perfil:', err)
    return NextResponse.json(
      { error: err.message || 'Erro interno ao processar a foto de perfil.' },
      { status: 500 }
    )
  }
}
