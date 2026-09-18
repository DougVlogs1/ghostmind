import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pense Brasil | Plataforma de Educação Política e Financeira',
  description: 'Aprenda sobre a Constituição, os Três Poderes, orçamento público, impostos, taxa Selic, inflação e investimentos de forma prática, apartidária e gratuita.',
  keywords: [
    'educação política',
    'educação financeira',
    'cidadania',
    'Constituição Brasileira',
    'Três Poderes',
    'taxa Selic',
    'inflação IPCA',
    'orçamento público',
    'investimentos básicos',
    'pensamento crítico'
  ],
  authors: [{ name: 'Pense Brasil' }],
  openGraph: {
    title: 'Pense Brasil | Educação Política e Financeira',
    description: 'Plataforma educacional gratuita para uma cidadania consciente, inteligente e autônoma.',
    url: 'https://pensebrasil.org',
    siteName: 'Pense Brasil',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2 space-y-3">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <Image
                    src="/images/logo.png"
                    alt="Pense Brasil Logo"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain opacity-90 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  />
                  <span className="text-xl font-extrabold tracking-tight">
                    <span className="text-br-green">Pense</span>
                    <span className="text-br-yellow"> Brasil</span>
                  </span>
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                  Plataforma educacional apartidária dedicada ao fortalecimento da cidadania, da compreensão do Estado e da liberdade financeira de todos os brasileiros.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                  Navegação
                </h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <Link href="/" className="hover:text-br-yellow transition-colors">
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link href="/modules" className="hover:text-br-yellow transition-colors">
                      Catálogo de Módulos
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-br-yellow transition-colors">
                      Meu Painel
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-br-yellow transition-colors">
                      Sobre o Projeto
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                  Acesso
                </h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <Link href="/login" className="hover:text-br-yellow transition-colors">
                      Entrar na Conta
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="hover:text-br-yellow transition-colors">
                      Cadastre-se Grátis
                    </Link>
                  </li>
                  <li>
                    <Link href="/forgot-password" className="hover:text-br-yellow transition-colors">
                      Recuperar Senha
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>&copy; {new Date().getFullYear()} Pense Brasil. Todos os direitos reservados.</p>
              <p className="text-slate-400">Desenvolvido com compromisso ético com a cidadania brasileira.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}