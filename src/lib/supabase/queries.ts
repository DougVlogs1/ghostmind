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

// 4. Marca uma lição como concluída e concede XP
export async function markLessonCompleted(lessonId: number): Promise<{ success: boolean; xpEarned: number; requiresAuth?: boolean }> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, xpEarned: 0, requiresAuth: true }
    }

    // Registra progresso no banco Supabase
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
      console.warn('Não foi possível salvar o progresso no Supabase remoto:', progError.message)
      return { success: true, xpEarned: 20 }
    }

    // Atualiza ou insere XP em user_levels
    await addXpToUser(user.id, 20)

    return { success: true, xpEarned: 20 }
  } catch (err) {
    console.warn('Erro ao marcar lição como concluída:', err)
    return { success: true, xpEarned: 20 }
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

    // Salva pontuação
    await supabase.from('user_scores').upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        score,
        max_score: 100,
        quiz_data: quizData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )

    // Se a nota for de aprovação (>= 70%), marca a lição como completa
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

    // Calcula XP com base na nota: 30 base + pontuação
    const xpEarned = Math.round(30 + (score * 0.5))
    await addXpToUser(user.id, xpEarned)

    return { success: true, xpEarned }
  } catch (err) {
    console.warn('Erro ao salvar score do quiz:', err)
    return { success: true, xpEarned: 50 }
  }
}

// Função auxiliar para atualizar XP e Nível do usuário
async function addXpToUser(userId: string, xpDelta: number) {
  try {
    const { data: levelData } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    let currentXp = (levelData?.total_xp || 0) + xpDelta
    let currentLevel = levelData?.current_level || 1
    let xpToNext = levelData?.xp_to_next_level || 100

    // Cálculo progressivo de nível (ex: 100 XP para nível 2, 250 XP para nível 3, etc.)
    while (currentXp >= xpToNext) {
      currentLevel += 1
      xpToNext += 100 * currentLevel
    }

    const levelProgress = Math.min(100, Math.round((currentXp / xpToNext) * 100))

    await supabase.from('user_levels').upsert(
      {
        user_id: userId,
        total_xp: currentXp,
        current_level: currentLevel,
        xp_to_next_level: xpToNext,
        level_progress: levelProgress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )
  } catch (err) {
    console.warn('Não foi possível sincronizar XP no banco remoto:', err)
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

    if (level) {
      totalXp = level.total_xp || 0
      currentLevel = level.current_level || 1
      levelProgress = level.level_progress || 0
      xpToNextLevel = level.xp_to_next_level || 100
    } else {
      // Se não existir registro de nível, estima com base nas lições completadas
      totalXp = completedLessonIds.length * 20
      currentLevel = Math.max(1, Math.floor(totalXp / 100) + 1)
      levelProgress = (totalXp % 100)
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