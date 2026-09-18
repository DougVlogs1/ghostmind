export const mockModules = [
  {
    id: 1,
    title: 'Educação Política',
    description: 'Compreenda como funciona o sistema político brasileiro e seus fundamentos democráticos.',
    lessons_count: 3,
    order_index: 1,
  },
  {
    id: 2,
    title: 'Educação Financeira',
    description: 'Aprenda conceitos práticos de finanças pessoais e economia para tomar decisões inteligentes.',
    lessons_count: 2,
    order_index: 2,
  },
  {
    id: 3,
    title: 'Pensamento Crítico',
    description: 'Desenvolva habilidades para identificar fake news e manipulações emocionais.',
    lessons_count: 1,
    order_index: 3,
  }
];

export const mockLessons = [
  // Aulas Módulo 1
  {
    id: 101,
    module_id: 1,
    title: 'Introdução à Democracia',
    content: '<h2>O que é Democracia?</h2><p>Democracia é um regime político em que todos os cidadãos elegíveis têm o direito de participar de forma igualitária...</p>',
    order_index: 1,
  },
  {
    id: 102,
    module_id: 1,
    title: 'Os Três Poderes',
    content: '<h2>Executivo, Legislativo e Judiciário</h2><p>No Brasil, os poderes são divididos para garantir o equilíbrio e evitar abusos...</p>',
    order_index: 2,
  },
  {
    id: 103,
    module_id: 1,
    title: 'O Sistema Eleitoral',
    content: '<h2>Como funciona o voto?</h2><p>O sistema eleitoral brasileiro é reconhecido mundialmente por sua agilidade e segurança, através das urnas eletrônicas...</p>',
    order_index: 3,
  },
  
  // Aulas Módulo 2
  {
    id: 201,
    module_id: 2,
    title: 'Planejamento Financeiro Básico',
    content: '<h2>Como organizar suas contas</h2><p>O primeiro passo para a liberdade financeira é saber exatamente o quanto você ganha e o quanto você gasta...</p>',
    order_index: 1,
  },
  {
    id: 202,
    module_id: 2,
    title: 'Juros Compostos',
    content: '<h2>A magia dos juros compostos</h2><p>Entender como os juros sobre juros funcionam é fundamental para fazer o dinheiro trabalhar para você...</p>',
    order_index: 2,
  },

  // Aulas Módulo 3
  {
    id: 301,
    module_id: 3,
    title: 'Identificando Fake News',
    content: '<h2>Verifique as fontes!</h2><p>Aprenda técnicas práticas para checar se uma notícia recebida nas redes sociais é verdadeira ou falsa...</p>',
    order_index: 1,
  }
];

export const mockProgress = [
  { lesson_id: 101, completed: true },
  { lesson_id: 102, completed: true },
  { lesson_id: 201, completed: true },
];
