export interface AnswerOption {
  id: number
  text: string
  isCorrect: boolean
  explanation: string
}

export interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty?: number
}

export interface Lesson {
  id: number
  moduleId: number
  title: string
  slug: string
  summary: string
  duration: string
  orderIndex: number
  content: string
  questions: Question[]
}

export interface EducationalModule {
  id: number
  title: string
  slug: string
  description: string
  duration: string
  lessonsCount: number
  orderIndex: number
  color: 'br-green' | 'br-blue' | 'br-yellow'
  lessons: Lesson[]
}

export const educationalModules: EducationalModule[] = [
  {
    id: 1,
    title: 'Fundamentos Políticos',
    slug: 'fundamentos-politicos',
    description: 'Entenda como funciona o sistema político brasileiro, os limites constitucionais dos governantes e a democracia representativa.',
    duration: '4 horas',
    lessonsCount: 5,
    orderIndex: 1,
    color: 'br-green',
    lessons: [
      {
        id: 101,
        moduleId: 1,
        title: 'O que o Presidente pode e não pode fazer',
        slug: 'presidente-poderes-limites',
        summary: 'Compreenda as atribuições do Chefe do Executivo e o sistema de freios e contrapesos na República.',
        duration: '20 min',
        orderIndex: 1,
        content: `
          <h2>Poderes e Limitações do Presidente da República</h2>
          <p>Na República Federativa do Brasil, o Presidente desempenha duas funções centrais: a de <strong>Chefe de Estado</strong> (representando o país perante as demais nações) e a de <strong>Chefe de Governo</strong> (liderando a administração pública federal e as políticas de governo).</p>

          <h3>O que o Presidente PODE fazer:</h3>
          <ul>
            <li><strong>Executar leis e políticas públicas:</strong> Administrar os recursos federais e colocar em prática as diretrizes aprovadas em lei.</li>
            <li><strong>Sancionar ou Vetar projetos de lei:</strong> Após aprovação pelo Congresso Nacional, o Presidente pode aprovar (sancionar) ou rejeitar total ou parcialmente (vetar) uma proposta.</li>
            <li><strong>Editar Medidas Provisórias (MPs):</strong> Em situações de urgência e relevância, com força de lei imediata, com validade máxima de até 120 dias, dependendo de posterior aprovação do Congresso.</li>
            <li><strong>Nomear ministros de Estado e dirigentes:</strong> Escolher a equipe ministerial e indicar ministros do STF e dirigentes de agências reguladoras (sujeito à sabatina e aprovação do Senado Federal).</li>
            <li><strong>Comando supremo das Forças Armadas:</strong> Exercer a autoridade máxima sobre Exército, Marinha e Aeronáutica dentro dos preceitos constitucionais.</li>
          </ul>

          <h3>O que o Presidente NÃO PODE fazer:</h3>
          <ul>
            <li><strong>Criar leis sozinho:</strong> Não pode legislar arbitrariamente fora dos limites constitucionais. Leis ordinárias e complementares dependem do Congresso Nacional.</li>
            <li><strong>Gastar sem previsão orçamentária:</strong> O Executivo só pode realizar despesas autorizadas pela Lei Orçamentária Anual (LOA) e leis de diretrizes aprovadas pelos parlamentares.</li>
            <li><strong>Interferir em decisões judiciais:</strong> O Judiciário é independente. Decisões do STF e tribunais devem ser cumpridas pelo Poder Executivo.</li>
            <li><strong>Fechar o Congresso ou dissolver tribunais:</strong> Atos contra o livre exercício dos poderes constituem crime de responsabilidade e atentado contra a ordem democrática.</li>
          </ul>

          <h3>O Sistema de Freios e Contrapesos (Checks and Balances)</h3>
          <p>Nenhum governante possui poder irrestrito. Se o Presidente vetar uma lei por discordância política, o Congresso pode derrubar esse veto por maioria absoluta. Se editar um ato incompatível com a Carta Magna, o Supremo Tribunal Federal pode declará-lo inconstitucional.</p>
        `,
        questions: [
          {
            id: 1001,
            text: 'Qual é o papel do Congresso Nacional caso o Presidente vete integralmente um projeto de lei aprovado?',
            options: [
              'O veto presidencial é absoluto e encerra a tramitação da proposta.',
              'O Congresso pode analisar as razões do veto e derrubá-lo por voto da maioria absoluta de deputados e senadores.',
              'O projeto de lei é enviado diretamente para referendo popular obrigatório.',
              'O Supremo Tribunal Federal é convocado para decidir se a lei entra em vigor.'
            ],
            correctAnswer: 1,
            explanation: 'Na Constituição Brasileira (art. 66), o veto presidencial não é irrecorrível: deputados e senadores, em sessão conjunta, podem rejeitar o veto por maioria absoluta, promulgando a lei.'
          },
          {
            id: 1002,
            text: 'O Presidente da República pode realizar gastos públicos não autorizados no orçamento aprovado pelo Congresso?',
            options: [
              'Sim, desde que considere a despesa de interesse social prioritário.',
              'Não, realizar despesas não previstas na Lei Orçamentária Anual (LOA) fere a Constituição e a Lei de Responsabilidade Fiscal.',
              'Sim, desde que comunique os tribunais em até 30 dias após o pagamento.',
              'Apenas se o valor não ultrapassar 50% de sua dotação ministerial.'
            ],
            correctAnswer: 1,
            explanation: 'O princípio da legalidade orçamentária veda o início de programas ou projetos não incluídos na lei orçamentária anual, sob pena de crime de responsabilidade.'
          }
        ]
      },
      {
        id: 102,
        moduleId: 1,
        title: 'Separação dos Poderes: Executivo, Legislativo e Judiciário',
        slug: 'separacao-dos-poderes',
        summary: 'Entenda as funções típicas e atípicas dos três poderes que sustentam o Estado democrático.',
        duration: '25 min',
        orderIndex: 2,
        content: `
          <h2>A Tripartição de Poderes no Brasil</h2>
          <p>Inspirada na teoria clássica de Montesquieu e inscrita no Artigo 2º da Constituição Federal de 1988, a organização do Estado brasileiro estabelece que são poderes da União, <strong>independentes e harmônicos entre si</strong>, o Legislativo, o Executivo e o Judiciário.</p>

          <h3>1. Poder Legislativo (Congresso Nacional)</h3>
          <p>Composto pela Câmara dos Deputados (representantes do povo) e pelo Senado Federal (representantes dos Estados e do DF).</p>
          <ul>
            <li><strong>Função típica:</strong> Propor, debater e aprovar leis, além de fiscalizar os atos do Executivo e gerenciar o orçamento nacional.</li>
            <li><strong>Função atípica:</strong> Julgar o Presidente em processos de impeachment (Senado) e administrar sua própria estrutura interna.</li>
          </ul>

          <h3>2. Poder Executivo (Governo)</h3>
          <p>Liderado pelo Presidente, Governadores e Prefeitos nos seus respectivos âmbitos.</p>
          <ul>
            <li><strong>Função típica:</strong> Administrar os serviços públicos essenciais (saúde, segurança, educação, infraestrutura) e executar as leis.</li>
            <li><strong>Função atípica:</strong> Editar Medidas Provisórias com força de lei e regulamentar normas através de decretos.</li>
          </ul>

          <h3>3. Poder Judiciário (Tribunais e Juízes)</h3>
          <p>Formado pelo STF, STJ, Tribunais Regionais Federais, Tribunais de Justiça estaduais e juízes de direito.</p>
          <ul>
            <li><strong>Função típica:</strong> Julgar conflitos de interesses com base no ordenamento jurídico e assegurar o cumprimento da Constituição.</li>
            <li><strong>Função atípica:</strong> Organizar seus próprios concursos públicos, orçamento interno e regimentos.</li>
          </ul>
        `,
        questions: [
          {
            id: 1003,
            text: 'Segundo a Constituição de 1988, qual é a função típica primordial do Poder Legislativo?',
            options: [
              'Administrar os hospitais federais e polícias rodoviárias.',
              'Elaborar e votar leis representativas, além de fiscalizar os atos da administração pública.',
              'Julgar a legalidade de contratos privados em primeira instância.',
              'Comandar as operações das Forças Armadas no exterior.'
            ],
            correctAnswer: 1,
            explanation: 'A função precípua do Legislativo é legislar (criar o marco normativo) e fiscalizar as ações e contas do Poder Executivo.'
          }
        ]
      },
      {
        id: 103,
        moduleId: 1,
        title: 'Como as Leis são criadas no Brasil',
        slug: 'processo-legislativo-criacao-leis',
        summary: 'A jornada de um projeto de lei da iniciativa popular ou parlamentar até a publicação no Diário Oficial.',
        duration: '25 min',
        orderIndex: 3,
        content: `
          <h2>O Rito do Processo Legislativo</h2>
          <p>Criar uma lei no Brasil é um processo rigoroso com múltiplas fases de escrutínio para garantir debate democrático e respeito às garantias fundamentais.</p>

          <ol>
            <li><strong>Iniciativa:</strong> Quem pode propor uma lei? Parlamentares (deputados e senadores), Comissões do Congresso, Presidente da República, STF, PGR e os próprios cidadãos (Iniciativa Popular, cumprindo requisitos de assinaturas em múltiplos estados).</li>
            <li><strong>Comissões Temáticas:</strong> O projeto é avaliado na Comissão de Constituição e Justiça (CCJ) para checar se viola a Constituição e em comissões técnicas (Educação, Finanças, Saúde).</li>
            <li><strong>Votação em Plenário:</strong> Sendo aprovado na Casa iniciadora (geralmente a Câmara dos Deputados), segue para a Casa revisora (Senado Federal). Se sofrer alterações substanciais, retorna à primeira Casa.</li>
            <li><strong>Sanção ou Veto Presidencial:</strong> O Presidente tem 15 dias úteis para sancionar (aprovar) ou vetar.</li>
            <li><strong>Promulgação e Publicação:</strong> A lei promulgada ganha número oficial e é publicada no Diário Oficial da União (DOU) para ter vigência.</li>
          </ol>
        `,
        questions: [
          {
            id: 1004,
            text: 'Qual comissão permanente do parlamento analisa se um projeto fere cláusulas da Constituição?',
            options: [
              'Comissão de Relações Exteriores e Defesa Nacional.',
              'Comissão de Constituição, Justiça e Cidadania (CCJ).',
              'Comissão de Defesa do Consumidor.',
              'Tribunal de Contas da União (TCU).'
            ],
            correctAnswer: 1,
            explanation: 'A CCJ é responsável pelo exame de constitucionalidade, juridicidade e técnica legislativa de todas as proposições antes da ida ao plenário.'
          }
        ]
      },
      {
        id: 104,
        moduleId: 1,
        title: 'O Orçamento Público: De onde vem e para onde vai o dinheiro',
        slug: 'orcamento-publico-tributos',
        summary: 'PPA, LDO e LOA: entenda como o dinheiro arrecadado em impostos é planejado e fiscalizado.',
        duration: '30 min',
        orderIndex: 4,
        content: `
          <h2>O Ciclo Orçamentário Brasileiro</h2>
          <p>O orçamento não é uma decisão aleatória do governo; ele é estruturado em três leis interdependentes que tramitam periodicamente no Poder Legislativo:</p>

          <ul>
            <li><strong>PPA (Plano Plurianual):</strong> Estabelece diretrizes, objetivos e metas estratégicas de médio prazo para 4 anos de governo.</li>
            <li><strong>LDO (Lei de Diretrizes Orçamentárias):</strong> Anual, faz o elo entre o PPA e o orçamento prático, definindo metas fiscais e prioridades.</li>
            <li><strong>LOA (Lei Orçamentária Anual):</strong> O orçamento propriamente dito. Estima todas as receitas esperadas (impostos, taxas, contribuições) e fixa os limites de despesas para cada ministério e órgão no ano seguinte.</li>
          </ul>

          <h3>Despesas Obrigatórias vs. Despesas Discricionárias</h3>
          <p>No Brasil, mais de 90% do orçamento federal é composto por <strong>despesas obrigatórias</strong> (previdência social, pagamento de folha de servidores, benefícios constitucionais, transferências constitucionais para estados e municípios). O governo administra apenas uma pequena fatia de <strong>despesas discricionárias</strong> (investimentos em novas obras, custeio de universidades, manutenção diária de órgãos).</p>
        `,
        questions: [
          {
            id: 1005,
            text: 'Qual instrumento orçamentário estima todas as receitas e fixa os limites de despesas para o ano fiscal?',
            options: [
              'A Lei Orçamentária Anual (LOA).',
              'O Plano Plurianual (PPA).',
              'O Balanço Anual de Pagamentos do Banco Central.',
              'O Código Tributário Nacional.'
            ],
            correctAnswer: 0,
            explanation: 'A LOA é a lei que operacionaliza no dia a dia as receitas estimadas e os limites de gastos autorizados para cada área no exercício financeiro.'
          }
        ]
      },
      {
        id: 105,
        moduleId: 1,
        title: 'Partidos Políticos e Sistemas Eleitorais',
        slug: 'partidos-sistemas-eleitorais',
        summary: 'Diferença entre sistema majoritário e proporcional, quociente eleitoral e o funcionamento das eleições.',
        duration: '25 min',
        orderIndex: 5,
        content: `
          <h2>Como os Votos se Transformam em Mandatos</h2>
          <p>Nas eleições brasileiras existem dois sistemas fundamentais dependendo do cargo disputado:</p>

          <h3>1. Sistema Majoritário (Vence quem tiver mais votos)</h3>
          <p>Aplica-se à escolha de:</p>
          <ul>
            <li>Presidente da República, Governadores e Prefeitos (com 2º turno em cidades com mais de 200 mil eleitores se nenhum candidato alcançar 50% + 1 dos votos válidos).</li>
            <li>Senadores da República (eleitos por maioria simples, com mandatos de 8 anos, renovando 1/3 e 2/3 a cada quatro anos).</li>
          </ul>

          <h3>2. Sistema Proporcional (Representação das correntes de opinião)</h3>
          <p>Aplica-se à escolha de <strong>Deputados Federais, Deputados Estaduais e Vereadores</strong>. Aqui você vota não apenas no candidato, mas na legenda partidária.</p>
          <p>As cadeiras no parlamento são distribuídas proporcionalmente ao total de votos recebidos pelo <strong>partido ou federação</strong> através do <em>Quociente Eleitoral (QE)</em> e <em>Quociente Partidário (QP)</em>. Por isso, um candidato com muitos votos individuais pode "puxar" colegas de legenda menos votados.</p>
        `,
        questions: [
          {
            id: 1006,
            text: 'Em qual das seguintes eleições é utilizado o Sistema Eleitoral Proporcional no Brasil?',
            options: [
              'Eleição para Senador da República.',
              'Eleição para Governador de Estado.',
              'Eleição para Deputado Federal e Vereador.',
              'Eleição para Presidente da República.'
            ],
            correctAnswer: 2,
            explanation: 'Deputados federais, estaduais e vereadores são eleitos pelo sistema proporcional, onde as vagas são distribuídas aos partidos conforme a votação total da legenda.'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Como Funciona o Estado Brasileiro',
    slug: 'estado-brasileiro',
    description: 'A organização do pacto federativo: União, Estados, Municípios, o papel do Judiciário e a cidadania participativa.',
    duration: '3.5 horas',
    lessonsCount: 4,
    orderIndex: 2,
    color: 'br-blue',
    lessons: [
      {
        id: 201,
        moduleId: 2,
        title: 'Pacto Federativo: União, Estados e Municípios',
        slug: 'pacto-federativo-competencias',
        summary: 'Quem é responsável por o quê: saúde, educação básica, segurança pública e iluminação das cidades.',
        duration: '25 min',
        orderIndex: 1,
        content: `
          <h2>A Federação Brasileira e a Divisão de Responsabilidades</h2>
          <p>O Brasil é uma federação composta por três esferas autônomas de governo. Compreender essa divisão evita cobrar da autoridade errada o serviço público demandado:</p>

          <h3>1. Municípios (Prefeitos e Vereadores)</h3>
          <ul>
            <li>Educação infantil (creches) e ensino fundamental I.</li>
            <li>Atenção básica em saúde (postos de saúde e UBS).</li>
            <li>Transporte coletivo urbano, trânsito local e limpeza pública.</li>
            <li>Plano diretor urbano, zoneamento e IPTU/ISS.</li>
          </ul>

          <h3>2. Estados (Governadores e Deputados Estaduais)</h3>
          <ul>
            <li>Segurança pública ostensiva e investigativa (Polícia Militar e Polícia Civil).</li>
            <li>Ensino médio da rede pública.</li>
            <li>Hospitais regionais de média e alta complexidade (SUS).</li>
            <li>Gestão do ICMS e IPVA.</li>
          </ul>

          <h3>3. União (Governo Federal e Congresso)</h3>
          <ul>
            <li>Defesa nacional, fronteiras e segurança internacional (Polícia Federal, PRF e Forças Armadas).</li>
            <li>Ensino superior (universidades e institutos federais).</li>
            <li>Emissão de moeda, reservas cambiais e política monetária (Banco Central).</li>
            <li>Regulação de telecomunicações, energia e transportes interestaduais.</li>
          </ul>
        `,
        questions: [
          {
            id: 2001,
            text: 'De acordo com a repartição constitucional de competências, qual esfera é primariamente responsável pela segurança pública ostensiva (Polícia Militar)?',
            options: [
              'O Governo do Estado.',
              'A Prefeitura Municipal.',
              'O Ministério da Defesa (Governo Federal).',
              'O Tribunal Regional Federal.'
            ],
            correctAnswer: 0,
            explanation: 'A segurança pública estadual, incluindo policiamento ostensivo (PM) e investigação criminal comum (Polícia Civil), é competência dos governos estaduais (art. 144 da CF).'
          }
        ]
      },
      {
        id: 202,
        moduleId: 2,
        title: 'O Poder Judiciário e o Papel do STF',
        slug: 'judiciario-stf-guardiao-constituicao',
        summary: 'A estrutura dos tribunais, as instâncias recursais e o controle concentrado de constitucionalidade.',
        duration: '30 min',
        orderIndex: 2,
        content: `
          <h2>A Justiça e a Guarda da Constituição</h2>
          <p>O Poder Judiciário tem por missão garantir a aplicação do ordenamento jurídico, assegurar os direitos dos cidadãos e solucionar litígios de forma imparcial.</p>

          <h3>A Pirâmide do Judiciário Nacional:</h3>
          <ul>
            <li><strong>Juízes de Primeira Instância (Varas cíveis, criminais, trabalhistas):</strong> Onde os processos começam, ocorrem audiências e se colhem testemunhos.</li>
            <li><strong>Segunda Instância (Tribunais de Justiça e TRFs):</strong> Analisam recursos contra sentenças de primeiro grau com colegiados de desembargadores.</li>
            <li><strong>Tribunais Superiores (STJ, TST, TSE, STM):</strong> Padronizam a interpretação de leis federais.</li>
            <li><strong>Supremo Tribunal Federal (STF):</strong> Composto por 11 ministros, é o guardião definitivo da Constituição da República.</li>
          </ul>

          <h3>O que é o Controle de Constitucionalidade?</h3>
          <p>Nenhuma lei aprovada pelo Congresso ou decreto do Presidente pode contrariar os direitos fundamentais inscritos na Carta de 1988. Através de ações diretas (ADI, ADC, ADPF), o STF verifica se uma norma respeita a Constituição, podendo anular leis ilegítimas.</p>
        `,
        questions: [
          {
            id: 2002,
            text: 'Qual é a principal atribuição institucional do Supremo Tribunal Federal (STF)?',
            options: [
              'Auditar as contas de empresas privadas do setor financeiro.',
              'Ser o guardião da Constituição Federal e decidir em última instância questões de constitucionalidade.',
              'Presidir as sessões legislativas da Câmara dos Deputados.',
              'Fixar a meta de inflação anual da economia.'
            ],
            correctAnswer: 1,
            explanation: 'O STF tem como missão precípua a guarda da Constituição (art. 102 da CF), exercendo o controle de constitucionalidade dos atos do poder público.'
          }
        ]
      },
      {
        id: 203,
        moduleId: 2,
        title: 'Ministérios, Autarquias e Agências Reguladoras',
        slug: 'ministerios-agencias-reguladoras',
        summary: 'Entenda como a máquina pública funciona além dos políticos eleitos: Anvisa, Anatel, Banco Central e Ibama.',
        duration: '20 min',
        orderIndex: 3,
        content: `
          <h2>A Administração Direta e Indireta</h2>
          <p>Governar um país de mais de 200 milhões de habitantes exige órgãos especializados com autonomia técnica para proteger o cidadão contra abusos e falhas de mercado.</p>

          <h3>Agências Reguladoras (Estado, não Governo)</h3>
          <p>Órgãos como <strong>Anvisa</strong> (saúde e medicamentos), <strong>Anatel</strong> (telecomunicações), <strong>Aneel</strong> (energia elétrica) e <strong>ANS</strong> (planos de saúde) possuem diretores com mandatos fixos. Sua missão é fiscalizar a prestação de serviços essenciais de forma técnica, independentemente de mudanças partidárias periódicas.</p>
        `,
        questions: [
          {
            id: 2003,
            text: 'Por que os dirigentes das agências reguladoras (como Anvisa e Anatel) possuem mandatos com estabilidade temporária?',
            options: [
              'Para garantir decisões técnicas imparciais e protegidas contra pressões políticas passageiras.',
              'Para que nunca precisem prestar contas ao Tribunal de Contas da União.',
              'Para impedir que o Congresso Nacional fiscalize seus orçamentos.',
              'Para terem direito a veto em eleições municipais.'
            ],
            correctAnswer: 0,
            explanation: 'A autonomia decisória e mandatos fixos das agências reguladoras existem para assegurar regulação técnica e estável, estimulando investimentos e protegendo consumidores.'
          }
        ]
      },
      {
        id: 204,
        moduleId: 2,
        title: 'Cidadania Ativa: Como Fiscalizar e Participar',
        slug: 'cidadania-ativa-fiscalizacao',
        summary: 'Portais de Transparência, Lei de Acesso à Informação (LAI), ouvidorias e conselhos municipais.',
        duration: '20 min',
        orderIndex: 4,
        content: `
          <h2>Cidadania não termina no dia da votação</h2>
          <p>O exercício cívico é diário. Todo cidadão brasileiro tem garantido por lei instrumentos poderosos para auditar o destino do dinheiro público:</p>
          <ul>
            <li><strong>Lei de Acesso à Informação (Lei nº 12.527/2011):</strong> Obriga órgãos públicos a responder pedidos de informação em até 20 dias (salvo sigilo legal justificado).</li>
            <li><strong>Portais da Transparência:</strong> Ferramentas online onde qualquer pessoa pode consultar salários, contratos e licitações de prefeituras, estados e União.</li>
            <li><strong>Ministério Público e Tribunais de Contas (TCU/TCE):</strong> Instituições que recebem denúncias fundadas de desvios e superfaturamentos para mover ações civis públicas.</li>
          </ul>
        `,
        questions: [
          {
            id: 2004,
            text: 'Qual lei garante a qualquer cidadão o direito de solicitar e receber dados públicos dos órgãos governamentais sem precisar justificar o motivo?',
            options: [
              'A Lei de Acesso à Informação (LAI).',
              'O Código Penal Brasileiro.',
              'A Lei Geral de Proteção de Dados (LGPD).',
              'A Consolidação das Leis do Trabalho (CLT).'
            ],
            correctAnswer: 0,
            explanation: 'A Lei nº 12.527/2011 (LAI) consagra o princípio de que a publicidade é a regra geral e o sigilo a exceção, facultando o pedido de informação sem exigência de motivo.'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Educação Financeira Real',
    slug: 'educacao-financeira',
    description: 'Domine a inflação, o poder dos juros compostos, crédito responsável, reserva de emergência e investimentos fundamentais.',
    duration: '4.5 horas',
    lessonsCount: 5,
    orderIndex: 3,
    color: 'br-yellow',
    lessons: [
      {
        id: 301,
        moduleId: 3,
        title: 'Inflação e o Poder de Compra',
        slug: 'inflacao-poder-de-compra',
        summary: 'Entenda como o IPCA é medido, por que os preços sobem e como proteger seu dinheiro da corrosão inflacionária.',
        duration: '25 min',
        orderIndex: 1,
        content: `
          <h2>O que é Inflação e como ela afeta seu bolso</h2>
          <p>A inflação não é apenas o aumento de um produto específico (como o tomate ou o combustível), mas a elevação generalizada e contínua do nível de preços de bens e serviços na economia, resultando na <strong>perda do poder aquisitivo da moeda</strong>.</p>

          <h3>Como o Brasil mede a inflação?</h3>
          <ul>
            <li><strong>IPCA (Índice Nacional de Preços ao Consumidor Amplo):</strong> Calculado mensalmente pelo IBGE, mede a variação da cesta de consumo de famílias com renda entre 1 e 40 salários mínimos. É a meta oficial de inflação do país.</li>
            <li><strong>INPC (Índice Nacional de Preços ao Consumidor):</strong> Focado em famílias com renda entre 1 e 5 salários mínimos, com maior peso em alimentação e transporte básico.</li>
            <li><strong>IGP-M (Índice Geral de Preços do Mercado):</strong> Calculado pela FGV, muito utilizado em contratos de aluguel e fortemente influenciado pelo atacado e câmbio.</li>
          </ul>

          <h3>Como se proteger da perda de poder de compra:</h3>
          <p>Deixar o dinheiro parado na conta corrente ou guardado em espécie significa perder valor todo mês. Para preservar o patrimônio, seus recursos precisam render pelo menos uma taxa igual à inflação (ganho real zero) ou superior a ela (ganho real positivo), como em títulos públicos atrelados ao IPCA (Tesouro IPCA+).</p>
        `,
        questions: [
          {
            id: 3001,
            text: 'Se a inflação no ano foi de 6% e seu dinheiro rendeu 6% no mesmo período, qual foi seu ganho real?',
            options: [
              'Ganho real de 6%.',
              'Ganho real nulo (aproximadamente 0%), mantendo apenas o poder de compra.',
              'Perda real de 6%.',
              'Ganho real de 12% somando as taxas.'
            ],
            correctAnswer: 1,
            explanation: 'O ganho real desconta o efeito da inflação sobre a rentabilidade nominal. Se ambos foram de 6%, seu poder aquisitivo foi mantido inalterado.'
          },
          {
            id: 3002,
            text: 'Qual é o índice oficial de inflação utilizado pelo Conselho Monetário Nacional (CMN) para definir as metas do Brasil?',
            options: [
              'O IPCA, medido pelo IBGE.',
              'O IGP-M, medido pela Fundação Getulio Vargas.',
              'A Taxa Selic Over.',
              'O CDI, calculado pela B3.'
            ],
            correctAnswer: 0,
            explanation: 'O IPCA (Índice Nacional de Preços ao Consumidor Amplo) é a métrica oficial adotada no regime de metas de inflação no Brasil.'
          }
        ]
      },
      {
        id: 302,
        moduleId: 3,
        title: 'A Matemática dos Juros: Simples vs. Compostos',
        slug: 'juros-simples-e-compostos',
        summary: 'Compreenda a força dos juros sobre juros nos investimentos e o perigo do efeito bola de neve nas dívidas.',
        duration: '30 min',
        orderIndex: 2,
        content: `
          <h2>Juros: O Custo do Dinheiro no Tempo</h2>
          <p>Quando você pega dinheiro emprestado, paga juros pelo privilégio de usar o capital de outrem hoje. Quando investe, você recebe juros pela renúncia de consumir hoje para disponibilizar o recurso no mercado.</p>

          <h3>Juros Simples:</h3>
          <p>Incidem sempre sobre o capital inicial original (fórmula: <em>J = C × i × t</em>). O crescimento é linear.</p>

          <h3>Juros Compostos (Juros sobre Juros):</h3>
          <p>A taxa de juros incide sobre o capital inicial acrescido de todos os juros acumulados nos períodos anteriores (fórmula: <em>M = C × (1 + i)^t</em>). O crescimento é <strong>exponencial</strong>.</p>
          <p>No longo prazo, os juros compostos são o maior aliado de quem investe com disciplina e o maior inimigo de quem contrai dívidas no cartão de crédito ou cheque especial.</p>
        `,
        questions: [
          {
            id: 3003,
            text: 'Por que o endividamento no rotativo do cartão de crédito cresce tão vertiginosamente?',
            options: [
              'Porque utiliza juros simples com desconto anual.',
              'Porque opera sob o regime de juros compostos com taxas mensais elevadas sobre o saldo devedor.',
              'Porque os bancos debitam o valor diretamente do FGTS sem autorização.',
              'Porque as taxas são congeladas pelo governo federal.'
            ],
            correctAnswer: 1,
            explanation: 'No rotativo, as altíssimas taxas mensais incidem mês a mês sobre o montante acumulado anterior, gerando crescimento exponencial da dívida.'
          }
        ]
      },
      {
        id: 303,
        moduleId: 3,
        title: 'Crédito e Endividamento Consciente',
        slug: 'credito-cet-endividamento',
        summary: 'O que é CET (Custo Efetivo Total), cheque especial, financiamentos e como sair do endividamento.',
        duration: '25 min',
        orderIndex: 3,
        content: `
          <h2>Entendendo o Custo Real do Crédito</h2>
          <p>Muitas pessoas olham apenas para a "taxa de juros da parcela" de uma propaganda e ignoram o indicador mais importante: o <strong>Custo Efetivo Total (CET)</strong>.</p>

          <h3>O que compõe o CET?</h3>
          <ul>
            <li>Taxa nominal de juros do contrato.</li>
            <li>Imposto sobre Operações Financeiras (IOF).</li>
            <li>Tarifas de cadastro e abertura de crédito (TAC).</li>
            <li>Seguros obrigatórios embutidos no financiamento.</li>
          </ul>

          <h3>Regra de Ouro do Orçamento:</h3>
          <p>As parcelas totais de dívidas de uma família (financiamentos, empréstimos, cartões) nunca devem comprometer mais de <strong>30% da sua renda líquida mensal</strong>. Acima desse patamar, qualquer imprevisto médico ou perda de emprego pode desestabilizar todo o patrimônio.</p>
        `,
        questions: [
          {
            id: 3004,
            text: 'Ao comparar duas opções de empréstimo em bancos diferentes, qual indicador expressa fielmente o custo total real da operação?',
            options: [
              'A taxa de juros nominal anunciada na publicidade.',
              'O Custo Efetivo Total (CET), que inclui juros, IOF, tarifas e encargos.',
              'A quantidade de parcelas de pagamento.',
              'O limite do cheque especial da conta corrente.'
            ],
            correctAnswer: 1,
            explanation: 'O Banco Central obriga as instituições a divulgarem o CET justamente para que o consumidor compare o custo verdadeiro, englobando impostos e tarifas embutidas.'
          }
        ]
      },
      {
        id: 304,
        moduleId: 3,
        title: 'Construindo sua Reserva de Emergência',
        slug: 'reserva-de-emergencia',
        summary: 'Onde guardar, quanto acumular e por que liquidez diária e segurança superam a busca por alta rentabilidade aqui.',
        duration: '25 min',
        orderIndex: 4,
        content: `
          <h2>O Primeiro e Mais Importante Investimento</h2>
          <p>A Reserva de Emergência é o montante financeiro destinado exclusivamente a amortecer imprevistos inevitáveis: despesas médicas repentinas, conserto do carro de trabalho ou perda involuntária de renda.</p>

          <h3>Quanto guardar?</h3>
          <ul>
            <li><strong>Assalariados com estabilidade / CLT:</strong> Entre 3 a 6 meses do custo de vida essencial.</li>
            <li><strong>Autônomos, profissionais liberais e empreendedores:</strong> Entre 6 a 12 meses do custo de vida essencial, devido à maior volatilidade de receitas.</li>
          </ul>

          <h3>Os Três Pilares da Reserva:</h3>
          <ol>
            <li><strong>Segurança Máxima:</strong> Baixíssimo risco de perda do principal (ex: títulos soberanos federais ou CDBs com cobertura do FGC).</li>
            <li><strong>Liquidez Imediata (D+0 ou D+1):</strong> O dinheiro deve poder ser resgatado a qualquer momento em que a emergência acontecer.</li>
            <li><strong>Baixa Volatilidade:</strong> O saldo não pode oscilar negativamente dependendo do humor do mercado de ações.</li>
          </ol>
        `,
        questions: [
          {
            id: 3005,
            text: 'Qual é a característica essencial prioritária que deve nortear a escolha de uma aplicação para a Reserva de Emergência?',
            options: [
              'Possibilidade de retornos astronômicos em curtíssimo prazo.',
              'Alta segurança e liquidez imediata (diária), garantindo resgate sem perdas quando necessário.',
              'Prazo de carência longo sem possibilidade de saque por 5 anos.',
              'Aplicação exclusiva em ações de empresas do setor imobiliário.'
            ],
            correctAnswer: 1,
            explanation: 'A função da reserva é servir como blindagem contra imprevistos; por isso, alta liquidez e segurança absoluta do capital são indispensáveis.'
          }
        ]
      },
      {
        id: 305,
        moduleId: 3,
        title: 'Planejamento Financeiro: O Método 50/30/20',
        slug: 'metodo-orcamentario-50-30-20',
        summary: 'Como organizar sua receita mensal entre necessidades básicas, estilo de vida e metas de futuro.',
        duration: '25 min',
        orderIndex: 5,
        content: `
          <h2>Estruturando seu Dinheiro com Inteligência</h2>
          <p>Não ter um plano para a renda significa que o dinheiro desaparecerá em pequenos gastos supérfluos cotidianos. Um modelo amplamente testado é a divisão orçamentária 50/30/20:</p>

          <ul>
            <li><strong>50% para Necessidades Básicas:</strong> Moradia (aluguel/condomínio), alimentação essencial, contas de consumo (água, energia, gás, internet), saúde e transporte.</li>
            <li><strong>30% para Estilo de Vida e Desejos:</strong> Lazer, restaurantes, viagens, assinaturas e compras pessoais.</li>
            <li><strong>20% para Metas Financeiras e Futuro:</strong> Construção da reserva de emergência, quitação antecipada de dívidas e investimentos para a aposentadoria/independência financeira.</li>
          </ul>
        `,
        questions: [
          {
            id: 3006,
            text: 'No método de organização financeira 50/30/20, qual fatia da renda deve ser alocada para metas de futuro (investimentos e poupança)?',
            options: [
              '50% da renda líquida.',
              '20% da renda líquida.',
              '5% da renda bruta.',
              'Apenas o que sobrar no último dia do mês.'
            ],
            correctAnswer: 1,
            explanation: 'O método propõe reservar cerca de 20% para construção de patrimônio, amortização de dívidas e reserva de segurança.'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Economia na Prática',
    slug: 'economia-pratica',
    description: 'Como o PIB, a Taxa Selic, o câmbio, o desemprego e a tributação influenciam o preço das coisas e os salários.',
    duration: '4 horas',
    lessonsCount: 5,
    orderIndex: 4,
    color: 'br-blue',
    lessons: [
      {
        id: 401,
        moduleId: 4,
        title: 'O que é o PIB e por que ele importa?',
        slug: 'o-que-e-o-pib',
        summary: 'Produto Interno Bruto: como a riqueza de um país é gerada e medida.',
        duration: '25 min',
        orderIndex: 1,
        content: `
          <h2>A Métrica da Riqueza Nacional</h2>
          <p>O <strong>Produto Interno Bruto (PIB)</strong> é a soma de todos os bens e serviços finais produzidos em um país durante determinado período (geralmente um trimestre ou ano). Ele mede o tamanho e a dinâmica da atividade econômica.</p>

          <h3>A Ótica da Demanda (Como o PIB é calculado):</h3>
          <p><em>PIB = Consumo das Famílias (C) + Investimentos Privados (I) + Gastos do Governo (G) + (Exportações - Importações)</em></p>

          <h3>PIB Total vs. PIB per capita:</h3>
          <p>Um país com população enorme pode ter um PIB global volumoso, mas se a população for gigantesca, o <strong>PIB per capita</strong> (PIB dividido pelo número de habitantes) pode ser modesto. O PIB per capita é um indicador melhor do nível médio de produtividade e bem-estar material de uma sociedade.</p>
        `,
        questions: [
          {
            id: 4001,
            text: 'O que representa o indicador de PIB per capita?',
            options: [
              'O total de impostos cobrados pelo Ministério da Fazenda.',
              'A divisão do valor total do PIB pelo número de habitantes do país, indicando a produção média por pessoa.',
              'O valor das exportações de commodities agrícolas.',
              'O montante de dívida externa contratada pelo Banco Central.'
            ],
            correctAnswer: 1,
            explanation: 'O PIB per capita divide o total gerado pela quantidade de cidadãos, servindo de métrica comparativa para a produtividade média.'
          }
        ]
      },
      {
        id: 402,
        moduleId: 4,
        title: 'Política Monetária e a Taxa Selic',
        slug: 'politica-monetaria-taxa-selic',
        summary: 'Como o Copom utiliza a taxa básica de juros para frear a inflação ou estimular o crescimento.',
        duration: '30 min',
        orderIndex: 2,
        content: `
          <h2>O Termostato da Economia Brasileira</h2>
          <p>A <strong>Taxa Selic</strong> é a taxa básica de juros da economia brasileira, fixada a cada 45 dias pelo Comitê de Política Monetária (COPOM) do Banco Central do Brasil.</p>

          <h3>O Ciclo da Política Monetária:</h3>
          <ul>
            <li><strong>Quando a inflação está alta:</strong> O Banco Central <em>eleva a Selic</em>. Com juros mais altos, o crédito fica mais caro, o consumo e os investimentos desaceleram, a demanda esfria e a pressão sobre os preços arrefece.</li>
            <li><strong>Quando a economia está deprimida e a inflação controlada:</strong> O Banco Central <em>reduz a Selic</em>. O crédito fica mais acessível, estimulando famílias a consumir e empresas a investir e gerar empregos.</li>
          </ul>
        `,
        questions: [
          {
            id: 4002,
            text: 'Quando o Banco Central decide elevar a Taxa Selic, qual é o efeito esperado sobre a economia?',
            options: [
              'O crédito fica mais barato e o consumo das famílias dispara instantaneamente.',
              'O crédito encarece, desacelerando a demanda agregada para conter as pressões inflacionárias.',
              'A inflação aumenta necessariamente na mesma proporção.',
              'Os juros da poupança passam a render 30% ao mês.'
            ],
            correctAnswer: 1,
            explanation: 'A alta da Selic encarece empréstimos e financiamentos, arrefecendo o consumo e os investimentos para controlar a inflação.'
          }
        ]
      },
      {
        id: 403,
        moduleId: 4,
        title: 'Câmbio, Dólar e o Comércio Exterior',
        slug: 'cambio-dolar-comercio-exterior',
        summary: 'Por que a cotação da moeda americana mexe com o pãozinho na padaria e os combustíveis.',
        duration: '25 min',
        orderIndex: 3,
        content: `
          <h2>Por que o Dólar afeta quem nunca saiu do Brasil</h2>
          <p>O Brasil adota o regime de <strong>câmbio flutuante</strong>, no qual o preço do dólar varia conforme a oferta e a demanda internacional de moeda.</p>
          <p>Mesmo bens produzidos nacionalmente têm preços atrelados a commodities cotadas em dólar: o trigo (base do pão francês), a soja (alimentação de aves e suínos), o petróleo (gasolina e diesel do frete) e insumos agrícolas (fertilizantes importados). Uma alta acentuada do dólar encarece toda a cadeia de suprimentos interna.</p>
        `,
        questions: [
          {
            id: 4003,
            text: 'Por que uma alta forte da cotação do dólar pode pressionar o preço de alimentos básicos no supermercado?',
            options: [
              'Porque os supermercados cobram seus preços em dólares americanos.',
              'Porque insumos agrícolas, combustíveis de frete e matérias-primas como o trigo são cotados globalmente em moeda estrangeira.',
              'Porque o Banco Central proíbe a venda de comida em moeda nacional.',
              'Porque a moeda brasileira deixa de circular legalmente.'
            ],
            correctAnswer: 1,
            explanation: 'O encarecimento das commodities internacionais e fertilizantes importados eleva os custos de produção e transporte no mercado doméstico.'
          }
        ]
      },
      {
        id: 404,
        moduleId: 4,
        title: 'Emprego, Produtividade e Renda',
        slug: 'emprego-produtividade-renda',
        summary: 'A relação direta entre produtividade do trabalho, educação técnica e salários reais sustentáveis.',
        duration: '25 min',
        orderIndex: 4,
        content: `
          <h2>Como os Salários Reais Realmente Crescem</h2>
          <p>Aumentar salários por decreto sem aumento de produção gera apenas inflação e desemprego. O único motor duradouro de enriquecimento de uma sociedade é o <strong>crescimento da produtividade</strong> (produzir mais e melhor com a mesma quantidade de recursos e tempo).</p>
          <p>A produtividade depende de: capital humano (educação de qualidade e qualificação técnica), investimento em tecnologia e infraestrutura logística (estradas, portos e ferrovias eficientes) e segurança jurídica para investimentos de longo prazo.</p>
        `,
        questions: [
          {
            id: 4004,
            text: 'Qual é o fator estrutural que permite aumentos reais e sustentáveis nos salários sem gerar surto inflacionário?',
            options: [
              'O aumento constante na emissão de papel-moeda físico.',
              'O crescimento contínuo da produtividade do trabalho e da economia.',
              'O tabelamento coercitivo dos preços em todos os comércios.',
              'A proibição de importações de bens estrangeiros.'
            ],
            correctAnswer: 1,
            explanation: 'A elevação da produtividade viabiliza maior valor agregado por hora trabalhada, permitindo salários reais maiores de forma duradoura.'
          }
        ]
      },
      {
        id: 405,
        moduleId: 4,
        title: 'Arrecadação, Tributação e o Sistema Tributário',
        slug: 'tributacao-impostos-gastos-publicos',
        summary: 'Impostos diretos vs. indiretos, regressividade fiscal e a importância da transparência dos gastos públicos.',
        duration: '25 min',
        orderIndex: 5,
        content: `
          <h2>Para onde vão os Tributos Brasileiros?</h2>
          <p>O Estado arrecada recursos da sociedade para financiar bens públicos que o mercado sozinho não proveria de forma universal: segurança pública, judiciário, malha viária, diplomacia, fiscalização e proteção social aos mais vulneráveis.</p>

          <h3>Tributação Direta vs. Indireta:</h3>
          <ul>
            <li><strong>Impostos Diretos (sobre renda e patrimônio):</strong> IRPF, IPTU, IPVA. Identificam quem tem maior capacidade de pagar.</li>
            <li><strong>Impostos Indiretos (sobre o consumo de bens e serviços):</strong> ICMS, IPI, PIS/Cofins, ISS. São cobrados na nota fiscal do produto.</li>
          </ul>
          <p>No Brasil, a alta concentração de tributos sobre o consumo torna o sistema <em>regressivo</em>: o cidadão de baixa renda gasta uma proporção muito maior do seu salário pagando impostos sobre arroz, feijão e luz do que o cidadão de alta renda.</p>
        `,
        questions: [
          {
            id: 4005,
            text: 'Por que a concentração da carga tributária sobre o consumo de bens e serviços (impostos indiretos) é considerada regressiva?',
            options: [
              'Porque cobra alíquotas iguais no preço dos produtos, penalizando proporcionalmente com maior peso a renda das famílias mais pobres.',
              'Porque beneficia exclusivamente as classes de menor renda com isenções gerais.',
              'Porque incide apenas sobre itens de luxo importados.',
              'Porque os impostos sobre consumo são devolvidos em dinheiro a todos no final do ano.'
            ],
            correctAnswer: 0,
            explanation: 'Como famílias de menor renda consomem a quase totalidade do que ganham na subsistência diária, pagam percentualmente muito mais impostos embutidos nas mercadorias.'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Pensamento Crítico e Análise de Informações',
    slug: 'pensamento-critico',
    description: 'Aprenda a diferenciar fatos de opiniões, identificar falácias argumentativas, desarmar vieses e interpretar dados estatísticos com rigor.',
    duration: '3.5 horas',
    lessonsCount: 5,
    orderIndex: 5,
    color: 'br-green',
    lessons: [
      {
        id: 501,
        moduleId: 5,
        title: 'Fatos versus Opiniões',
        slug: 'fatos-versus-opinioes',
        summary: 'O alicerce do debate honesto: o que é verificável com dados e o que reflete julgamentos de valor.',
        duration: '20 min',
        orderIndex: 1,
        content: `
          <h2>A Linha Divisória entre o Real e o Julgamento Pessoal</h2>
          <p>Em tempos de redes sociais e polarização, confundir <strong>fatos</strong> com <strong>opiniões</strong> é a causa primordial da desinformação.</p>

          <h3>1. O que é um Fato?</h3>
          <p>Uma declaração sobre a realidade objetiva que pode ser <em>comprovada ou refutada</em> empiricamente com evidências, medições ou registros históricos.</p>
          <p><em>Exemplo:</em> "A taxa de desemprego medida pelo IBGE no trimestre foi de 7,5%." (Pode ser verificado nos dados oficiais).</p>

          <h3>2. O que é uma Opinião?</h3>
          <p>Uma interpretação subjetiva, juízo moral, crença ou preferência pessoal que varia de pessoa para pessoa.</p>
          <p><em>Exemplo:</em> "Essa taxa de desemprego é inaceitável e demonstra a incompetência do ministro." (Expressa um julgamento de valor político, não uma medição pura).</p>
        `,
        questions: [
          {
            id: 5001,
            text: 'Qual das seguintes afirmações expressa um FATO verificável e não uma opinião subjetiva?',
            options: [
              'A cidade de Curitiba possui a melhor gestão de transporte urbano de todo o planeta.',
              'O Produto Interno Bruto brasileiro registrou expansão de 2,9% em 2023 segundo o IBGE.',
              'Qualquer imposto é imoral e destrói o espírito da humanidade.',
              'O melhor presidente da história foi aquele que construiu a capital federal.'
            ],
            correctAnswer: 1,
            explanation: 'A taxa de crescimento do PIB registrada pelo órgão estatístico oficial é um dado mensurável e documentalmente verificável.'
          }
        ]
      },
      {
        id: 502,
        moduleId: 5,
        title: 'Identificando Falácias Lógicas Comuns',
        slug: 'identificando-falacias-logicas',
        summary: 'Ad Hominem, Espantalho, Falsa Dicotomia e Apelo à Autoridade: como não se deixar enganar por retórica enganosa.',
        duration: '25 min',
        orderIndex: 2,
        content: `
          <h2>Desarmando Truques de Debate</h2>
          <p>Uma falácia lógica é um argumento com falha estrutural de raciocínio, frequentemente usado para convencer sem embasamento válido:</p>

          <ul>
            <li><strong>Ad Hominem (Ataque à Pessoa):</strong> Em vez de refutar o argumento ou os dados apresentados, ataca-se o caráter, o passado ou a identidade de quem fala.</li>
            <li><strong>Falácia do Espantalho:</strong> Distorcer, exagerar ou simplificar grosseiramente a posição do adversário para atacar essa versão caricata fácil de derrubar.</li>
            <li><strong>Falsa Dicotomia (8 ou 80):</strong> Apresentar apenas dois caminhos extremos opostos ("Ou você apoia minha proposta integralmente ou você odeia o Brasil!"), omitindo as dezenas de alternativas moderadas existentes.</li>
            <li><strong>Apelo à Emoção:</strong> Apelar para o medo, a raiva ou a piedade desmedida para forçar uma conclusão sem expor dados lógicos.</li>
          </ul>
        `,
        questions: [
          {
            id: 5002,
            text: 'Em um debate econômico, quando um debatedor diz: "Não precisamos ouvir a proposta do economista X porque ele é jovem e arrogante", qual falácia está sendo cometida?',
            options: [
              'Falácia da Falsa Dicotomia.',
              'Falácia Ad Hominem (ataque à pessoa).',
              'Falácia do Apelo à Tradição.',
              'Falácia do Escocês de Verdade.'
            ],
            correctAnswer: 1,
            explanation: 'A falácia Ad Hominem desvia do conteúdo do argumento para atacar a personalidade ou características do interlocutor.'
          }
        ]
      },
      {
        id: 503,
        moduleId: 5,
        title: 'Como Checar Fontes e Identificar Desinformação',
        slug: 'checagem-de-fontes-e-noticias',
        summary: 'Técnicas de leitura lateral, verificação cruzada e como investigar imagens fora de contexto.',
        duration: '25 min',
        orderIndex: 3,
        content: `
          <h2>O Método dos Checadores Profissionais</h2>
          <p>Quando receber uma notícia bombástica que desperte fortes emoções (raiva, indignação ou euforia triunfante), aplique imediatamente o método da <strong>Leitura Lateral</strong>:</p>

          <ol>
            <li><strong>Não leia apenas a página ou print recebido:</strong> Abra uma nova aba no navegador e pesquise os termos-chave do evento.</li>
            <li><strong>Verifique a fonte primária:</strong> A reportagem cita um documento oficial, um processo judicial ou um artigo científico? Vá direto à fonte original para ver se a citação não foi distorcida.</li>
            <li><strong>Cheque agências de fact-checking:</strong> Agências profissionais de verificação (Lupa, Aos Fatos, Fato ou Boato) já analisaram o caso?</li>
            <li><strong>Cuidado com manchetes apelativas e clickbait:</strong> Muitas vezes o título mente para atrair cliques, contradizendo o próprio corpo da matéria.</li>
          </ol>
        `,
        questions: [
          {
            id: 5003,
            text: 'Qual é o primeiro passo recomendado pela técnica de "Leitura Lateral" ao se deparar com uma informação suspeita nas redes sociais?',
            options: [
              'Compartilhar imediatamente nos grupos de família com um ponto de interrogação.',
              'Abrir abas adicionais e pesquisar a mesma informação em fontes de referência independentes e órgãos oficiais.',
              'Acreditar se a notícia tiver mais de 50 mil curtidas.',
              'Bloquear todas as pessoas que discordarem do conteúdo.'
            ],
            correctAnswer: 1,
            explanation: 'A leitura lateral consiste em sair da postagem original para averiguar o que fontes jornalísticas confiáveis e documentos primários dizem a respeito.'
          }
        ]
      },
      {
        id: 504,
        moduleId: 5,
        title: 'Vieses Cognitivos: O Viés de Confirmação',
        slug: 'vieses-cognitivos-confirmacao',
        summary: 'Por que o cérebro adora ser enganado com aquilo em que já acreditava e como se blindar contra isso.',
        duration: '20 min',
        orderIndex: 4,
        content: `
          <h2>O Ponto Cego da Mente Humana</h2>
          <p>Nosso cérebro evoluiu para economizar energia mental, utilizando atalhos mentais que frequentemente geram distorções sistemáticas chamadas de <strong>vieses cognitivos</strong>.</p>
          <p>O mais perigoso no debate cívico é o <strong>Viés de Confirmação</strong>: a tendência natural de buscar, valorizar e compartilhar apenas informações que confirmem nossas crenças prévias, enquanto ignoramos, desqualificamos ou ridicularizamos dados sólidos que desafiem nosso ponto de vista.</p>
        `,
        questions: [
          {
            id: 5004,
            text: 'O que caracteriza o fenômeno psicológico do Viés de Confirmação?',
            options: [
              'A facilidade de mudar de ideia toda vez que alguém apresenta uma teoria conspiratória.',
              'A tendência involuntária de priorizar evidências que validem convicções prévias e descartar dados que as contrariem.',
              'A capacidade infalível de lembrar de todos os dados estatísticos lidos na infância.',
              'A perda de memória temporária durante períodos eleitorais.'
            ],
            correctAnswer: 1,
            explanation: 'O viés de confirmação faz o indivíduo filtrar a realidade para proteger sua identidade e crenças, gerando bolhas ideológicas.'
          }
        ]
      },
      {
        id: 505,
        moduleId: 5,
        title: 'Interpretação Crítica de Gráficos e Estatísticas',
        slug: 'interpretacao-de-graficos-e-estatisticas',
        summary: 'Eixos truncados, correlação vs. causalidade e como não ser manipulado por números fora de escala.',
        duration: '25 min',
        orderIndex: 5,
        content: `
          <h2>Números não mentem, mas mentirosos usam números</h2>
          <p>Gráficos em telejornais ou propagandas políticas podem induzir ao erro mesmo apresentando dados verdadeiros se forem apresentados com desonestidade visual:</p>

          <ul>
            <li><strong>Eixo Y Truncado:</strong> Não começar o eixo vertical do gráfico no zero para fazer uma variação ínfima (ex: de 51% para 52%) parecer um crescimento astronômico visualmente desproporcional.</li>
            <li><strong>Correlação NÃO é Causalidade:</strong> O fato de dois eventos acontecerem simultaneamente não significa que um causou o outro. Pode haver uma terceira variável oculta ou mera coincidência estatística.</li>
            <li><strong>Amostragem Viciada (Cherry Picking):</strong> Selecionar a dedo apenas um ano específico atípico como termo de comparação para vender uma narrativa fictícia de sucesso ou fracasso.</li>
          </ul>
        `,
        questions: [
          {
            id: 5005,
            text: 'Se o consumo de sorvete aumenta nos mesmos meses em que aumentam as queimadas na floresta, qual erro lógico seria afirmar que "o consumo de sorvete causa queimadas"?',
            options: [
              'Confundir mera correlação circunstancial com relação de causalidade real.',
              'Inverter o sinal dos juros compostos.',
              'Cometer uma falácia de apelo à autoridade médica.',
              'Desconsiderar a Lei de Responsabilidade Fiscal.'
            ],
            correctAnswer: 0,
            explanation: 'Ambos os fenômenos se correlacionam porque decorrem de uma causa comum anterior (o verão e o clima quente e seco), não porque um cause o outro.'
          }
        ]
      }
    ]
  }
]
