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
          <div class="callout-box">
            <div class="callout-title">Papel Constitucional na República</div>
            <p>Na República Federativa do Brasil, o Presidente desempenha simultaneamente duas funções centrais de liderança: a de <strong>Chefe de Estado</strong> (representando a soberania do país perante as demais nações nas relações diplomáticas) e a de <strong>Chefe de Governo</strong> (liderando a administração pública federal e as políticas públicas no âmbito nacional).</p>
          </div>

          <p>Para manter o equilíbrio e evitar excessos de poder, a Constituição de 1988 estabelece claramente as prerrogativas e os limites intransponíveis do cargo:</p>

          <div class="compare-grid">
            <div class="compare-can">
              <div class="compare-header">Atribuições e Competências (Pode Fazer)</div>
              <ul>
                <li><strong>Executar leis e políticas públicas:</strong> Administrar os recursos federais e colocar em prática as diretrizes aprovadas em lei.</li>
                <li><strong>Sancionar ou Vetar projetos de lei:</strong> Após aprovação pelo Congresso Nacional, o Presidente pode aprovar (sancionar) ou rejeitar total ou parcialmente (vetar) uma proposta.</li>
                <li><strong>Editar Medidas Provisórias (MPs):</strong> Em situações de urgência e relevância, com força de lei imediata, com validade máxima de até 120 dias, dependendo de posterior aprovação do Congresso.</li>
                <li><strong>Nomear ministros de Estado e dirigentes:</strong> Escolher a equipe ministerial e indicar ministros do STF e dirigentes de agências reguladoras (sujeito à sabatina e aprovação do Senado Federal).</li>
                <li><strong>Comando supremo das Forças Armadas:</strong> Exercer a autoridade máxima sobre Exército, Marinha e Aeronáutica dentro dos preceitos constitucionais.</li>
              </ul>
            </div>
            <div class="compare-cannot">
              <div class="compare-header">Limites Constitucionais (Não Pode Fazer)</div>
              <ul>
                <li><strong>Criar leis sozinho:</strong> Não pode legislar arbitrariamente fora dos limites constitucionais. Leis ordinárias e complementares dependem exclusivamente do Congresso Nacional.</li>
                <li><strong>Gastar sem previsão orçamentária:</strong> O Executivo só pode realizar despesas autorizadas pela Lei Orçamentária Anual (LOA) e leis de diretrizes aprovadas pelos parlamentares.</li>
                <li><strong>Interferir em decisões judiciais:</strong> O Judiciário é independente. Decisões do STF e tribunais devem ser integralmente cumpridas pelo Poder Executivo.</li>
                <li><strong>Fechar o Congresso ou dissolver tribunais:</strong> Atos contra o livre exercício dos poderes constituem crime de responsabilidade e grave atentado contra a ordem democrática.</li>
              </ul>
            </div>
          </div>

          <hr />

          <h3>O Sistema de Freios e Contrapesos (Checks and Balances)</h3>
          <div class="callout-warning">
            <div class="callout-title">Princípio da Harmonia e Limitação de Poder</div>
            <p>Nenhum governante possui poder irrestrito. Se o Presidente vetar uma lei por discordância política, o Congresso Nacional pode derrubar esse veto por maioria absoluta. Se o Presidente editar um decreto ou ato incompatível com a Carta Magna, o Supremo Tribunal Federal tem a autoridade de declará-lo inconstitucional e nulo de pleno direito.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">Artigo 2º da Constituição Federal de 1988</div>
            <p>Inspirada na teoria clássica formulada por Montesquieu, a organização do Estado brasileiro estabelece que <strong>são poderes da União, independentes e harmônicos entre si, o Legislativo, o Executivo e o Judiciário</strong>. Cada um possui funções típicas (sua vocação principal) e funções atípicas (secundárias, para garantir autonomia mútua).</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">1. Poder Legislativo (Congresso Nacional)</div>
            <p>Composto pela <strong>Câmara dos Deputados</strong> (que representa o povo) e pelo <strong>Senado Federal</strong> (que representa os 26 Estados federados e o Distrito Federal).</p>
            <ul>
              <li><strong>Função típica:</strong> Propor, debater e aprovar leis para o país, além de fiscalizar permanentemente as contas do Executivo e gerenciar o orçamento nacional.</li>
              <li><strong>Função atípica:</strong> Julgar o Presidente da República e outras autoridades em processos de crime de responsabilidade/impeachment (Senado) e organizar sua administração interna.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Poder Executivo (Governo e Administração)</div>
            <p>Liderado pelo <strong>Presidente da República</strong> no âmbito federal, pelos <strong>Governadores</strong> nos estados e pelos <strong>Prefeitos</strong> nos municípios.</p>
            <ul>
              <li><strong>Função típica:</strong> Administrar os serviços públicos essenciais (saúde, segurança, educação, infraestrutura) e executar com eficiência as leis em vigor.</li>
              <li><strong>Função atípica:</strong> Editar Medidas Provisórias com força temporária de lei e regulamentar normas gerais através de decretos executivos.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. Poder Judiciário (Tribunais e Magistratura)</div>
            <p>Formado pelo <strong>STF, STJ, Tribunais Regionais Federais, Tribunais de Justiça estaduais e juízes de direito</strong>.</p>
            <ul>
              <li><strong>Função típica:</strong> Julgar conflitos de interesses e litígios com base no ordenamento jurídico vigente e assegurar a obediência irrestrita à Constituição.</li>
              <li><strong>Função atípica:</strong> Organizar seus próprios concursos públicos de ingresso, administrar seu orçamento interno e formular seus regimentos.</li>
            </ul>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Equilíbrio Republicano</div>
            <p>A independência não significa isolamento: os poderes devem conviver em constante harmonia. Nenhum poder pode se sobrepor aos demais nem usurpar competências alheias sem violar o pacto democrático.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Que É o Processo Legislativo?</div>
            <p>Criar uma lei no Brasil é um processo técnico e político rigoroso, estruturado em múltiplas fases de escrutínio para garantir o amplo debate democrático, a viabilidade orçamentária e o respeito rigoroso às garantias fundamentais da sociedade.</p>
          </div>

          <ol>
            <li><strong>Iniciativa:</strong> Quem pode propor uma nova lei? Parlamentares (deputados federais e senadores), Comissões temáticas do Congresso, o Presidente da República, o Supremo Tribunal Federal, a Procuradoria-Geral da República e os próprios cidadãos — por meio da <em>Iniciativa Popular</em>, que exige assinaturas de pelo menos 1% do eleitorado nacional distribuído por no mínimo cinco estados.</li>
            <li><strong>Comissões Temáticas:</strong> O projeto de lei é encaminhado para comissões especializadas. Obrigatoriamente, passa pela <strong>Comissão de Constituição e Justiça (CCJ)</strong> para verificar se viola direitos constitucionais, e em seguida por comissões técnicas pertinentes (Educação, Finanças e Tributação, Saúde, Meio Ambiente).</li>
            <li><strong>Votação em Plenário:</strong> Sendo aprovado nas comissões, o projeto é votado no Plenário da Casa iniciadora (geralmente a Câmara dos Deputados). Sendo aprovado, segue para a Casa revisora (o Senado Federal). Se o Senado fizer alterações substanciais no texto, o projeto retorna obrigatoriamente à Câmara para deliberação final.</li>
            <li><strong>Sanção ou Veto Presidencial:</strong> Recebendo a proposta final aprovada pelas duas Casas, o Presidente da República dispõe de 15 dias úteis para <em>sancionar</em> (concordar e aprovar) ou <em>vetar</em> (rejeitar total ou parcialmente). O Congresso pode derrubar o veto em sessão conjunta por maioria absoluta.</li>
            <li><strong>Promulgação e Publicação:</strong> Após a sanção (ou derrubada do veto), a nova lei é formalmente promulgada, ganha número de ordem e é publicada no <em>Diário Oficial da União (DOU)</em> para que passe a valer para todos os cidadãos.</li>
          </ol>

          <div class="callout-warning">
            <div class="callout-title">O Papel Guardião da CCJ</div>
            <p>A Comissão de Constituição e Justiça e de Cidadania (CCJ) tem poder terminativo sobre a constitucionalidade: projetos que desrespeitem cláusulas pétreas da Constituição Federal são sumariamente arquivados antes mesmo de qualquer votação em plenário.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">A Tríade Orçamentária</div>
            <p>O orçamento público no Brasil não decorre de decisões arbitrárias do governo de plantão; ele é rigorosamente estruturado através de <strong>três leis complementares e interdependentes</strong>, cuja elaboração compete ao Poder Executivo e cuja discussão e aprovação cabem ao Poder Legislativo.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">1. PPA — Plano Plurianual (Horizonte de 4 Anos)</div>
            <p>Estabelece as diretrizes estratégicas, objetivos de longo prazo e metas físicas da administração pública federal para um período de 4 anos. Sua vigência tem início no segundo ano de mandato de um presidente e se encerra no primeiro ano do governo seguinte, assegurando continuidade administrativa.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. LDO — Lei de Diretrizes Orçamentárias (Anual)</div>
            <p>Apresentada anualmente, a LDO funciona como o elo prático entre o planejamento de médio prazo do PPA e a execução concreta da LOA. Ela define as metas fiscais, prioridades imediatas e regras para despesas com pessoal e endividamento.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. LOA — Lei Orçamentária Anual (O Orçamento Prático)</div>
            <p>O orçamento detalhado em si. A LOA estima com precisão todas as receitas esperadas (impostos, tributos, contribuições e receitas patrimoniais) e fixa os limites máximos de gastos autorizados para cada ministério, tribunal e órgão público no ano seguinte.</p>
          </div>

          <hr />

          <h3>Despesas Obrigatórias vs. Despesas Discricionárias</h3>
          <p>Compreender essa distinção é fundamental para qualquer análise honesta das contas públicas:</p>

          <div class="compare-grid">
            <div class="compare-can">
              <div class="compare-header">Despesas Obrigatórias (>90% do Orçamento)</div>
              <ul>
                <li><strong>Previdência e Benefícios Sociais:</strong> Pagamento de aposentadorias do INSS, pensões e BPC.</li>
                <li><strong>Folha Salarial:</strong> Vencimentos de servidores públicos federais ativos e inativos.</li>
                <li><strong>Pisos Constitucionais:</strong> Percentuais mínimos obrigatórios de repasse para Saúde e Educação.</li>
                <li><strong>Obrigatoriedade legal:</strong> O governo é obrigado por lei a pagar pontualmente; não pode remanejar discricionariamente.</li>
              </ul>
            </div>
            <div class="compare-cannot">
              <div class="compare-header">Despesas Discricionárias (<10% do Orçamento)</div>
              <ul>
                <li><strong>Investimentos em Infraestrutura:</strong> Novas rodovias, ferrovias, portos e habitação popular.</li>
                <li><strong>Custeio e Manutenção:</strong> Contas de energia de universidades, segurança e equipamentos de pesquisa.</li>
                <li><strong>Margem de Ajuste:</strong> É a única fração que o governo consegue contingenciar ou cortar rapidamente quando as receitas caem.</li>
              </ul>
            </div>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Rigidez Orçamentária e Reformas</div>
            <p>Como mais de 90% dos recursos arrecadados já se encontram comprometidos com despesas obrigatórias fixadas por lei ou pela Constituição, governantes têm margem de manobra orçamentária muito reduzida, motivo pelo qual o debate econômico exige reformas estruturais profundas no Congresso.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">A Engenharia Eleitoral Brasileira</div>
            <p>No Brasil, o ato de votar se traduz em mandatos eletivos por meio de dois sistemas eleitorais distintos, desenhados para finalidades políticas diferentes: o <strong>Sistema Majoritário</strong> (para cargos executivos e senadores) e o <strong>Sistema Proporcional</strong> (para o parlamento e câmaras de vereadores).</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">1. Sistema Majoritário — A Força da Maioria</div>
            <p>Neste modelo, vence a disputa o candidato individual que obtiver o maior volume de votos válidos:</p>
            <ul>
              <li><strong>Poder Executivo (Presidente, Governadores e Prefeitos):</strong> Em cidades com mais de 200 mil eleitores e nas disputas estadual e federal, exige-se maioria absoluta (50% + 1 dos votos válidos). Caso nenhum alcance essa marca, ocorre segundo turno entre os dois mais votados.</li>
              <li><strong>Senado Federal:</strong> Os senadores representam os estados de forma igualitária (3 por estado/DF). São eleitos por maioria simples, com mandatos de 8 anos, renovando alternadamente 1/3 e 2/3 da Casa a cada quatro anos.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Sistema Proporcional — O Pluralismo de Ideias</div>
            <p>Aplica-se à escolha de <strong>Deputados Federais, Deputados Estaduais e Vereadores</strong>. O objetivo constitucional é garantir que o parlamento espelhe a pluralidade de correntes de pensamento existentes na sociedade brasileira:</p>
            <ul>
              <li><strong>Voto na Legenda:</strong> O cidadão pode votar nominalmente no candidato ou digitar apenas a legenda do partido político.</li>
              <li><strong>Distribuição das Vagas:</strong> As cadeiras não pertencem exclusivamente aos candidatos mais votados no cômputo geral, mas sim aos <em>partidos e federações</em> proporcionalmente ao total de votos recebidos pela sigla.</li>
            </ul>
          </div>

          <div class="formula-box">
            <span class="formula-label">Cálculo do Quociente Eleitoral (QE)</span>
            QE = Total de Votos Válidos ÷ Total de Vagas da Casa Legislativa
          </div>

          <div class="callout-warning">
            <div class="callout-title">O 'Efeito Puxador' de Votos</div>
            <p>Por causa do Quociente Partidário, um candidato que receba centenas de milhares de votos individuais transfere o excedente de quociente para sua própria sigla partidária, permitindo que outros candidatos do mesmo partido ou federação sejam eleitos com votações menores.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Pacto Federativo</div>
            <p>O Brasil é uma República Federativa estruturada em três esferas político-administrativas autônomas e complementares. Compreender qual ente federado responde por cada demanda é essencial para exercer a cidadania e não cobrar a autoridade errada pelo serviço público que lhe é devido.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">1. Municípios (Prefeitos e Vereadores) — A Vida na Cidade</div>
            <p>É a esfera mais próxima do dia a dia da população, responsável pelos serviços de impacto urbano imediato:</p>
            <ul>
              <li><strong>Educação:</strong> Educação infantil (creches e pré-escolas) e ensino fundamental I (1º ao 5º ano).</li>
              <li><strong>Saúde Básica:</strong> Postos de saúde municipais, Unidades Básicas de Saúde (UBS) e agentes comunitários.</li>
              <li><strong>Serviços Urbanos:</strong> Transporte coletivo municipal, iluminação pública, asfalto, coleta de lixo e saneamento.</li>
              <li><strong>Ordenamento do Solo:</strong> Plano diretor municipal, zoneamento urbano e arrecadação de IPTU e ISS.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Estados e Distrito Federal (Governadores e Deputados) — Serviços Regionais</div>
            <p>Atuam na coordenação regional e na infraestrutura de médio e grande porte:</p>
            <ul>
              <li><strong>Segurança Pública:</strong> Policiamento ostensivo preventivo (Polícia Militar), polícia investigativa (Polícia Civil) e Corpo de Bombeiros.</li>
              <li><strong>Educação Média:</strong> Ensino médio público e colégios técnicos estaduais.</li>
              <li><strong>Saúde de Alta Complexidade:</strong> Gestão de hospitais regionais de trauma, emergências e especialidades do SUS.</li>
              <li><strong>Tributação Estadual:</strong> Gestão e fiscalização do ICMS (sobre mercadorias e energia) e IPVA (veículos).</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. União (Governo Federal e Congresso Nacional) — Estratégia Soberana</div>
            <p>Responsável pelos interesses nacionais, soberania externa e diretrizes macroeconômicas:</p>
            <ul>
              <li><strong>Defesa e Fronteiras:</strong> Forças Armadas (Exército, Marinha e Aeronáutica), Polícia Federal e Polícia Rodoviária Federal.</li>
              <li><strong>Educação Superior:</strong> Universidades federais e Institutos Federais de Educação, Ciência e Tecnologia (IFs).</li>
              <li><strong>Moeda e Macroeconomia:</strong> Emissão de moeda, gestão das reservas internacionais e política monetária através do Banco Central.</li>
              <li><strong>Regulação Nacional:</strong> Telecomunicações, malha aérea, sistema elétrico interligado e rodovias federais (BRs).</li>
            </ul>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Cobrança Cidadã Correta</div>
            <p>Reclamar com o Presidente da República ou nas redes sociais de Brasília sobre a falta de vagas em creches ou iluminação escura no bairro é ineficaz: tais serviços são obrigações orçamentárias exclusivas da prefeitura e da câmara municipal da sua cidade.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">A Função Jurisdicional</div>
            <p>O Poder Judiciário tem como atribuição precípua aplicar a ordem jurídica com imparcialidade, dirimir litígios entre cidadãos ou entre cidadãos e o Estado, e salvaguardar os direitos e garantias fundamentais previstos na Constituição Federal de 1988.</p>
          </div>

          <h3>A Pirâmide da Justiça Brasileira</h3>
          <p>Para assegurar o direito à ampla defesa e ao duplo grau de jurisdição, as decisões judiciais tramitam por instâncias sucessivas:</p>

          <div class="tier-card">
            <div class="tier-title">1ª Instância — Onde a Lide Começa</div>
            <p>Juízes de direito individuais em comarcas e varas (cíveis, criminais, de família, fazendárias e trabalhistas). É onde os processos nascem, provas são juntadas, testemunhas são ouvidas e a sentença inaugural é proferida.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">2ª Instância — Os Colegiados Recursais</div>
            <p>Tribunais de Justiça estaduais (TJs) e Tribunais Regionais Federais (TRFs). As decisões são tomadas de forma colegiada por turmas ou câmaras de desembargadores, que revisam os recursos contra sentenças da primeira instância.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">Tribunais Superiores — Uniformização da Legislação Federal</div>
            <p>Órgãos de cúpula temática sediados em Brasília: <strong>STJ</strong> (legislação federal infraconstitucional), <strong>TST</strong> (matéria trabalhista), <strong>TSE</strong> (normas eleitorais) e <strong>STM</strong> (justiça militar).</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">Supremo Tribunal Federal (STF) — O Guardião da Carta Magna</div>
            <p>Composto por <strong>11 Ministros</strong> com sabatina obrigatória no Senado, é o tribunal de cúpula de todo o ordenamento jurídico nacional. Sua missão primordial é proteger e interpretar definitivamente a Constituição da República.</p>
          </div>

          <hr />

          <h3>O Que É o Controle de Constitucionalidade?</h3>
          <p>Nenhuma lei aprovada pelo Congresso Nacional, Assembleia Legislativa ou decreto do Presidente pode contrariar cláusulas pétreas ou direitos fundamentais da Constituição.</p>

          <div class="callout-warning">
            <div class="callout-title">Controle Concentrado de Constitucionalidade</div>
            <p>Por meio de instrumentos de controle concentrado — como Ações Diretas de Inconstitucionalidade (ADI), Ações Declaratórias de Constitucionalidade (ADC) e Arguição de Descumprimento de Preceito Fundamental (ADPF) —, o STF tem o poder de anular normas incompatíveis com a Constituição, conferindo efeito vinculante para toda a administração pública.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">Estado vs. Governo</div>
            <p>Enquanto os ministérios integram o <em>Governo</em> (com cargos políticos que mudam a cada eleição presidencial), grande parte dos serviços técnicos e das fiscalizações essenciais do país é exercida por órgãos autônomos de <em>Estado</em> pertencentes à administração indireta: as agências reguladoras e as autarquias.</p>
          </div>

          <h3>O Papel Estratégico das Agências Reguladoras</h3>
          <p>Com a privatização e a concessão de serviços públicos nas últimas décadas, o Estado transferiu a operação direta para consórcios privados, mantendo sobre si o papel indispensável de fiscalizar padrões de qualidade, segurança e preços justos para o consumidor:</p>

          <div class="tier-card">
            <div class="tier-title">Anvisa — Agência Nacional de Vigilância Sanitária</div>
            <p>Fiscaliza e autoriza a fabricação e importação de medicamentos, vacinas, cosméticos, insumos médicos e padrões higiênico-sanitários de alimentos.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">Anatel — Agência Nacional de Telecomunicações</div>
            <p>Regulamenta o setor de telecomunicações, define regras de cobertura 4G/5G, fiscaliza tarifas e zela pela qualidade do atendimento das operadoras de internet e telefonia.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">Aneel — Agência Nacional de Energia Elétrica</div>
            <p>Audita geradoras e distribuidoras de energia elétrica, estabelece as bandeiras tarifárias e calcula os reajustes anuais das contas de luz no Brasil.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">ANS e ANTT — Saúde Suplementar e Transportes Terrestres</div>
            <p>A <strong>ANS</strong> estabelece o rol de procedimentos obrigatórios dos planos de saúde privados; a <strong>ANTT</strong> fiscaliza o transporte rodoviário interestadual de passageiros e concessões de pedágio em rodovias federais.</p>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Por Que os Diretores Têm Mandatos Fixos?</div>
            <p>A legislação garante que os conselheiros das agências reguladoras possuam mandatos com estabilidade e períodos predeterminados, protegendo as decisões técnicas contra interferências e pressões políticas momentâneas do governante no poder.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">Cidadania Participativa e Fiscalização</div>
            <p>O sufrágio nas urnas a cada dois anos é apenas a porta de entrada da democracia. O ordenamento jurídico brasileiro confere ao cidadão instrumentos legais de alta potência para monitorar a conduta dos agentes públicos e a aplicação de cada centavo arrecadado dos contribuintes.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">1. Lei de Acesso à Informação — LAI (Lei nº 12.527/2011)</div>
            <p>Consagra o princípio fundamental de que <strong>a publicidade é a regra geral e o sigilo a exceção extrema</strong>:</p>
            <ul>
              <li>Qualquer pessoa (física ou jurídica) pode solicitar documentos, relatórios e demonstrativos de qualquer órgão municipal, estadual ou federal.</li>
              <li>Não é exigido justificar o motivo nem a intenção do pedido.</li>
              <li>O órgão tem prazo estipulado por lei de até <strong>20 dias corridos</strong> (prorrogáveis justificadamente por mais 10) para prestar as informações.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Portais da Transparência Governamentais</div>
            <p>Plataformas digitais públicas de livre acesso onde qualquer cidadão com internet pode auditar em tempo real:</p>
            <ul>
              <li>Remuneração detalhada e diárias de servidores públicos e detentores de mandato.</li>
              <li>Editais de licitação, contratos públicos firmados e termos aditivos com fornecedores.</li>
              <li>Repasses federais do Fundo de Participação dos Municípios (FPM) e emendas parlamentares.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. Órgãos de Controle Externo e Denúncia</div>
            <p>Canais oficiais para formalização de denúncias fundamentadas:</p>
            <ul>
              <li><strong>Ministério Público (Estadual e Federal):</strong> Defensor dos interesses sociais indisponíveis e do patrimônio público, com prerrogativa de instaurar Inquéritos Civis e Ações de Improbidade.</li>
              <li><strong>Tribunais de Contas (TCU e TCEs):</strong> Órgãos técnicos auxiliares do Legislativo encarregados de auditar a legalidade dos gastos governamentais.</li>
            </ul>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Como Apresentar Denúncias Efetivas</div>
            <p>Denúncias genéricas baseadas em boatos costumam ser arquivadas. Para que uma representação tenha impacto real, anexe links de contratos, cópias de notas fiscais obtidas no portal da transparência ou fotografias comprovando a obra inacabada ou irregular.</p>
          </div>
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
          <h2>O Que É Inflação e Como Ela Afeta Seu Bolso</h2>
          <div class="callout-box">
            <div class="callout-title">Definição Macroeconômica</div>
            <p>A inflação não é a alta isolada de um produto específico (como a gasolina ou a safra de tomates), mas a <strong>elevação generalizada, cumulativa e contínua do nível de preços</strong> de bens e serviços na economia, resultando na perda direta do poder aquisitivo da moeda ao longo do tempo.</p>
          </div>

          <h3>Como o Brasil Mede a Inflação Oficial?</h3>
          <p>Diferentes institutos de pesquisa utilizam cestas de consumo e públicos-alvo distintos:</p>

          <div class="tier-card">
            <div class="tier-title">IPCA — Índice Nacional de Preços ao Consumidor Amplo (IBGE)</div>
            <p>Calculado mensalmente pelo IBGE, afere a variação de custos de famílias com renda entre <strong>1 e 40 salários mínimos</strong> nas principais regiões metropolitanas. É a métrica oficial utilizada pelo Conselho Monetário Nacional (CMN) e pelo Banco Central no regime de metas de inflação.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">INPC — Índice Nacional de Preços ao Consumidor (IBGE)</div>
            <p>Focado em famílias com rendimento entre <strong>1 e 5 salários mínimos</strong>, cuja maior fatia do orçamento familiar é consumida por alimentação de subsistência e transporte público básico. Frequentemente utilizado como balizador de reajustes do salário mínimo e dissídios salariais.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">IGP-M — Índice Geral de Preços do Mercado (FGV)</div>
            <p>Calculado pela Fundação Getulio Vargas, é composto por preços no atacado (60%), consumidor final (30%) e construção civil (10%). Por sofrer forte impacto das cotações internacionais e do dólar, historicamente serviu de base para reajustes de contratos de aluguel.</p>
          </div>

          <hr />

          <div class="formula-box">
            <span class="formula-label">Cálculo do Ganho Real nos Investimentos</span>
            Ganho Real (%) ≈ Rendimento Nominal (%) - Taxa de Inflação (%)
          </div>

          <div class="callout-warning">
            <div class="callout-title">O Imposto Invisível do Dinheiro Parado</div>
            <p>Deixar reservas financeiras na conta-corrente tradicional ou na poupança com rendimentos inferiores ao IPCA significa assistir seu dinheiro desvalorizar mês a mês. Proteger o patrimônio exige aplicações que rendam, no mínimo, a inflação do período mais uma taxa de juro real (como o Tesouro IPCA+).</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Preço da Renúncia e do Risco</div>
            <p>Quando você contrata um empréstimo ou financiamento, paga juros pela antecipação de consumo com o capital alheio. Quando você investe, é remunerado com juros pela disciplina de adiar o consumo imediato e disponibilizar seu capital na economia.</p>
          </div>

          <h3>A Diferença Entre Juros Simples e Juros Compostos</h3>
          <p>O mecanismo matemático adotado define se o crescimento da dívida ou da aplicação será modesto ou avassalador:</p>

          <div class="compare-grid">
            <div class="compare-can">
              <div class="compare-header">Juros Simples (Crescimento Linear)</div>
              <ul>
                <li><strong>Base de Cálculo:</strong> A taxa percentual incide unicamente sobre o capital inicial emprestado ao longo de todo o prazo.</li>
                <li><strong>Fórmula Matemática:</strong> <em>J = C × i × t</em></li>
                <li><strong>Comportamento:</strong> A quantia de juros acrescentada a cada mês permanece sempre fixa e previsível.</li>
              </ul>
            </div>
            <div class="compare-cannot">
              <div class="compare-header">Juros Compostos (Crescimento Exponencial)</div>
              <ul>
                <li><strong>Base de Cálculo:</strong> A taxa incide sobre o capital inicial somado aos juros acumulados nos meses anteriores ("juros sobre juros").</li>
                <li><strong>Fórmula Matemática:</strong> <em>M = C × (1 + i)ᵗ</em></li>
                <li><strong>Comportamento:</strong> No longo prazo, a curva de crescimento decola em ritmo geométrico.</li>
              </ul>
            </div>
          </div>

          <div class="formula-box">
            <span class="formula-label">Equação Fundamental dos Juros Compostos</span>
            M = C × (1 + i)ᵗ
          </div>

          <div class="callout-warning">
            <div class="callout-title">A Maior Força nos Investimentos e o Pior Veneno nas Dívidas</div>
            <p>Nos investimentos com aportes constantes, os juros compostos são o maior aliado para a construção da independência financeira. Em contrapartida, no rotativo do cartão de crédito ou no cheque especial (onde as taxas ultrapassam 300% a 400% ao ano), os juros compostos multiplicam a dívida em efeito bola de neve destrutivo.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Conceito de CET (Custo Efetivo Total)</div>
            <p>Ao contratar um financiamento de veículo, imóvel ou empréstimo pessoal, a esmagadora maioria dos consumidores olha apenas para a 'taxa de juros mensal da propaganda'. O indicador regulatório que realmente define o custo integral do contrato é o <strong>Custo Efetivo Total (CET)</strong>, fixado por determinação do Banco Central.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">Composição Detalhada do CET</div>
            <p>O CET consolida obrigatoriamente todas as despesas diretas e indiretas da operação financeira:</p>
            <ul>
              <li><strong>Taxa Nominal de Juros:</strong> O percentual de juros líquido cobrado pelo credor.</li>
              <li><strong>Tributos Federais:</strong> O Imposto sobre Operações Financeiras (IOF) recolhido pela União.</li>
              <li><strong>Tarifas Administrativas:</strong> Tarifas de abertura de crédito (TAC), custas de vistoria e emissão de carnê/boletos.</li>
              <li><strong>Seguros Obrigatórios Embutidos:</strong> Seguros de proteção financeira ou de vida exigidos na concessão.</li>
            </ul>
          </div>

          <div class="formula-box">
            <span class="formula-label">Regra de Ouro da Saúde Financeira</span>
            Total de Parcelas de Crédito e Dívidas ≤ 30% da Renda Líquida Familiar
          </div>

          <div class="callout-warning">
            <div class="callout-title">Limite Prudencial de Endividamento</div>
            <p>Comprometer mais de 30% dos seus rendimentos líquidos mensais com empréstimos, financiamentos e parcelas de cartões retira qualquer margem de segurança do seu orçamento. Qualquer emergência imprevista — como problema de saúde ou perda de emprego — provocará inadimplência em cadeia.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Conceito da Reserva de Emergência</div>
            <p>A Reserva de Emergência não é uma aplicação para acumular riqueza ou comprar supérfluos; é uma <strong>blindagem de segurança psicológica e financeira</strong> criada especificamente para suportar acontecimentos imprevistos graves (despesas médicas urgentes, quebra do veículo de trabalho ou interrupção repentina de rendimentos).</p>
          </div>

          <h3>Quanto Você Deve Acumular?</h3>
          <p>O montante ideal é calculado multiplicando o seu custo de vida básico mensal:</p>

          <div class="tier-card">
            <div class="tier-title">Profissionais CLT e Servidores Públicos com Estabilidade</div>
            <p>Recomenda-se entre <strong>3 e 6 meses</strong> do custo de sobrevivência essencial mensal, considerando a existência de seguro-desemprego, aviso prévio indenizado ou estabilidade funcional.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">Autônomos, Profissionais Liberais e Empreendedores</div>
            <p>Recomenda-se entre <strong>6 e 12 meses</strong> do custo de sobrevivência essencial, dada a maior volatilidade no faturamento e a ausência de rede de proteção rescisória estatal.</p>
          </div>

          <hr />

          <h3>Os Três Pilares Inegociáveis da Reserva</h3>
          <ol>
            <li><strong>Segurança Máxima de Crédito:</strong> Aplicações emissores de altíssima solidez e baixíssimo risco de calote (como títulos do Tesouro Direto Selic ou CDBs pós-fixados emitidos por grandes bancos com garantia do FGC até o teto legal).</li>
            <li><strong>Liquidez Imediata (D+0 ou D+1):</strong> Possibilidade de resgatar o capital a qualquer instante, inclusive nos fins de semana e feriados em caso de urgência médica.</li>
            <li><strong>Baixíssima Volatilidade:</strong> A cota da aplicação não pode oscilar negativamente; o saldo precisa ser estritamente preservado.</li>
          </ol>

          <div class="callout-warning">
            <div class="callout-title">Não Busque Alta Rentabilidade na Reserva</div>
            <p>O objetivo de uma reserva de emergência é conferir tranquilidade e liquidez, nunca multiplicar capital em apostas arriscadas. Jamais aloque a reserva em ações, fundos imobiliários com prazos de resgate longos ou criptoativos de alta oscilação.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Método Orçamentário 50/30/20</div>
            <p>Sem um direcionamento consciente, a renda mensal tende a se esvair silenciosamente em pequenos desperdícios diários. O framework 50/30/20, consagrado internacionalmente, organiza seus rendimentos líquidos em três categorias claras e equilibradas.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">50% — Necessidades Essenciais de Sobrevivência</div>
            <p>Despesas indispensáveis sem as quais você não mantém sua integridade básica:</p>
            <ul>
              <li>Moradia: aluguel, condomínio, IPTU e manutenção indispensável da casa.</li>
              <li>Alimentação básica de supermercado e feira (não inclui refeições em restaurantes caros).</li>
              <li>Contas de utilidade pública: água, energia elétrica, gás e pacote básico de internet.</li>
              <li>Saúde essencial (medicamentos contínuos ou plano de saúde) e transporte para o trabalho.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">30% — Estilo de Vida, Desejos e Lazer</div>
            <p>Gastos que proporcionam qualidade de vida, equilíbrio mental e satisfação pessoal:</p>
            <ul>
              <li>Passeios, refeições sociais em restaurantes e viagens de férias.</li>
              <li>Assinaturas de streaming, hobbies, compras pessoais e vestuário não essencial.</li>
              <li>Cuidados estéticos e entretenimento com amigos e familiares.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">20% — Construção do Futuro e Liberdade Financeira</div>
            <p>Recursos que constroem patrimônio e protegem o amanhã:</p>
            <ul>
              <li>Montagem e manutenção da sua reserva de emergência.</li>
              <li>Amortização extraordinária e quitação antecipada de dívidas ativas.</li>
              <li>Aportes mensais em investimentos diversificados para a aposentadoria e previdência.</li>
            </ul>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Adaptação à Realidade Individual</div>
            <p>Se o seu momento econômico atual ainda não permite poupar 20%, comece com 5% ou 10%. O fator mais determinante para o sucesso a longo prazo é a consistência do hábito de investir todo mês antes de consumir o excedente.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Conceito de PIB</div>
            <p>O <strong>Produto Interno Bruto (PIB)</strong> representa a soma monetária de todos os bens e serviços finais produzidos no território nacional durante determinado período (trimestre ou ano). É a principal régua utilizada no mundo para quantificar o tamanho, o dinamismo e a saúde da atividade econômica.</p>
          </div>

          <h3>A Ótica da Demanda (Como o PIB é Mensurado)</h3>
          <p>Existem diferentes métodos contábeis para medir o PIB. A mais comum é a ótica da despesa/demanda, decomposta em quatro grandes forças motrizes:</p>

          <div class="formula-box">
            <span class="formula-label">Equação Fundamental do PIB (Ótica da Demanda)</span>
            PIB = C + I + G + (X - M)
          </div>

          <div class="tier-card">
            <div class="tier-title">Componentes da Equação Econômica</div>
            <ul>
              <li><strong>C — Consumo das Famílias:</strong> Aquisição de bens duráveis, alimentos, vestuário e serviços de saúde/educação privada por cidadãos.</li>
              <li><strong>I — Investimentos Privados (FBCF):</strong> Máquinas, plantas fabris, tecnologia e construção civil realizadas por empresas privadas.</li>
              <li><strong>G — Gastos do Governo:</strong> Compras governamentais, obras públicas e contratação de serviços (não inclui transferências como aposentadorias para evitar dupla contagem).</li>
              <li><strong>(X - M) — Balança Comercial Líquida:</strong> Exportações brasileiras (X) deduzidas das Importações de bens estrangeiros (M).</li>
            </ul>
          </div>

          <hr />

          <h3>PIB Total vs. PIB per Capita</h3>
          <p>Um país populoso pode ostentar um PIB global imponente simplesmente pelo tamanho demográfico, enquanto a qualidade de vida de sua população permanece modesta. O indicador que reflete a produtividade média por cidadão é o <strong>PIB per capita</strong> (PIB total dividido pelo número de habitantes).</p>

          <div class="callout-warning">
            <div class="callout-title">Limitações Estatísticas do PIB</div>
            <p>O PIB mede o fluxo de produção de mercado, mas não expressa a desigualdade de renda, o trabalho voluntário e doméstico não remunerado, nem a preservação do meio ambiente. Por essa razão, economistas combinam o PIB com o Índice de Desenvolvimento Humano (IDH) e o Coeficiente de Gini.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Que É a Taxa Selic?</div>
            <p>A <strong>Taxa Selic</strong> (Sistema Especial de Liquidação e de Custódia) é a taxa básica de juros da economia brasileira. Fixada a cada 45 dias pelo <strong>COPOM (Comitê de Política Monetária do Banco Central)</strong>, ela funciona como o termostato de referência para todas as demais taxas bancárias de empréstimos, financiamentos e títulos públicos no país.</p>
          </div>

          <h3>O Ciclo da Política Monetária na Prática</h3>
          <p>O Banco Central ajusta a Selic para calibrar o ritmo de aquecimento da economia e manter a inflação na meta definida pelo Conselho Monetário Nacional:</p>

          <div class="compare-grid">
            <div class="compare-can">
              <div class="compare-header">Quando a Inflação Sobe (Elevação da Selic)</div>
              <ul>
                <li><strong>Encarecimento do Crédito:</strong> Juros de empréstimos e cartões sobem em toda a rede bancária.</li>
                <li><strong>Desaceleração do Consumo:</strong> Famílias compram menos a prazo e adiam trocas de carro ou imóvel.</li>
                <li><strong>Incentivo à Poupança:</strong> Investimentos em renda fixa tornam-se mais atraentes que consumir hoje.</li>
                <li><strong>Queda da Inflação:</strong> Com menor demanda na ponta final, lojistas e fabricantes são forçados a frear reajustes de preços.</li>
              </ul>
            </div>
            <div class="compare-cannot">
              <div class="compare-header">Quando a Economia Esfria (Corte da Selic)</div>
              <ul>
                <li><strong>Barateamento do Crédito:</strong> Financiamentos e empréstimos tornam-se mais acessíveis.</li>
                <li><strong>Aceleração dos Negócios:</strong> Empresas tomam crédito para expandir frotas, abrir lojas e contratar operários.</li>
                <li><strong>Aquecimento do Consumo:</strong> As famílias voltam a financiar bens e serviços essenciais e duráveis.</li>
                <li><strong>Crescimento do PIB:</strong> A economia ganha tração e gera postos de trabalho formais.</li>
              </ul>
            </div>
          </div>

          <div class="callout-warning">
            <div class="callout-title">O Efeito Defasado da Selic</div>
            <p>Alterações na Taxa Selic demoram de 6 a 18 meses para se propagar integralmente por toda a economia real. Por isso, as decisões do Banco Central são eminentemente técnicas e baseadas em projeções futuras, nunca em reações impulsivas imediatas.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Regime de Câmbio Flutuante</div>
            <p>Desde 1999, o Brasil adota o regime de <strong>câmbio flutuante</strong>, no qual a cotação do dólar oscila livremente conforme a oferta e procura internacional de divisas (fluxos comerciais de exportação/importação e investimentos externos).</p>
          </div>

          <h3>Como a Moeda Americana Penetra o Seu Supermercado</h3>
          <p>Muitas pessoas acreditam que a oscilação do dólar afeta apenas quem faz viagens internacionais. Na realidade, a moeda norte-americana é a unidade padrão de precificação de commodities essenciais à vida de todo brasileiro:</p>

          <div class="tier-card">
            <div class="tier-title">1. O Trigo e o Pão Francês</div>
            <p>O Brasil importa parcela significativa do trigo que consome (principalmente da Argentina e América do Norte). Se o dólar sobe, o moinho paga mais pela saca, a farinha sobe e a padaria é obrigada a reajustar o pãozinho e o macarrão.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Combustíveis e o Custo do Frete (Diesel)</div>
            <p>O petróleo é cotado em dólares nas bolsas globais. Quando a moeda americana dispara, o diesel e a gasolina no Brasil sobem, encarecendo o frete rodoviário de caminhões que abastecem os centros urbanos com frutas, legumes e carnes.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. Fertilizantes e Insumos Agrícolas</div>
            <p>Mais de 80% dos fertilizantes químicos utilizados pelo agronegócio nacional para produzir soja, milho e arroz são importados e pagos em moeda estrangeira.</p>
          </div>

          <div class="callout-warning">
            <div class="callout-title">O Fenômeno do Pass-Through Cambial</div>
            <p>Economistas chamam de <em>pass-through</em> a velocidade e intensidade com que a desvalorização da moeda doméstica (o real) se transfere para os índices de inflação locais (IPCA), reduzindo o poder de compra do cidadão comum.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Motor da Renda Real: A Produtividade</div>
            <p>Governos não criam riqueza por decreto legislativo ou através da impressão descontrolada de cédulas. A única fórmula comprovada na história mundial capaz de gerar aumentos reais, contínuos e sustentáveis de salário sem inflação é o <strong>aumento da produtividade do trabalho</strong> (a capacidade de gerar mais valor com o mesmo dispêndio de horas e insumos).</p>
          </div>

          <h3>Os Três Pilares da Produtividade Econômica</h3>
          <p>Para que um trabalhador produza mais e seja remunerado com salários superiores, um país precisa fortalecer três alicerces estruturantes:</p>

          <div class="tier-card">
            <div class="tier-title">1. Capital Humano e Qualificação Técnica</div>
            <p>Educação básica de excelência, alfabetização plena na idade certa e formação técnica alinhada às demandas da indústria moderna e dos serviços de alta tecnologia.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Inovação Tecnológica e Maquinário</div>
            <p>Empresas equipadas com maquinário moderno, softwares de automação, conectividade 5G e processos industriais eficientes multiplicam a capacidade de produção de cada trabalhador.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. Infraestrutura Logística e Segurança Jurídica</div>
            <p>Ferrovias, portos ágeis e rodovias bem pavimentadas reduzem o chamado "Custo Brasil", enquanto regras contratuais estáveis atraem investimentos fabris de longo prazo.</p>
          </div>

          <div class="callout-warning">
            <div class="callout-title">A Falsa Ilusão do Salário Nominal</div>
            <p>Se os salários nominais de uma categoria sobem 20%, mas a produção de bens permanece exatamente igual, os preços no comércio subirão os mesmos 20% para equilibrar a oferta, anulando qualquer ganho real de poder aquisitivo.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">A Justificativa da Tributação</div>
            <p>Em qualquer sociedade moderna e civilizada, o Estado arrecada tributos compulsórios dos cidadãos e das empresas para custear a oferta de bens públicos universais: soberania e segurança pública, ordenamento judiciário, malha de transportes, diplomacia, fiscalização e a rede de proteção social aos indivíduos em situação de vulnerabilidade.</p>
          </div>

          <h3>Tributação Direta vs. Tributação Indireta</h3>
          <p>A arquitetura tributária divide-se em duas modalidades fundamentais com impactos distributivos inteiramente distintos:</p>

          <div class="compare-grid">
            <div class="compare-can">
              <div class="compare-header">Tributação Direta (Sobre Renda e Patrimônio)</div>
              <ul>
                <li><strong>Identificação Clara:</strong> Incide nominalmente sobre quem gera riqueza ou é proprietário de bens (ex: IRPF, IPTU, IPVA).</li>
                <li><strong>Capacidade Contributiva:</strong> Permite adotar alíquotas progressivas (quem ganha mais recolhe uma alíquota percentual superior).</li>
                <li><strong>Transparência:</strong> O contribuinte sabe com precisão cirúrgica o volume recolhido para o erário público.</li>
              </ul>
            </div>
            <div class="compare-cannot">
              <div class="compare-header">Tributação Indireta (Sobre Consumo de Bens e Serviços)</div>
              <ul>
                <li><strong>Embutida nos Preços:</strong> Vem ocultada na nota fiscal do supermercado, energia e remédios (ex: ICMS, PIS/Cofins, IPI, ISS).</li>
                <li><strong>Alíquota Uniforme:</strong> Um milionário e um trabalhador desempregado pagam exatamente o mesmo imposto em reais sobre um quilo de alimento.</li>
                <li><strong>Efeito Regressivo:</strong> Penaliza desproporcionalmente as classes de menor poder aquisitivo.</li>
              </ul>
            </div>
          </div>

          <div class="callout-warning">
            <div class="callout-title">A Regressividade Tributária no Brasil</div>
            <p>Diferentemente dos países desenvolvidos da OCDE (onde a tributação foca na renda e patrimônio), no Brasil mais da metade de tudo que é arrecadado incide sobre o consumo. Como os cidadãos de menor renda gastam quase 100% dos seus rendimentos na subsistência diária, comprometem uma fatia percentual muito maior de sua renda sustentando impostos indiretos.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">O Alicerce do Pensamento Crítico</div>
            <p>Na era das redes sociais e da polarização algorítmica, a confusão deliberada ou involuntária entre <strong>fatos verificáveis</strong> e <strong>opiniões subjetivas</strong> tornou-se a raiz primordial da disseminação de desinformação no debate cívico.</p>
          </div>

          <div class="compare-grid">
            <div class="compare-can">
              <div class="compare-header">O Que É um Fato? (Objetivo)</div>
              <ul>
                <li><strong>Comprovação Empírica:</strong> Uma afirmação descritiva sobre a realidade material que pode ser rigorosamente confirmada ou refutada com dados, medições ou documentos.</li>
                <li><strong>Independência:</strong> O fato independe da vontade, credo ou preferência de quem o declara.</li>
                <li><strong>Exemplo Concreto:</strong> <em>"O PIB brasileiro expandiu 2,9% em 2023 de acordo com o relatório oficial do IBGE."</em></li>
              </ul>
            </div>
            <div class="compare-cannot">
              <div class="compare-header">O Que É uma Opinião? (Subjetiva)</div>
              <ul>
                <li><strong>Juízo de Valor:</strong> Uma interpretação individual, avaliação moral, crença ideológica ou preferência pessoal sobre determinado acontecimento.</li>
                <li><strong>Pluralidade:</strong> Pessoas bem intencionadas podem sustentar opiniões antagônicas diante de um mesmo conjunto de fatos.</li>
                <li><strong>Exemplo Concreto:</strong> <em>"Essa taxa de crescimento é pífia e prova a incompetência das políticas econômicas vigentes."</em></li>
              </ul>
            </div>
          </div>

          <div class="callout-warning">
            <div class="callout-title">A Falsa Equivalência no Debate</div>
            <p>Você tem pleno direito à sua própria opinião moral ou ideológica, mas não tem direito aos seus próprios fatos. Debater a melhor solução política é salutar; negar dados estatísticos e científicos consolidados desonra o diálogo democrático.</p>
          </div>
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
          <h2>Desarmando Truques de Debate e Retórica Enganosa</h2>
          <div class="callout-box">
            <div class="callout-title">O Que É uma Falácia Lógica?</div>
            <p>Uma falácia lógica é um argumento que parece persuasivo na superfície, mas contém uma quebra fundamental nas regras de inferência racional, sendo comumente utilizado na política e na publicidade para manipular a opinião pública sem apresentar mérito substantivo.</p>
          </div>

          <h3>As Quatro Falácias Mais Frequentes no Debate Político</h3>

          <div class="tier-card">
            <div class="tier-title">1. Falácia Ad Hominem (Ataque Pessoal à Pessoa)</div>
            <p>Em vez de analisar os méritos, dados ou premissas do argumento apresentado, o debatedor agride a reputação, idade, escolaridade, moral ou aparência física do adversário. <em>Exemplo: "Não ouçam as propostas orçamentárias do economista Y porque ele é jovem e arrogante."</em></p>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Falácia do Espantalho (Distorção Caricata)</div>
            <p>Consiste em simplificar grosseiramente, exagerar ou desfigurar a posição do outro debatedor até transformá-la em uma caricatura absurda, fácil de ser desmoralizada perante a plateia. <em>Exemplo: "Quem defende fiscalização ambiental quer que todos os fazendeiros morram de fome."</em></p>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. Falácia da Falsa Dicotomia (8 ou 80)</div>
            <p>Reduz uma questão complexa com dezenas de alternativas moderadas a apenas dois caminhos extremos mutuamente excludentes. <em>Exemplo: "Ou você apoia 100% da minha medida fiscal ou você quer a destruição completa do Brasil!"</em></p>
          </div>

          <div class="tier-card">
            <div class="tier-title">4. Falácia do Apelo à Emoção (Medo ou Piedade)</div>
            <p>Substitui o encadeamento causal e as estatísticas por narrativas de choque, terror ou piedade desmedida para forçar a adesão impulsiva do público sem que haja provas lógicas.</p>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Como Blindar Sua Mente</div>
            <p>Sempre que se deparar com uma discussão inflamada, separe o interlocutor da tese apresentada: avalie se os argumentos se sustentam logicamente por si sós, mesmo que fossem enunciados por alguém de quem você discorda politicamente.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">A Técnica da Leitura Lateral</div>
            <p>Desenvolvida e aperfeiçoada por jornalistas de <em>fact-checking</em> em universidades de prestígio, a <strong>Leitura Lateral</strong> preconiza que, ao ler uma publicação alarmante nas redes sociais, você NUNCA deve ficar preso na mesma página ou print, mas abrir abas paralelas de navegação para checar a credibilidade das fontes e o contexto integral do evento.</p>
          </div>

          <h3>Protocolo em 4 Etapas para Verificação de Informações</h3>

          <ol>
            <li><strong>Saia Imediatamente da Postagem Original:</strong> Abra uma nova aba no seu navegador e busque as palavras-chave do ocorrido em ferramentas de busca respeitadas. Se uma bomba política ocorreu, veículos de imprensa profissionais com equipes no Congresso já estarão cobrindo o fato com detalhes apurados.</li>
            <li><strong>Exija e Consulte a Fonte Primária:</strong> Se a notícia cita um acórdão do STF, uma instrução da Receita Federal ou um artigo científico internacional, busque o documento original oficial. Frequentemente, frases soltas são tiradas de contexto para inverter totalmente o sentido da decisão original.</li>
            <li><strong>Consulte Agências de Fact-Checking Profissionais:</strong> Agências especializadas (como Agência Lupa, Aos Fatos, Fato ou Boato e Comprova) possuem equipes dedicadas a rastrear imagens adulteradas, declarações forjadas e vídeos antigos reciclados fora de época.</li>
            <li><strong>Desconfie de Títulos Sensacionalistas e Manchetes Caça-Cliques (Clickbait):</strong> Muitas vezes, o título de uma matéria nas redes sociais é redigido de forma agressiva para provocar engajamento, mas o próprio corpo do texto esclarece que a realidade é muito mais ponderada.</li>
          </ol>

          <div class="callout-warning">
            <div class="callout-title">O Gatilho Emocional: Sinal de Alerta</div>
            <p>A desinformação contemporânea é arquitetada para ativar emoções instintivas imediatas: raiva, indignação cívica ou euforia partidária. Se você sentiu urgência visceral de compartilhar uma notícia no WhatsApp antes mesmo de ler o texto completo, pare e cheque imediatamente: você pode estar sendo manipulado.</p>
          </div>
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
          <div class="callout-box">
            <div class="callout-title">A Mecânica dos Vieses Cognitivos</div>
            <p>O cérebro humano foi moldado pela evolução para poupar energia metabólica e tomar decisões rápidas diante do perigo. Para isso, utiliza heurísticas e atalhos mentais que, no ambiente moderno de hiperinformação, geram distorções sistemáticas de interpretação denominadas <strong>vieses cognitivos</strong>.</p>
          </div>

          <h3>O Perigo Central: O Viés de Confirmação</h3>
          <p>Dentre dezenas de armadilhas psicológicas mapeadas pela ciência comportamental, o <strong>Viés de Confirmação</strong> é o mais destrutivo para a lucidez política e financeira de um cidadão:</p>

          <div class="tier-card">
            <div class="tier-title">Como o Viés de Confirmação Opera no Subconsciente</div>
            <ul>
              <li><strong>Busca Seletiva:</strong> Procuramos ativamente apenas artigos, influenciadores e postagens que validem o que nós já acreditamos previamente.</li>
              <li><strong>Assimilação Desigual:</strong> Aceitamos alegações frágeis sem qualquer exigência de provas se elas falarem mal de um adversário que detestamos.</li>
              <li><strong>Blindagem Imune:</strong> Desqualificamos dados estatísticos sólidos, estudos de universidades conceituadas ou auditorias governamentais rotulando-os como 'conspiração' caso contrariem nossa visão de mundo.</li>
            </ul>
          </div>

          <div class="tier-card">
            <div class="tier-title">A Formação de Câmaras de Eco (Bolhas Digitais)</div>
            <p>Os algoritmos de redes sociais amplificam esse viés entregando apenas conteúdos que reforçam crenças prévias para aumentar o tempo de tela do usuário, criando a falsa impressão de que "o mundo inteiro pensa exatamente como eu".</p>
          </div>

          <div class="callout-warning">
            <div class="callout-title">O Teste da Honestidade Intelectual</div>
            <p>Faça a si mesmo esta pergunta socrática: <em>"Que tipo de evidência documental ou estatística seria suficiente para me convencer de que estou errado sobre esta convicção política ou financeira?"</em> Se a resposta for "nenhuma", você não possui uma posição racional — possui um dogma religioso.</p>
          </div>
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
          <h2>Números Não Mentem, Mas Mentirosos Usam Números</h2>
          <div class="callout-box">
            <div class="callout-title">Estatística Crítica</div>
            <p>Um gráfico ou demonstrativo estatístico em telejornais, peças publicitárias ou propagandas eleitorais pode induzir o público ao erro mesmo utilizando dados matematicamente reais, caso sua apresentação visual seja deliberadamente manipulada para construir uma narrativa distorcida.</p>
          </div>

          <h3>As Três Grandes Armadilhas na Leitura de Dados</h3>

          <div class="tier-card">
            <div class="tier-title">1. Eixo Y Truncado (O Gráfico Sem o Zero)</div>
            <p>Ao omitir a base zero no eixo vertical e iniciar a escala, por exemplo, em 50%, uma variação ínfima de 50,5% para 51,5% é apresentada com uma barra visual três vezes maior que a outra, simulando uma explosão de crescimento quando o movimento real foi irrelevante.</p>
          </div>

          <div class="tier-card">
            <div class="tier-title">2. Confundir Correlação Estatística com Causalidade Real</div>
            <p>O fato de duas variáveis subirem simultaneamente no tempo não significa que uma é causa da outra. Podem decorrer de uma variável oculta comum ou de mera coincidência estatística (correlação espúria). <em>Exemplo clássico: O consumo de sorvetes e os afogamentos em praias aumentam juntos no verão, não porque o sorvete cause afogamento, mas porque o calor leva as pessoas ao mar.</em></p>
          </div>

          <div class="tier-card">
            <div class="tier-title">3. Amostragem Viciada e Recorte Temporal (Cherry Picking)</div>
            <p>Consiste em escolher a dedo um ano ou mês atípico (como o pico da pandemia de 2020 ou uma estiagem extraordinária) como termo base de comparação para forjar uma ilusão de crescimento exuberante ou decadência catastrófica.</p>
          </div>

          <div class="callout-warning">
            <div class="callout-title">Checklist ao Analisar Qualquer Gráfico</div>
            <p>Sempre verifique: (1) O eixo vertical começa no zero? (2) Qual é a fonte oficial dos números? (3) A amostra abrange um período histórico amplo ou apenas recortes convenientes? (4) Os números estão corrigidos pela inflação do período?</p>
          </div>
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
