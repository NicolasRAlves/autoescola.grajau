/* =====================================================================
   AUTO ESCOLA GRAJAÚ (Instrutor Autônomo Grajaú) — CONFIGURAÇÃO DO SITE
   ---------------------------------------------------------------------
   Tudo o que a escola pode mudar sem mexer no HTML fica aqui.
   Este arquivo é usado pelo navegador E pelo gerador das páginas
   (scripts/gerar-paginas.mjs).

   Regras:
   - Texto sempre entre aspas.  Ex.: horas: "08h às 18h"
   - Valor que ainda não sabemos = null (o site mostra "sob consulta"
     ou esconde o item).
   - Preços em número, sem R$:  450   ou   52.83
   - Depois de salvar: recarregue a página. Se mudou preço, texto de
     caso ou vídeo, rode também  npm run gerar  (pasta scripts).
   ===================================================================== */

window.GRAJAU = {

  /* true = mostra as marcas amarelas [CLIENTE INFORMAR] e a faixa de
     prévia. Troque para false ANTES de publicar. */
  modoRascunho: true,

  /* Domínio definitivo (sem barra no final). PROVISÓRIO. */
  siteUrl: "https://autoescolagrajau.com.br",

  nome: "Auto Escola Grajaú",
  marca: "Instrutor Autônomo Grajaú",
  slogan: "Seu sonho de dirigir começa aqui!",

  /* ---------- CONTATO ---------- */
  whatsapp: {
    numero: "5511926324474",            // só números, com 55 + DDD
    rotulo: "(11) 92632-4474",
    mensagemPadrao: "Olá! Vim pelo site da Auto Escola Grajaú e quero um orçamento."
  },

  telefones: [
    { rotulo: "(11) 92632-4474", numero: "+5511926324474" }
  ],

  email: null,

  endereco: {
    rua: "Av. Dona Belmira Marin, 4772",
    bairro: "Parque Brasil",
    cidade: "São Paulo",
    uf: "SP",
    cep: "04846-000",
    regiao: "Zona Sul",
    busca: "Av. Dona Belmira Marin, 4772 - Parque Brasil, São Paulo - SP, 04846-000"
  },

  /* Bairros atendidos. Enquanto regioesConfirmadas for false, a lista
     só aparece na prévia (marcada) e o site publicado diz "Grajaú e região". */
  regioes: ["Grajaú", "Parque Residencial Cocaia", "Jardim Eliana", "Varginha", "Cidade Dutra", "Interlagos", "Parelheiros", "Jardim São Bernardo", "Bororé", "Socorro"],
  regioesConfirmadas: true,

  /* Vazio = "Horários e dias flexíveis: combine pelo WhatsApp."
     Ex.: [{ dias: "Segunda a sábado", horas: "07h às 21h" }] */
  horarios: [],

  instagram: { usuario: "autoescolagrajau", url: "https://www.instagram.com/autoescolagrajau" },
  threads: { url: "https://www.threads.com/@autoescolagrajau" },
  youtube: {
    url: "https://www.youtube.com/@autoescolagrajau",
    /* vídeo do link da bio do Instagram ("prova prática Detran") */
    videoDestaque: "b1S8FvGT-JI",
    tituloDestaque: "Prova prática no Detran"
  },

  /* ---------- INSTRUTOR / INSTITUCIONAL ---------- */
  instrutor: {
    nome: null,                          // [CLIENTE INFORMAR] ex.: "Fulano"
    experiencia: null                    // [CLIENTE INFORMAR] ex.: "8 anos dando aula"
  },
  credenciamentoDetran: null,            // [CLIENTE INFORMAR] nº do credenciamento
  cnpj: null,
  duracaoAula: null,                     // [CLIENTE INFORMAR] ex.: "50 minutos"
  formasPagamento: null,                 // [CLIENTE INFORMAR] ex.: "Pix, dinheiro ou cartão"
  frota: { carro: "VW up!", moto: null },// modelo da moto: [CLIENTE INFORMAR]

  /* Data em que as regras de trânsito do site foram conferidas */
  regrasAtualizadasEm: "28/10/2026",

  /* ---------- SERVIÇOS ----------
     true  = oferece (aparece no site e no formulário)
     false = não oferece (some do site)
     null  = não confirmado (aparece só na prévia, marcado) */
  servicos: {
    categoriaA: true,
    categoriaB: true,
    adicaoCategoria: true,          // do post "Habilitação cat. A e B, adição de categoria"
    habilitados: true,              // "aulas para iniciantes e habilitados"
    aulaLocalProva: true,           // só carro: a prova de moto é em área fechada
    aulaNoCarroDoAluno: null,       // habilitado treinar no próprio carro
    buscaEmCasa: null,              // instrutor busca o aluno em casa?
    carroAutomatico: null,
    emprestaCapacete: null,
    marcaProvas: null,              // ajuda a agendar as provas no Detran?
    aulaNoite: null,
    aulaSabado: null,
    aulaDomingo: null
  },

  /* ---------- PREÇOS ----------
     Tirados dos cartazes da escola (out/2026).
     categorias: "A" moto, "B" carro.  grupo: onde o card aparece. */
  planos: {
    atualizadoEm: "28/10/2026",
    aviso: "Valores podem sofrer alterações sem aviso prévio.",
    itens: [
      {
        id: "pacote-20", grupo: "pacotes", destaque: true,
        nome: "Pacote 20 aulas", selo: "Carro + moto", preco: 1600,
        resumo: "Para quem começa do zero e quer tirar as duas categorias.",
        categorias: ["A", "B"],
        inclui: ["20 aulas práticas", "Pode dividir: 10 de carro + 10 de moto", "Aluguel do veículo na 1ª prova de cada categoria: cortesia"]
      },
      {
        id: "pacote-10", grupo: "pacotes",
        nome: "Pacote 10 aulas", selo: "Carro OU moto", preco: 1000,
        resumo: "Para a primeira habilitação ou a adição de uma categoria.",
        categorias: ["A", "B"],
        inclui: ["10 aulas práticas de carro ou de moto", "Aluguel do veículo na 1ª prova: cortesia"]
      },
      {
        id: "quatro-aulas", grupo: "rapidos",
        nome: "4 aulas + aluguel do veículo", selo: "Desconto incluso", preco: 800,
        resumo: "Para quem já tem alguma prática e quer chegar seguro.",
        categorias: ["A", "B"],
        inclui: ["4 aulas práticas de carro ou de moto", "Veículo da escola no dia da prova"]
      },
      {
        id: "duas-aulas-carro", grupo: "rapidos",
        nome: "2 aulas + aluguel do carro", selo: "Já sei dirigir", preco: 450,
        resumo: "As 2 aulas mínimas da lei e o carro para a prova.",
        categorias: ["B"],
        inclui: ["2 aulas práticas de carro", "Carro da escola no dia da prova"]
      },
      {
        id: "duas-aulas-moto", grupo: "rapidos",
        nome: "2 aulas + aluguel da moto", selo: "Já sei pilotar", preco: 450,
        resumo: "As 2 aulas mínimas da lei e a moto para a prova.",
        categorias: ["A"],
        inclui: ["2 aulas práticas de moto", "Moto da escola no dia da prova"]
      },
      {
        id: "aula-local-prova", grupo: "avulsos", servico: "aulaLocalProva",
        nome: "Aula no local da prova", detalhe: "carro", preco: 250, unidade: "por aula",
        resumo: "Treino no lugar onde você vai fazer o exame de carro.",
        categorias: ["B"]
      },
      {
        id: "aluguel", grupo: "avulsos",
        nome: "Somente aluguel do veículo", detalhe: "carro ou moto, para o dia da prova", preco: 250,
        resumo: "Você já treinou e só precisa do carro ou da moto da escola para a prova.",
        categorias: ["A", "B"]
      },
      {
        id: "avulsa", grupo: "avulsos",
        nome: "Aula avulsa", detalhe: "carro ou moto", preco: 100, unidade: "por aula",
        resumo: "Para treinar o que falta, no seu ritmo.",
        categorias: ["A", "B"], quantidade: true
      }
    ],

    /* Pagos à parte, fora das aulas (clínica e Detran-SP).
       Mesmos valores do site da Ariane (27/10/2026). */
    taxasAParte: [
      { id: "exame-medico-psico", nome: "Exame médico e psicotécnico", valor: 180 },
      { id: "exame-toxico", nome: "Exame toxicológico", valor: 150 },
      { id: "taxa-teorico", nome: "Taxa do exame teórico", valor: 52.83 },
      { id: "taxa-emissao", nome: "Taxa de emissão da CNH", valor: 137.79 }
    ]
  },

  /* ---------- CASOS (o formulário de orçamento) ----------
     Cada caso tem as próprias perguntas e as opções de preço sugeridas.
     Tipos de pergunta: "radio", "multi" (várias), "data", "texto".
     categorias: quais categorias o caso aceita ("AB" = as duas).
     servico (opcional): só aparece se o serviço estiver true. */
  casos: [
    {
      id: "zero", icone: "chave",
      titulo: "Nunca dirigi",
      subtitulo: "Primeira habilitação do zero",
      texto: "Começa do básico, com calma, até você se sentir pronto para a prova.",
      categorias: ["A", "B", "AB"],
      sugestoes: ["pacote-10", "pacote-20", "avulsa"],
      perguntas: [
        { id: "etapa", tipo: "radio", rotulo: "Em que etapa você está?", obrigatoria: true, opcoes: [
          ["inicio", "Ainda não abri o processo"],
          ["exames", "Já fiz os exames médico e psicotécnico"],
          ["teorico", "Estou fazendo o curso teórico no app"],
          ["teorica-ok", "Já passei na prova teórica"]
        ] }
      ]
    },
    {
      id: "ja-dirijo", icone: "volante",
      titulo: "Já sei dirigir",
      subtitulo: "Só falta a CNH",
      texto: "As aulas mínimas da lei, foco no que o examinador avalia e o veículo para a prova.",
      categorias: ["A", "B", "AB"],
      sugestoes: ["duas-aulas-carro", "duas-aulas-moto", "quatro-aulas", "aula-local-prova"],
      perguntas: [
        { id: "etapa", tipo: "radio", rotulo: "Em que etapa você está?", obrigatoria: true, opcoes: [
          ["antes-teorica", "Ainda não fiz a prova teórica"],
          ["teorica-ok", "Já passei na prova teórica"],
          ["pratica-marcada", "Minha prova prática já está marcada"]
        ] },
        { id: "pratica", tipo: "radio", rotulo: "Quanto você já dirige?", opcoes: [
          ["pouco", "Dirijo um pouco, com alguém do lado"],
          ["bem", "Dirijo bem, só nunca tirei a CNH"]
        ] }
      ]
    },
    {
      id: "prova-marcada", icone: "calendario",
      titulo: "Minha prova está marcada",
      subtitulo: "Quero chegar pronto no dia",
      texto: "Aula no local da prova (carro) e o veículo da escola no dia do exame.",
      categorias: ["A", "B"],
      sugestoes: ["aula-local-prova", "aluguel", "duas-aulas-carro", "duas-aulas-moto", "quatro-aulas"],
      perguntas: [
        { id: "data", tipo: "data", rotulo: "Data da prova", obrigatoria: false },
        { id: "local", tipo: "texto", rotulo: "Local da prova (se souber)", placeholder: "Ex.: o local que aparece no agendamento" },
        { id: "veiculo", tipo: "radio", rotulo: "Você precisa do veículo para a prova?", opcoes: [
          ["sim", "Sim, quero o veículo da escola"],
          ["nao", "Não, já tenho veículo para a prova"],
          ["nao-sei", "Ainda não sei"]
        ] }
      ]
    },
    {
      id: "reprovei", icone: "repetir",
      titulo: "Reprovei na prova",
      subtitulo: "Quero passar na próxima",
      texto: "A gente treina exatamente o que pegou, de preferência no local da prova.",
      categorias: ["A", "B"],
      sugestoes: ["aula-local-prova", "quatro-aulas", "avulsa", "aluguel"],
      perguntas: [
        { id: "tentativas", tipo: "radio", rotulo: "Quantas vezes você já fez a prova prática?", opcoes: [
          ["1", "1 vez"], ["2", "2 vezes"], ["3+", "3 ou mais"]
        ] },
        { id: "dificuldades", tipo: "multi", rotulo: "O que mais pegou? (pode marcar mais de um)", opcoes: [
          ["nervoso", "Nervosismo"],
          ["controle", "Controle do veículo (embreagem, marchas, equilíbrio)"],
          ["ladeira", "Ladeira / rampa"],
          ["conversao", "Conversões e preferências"],
          ["sinalizacao", "Sinalização e percurso"],
          ["outro", "Outra coisa"]
        ] },
        { id: "data", tipo: "data", rotulo: "Data da próxima prova (se já tiver)" }
      ]
    },
    {
      id: "habilitado", icone: "escudo", servico: "habilitados",
      titulo: "Tenho CNH, mas não dirijo",
      subtitulo: "Perdi a prática ou tenho medo",
      texto: "Aulas para habilitados: volte a dirigir com segurança, sem pressão e no seu tempo.",
      categorias: ["A", "B"],
      sugestoes: ["avulsa"],
      perguntas: [
        { id: "tempo", tipo: "radio", rotulo: "Há quanto tempo você não dirige?", obrigatoria: true, opcoes: [
          ["nunca", "Tirei a CNH e nunca dirigi"],
          ["menos-1", "Menos de 1 ano"],
          ["1-5", "De 1 a 5 anos"],
          ["5+", "Mais de 5 anos"]
        ] },
        { id: "objetivo", tipo: "multi", rotulo: "O que você quer treinar? (pode marcar mais de um)", opcoes: [
          ["medo", "Perder o medo"],
          ["transito", "Trânsito pesado e avenidas"],
          ["manobras", "Estacionar e manobrar"],
          ["ladeira", "Ladeira"],
          ["estrada", "Estrada / rodovia"]
        ] },
        { id: "carro", tipo: "radio", rotulo: "Onde prefere treinar?", servico: "aulaNoCarroDoAluno", opcoes: [
          ["escola", "No veículo da escola"],
          ["meu", "No meu próprio carro"]
        ] }
      ]
    },
    {
      id: "adicao", icone: "mais", servico: "adicaoCategoria",
      titulo: "Adicionar categoria",
      subtitulo: "Tenho A e quero B, ou o contrário",
      texto: "Você já tem uma CNH: é só aprender a outra e fazer a prova prática.",
      categorias: ["A", "B"],
      sugestoes: ["pacote-10", "quatro-aulas", "duas-aulas-carro", "duas-aulas-moto"],
      perguntas: [
        { id: "etapa", tipo: "radio", rotulo: "Em que etapa você está?", opcoes: [
          ["inicio", "Ainda vou abrir a adição"],
          ["aberto", "Já abri o processo"],
          ["pratica-marcada", "Minha prova prática já está marcada"]
        ] }
      ]
    },
    {
      id: "aluguel", icone: "carro",
      titulo: "Só preciso do veículo",
      subtitulo: "Para o dia da prova",
      texto: "Você já treinou e só precisa do carro ou da moto da escola para fazer o exame.",
      categorias: ["B", "A"],
      sugestoes: ["aluguel", "aula-local-prova", "duas-aulas-carro", "duas-aulas-moto"],
      perguntas: [
        { id: "data", tipo: "data", rotulo: "Data da prova" },
        { id: "local", tipo: "texto", rotulo: "Local da prova (se souber)", placeholder: "Ex.: o local que aparece no agendamento" }
      ]
    }
  ],

  /* ---------- VÍDEOS (Reels) ----------
     Arquivos em assets/video/. Para comprimir um vídeo novo:
     npm run videos  (pasta scripts). */
  videos: [
    { arquivo: "aula-moto.mp4", poster: "aula-moto.jpg", categoria: "A", titulo: "Aula de moto com a Grajaú" },
    { arquivo: "aula-carro.mp4", poster: "aula-carro.jpg", categoria: "B", titulo: "Aula prática de carro no VW up!" },
    { arquivo: "treino-moto-percurso.mp4", poster: "treino-moto-percurso.jpg", categoria: "A", titulo: "Treino de moto no percurso" }
  ],

  /* ---------- PERGUNTAS QUE DEPENDEM DA ESCOLA ----------
     Sem "resposta", a pergunta só aparece na prévia.
     categoria: "geral", "A", "B", "habilitados" ou "local-prova" */
  faqEscola: [
    { categoria: "geral", pergunta: "Quanto dura cada aula?", resposta: "" },
    { categoria: "geral", pergunta: "Quais são as formas de pagamento?", resposta: "" },
    { categoria: "geral", pergunta: "O instrutor busca o aluno em casa?", resposta: "" },
    { categoria: "geral", pergunta: "Vocês marcam as provas no Detran?", resposta: "" },
    { categoria: "B", pergunta: "Tem carro automático?", resposta: "" },
    { categoria: "A", pergunta: "Vocês emprestam capacete?", resposta: "" },
    { categoria: "A", pergunta: "Qual é a moto das aulas?", resposta: "" },
    { categoria: "habilitados", pergunta: "Posso treinar no meu próprio carro?", resposta: "" },
    { categoria: "local-prova", pergunta: "Em quais locais de prova vocês dão aula?", resposta: "" },
    { categoria: "local-prova", pergunta: "Tem aula no local da prova para moto?", resposta: "Não. A prova prática de moto é feita em área fechada, então o treino de moto acontece nas aulas normais. O aluguel da moto para o dia da prova custa R$ 250." }
  ]
};
