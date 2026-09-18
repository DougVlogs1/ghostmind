import Link from 'next/link'
import { educationalModules } from '@/lib/educationalContent'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section com Banner Oficial Pense Brasil */}
      <section 
        className="relative overflow-hidden text-white min-h-[calc(100vh-64px)] flex flex-col justify-center py-20 lg:py-28 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/images/banner.png")' }}
      >
        {/* Overlay translúcido de alto contraste para leitura perfeita sobre a imagem */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/75 to-slate-950/80 backdrop-blur-[2px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 rounded-full text-xs font-bold text-white mb-6">
            <span>🇧🇷 Plataforma Cívica Apartidária</span>
            <span>•</span>
            <span className="text-br-yellow font-bold">100% Gratuita</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight mb-6">
            Compreenda a República, a Economia e o seu Bolso.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Aprenda o que os governantes realmente podem fazer, como o orçamento público é distribuído e como gerenciar seu dinheiro com autonomia e pensamento crítico.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-br-yellow text-br-blue hover:bg-yellow-300 font-extrabold text-base shadow-lg shadow-yellow-500/10 transition-all transform hover:-translate-y-0.5"
            >
              Começar Agora Gratuitamente →
            </Link>

            <Link
              href="/modules"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition-all"
            >
              Explorar Catálogo ({educationalModules.length} Módulos)
            </Link>
          </div>

          {/* Destaques Rápidos */}
          <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-br-yellow">5</span>
              <span className="text-xs text-slate-400 font-medium">Módulos Essenciais</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-white">24</span>
              <span className="text-xs text-slate-400 font-medium">Lições Práticas</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-br-green-light">100%</span>
              <span className="text-xs text-slate-400 font-medium">Gabaritos Comentados</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-white">0</span>
              <span className="text-xs text-slate-400 font-medium">Viés Partidário</span>
            </div>
          </div>
        </div>
      </section>

      {/* Os 5 Pilares de Aprendizagem */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-br-green bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3 inline-block">
              Trilhas de Aprendizagem
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              O Que Você Irá Dominar
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              Um currículo estruturado para transformar cidadãos em observadores críticos e protagonistas do futuro do país.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educationalModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-slate-50 rounded-2xl p-7 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Módulo {mod.orderIndex}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      ⏱ {mod.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {mod.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {mod.lessons.length} aulas estruturadas
                  </span>

                  <Link
                    href={`/modules/${mod.id}`}
                    className="text-sm font-bold text-br-blue hover:text-br-green transition-colors"
                  >
                    Ver Ementa →
                  </Link>
                </div>
              </div>
            ))}

            {/* Card Chamada Especial */}
            <div className="bg-gradient-to-br from-br-blue to-slate-950 text-white rounded-2xl p-7 flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-br-yellow block mb-2">
                  Sistema de Evolução
                </span>
                <h3 className="text-xl font-bold mb-2">
                  Gamificação e Conquistas
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Ganhe pontos de experiência (XP), avance de nível e desbloqueie distintivos ao gabaritar quizzes e concluir módulos.
                </p>
              </div>

              <Link
                href="/register"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-br-yellow text-br-blue font-extrabold text-sm hover:bg-yellow-300 transition-colors shadow-sm"
              >
                Criar Minha Conta Grátis
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-br-green to-emerald-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Pronto para transformar sua visão sobre a política e a economia?
          </h2>
          <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Sem mensalidades, sem pegadinhas. Uma plataforma desenvolvida com amor pelo Brasil e compromisso com o conhecimento cívico.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-block px-8 py-4 rounded-2xl bg-br-yellow text-br-blue font-extrabold text-base hover:bg-yellow-300 transition-all shadow-lg shadow-black/10"
            >
              Criar Conta e Começar Agora
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}