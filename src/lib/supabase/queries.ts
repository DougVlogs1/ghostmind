// Camada de serviços e queries com integração Supabase e resiliência
import { educationalModules, Lesson, EducationalModule, Question } from '@/lib/educationalContent'
import { supabase } from '@/lib/supabase/client'

export interface UserStats {
  completedLessonsCount: number
  totalLessonsCount: number
  overallProgressPercentage: number
  totalXp: number
  currentLevel: number
  levelProgress: number
  xpToNextLevel: number
  averageScore: number
  quizzesTaken: number
  achievementsCount: number
  modulesProgress: {
    moduleId: number
    title: string
    color: string
    completedCount: number
    totalCount: number
    percentage: number
  }[]
  recentActivities: {
    title: string
    type: 'lesson' | 'quiz'
    date: string
    score?: number
  }[]
}

// 1. Busca todos os módulos com progresso consolidado
export async function getAllModulesWithProgress(): Promise<{
  modules: (EducationalModule & { completedLessons: number; progressPercentage: number })[]
  isUsingFallback: boolean
  isAuthenticated: boolean
}> {
  let isUsingFallback = false
  let userProgressMap: Record<number, boolean> = {}
  let isAuthenticated = false

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isAuthenticated = true
      const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)

      if (progress) {
        progress.forEach((p) => {
          userProgressMap[p.lesson_id] = p.completed
        })
      }
    }
  } catch (err) {
    // Se a conexão com o Supabase falhar, o mapa de progresso fica vazio
    isUsingFallback = true
  }

  const modules = educationalModules.map((module) => {
    const completedCount = module.lessons.filter((l) => userProgressMap[l.id]).length
    const totalCount = module.lessons.length
    const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return {
      ...module,
      completedLessons: completedCount,
      progressPercentage: percentage,
    }
  })

  return { modules, isUsingFallback, isAuthenticated }
}

export type LessonWithProgress = Lesson & { completed: boolean }
export type ModuleWithLessons = Omit<EducationalModule, 'lessons'> & {
  lessons: LessonWithProgress[]
}

// 2. Busca módulo por ID ou Slug (resiliente para usuários logados e deslogados)
export async function getModuleById(idOrSlug: number | string): Promise<{
  module: ModuleWithLessons | null
  completedCount: number
  progressPercentage: number
  isAuthenticated: boolean
}> {
  if (idOrSlug === undefined || idOrSlug === null || idOrSlug === '') {
    return { module: null, completedCount: 0, progressPercentage: 0, isAuthenticated: false }
  }

  const numericId = typeof idOrSlug === 'number' ? idOrSlug : parseInt(String(idOrSlug), 10)
  const slugStr = String(idOrSlug).trim().toLowerCase()

  const foundModule = educationalModules.find((m) => {
    if (!isNaN(numericId) && m.id === numericId) return true
    if (m.slug.toLowerCase() === slugStr) return true
    if (m.id.toString() === slugStr) return true
    return false
  })

  if (!foundModule) {
    return { module: null, completedCount: 0, progressPercentage: 0, isAuthenticated: false }
  }

  let userProgressMap: Record<number, boolean> = {}
  let isAuthenticated = false

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isAuthenticated = true
      const { data: progress } = await supabase
        .from('user_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)

      if (progress) {
        progress.forEach((p) => {
          userProgressMap[p.lesson_id] = p.completed
        })
      }
    }
  } catch (err) {
    // Falha silenciosa de rede / visitante sem sessão
  }

  const lessonsWithProgress: LessonWithProgress[] = foundModule.lessons.map((lesson) => ({
    ...lesson,
    completed: !!userProgressMap[lesson.id],
  }))

  const completedCount = lessonsWithProgress.filter((l) => l.completed).length
  const totalCount = lessonsWithProgress.length
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return {
    module: {
      ...foundModule,
      lessons: lessonsWithProgress,
    },
    completedCount,
    progressPercentage,
    isAuthenticated,
  }
}
export const getModuleByIdOrSlug = getModuleById

// 3. Busca lição por ID ou Slug com navegação para anterior e próxima
export async function getLessonById(idOrSlug: number | string): Promise<{
  lesson: Lesson | null
  module: EducationalModule | null
  previousLesson: Lesson | null
  nextLesson: Lesson | null
  isCompleted: boolean
  isAuthenticated: boolean
}> {
  if (idOrSlug === undefined || idOrSlug === null || idOrSlug === '') {
    return {
      lesson: null,
      module: null,
      previousLesson: null,
      nextLesson: null,
      isCompleted: false,
      isAuthenticated: false,
    }
  }

  const numericId = typeof idOrSlug === 'number' ? idOrSlug : parseInt(String(idOrSlug), 10)
  const slugStr = String(idOrSlug).trim().toLowerCase()

  let foundLesson: Lesson | null = null
  let foundModule: EducationalModule | null = null

  for (const mod of educationalModules) {
    const l = mod.lessons.find((item) => {
      if (!isNaN(numericId) && item.id === numericId) return true
      if (item.slug.toLowerCase() === slugStr) return true
      if (item.id.toString() === slugStr) return true
      return false
    })
    if (l) {
      foundLesson = l
      foundModule = mod
      break
    }
  }

  if (!foundLesson || !foundModule) {
    return {
      lesson: null,
      module: null,
      previousLesson: null,
      nextLesson: null,
      isCompleted: false,
      isAuthenticated: false,
    }
  }

  const currentIndex = foundModule.lessons.findIndex((l) => l.id === foundLesson!.id)
  const previousLesson = currentIndex > 0 ? foundModule.lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < foundModule.lessons.length - 1 ? foundModule.lessons[currentIndex + 1] : null

  let isCompleted = false
  let isAuthenticated = false

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      isAuthenticated = true
      const { data: prog } = await supabase
        .from('user_progress')
        .select('completed')
        .eq('user_id', user.id)
        .eq('lesson_id', foundLesson.id)
        .maybeSingle()

      isCompleted = prog?.completed || false
    }
  } catch (err) {
    // Falha silenciosa de rede / visitante sem sessão
  }

  return {
    lesson: foundLesson,
    module: foundModule,
    previousLesson,
    nextLesson,
    isCompleted,
    isAuthenticated,
  }
}
export const getLessonByIdOrSlug = getLessonById

// ─────────────────────────────────────────────────────────────────────────────
// LÓGICA DE NÍVEIS E XP
//
// O XP é sempre acumulado absolutamente em `total_xp`.
// O threshold para cada nível segue a progressão:
//   Nível 1 → 100 XP para subir
//   Nível 2 → +150 XP (total: 250 XP)
//   Nível 3 → +200 XP (total: 450 XP)
//   Nível N → threshold(N) = N * (100 + 25*(N-1))
//
// `level_progress` é calculado dentro da faixa do nível atual (não sobre total).
// ─────────────────────────────────────────────────────────────────────────────
export function xpThresholdForLevel(level: number): number {
  // Threshold ABSOLUTO (acumulado) para COMPLETAR o nível `level`
  // threshold(1)=100, threshold(2)=250, threshold(3)=450, threshold(4)=700...
  return level * (100 + 25 * (level - 1))
}

export function computeLevelFromXp(totalXp: number): {
  level: number
  levelProgress: number
  xpToNextLevel: number
  prevThreshold: number
} {
  let level = 1
  while (xpThresholdForLevel(level) <= totalXp) {
    level++
  }
  // `level` é o nível atual (ainda não completado)
  const prevThreshold = level > 1 ? xpThresholdForLevel(level - 1) : 0
  const nextThreshold = xpThresholdForLevel(level)
  const xpInLevel = totalXp - prevThreshold
  const xpNeeded = nextThreshold - prevThreshold
  const levelProgress = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100))
  return { level, levelProgress, xpToNextLevel: nextThreshold, prevThreshold }
}

// Função auxiliar para atualizar XP e Nível do usuário
async function addXpToUser(userId: string, xpDelta: number) {
  if (xpDelta <= 0) return
  try {
    const { data: levelData } = await supabase
      .from('user_levels')
      .select('total_xp')
      .eq('user_id', userId)
      .maybeSingle()

    const prevTotalXp = levelData?.total_xp ?? 0
    const newTotalXp = prevTotalXp + xpDelta
    const { level, levelProgress, xpToNextLevel } = computeLevelFromXp(newTotalXp)

    const { error: upsertErr } = await supabase.from('user_levels').upsert(
      {
        user_id: userId,
        total_xp: newTotalXp,
        current_level: level,
        xp_to_next_level: xpToNextLevel,
        level_progress: levelProgress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

    if (upsertErr) {
      console.warn('Erro ao atualizar user_levels no Supabase:', upsertErr.message)
    }
  } catch (err) {
    console.warn('Não foi possível sincronizar XP no banco remoto:', err)
  }
}

// 4. Marca uma lição como concluída e concede XP
export async function markLessonCompleted(lessonId: number): Promise<{
  success: boolean
  xpEarned: number
  alreadyCompleted?: boolean
  requiresAuth?: boolean
}> {
  const XP_REWARD = 20
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, xpEarned: 0, requiresAuth: true }
    }

    // Verifica se já foi concluída para não duplicar XP
    const { data: existing } = await supabase
      .from('user_progress')
      .select('completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle()

    const alreadyCompleted = existing?.completed === true

    // Salva progresso no Supabase
    const { error: progError } = await supabase
      .from('user_progress')
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completion_date: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      )

    if (progError) {
      console.warn('user_progress upsert:', progError.message)
    }

    // Só concede XP na primeira conclusão
    if (!alreadyCompleted) {
      await addXpToUser(user.id, XP_REWARD)
      return { success: true, xpEarned: XP_REWARD }
    }

    return { success: true, xpEarned: 0, alreadyCompleted: true }
  } catch (err) {
    console.warn('Erro ao marcar lição como concluída:', err)
    return { success: true, xpEarned: XP_REWARD }
  }
}

// 5. Salva resultado de Quiz, pontuação e concede XP proporcional
export async function saveQuizScore(
  lessonId: number,
  score: number,
  quizData?: any
): Promise<{ success: boolean; xpEarned: number; requiresAuth?: boolean }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, xpEarned: 0, requiresAuth: true }
    }

    // Verifica melhor nota anterior
    const { data: existingScore } = await supabase
      .from('user_scores')
      .select('score')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle()

    const previousBest = Number(existingScore?.score ?? 0)

    // Salva pontuação (mantém a melhor nota)
    await supabase.from('user_scores').upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        score: Math.max(score, previousBest),
        max_score: 100,
        quiz_data: quizData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )

    // Se aprovado (>= 70%), marca a lição como concluída
    if (score >= 70) {
      await supabase.from('user_progress').upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completion_date: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      )
    }

    // XP: 30 base + metade da nota (máx ~80 XP com 100%)
    const xpEarned = Math.round(30 + score * 0.5)
    await addXpToUser(user.id, xpEarned)

    return { success: true, xpEarned }
  } catch (err) {
    console.warn('Erro ao salvar score do quiz:', err)
    return { success: true, xpEarned: 50 }
  }
}

// 6. Busca estatísticas do usuário para o Dashboard
export async function getUserDashboardStats(userId: string): Promise<UserStats> {
  let completedLessonIds: number[] = []
  let userScores: { score: number; lesson_id: number; created_at: string }[] = []
  let totalXp = 0
  let currentLevel = 1
  let levelProgress = 0
  let xpToNextLevel = 100

  try {
    // 1. Busca progresso de lições
    const { data: progress } = await supabase
      .from('user_progress')
      .select('lesson_id, completed, completion_date')
      .eq('user_id', userId)
      .eq('completed', true)

    if (progress) {
      completedLessonIds = progress.map((p) => p.lesson_id)
    }

    // 2. Busca scores de quizzes
    const { data: scores } = await supabase
      .from('user_scores')
      .select('score, lesson_id, created_at')
      .eq('user_id', userId)

    if (scores) {
      userScores = scores
    }

    // 3. Busca nível e XP
    const { data: level } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (level && level.total_xp !== undefined && level.total_xp !== null) {
      const raw = Number(level.total_xp) || 0
      const computed = computeLevelFromXp(raw)
      totalXp = raw
      currentLevel = computed.level
      levelProgress = computed.levelProgress
      xpToNextLevel = computed.xpToNextLevel
    } else {
      // Se não existir registro de nível, estima com base nas lições completadas
      totalXp = completedLessonIds.length * 20
      const computed = computeLevelFromXp(totalXp)
      currentLevel = computed.level
      levelProgress = computed.levelProgress
      xpToNextLevel = computed.xpToNextLevel
    }
  } catch (err) {
    console.warn('Erro ao carregar estatísticas do usuário no banco remoto:', err)
  }

  // Estatísticas globais
  const totalLessons = educationalModules.reduce((acc, m) => acc + m.lessons.length, 0)
  const completedCount = completedLessonIds.length
  const overallPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  const averageScore = userScores.length > 0
    ? Math.round(userScores.reduce((acc, s) => acc + (Number(s.score) || 0), 0) / userScores.length)
    : 0

  // Progresso por módulo
  const modulesProgress = educationalModules.map((module) => {
    const modCompleted = module.lessons.filter((l) => completedLessonIds.includes(l.id)).length
    const modTotal = module.lessons.length
    const modPercent = modTotal > 0 ? Math.round((modCompleted / modTotal) * 100) : 0

    return {
      moduleId: module.id,
      title: module.title,
      color: module.color,
      completedCount: modCompleted,
      totalCount: modTotal,
      percentage: modPercent,
    }
  })

  // Conquistas estimadas com base em marcos reais
  let achievementsCount = 0
  if (completedCount >= 1) achievementsCount += 1 // Primeiros Passos
  if (completedCount >= 5) achievementsCount += 1 // Estudioso
  if (completedCount >= 10) achievementsCount += 1 // Dedicado
  if (averageScore >= 80) achievementsCount += 1 // Bom Desempenho
  if (overallPercentage >= 50) achievementsCount += 1 // Meio Caminho

  return {
    completedLessonsCount: completedCount,
    totalLessonsCount: totalLessons,
    overallProgressPercentage: overallPercentage,
    totalXp,
    currentLevel,
    levelProgress,
    xpToNextLevel,
    averageScore,
    quizzesTaken: userScores.length,
    achievementsCount,
    modulesProgress,
    recentActivities: [],
  }
}