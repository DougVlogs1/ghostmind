import Link from 'next/link'

export const metadata = {
  title: 'Sobre o Projeto | Pense Brasil',
  description: 'Conheça a missão, os princípios e o compromisso cívico e educacional da plataforma Pense Brasil.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Topo */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-br-blue bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-3">
            Nossa Missão Cívica
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Educação Política e Financeira para Todos os Brasileiros
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            O <strong>Pense Brasil</strong> nasceu com o propósito inegociável de democratizar o conhecimento cívico, o entendimento da República e a autonomia financeira, sem viés ideológico ou propaganda partidária.
          </p>
        </div>

        {/* Pilares Fundamentais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-br-green flex items-center justify-center text-2xl font-bold">
              🏛
            </div>
            <h2 className="text-xl font-bold text-slate-900">Democracia e Cidadania Real</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Explicamos com clareza o que o Presidente, governadores, prefeitos e parlamentares podem e não podem fazer. Ensinamos a fiscalizar o orçamento público e a cobrar resultados de forma técnica e consciente.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-br-blue flex items-center justify-center text-2xl font-bold">
              📈
            </div>
            <h2 className="text-xl font-bold text-slate-900">Economia sem Mistérios</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Desmistificamos o PIB, a taxa Selic, a inflação, o câmbio e a tributação. Mostramos como as decisões de política econômica repercutem diretamente no custo de vida, nos empregos e no supermercado.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
              💰
            </div>
            <h2 className="text-xl font-bold text-slate-900">Educação Financeira Prática</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Aprenda a construir sua reserva de emergência, escapar dos juros abusivos do rotativo do cartão e planejar seu orçamento familiar com o método 50/30/20 e investimentos seguros.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl font-bold">
              🔍
            </div>
            <h2 className="text-xl font-bold text-slate-900">Pensamento Crítico Rigoroso</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Capacitamos o cidadão a distinguir fatos de opiniões, desarmar falácias argumentativas, identificar o viés de confirmação e checar fontes antes de compartilhar informações nas redes.
            </p>
          </div>
        </div>

        {/* Compromisso Ético */}
        <div className="bg-gradient-to-br from-slate-900 to-br-blue rounded-3xl p-8 sm:p-10 text-white shadow-sm space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-br-yellow block">
            Compromisso de Imparcialidade
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pluralidade, Rigor Constitucional e Base Científica
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Em todos os temas onde há debate legítimo entre diferentes correntes do pensamento econômico ou político, apresentamos os argumentos, as evidências e os trade-offs de cada visão sem induzir preferência eleitoral. Nossa lealdade é com a Constituição da República e a cidadania brasileira.
          </p>

          <div className="pt-4">
            <Link
              href="/modules"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-br-yellow text-br-blue font-bold text-sm hover:bg-yellow-300 transition-colors shadow-sm"
            >
              Começar a Estudar Agora →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
