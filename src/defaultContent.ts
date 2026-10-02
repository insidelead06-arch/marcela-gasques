export interface FocusArea {
  id: string;
  numero: string;
  titulo: string;
  descricao: string;
  detalhes: string;
}

export interface FaqItem {
  pergunta: string;
  resposta: string;
}

export interface ProcessStep {
  numero: string;
  titulo: string;
  descricao: string;
}

export interface SiteContent {
  whatsappNumber: string;
  whatsappDisplay: string;
  crp: string;
  instagramHandle: string;
  instagramUrl: string;
  tiktokHandle: string;
  tiktokUrl: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    eyebrow: string;
    title: string;
    p1: string;
    p2: string;
    p3: string;
    quote: string;
  };
  possibilidadesTitle: string;
  possibilidadesSubtitle: string;
  possibilidades: FocusArea[];
  comoFunciona: {
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  social: {
    eyebrow: string;
    title: string;
    description: string;
    whatsappPrompt: string;
  };
  faqTitle: string;
  faqSubtitle: string;
  faqList: FaqItem[];
  contato: {
    eyebrow: string;
    title: string;
    subtitle: string;
    buttonText: string;
    fieldLabel: string;
    fieldOptions: string[];
  };
}

export const defaultSiteContent: SiteContent = {
  whatsappNumber: '5514997238742',
  whatsappDisplay: '(14) 99723-8742',
  crp: '06/238765',
  instagramHandle: '@psi_marcelagasques',
  instagramUrl: 'https://www.instagram.com/psi_marcelagasques?stkn=MTAwbjRyeG91b2lqag==',
  tiktokHandle: '@psi_marcelagasques',
  tiktokUrl: 'https://www.tiktok.com/@psi_marcelagasques',
  hero: {
    eyebrow: 'Psicologia Clínica & Psicoterapia 100% Online',
    title: 'Psicoterapia para adultos, on-line e com escuta voltada à Psicanálise.',
    subtitle: 'Um espaço para falar sobre o que você está vivendo, compreender melhor seus sentimentos e relações e olhar para aquilo que, muitas vezes, é difícil entender sozinho.',
    ctaPrimary: 'Quero conhecer o processo terapêutico',
    ctaSecondary: 'O que podemos trabalhar',
  },
  about: {
    eyebrow: 'Conheça a profissional',
    title: 'A terapia começa quando aquilo que incomoda pode finalmente ser colocado em palavras.',
    p1: 'Olá, sou Marcela Gasques, psicóloga. Meu trabalho é oferecer um espaço de escuta onde você possa falar sobre o que está vivendo com liberdade, sem precisar chegar com tudo organizado ou saber exatamente o que está acontecendo.',
    p2: 'Na psicoterapia, podemos olhar juntos para sentimentos, relações, conflitos, perdas, escolhas e situações que parecem se repetir na sua vida.',
    p3: 'Minha escuta é orientada pela Psicanálise, uma abordagem que busca compreender não apenas aquilo que aparece de forma mais evidente, mas também os sentidos e questões que podem estar por trás do que sentimos, pensamos e vivemos.',
    quote: 'Um convite para pausar, se escutar e reconstruir sentidos.',
  },
  possibilidadesTitle: 'O que podemos trabalhar em psicoterapia',
  possibilidadesSubtitle: 'Demandas comuns e temas fundamentais que ganham espaço, elaboração e cuidado nas sessões individuais.',
  possibilidades: [
    {
      id: 'vinculos',
      numero: '01',
      titulo: 'Relações e vínculos',
      descricao: 'Algumas relações podem trazer conflitos, inseguranças ou a sensação de estar sempre vivendo situações parecidas.',
      detalhes: 'Você enfrenta dificuldades nos relacionamentos amorosos, familiares ou de amizade, sente dificuldade em estabelecer limites ou percebe padrões que se repetem nas suas relações.',
    },
    {
      id: 'luto',
      numero: '02',
      titulo: 'Perdas e luto',
      descricao: 'Algumas perdas mudam nossa rotina, nossos planos e até a forma como nos relacionamos com a vida.',
      detalhes: 'Você está passando por um término, afastamento, perda de alguém importante, mudança significativa ou outro momento que esteja sendo difícil elaborar.',
    },
    {
      id: 'escolhas',
      numero: '03',
      titulo: 'Escolhas e mudanças',
      descricao: 'Há momentos em que precisamos tomar decisões, mudar de direção ou lidar com uma fase da vida que já não é a mesma.',
      detalhes: 'Você está diante de uma mudança de carreira, uma nova fase da vida, uma decisão importante ou se sente inseguro sobre qual caminho seguir.',
    },
    {
      id: 'sentimentos',
      numero: '04',
      titulo: 'Sentimentos e conflitos',
      descricao: 'Nem sempre é fácil entender o que estamos sentindo ou explicar por que determinadas situações nos afetam tanto.',
      detalhes: 'Você se sente angustiado, ansioso, inseguro, sobrecarregado ou percebe conflitos internos que gostaria de compreender melhor.',
    },
  ],
  comoFunciona: {
    eyebrow: 'Processo Terapêutico',
    title: 'Como funciona o atendimento online',
    subtitle: 'Comodidade, segurança e o mesmo rigor ético do consultório presencial.',
    steps: [
      {
        numero: '01',
        titulo: 'Primeiro Contato',
        descricao: 'Você entra em contato pelo WhatsApp para tirar dúvidas iniciais sobre horários disponíveis e valores.',
      },
      {
        numero: '02',
        titulo: 'Sessão Inicial',
        descricao: 'Realizamos a primeira conversa em videochamada segura para você apresentar suas questões e combinarmos o processo.',
      },
      {
        numero: '03',
        titulo: 'Acompanhamento Contínuo',
        descricao: 'Encontros semanais de 50 minutos, com sigilo ético absoluto e atenção focada nas suas necessidades.',
      },
    ],
  },
  social: {
    eyebrow: 'Encontre-me nas redes',
    title: 'Para continuar essa conversa fora da sessão.',
    description: 'No Instagram e no TikTok, compartilho um pouco do meu olhar sobre Psicologia, relações, sentimentos e as questões que surgem ao longo da vida.',
    whatsappPrompt: 'Prefere falar direto? Chame no WhatsApp',
  },
  faqTitle: 'Perguntas Frequentes',
  faqSubtitle: 'Respostas claras para as dúvidas mais comuns sobre o processo terapêutico.',
  faqList: [
    {
      pergunta: 'Preciso saber exatamente o que está acontecendo comigo para começar a terapia?',
      resposta: 'Não. Você não precisa chegar com tudo organizado ou saber exatamente o que está sentindo. A psicoterapia também pode ser um espaço para compreender melhor o que está acontecendo e encontrar palavras para aquilo que ainda não consegue nomear.',
    },
    {
      pergunta: 'Como funciona a primeira sessão?',
      resposta: 'A primeira sessão é um momento para nos conhecermos, para você trazer o que motivou a busca pela psicoterapia e conhecer melhor a forma como conduzo o processo. A partir dessa conversa inicial, compreendemos juntos suas necessidades e os próximos passos.',
    },
    {
      pergunta: 'Por quanto tempo preciso fazer terapia?',
      resposta: 'Não existe um período determinado. Cada processo terapêutico possui seu próprio ritmo e duração, que podem ser revisitados ao longo do acompanhamento.',
    },
    {
      pergunta: 'Como saber se a psicoterapia é para mim?',
      resposta: 'Se existe algo que tem despertado questionamentos, desconfortos ou o desejo de se compreender melhor, a terapia pode ser um espaço para olhar para isso com mais atenção. Você não precisa ter todas as respostas antes de começar.',
    },
    {
      pergunta: 'Você emite recibo para reembolso no plano de saúde?',
      resposta: 'Sim! Forneço recibos com todos os dados exigidos pelo Conselho Federal de Psicologia e operadoras de planos de saúde para solicitação de reembolso.',
    },
  ],
  contato: {
    eyebrow: 'Primeiro Passo',
    title: 'Vamos conversar?',
    subtitle: 'Você não precisa ter tudo organizado para começar. Podemos começar pelo que hoje está pedindo espaço para ser dito.',
    buttonText: 'Falar com Marcela',
    fieldLabel: 'O que trouxe você até aqui?',
    fieldOptions: [
      'Quero conhecer a psicoterapia',
      'Relações e vínculos',
      'Perdas e luto',
      'Escolhas e mudanças',
      'Ansiedade e questões emocionais',
      'Outro',
    ],
  },
};
