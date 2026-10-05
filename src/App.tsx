import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Calendar,
  Clock,
  Video,
  MapPin,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowRight,
  Shield,
  Menu,
  X,
  Compass,
  HeartHandshake,
  Sparkles,
  CheckCircle2,
  Instagram,
  ExternalLink,
  Heart,
  Lock,
  Edit3,
} from 'lucide-react';
import { auth, onAuthStateChanged, db, User } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { SiteContent, defaultSiteContent } from './defaultContent';
import { AdminModal } from './AdminModal';

export default function App() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('marcela_cms_auth') === 'ADMIN';
    } catch {
      return false;
    }
  });

  const handleAdminLoginSuccess = () => {
    try {
      localStorage.setItem('marcela_cms_auth', 'ADMIN');
    } catch (e) {
      console.warn(e);
    }
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem('marcela_cms_auth');
    } catch (e) {
      console.warn(e);
    }
    setIsAdminLoggedIn(false);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    assunto: 'Quero conhecer a psicoterapia',
    modalidade: 'online',
    periodo: 'tarde',
    mensagem: '',
  });

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const docRef = doc(db, 'site_content', 'main');
    const unsubscribeDoc = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as Partial<SiteContent>;
          setContent((prev) => ({
            ...prev,
            ...data,
            hero: { ...prev.hero, ...(data.hero || {}) },
            about: { ...prev.about, ...(data.about || {}) },
            comoFunciona: { ...prev.comoFunciona, ...(data.comoFunciona || {}) },
            social: { ...prev.social, ...(data.social || {}) },
            contato: { ...prev.contato, ...(data.contato || {}) },
            possibilidades:
              data.possibilidades && data.possibilidades.length > 0
                ? data.possibilidades
                : prev.possibilidades,
            faqList:
              data.faqList && data.faqList.length > 0
                ? data.faqList
                : prev.faqList,
          }));
        }
      },
      (error) => {
        console.warn('Firestore snapshot error:', error);
      }
    );

    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setAdminOpen(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    return () => {
      unsubscribeAuth();
      unsubscribeDoc();
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const whatsappNumber = content.whatsappNumber;
  const whatsappDisplay = content.whatsappDisplay;
  const crp = content.crp;
  const instagramUrl = content.instagramUrl;
  const instagramHandle = content.instagramHandle;
  const tiktokUrl = content.tiktokUrl;
  const tiktokHandle = content.tiktokHandle;
  const possibilidades = content.possibilidades;
  const faqs = content.faqList;

  const getWhatsappLink = (customText?: string) => {
    const text =
      customText ||
      'Olá, Marcela! Visitei seu site e gostaria de saber mais informações sobre os atendimentos de psicoterapia online.';
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const msg =
      `Olá, Marcela! Preenchi o formulário no seu site:\n\n` +
      `• Nome: ${formData.nome}\n` +
      `• O que me trouxe até aqui: ${formData.assunto}\n` +
      `• Formato: Atendimento 100% Online\n` +
      `• Melhor Período: ${formData.periodo}\n` +
      (formData.whatsapp ? `• Meu WhatsApp: ${formData.whatsapp}\n` : '') +
      (formData.mensagem ? `• Mensagem: ${formData.mensagem}\n` : '');

    // Redirect directly to WhatsApp with the formatted subject
    window.location.href = getWhatsappLink(msg);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#2c2520] relative overflow-x-hidden selection:bg-[#d8c3b4] selection:text-[#231c17]">
      {/* 
        MARCA D'ÁGUA DA IDENTIDADE VISUAL
        Composição gráfica com as formas e tipografia da marca Marcela Gasques
      */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      >
        {/* Center-Left Background Logo Watermark (Logo 2) */}
        <div className="absolute top-[32%] -left-20 md:-left-32 w-[350px] h-[480px] md:w-[500px] md:h-[680px] opacity-[0.12] select-none">
          <img
            src="./assets/logo2_transparent.png"
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter contrast-125"
            onError={(e) => {
              e.currentTarget.src = './assets/logo2.jpg';
            }}
          />
        </div>

        {/* Bottom-Right Background Logo Watermark */}
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[340px] md:w-[600px] md:h-[420px] opacity-[0.12] select-none">
          <img
            src="./assets/logo1_transparent.png"
            alt=""
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain filter contrast-125"
            onError={(e) => {
              e.currentTarget.src = './assets/logo1.jpg';
            }}
          />
        </div>
      </div>

      {/* HEADER / NAVIGATION (3-zone Top Bar Contract) */}
      <header className="sticky top-0 z-50 bg-[#faf8f5]/95 backdrop-blur-md border-b border-[#e9e1d5] shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Zone 1: Brand Wordmark with official logo */}
          <a
            href="#"
            className="flex items-center gap-3.5 group"
          >
            <img
              src="./assets/logo1_trimmed.png"
              alt="Marcela Gasques - Psicóloga Clínica"
              referrerPolicy="no-referrer"
              className="h-11 md:h-13 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = './assets/logo1.jpg';
              }}
            />
            <div className="flex flex-col">
              <span className="text-lg md:text-xl lg:text-2xl font-serif tracking-tight text-[#2c2520] group-hover:text-[#8c422f] transition-colors leading-tight">
                Marcela Gasques
              </span>
              <span className="text-[10px] tracking-widest uppercase text-[#8c422f] font-semibold">
                Psicóloga Clínica · CRP {crp}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7 text-xs xl:text-sm font-medium text-[#5c5045]">
            <a
              href="#sobre"
              className="hover:text-[#8c422f] transition-colors py-1 whitespace-nowrap"
            >
              Sobre
            </a>
            <a
              href="#cuidado"
              className="hover:text-[#8c422f] transition-colors py-1 whitespace-nowrap"
            >
              O que Trabalhamos
            </a>
            <a
              href="#como-funciona"
              className="hover:text-[#8c422f] transition-colors py-1 whitespace-nowrap"
            >
              Como Funciona
            </a>
            <a
              href="#instagram"
              className="hover:text-[#8c422f] transition-colors py-1 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Instagram className="w-3.5 h-3.5 text-[#8c422f]" />
              <span>Redes Sociais</span>
            </a>
            <a
              href="#faq"
              className="hover:text-[#8c422f] transition-colors py-1 whitespace-nowrap"
            >
              Dúvidas Frequentes
            </a>
          </nav>

          {/* Desktop Primary Action CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 px-4 xl:px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#362d26] text-[#faf8f5] hover:bg-[#8c422f] transition-colors shadow-sm whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#e5d2c1]" />
              <span>Agendar Conversa</span>
            </a>
          </div>

          {/* Mobile & Tablet Toggle Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={getWhatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#2e7d32]/10 text-[#2e7d32] hover:bg-[#2e7d32]/20 transition-colors"
              aria-label="Chamar no WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#362d26] bg-[#f0e7dc]/60 hover:bg-[#ebe3d7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#8c422f]/20"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#faf8f5]/98 backdrop-blur-xl border-b border-[#e9e1d5] px-6 py-6 shadow-xl">
            <div className="flex flex-col gap-1 text-sm font-medium text-[#4a3e35]">
              <a
                href="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-[#f2ebe2] hover:text-[#8c422f] transition-colors flex items-center justify-between"
              >
                <span>Sobre a Psicóloga</span>
                <ArrowRight className="w-4 h-4 text-[#b09e8e]" />
              </a>
              <a
                href="#cuidado"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-[#f2ebe2] hover:text-[#8c422f] transition-colors flex items-center justify-between"
              >
                <span>O que Podemos Trabalhar</span>
                <ArrowRight className="w-4 h-4 text-[#b09e8e]" />
              </a>
              <a
                href="#como-funciona"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-[#f2ebe2] hover:text-[#8c422f] transition-colors flex items-center justify-between"
              >
                <span>Como Funciona o Atendimento</span>
                <ArrowRight className="w-4 h-4 text-[#b09e8e]" />
              </a>
              <a
                href="#instagram"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-[#f2ebe2] hover:text-[#8c422f] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#8c422f]" />
                  <span>Redes Sociais (Instagram & TikTok)</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#b09e8e]" />
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-3 rounded-xl hover:bg-[#f2ebe2] hover:text-[#8c422f] transition-colors flex items-center justify-between"
              >
                <span>Dúvidas Frequentes</span>
                <ArrowRight className="w-4 h-4 text-[#b09e8e]" />
              </a>

              {/* Direct CTAs in Mobile Menu */}
              <div className="pt-4 mt-2 border-t border-[#e9e1d5] space-y-2.5">
                <a
                  href="#contato"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#362d26] text-[#faf8f5] hover:bg-[#8c422f] transition-colors shadow-sm"
                >
                  <Calendar className="w-4 h-4 text-[#e5d2c1]" />
                  <span>Solicitar Horário</span>
                </a>

                <a
                  href={getWhatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-xs font-semibold bg-[#2e7d32] text-white hover:bg-[#1b5e20] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {whatsappDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-20 md:pt-16 md:pb-28 overflow-hidden z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Headline and Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8c422f] font-semibold">
                <span className="w-6 h-[1px] bg-[#8c422f]" />
                {content.hero.eyebrow}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#231c17] leading-[1.14] tracking-tight text-balance">
                {content.hero.title}
              </h1>

              <p className="text-lg md:text-xl text-[#5c5045] font-light leading-relaxed max-w-2xl">
                {content.hero.subtitle}
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  href="#contato"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium bg-[#362d26] text-[#faf8f5] hover:bg-[#8c422f] transition-all shadow-md group"
                >
                  <MessageCircle className="w-4 h-4 text-[#e5d2c1]" />
                  <span>{content.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="#cuidado"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-sm font-medium border border-[#ded2c1] text-[#362d26] hover:bg-[#ebe3d7]/60 transition-colors"
                >
                  {content.hero.ctaSecondary}
                </a>
              </div>

              {/* Subtle Trust Indicators */}
              <div className="pt-6 border-t border-[#e9e1d5] flex flex-wrap items-center gap-6 text-xs text-[#6b5d52]">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#8c422f]" />
                  <span>Sigilo profissional ético (CFP · CRP 06/238765)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#8c422f]" />
                  <span>Atendimento 100% Online seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#8c422f]" />
                  <span>Conforto de onde você estiver</span>
                </div>
              </div>
            </div>

            {/* Right Column: Imagery with layered logo watermark */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Background Card */}
                <div className="absolute -inset-3 bg-[#f0e7dc] rounded-3xl transform rotate-1 transition-transform group-hover:rotate-0 -z-10 shadow-sm border border-[#e5d9ca]" />

                {/* Hero photography */}
                <div className="overflow-hidden rounded-2xl shadow-lg border border-[#e5d9ca] bg-[#faf8f5]">
                  <img
                    src="./assets/marcela_gasques_real.jpg"
                    alt="Marcela Gasques - Psicóloga Clínica"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain block rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://i.imgur.com/nJWDKW9.jpeg';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT MARCELA GASQUES SECTION */}
      <section id="sobre" className="py-20 bg-[#f5f1eb]/70 border-y border-[#e9e1d5] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Portrait column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative max-w-sm mx-auto">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-[#d9ccbd] -z-10" />
                <div className="overflow-hidden rounded-2xl shadow-md border border-[#e5d9ca] bg-[#faf8f5]">
                  <img
                    src="./assets/marcela_gasques_about.jpg"
                    alt="Marcela Gasques - Psicóloga Clínica"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain block rounded-2xl"
                    onError={(e) => {
                      e.currentTarget.src = 'https://i.imgur.com/JXFPHCl.jpeg';
                    }}
                  />
                </div>
                <div className="text-center mt-3">
                  <span className="text-xs tracking-wider uppercase text-[#7a6b5e]">
                    Marcela Gasques · CRP {crp}
                  </span>
                </div>
              </div>
            </div>

            {/* Content column */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8c422f] font-semibold">
                <span className="w-6 h-[1px] bg-[#8c422f]" />
                {content.about.eyebrow}
              </div>

              <h2 className="text-3xl md:text-4xl font-serif text-[#231c17] leading-tight">
                {content.about.title}
              </h2>

              <div className="space-y-4 text-base md:text-lg text-[#55473c] font-light leading-relaxed">
                <p>{content.about.p1}</p>
                <p>{content.about.p2}</p>
                <p>{content.about.p3}</p>
              </div>

              {/* Three Pillars */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e2d5c5]">
                  <Compass className="w-5 h-5 text-[#8c422f] mb-2" />
                  <h4 className="text-sm font-semibold text-[#231c17] mb-1">
                    Escuta Atenta
                  </h4>
                  <p className="text-xs text-[#6e5f52] leading-relaxed">
                    Acolhimento da sua história com dedicação e profundidade.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e2d5c5]">
                  <HeartHandshake className="w-5 h-5 text-[#8c422f] mb-2" />
                  <h4 className="text-sm font-semibold text-[#231c17] mb-1">
                    Vínculo Genuíno
                  </h4>
                  <p className="text-xs text-[#6e5f52] leading-relaxed">
                    Relação terapêutica ética e confiável para falar abertamente.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e2d5c5]">
                  <Sparkles className="w-5 h-5 text-[#8c422f] mb-2" />
                  <h4 className="text-sm font-semibold text-[#231c17] mb-1">
                    Tempo Singular
                  </h4>
                  <p className="text-xs text-[#6e5f52] leading-relaxed">
                    Respeito absoluto ao seu ritmo, sem pressa ou cobranças.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O QUE PODEMOS TRABALHAR EM TERAPIA */}
      <section id="cuidado" className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Heading */}
          <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8c422f] font-semibold mb-3">
              <span className="w-6 h-[1px] bg-[#8c422f]" />
              Frentes de Atuação
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#231c17] tracking-tight">
              {content.possibilidadesTitle}
            </h2>
            <p className="text-base md:text-lg text-[#5c5045] mt-4 font-light leading-relaxed">
              {content.possibilidadesSubtitle}
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {possibilidades.map((item) => {
              const descricao = (item as any).descricao || (item as any).texto;
              const detalhes = (item as any).detalhes || (item as any).indicadoPara;
              return (
                <div
                  key={item.numero}
                  className="group relative p-8 md:p-10 rounded-2xl transition-all duration-300 border bg-[#faf8f5] border-[#e5d9ca] hover:border-[#b8a695] hover:bg-[#ffffff] hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    {/* Top Number indicator - clean and without red badge */}
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-serif text-3xl md:text-4xl text-[#b09e8e] group-hover:text-[#8c422f] transition-colors tabular-nums">
                        {item.numero}
                      </span>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-2xl md:text-3xl font-serif text-[#231c17] mb-4 group-hover:text-[#8c422f] transition-colors">
                      {item.titulo}
                    </h3>

                    {/* Main Description */}
                    <p className="text-base text-[#4a3e35] leading-relaxed font-light mb-6">
                      {descricao}
                    </p>

                    {/* Quando buscar */}
                    {detalhes && (
                      <div className="pt-5 border-t border-[#f0e7dc] space-y-2 mb-6">
                        <div className="text-xs font-semibold text-[#8c422f] uppercase tracking-wider">
                          Pode fazer sentido buscar terapia quando:
                        </div>
                        <p className="text-sm text-[#5c5045] leading-relaxed">
                          {detalhes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Saiba mais → CTA */}
                  <div className="pt-4 border-t border-[#f0e7dc] flex items-center justify-between">
                    <a
                      href={getWhatsappLink(
                        `Olá, Marcela! Li sobre "${item.titulo}" no seu site e gostaria de saber mais sobre o atendimento terapêutico voltado a esse tema.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#8c422f] hover:text-[#52251a] transition-colors group/link"
                    >
                      <span>Saiba mais</span>
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Guidance Box */}
          <div className="mt-12 p-8 rounded-2xl bg-[#f2ebe2] border border-[#e2d5c5] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-lg font-serif text-[#231c17]">
                Tem dúvidas sobre qual assunto ou ponto de partida é o ideal?
              </h4>
              <p className="text-sm text-[#615246]">
                Converse diretamente comigo no WhatsApp para esclarecer dúvidas e agendar sua sessão.
              </p>
            </div>
            <a
              href={getWhatsappLink(
                'Olá, Marcela! Gostaria de uma orientação inicial para saber por onde começar meu processo terapêutico.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#2e7d32] text-white hover:bg-[#1b5e20] transition-colors shadow-sm whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              Chamar no WhatsApp: (14) 99723-8742
            </a>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA O ACOMPANHAMENTO (Modalities & Process) */}
      <section id="como-funciona" className="py-20 bg-[#f5f1eb]/70 border-t border-[#e9e1d5] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#8c422f] font-semibold mb-3">
              <span className="w-6 h-[1px] bg-[#8c422f]" />
              Formato & Estrutura
              <span className="w-6 h-[1px] bg-[#8c422f]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#231c17]">
              Como funciona o atendimento
            </h2>
            <p className="text-base text-[#5c5045] mt-3 font-light">
              Praticidade e flexibilidade para acolher sua rotina com total sigilo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Modality 1: Online */}
            <div className="p-8 rounded-2xl bg-[#faf8f5] border border-[#e5d9ca] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0e7dc] flex items-center justify-center text-[#8c422f]">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-[#231c17]">
                  Atendimento 100% Online
                </h3>
                <p className="text-sm text-[#5c5045] leading-relaxed">
                  Sessões realizadas por videoconferência em plataforma criptografada e segura.
                  Você é atendido com tranquilidade de qualquer cidade do Brasil ou do exterior,
                  sem perda de tempo com trânsito ou deslocamentos.
                </p>
                <ul className="space-y-2 text-xs text-[#5c5045] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Sem deslocamentos ou trânsito
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Privacidade e sigilo profissional
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Flexibilidade de horários
                  </li>
                </ul>
              </div>
            </div>

            {/* Modality 2: Espaço de Privacidade */}
            <div className="p-8 rounded-2xl bg-[#faf8f5] border border-[#e5d9ca] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0e7dc] flex items-center justify-center text-[#8c422f]">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-[#231c17]">
                  Seu Espaço Privativo
                </h3>
                <p className="text-sm text-[#5c5045] leading-relaxed">
                  Para o atendimento online, basta estar em um local onde você se sinta à vontade,
                  com privacidade para falar livremente. O uso de fones de ouvido é recomendado
                  para maior conforto e confidencialidade.
                </p>
                <ul className="space-y-2 text-xs text-[#5c5045] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Local confortável e privativo
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Conexão estável e fones de ouvido
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Ambiente seguro e acolhedor
                  </li>
                </ul>
              </div>
            </div>

            {/* Modality 3: Sessões & Frequência */}
            <div className="p-8 rounded-2xl bg-[#faf8f5] border border-[#e5d9ca] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#f0e7dc] flex items-center justify-center text-[#8c422f]">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-[#231c17]">
                  Duração & Encontros
                </h3>
                <p className="text-sm text-[#5c5045] leading-relaxed">
                  Cada sessão tem duração de 50 minutos. A frequência é combinada em conjunto,
                  sendo habitualmente semanal para assegurar a continuidade do processo terapêutico.
                </p>
                <ul className="space-y-2 text-xs text-[#5c5045] pt-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Duração de 50 minutos por sessão
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Frequência ajustada à sua necessidade
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#8c422f]" />
                    Emissão de recibos para reembolso
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTAGRAM SECTION (Animated Smartphone with Infinite Scrolling Feed) */}
      <section id="instagram" className="py-24 bg-[#faf8f5] border-t border-[#e9e1d5] relative overflow-hidden z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
            
            {/* Left Column: Animated Smartphone with Infinite Loop Feed */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <div className="relative flex items-center justify-center py-6 w-full max-w-[340px]">
                {/* Background Ambient Instagram Glow */}
                <div className="absolute -inset-6 bg-gradient-to-tr from-[#f58529]/20 via-[#dd2a7b]/20 to-[#8134af]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

                {/* Floating Badge Top Right */}
                <div className="absolute -top-1 -right-3 sm:-right-6 z-30 bg-white/95 backdrop-blur-md border border-[#e5d9ca] px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2.5 animate-bounce [animation-duration:3.5s]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-bold text-[#231c17] leading-tight">{instagramHandle}</span>
                    <span className="block text-[10px] text-[#8c422f] font-semibold">Perfil Oficial</span>
                  </div>
                </div>

                {/* Floating Badge Bottom Left */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute -bottom-2 -left-3 sm:-left-6 z-30 bg-white/95 backdrop-blur-md border border-[#e5d9ca] px-3.5 py-2 rounded-2xl shadow-lg flex items-center gap-2.5 hover:border-[#111111] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.69 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V8.58a8.27 8.27 0 0 0 4.84 1.55v-3.44a4.85 4.85 0 0 1-.93 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <span className="block text-[11px] font-bold text-[#231c17] leading-tight">TikTok Oficial</span>
                    <span className="block text-[10px] text-[#7a6b5e] font-mono">{tiktokHandle}</span>
                  </div>
                </a>

                {/* Realistic Smartphone Chassis */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Abrir Instagram de Marcela Gasques"
                  className="animate-phone-float relative w-[280px] sm:w-[310px] h-[580px] sm:h-[620px] bg-[#1a1714] rounded-[50px] p-3 shadow-2xl ring-1 ring-white/10 ring-offset-4 ring-offset-[#e8ded1] block group cursor-pointer"
                >
                  {/* Physical Side Buttons */}
                  <div className="absolute -left-[14px] top-24 w-[3px] h-8 bg-[#2e2721] rounded-l-md" />
                  <div className="absolute -left-[14px] top-36 w-[3px] h-12 bg-[#2e2721] rounded-l-md" />
                  <div className="absolute -left-[14px] top-52 w-[3px] h-12 bg-[#2e2721] rounded-l-md" />
                  <div className="absolute -right-[14px] top-32 w-[3px] h-16 bg-[#2e2721] rounded-r-md" />

                  {/* Inner Screen Frame */}
                  <div className="relative w-full h-full bg-white rounded-[40px] overflow-hidden flex flex-col border border-black/30">
                    
                    {/* Dynamic Island / Camera Notch */}
                    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3 pointer-events-none">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#181818] ring-1 ring-white/10" />
                      <div className="w-2 h-2 rounded-full bg-[#0a3818]" />
                    </div>

                    {/* Top Status Bar */}
                    <div className="h-9 px-6 pt-1 flex items-center justify-between text-[11px] font-semibold text-black bg-white z-30 select-none">
                      <span>09:41</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px]">5G</span>
                        <div className="w-5 h-2.5 border border-black rounded-xs p-0.5 flex items-center">
                          <div className="w-full h-full bg-black rounded-2xs" />
                        </div>
                      </div>
                    </div>

                    {/* Instagram In-App Header */}
                    <div className="px-4 py-2 border-b border-[#f0e7dc] bg-white flex items-center justify-between z-30 shadow-2xs select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-base tracking-tight text-[#231c17]">Instagram</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#dd2a7b]" />
                      </div>
                      <div className="flex items-center gap-3 text-[#2c2520]">
                        <Heart className="w-4 h-4 text-[#2c2520]" />
                        <MessageCircle className="w-4 h-4 text-[#2c2520]" />
                      </div>
                    </div>

                    {/* Instagram In-App Profile Quick Bar */}
                    <div className="px-3.5 py-2 bg-[#fcfbfa] border-b border-[#f0e7dc] flex items-center justify-between z-30 text-xs select-none">
                      <div className="flex items-center gap-2">
                        <img
                          src="./assets/marcela_gasques_real.jpg"
                          alt="Marcela Gasques"
                          className="w-7 h-7 rounded-full object-cover border border-[#dd2a7b] p-0.5"
                          onError={(e) => {
                            e.currentTarget.src = 'https://i.imgur.com/nJWDKW9.jpeg';
                          }}
                        />
                        <div className="leading-tight">
                          <span className="font-semibold text-[#231c17] text-[11px] block">psi_marcelagasques</span>
                          <span className="text-[9px] text-[#7a6b5e]">Marcela Gasques · Psi</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-white px-2.5 py-1 rounded-md bg-gradient-to-r from-[#833ab4] to-[#fd1d1d]">
                        Seguir
                      </span>
                    </div>

                    {/* Infinite Scrolling Screen Viewport */}
                    <div className="relative flex-1 overflow-hidden bg-[#faf8f5]">
                      {/* Infinite Loop Feed Container: cycles continuously */}
                      <div className="animate-instagram-scroll flex flex-col select-none">
                        {/* Copy 1 */}
                        <div className="flex flex-col">
                          <img
                            src="./assets/instagram_screenshot.jpg"
                            alt="Feed Instagram Marcela Gasques"
                            className="w-full h-auto object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://i.imgur.com/qyAa1BB.jpeg';
                            }}
                          />
                        </div>

                        {/* Copy 2: Exact duplicate for continuous seamless looping */}
                        <div className="flex flex-col">
                          <img
                            src="./assets/instagram_screenshot.jpg"
                            alt="Feed Instagram Marcela Gasques"
                            className="w-full h-auto object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://i.imgur.com/qyAa1BB.jpeg';
                            }}
                          />
                        </div>
                      </div>

                      {/* Subtle Glass Reflection Overlay */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 z-20" />
                    </div>

                    {/* Bottom Home Indicator */}
                    <div className="h-5 bg-white flex items-center justify-center z-30 select-none">
                      <div className="w-24 h-1 bg-black/40 rounded-full" />
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Column: Copy & Social Links */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 text-left">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8c422f] font-semibold">
                <span className="w-6 h-[1px] bg-[#8c422f]" />
                {content.social.eyebrow}
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#231c17] leading-tight tracking-tight">
                {content.social.title}
              </h2>

              <p className="text-base sm:text-lg text-[#55473c] font-light leading-relaxed">
                {content.social.description}
              </p>

              {/* Botões / Cards para as Redes Sociais */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instagram Card */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-white border border-[#e5d9ca] hover:border-[#dd2a7b] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-[#231c17] group-hover:text-[#dd2a7b] transition-colors leading-tight">
                        Instagram
                      </h4>
                      <span className="text-xs text-[#7a6b5e]">
                        {instagramHandle}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#f0e7dc] flex items-center justify-between text-xs font-semibold text-[#8c422f] group-hover:text-[#dd2a7b] transition-colors">
                    <span>Conhecer Instagram</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>

                {/* TikTok Card */}
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-white border border-[#e5d9ca] hover:border-[#111111] hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[#111111] flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <svg
                        className="w-5 h-5 fill-current"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.69 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V8.58a8.27 8.27 0 0 0 4.84 1.55v-3.44a4.85 4.85 0 0 1-.93 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-[#231c17] group-hover:text-[#111111] transition-colors leading-tight">
                        TikTok
                      </h4>
                      <span className="text-xs text-[#7a6b5e]">
                        {tiktokHandle}
                      </span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-[#f0e7dc] flex items-center justify-between text-xs font-semibold text-[#8c422f] group-hover:text-[#111111] transition-colors">
                    <span>Conhecer TikTok</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              </div>

              {/* Canal WhatsApp direto */}
              <div className="pt-2">
                <a
                  href={getWhatsappLink(
                    'Olá, Marcela! Vi suas publicações nas redes sociais e gostaria de saber mais informações sobre os atendimentos online.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[#7a6b5e] hover:text-[#8c422f] transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#8c422f]" />
                  <span>Prefere falar direto? Chame no WhatsApp ({whatsappDisplay})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES (FAQ) */}
      <section id="faq" className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#8c422f] font-semibold mb-3">
              <span className="w-6 h-[1px] bg-[#8c422f]" />
              Esclarecimentos
              <span className="w-6 h-[1px] bg-[#8c422f]" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif text-[#231c17] tracking-tight">
              {content.faqTitle}
            </h2>
            <p className="text-base text-[#5c5045] mt-4 font-light">
              {content.faqSubtitle}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-[#ffffff] border-[#ded2c1] shadow-sm'
                      : 'bg-[#faf8f5] border-[#e9e1d5] hover:border-[#ded2c1]'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-6 text-left flex items-start justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-lg md:text-xl font-serif text-[#231c17] leading-snug">
                      {faq.pergunta}
                    </span>
                    <span className="p-1 rounded-full bg-[#f5f1eb] text-[#8c422f] shrink-0 mt-0.5">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-base text-[#55473c] leading-relaxed font-light border-t border-[#f5f1eb]">
                      {faq.resposta}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Additional note */}
          <div className="mt-10 text-center text-sm text-[#736356]">
            Tem alguma outra dúvida que não foi listada aqui?{' '}
            <a
              href="#contato"
              className="text-[#8c422f] font-semibold underline underline-offset-4 hover:text-[#5e2b1e]"
            >
              Envie uma mensagem diretamente
            </a>
            .
          </div>
        </div>
      </section>

      {/* CONTATO & AGENDAMENTO */}
      <section id="contato" className="py-24 bg-[#f5f1eb] border-t border-[#e9e1d5] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left information column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#8c422f] font-semibold">
                <span className="w-6 h-[1px] bg-[#8c422f]" />
                {content.contato.eyebrow}
              </div>

              <h2 className="text-3xl md:text-5xl font-serif text-[#231c17] leading-tight">
                {content.contato.title}
              </h2>

              <p className="text-base md:text-lg text-[#55473c] font-light leading-relaxed">
                {content.contato.subtitle}
              </p>

              {/* Direct WhatsApp Callout Card */}
              <div className="p-6 rounded-2xl bg-[#ffffff] border border-[#e2d5c5] shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#2e7d32] flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#231c17]">
                      Conversa Direta no WhatsApp
                    </h4>
                    <p className="text-xs text-[#6e5f52]">
                      {whatsappDisplay} · Resposta ágil e acolhedora
                    </p>
                  </div>
                </div>

                <a
                  href={getWhatsappLink('Olá, Marcela! Gostaria de conversar com você sobre o atendimento psicoterapêutico.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold bg-[#2e7d32] text-white hover:bg-[#1b5e20] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{content.contato.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Brand watermark preview badge in contact */}
              <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e2d5c5] flex items-center gap-4">
                <img
                  src="./assets/logo1.jpg"
                  alt="Marcela Gasques Logo"
                  referrerPolicy="no-referrer"
                  className="w-16 h-12 object-contain"
                />
                <div className="text-xs text-[#6e5f52]">
                  <strong className="block font-semibold text-[#2c2520] font-serif text-sm">
                    Marcela Gasques · CRP {crp}
                  </strong>
                  Psicóloga Clínica · Atendimento ético com escuta atenta e sigilo integral.
                </div>
              </div>
            </div>

            {/* Right form column */}
            <div className="lg:col-span-7">
              <div className="p-8 md:p-10 rounded-3xl bg-[#ffffff] border border-[#ded2c1] shadow-md">
                {formSubmitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-[#e8f5e9] text-[#2e7d32] rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-serif text-[#231c17]">
                      Mensagem recebida com carinho!
                    </h3>
                    <p className="text-sm text-[#55473c] max-w-md mx-auto leading-relaxed">
                      Obrigada por entrar em contato, {formData.nome || 'você'}. Clique no botão abaixo para concluir o contato diretamente no WhatsApp ({whatsappDisplay}).
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a
                        href={getWhatsappLink(
                          `Olá, Marcela! Preenchi o formulário no seu site:\n• Nome: ${formData.nome}\n• Assunto: ${formData.assunto}\n• Período: ${formData.periodo}` +
                            (formData.mensagem ? `\n• Mensagem: ${formData.mensagem}` : '')
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#2e7d32] text-white hover:bg-[#1b5e20] transition-colors shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Abrir WhatsApp: {whatsappDisplay}
                      </a>
                      <button
                        onClick={() => {
                          setFormSubmitted(false);
                          setFormData({
                            nome: '',
                            whatsapp: '',
                            email: '',
                            assunto: 'Psicoterapia (Autoconhecimento)',
                            modalidade: 'online',
                            periodo: 'tarde',
                            mensagem: '',
                          });
                        }}
                        className="text-xs text-[#6e5f52] hover:underline"
                      >
                        Enviar nova mensagem
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-serif text-[#231c17] mb-1">
                        Solicitar contato para agendamento
                      </h3>
                      <p className="text-xs text-[#6e5f52]">
                        Preencha os dados abaixo e você será redirecionado para o WhatsApp ({whatsappDisplay}).
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#55473c]">
                          Seu Nome Completo
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.nome}
                          onChange={(e) =>
                            setFormData({ ...formData, nome: e.target.value })
                          }
                          placeholder="Como prefere ser chamado(a)?"
                          className="w-full px-4 py-3 rounded-xl border border-[#ded2c1] bg-[#faf8f5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c422f]/30"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#55473c]">
                          WhatsApp / Telefone
                        </label>
                        <input
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) =>
                            setFormData({ ...formData, whatsapp: e.target.value })
                          }
                          placeholder="(DDD) 99999-9999"
                          className="w-full px-4 py-3 rounded-xl border border-[#ded2c1] bg-[#faf8f5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c422f]/30"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#55473c]">
                        {content.contato.fieldLabel}
                      </label>
                      <select
                        value={formData.assunto}
                        onChange={(e) =>
                          setFormData({ ...formData, assunto: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-[#ded2c1] bg-[#faf8f5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c422f]/30"
                      >
                        {content.contato.fieldOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#55473c]">
                          Formato de Atendimento
                        </label>
                        <div className="w-full px-4 py-3 rounded-xl border border-[#ded2c1] bg-[#f0e8dc]/60 text-sm text-[#4a3e35] flex items-center gap-2">
                          <Video className="w-4 h-4 text-[#8c422f]" />
                          <span className="font-medium text-[#2c2520]">Atendimento 100% Online</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-[#55473c]">
                          Melhor Período
                        </label>
                        <select
                          value={formData.periodo}
                          onChange={(e) =>
                            setFormData({ ...formData, periodo: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-xl border border-[#ded2c1] bg-[#faf8f5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c422f]/30"
                        >
                          <option value="manha">Manhã</option>
                          <option value="tarde">Tarde</option>
                          <option value="noite">Noite</option>
                          <option value="flexivel">Horário flexível</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#55473c]">
                        Mensagem ou dúvida inicial (opcional)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.mensagem}
                        onChange={(e) =>
                          setFormData({ ...formData, mensagem: e.target.value })
                        }
                        placeholder="Se desejar, compartilhe brevemente o que te trouxe à psicoterapia neste momento..."
                        className="w-full px-4 py-3 rounded-xl border border-[#ded2c1] bg-[#faf8f5] text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c422f]/30 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl text-sm font-semibold bg-[#2e7d32] text-white hover:bg-[#1b5e20] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <MessageCircle className="w-5 h-5 text-white" />
                      <span>{content.contato.buttonText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#231c17] text-[#ded2c1] py-16 border-t border-[#362d26] relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#362d26]">
            <div>
              <span className="text-3xl font-serif text-[#faf8f5] tracking-tight block">
                Marcela Gasques
              </span>
              <p className="text-xs text-[#a8988a] uppercase tracking-widest mt-1">
                Psicóloga Clínica · CRP {crp} · Atendimento 100% Online
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 text-xs text-[#ded2c1]">
              <a
                href={getWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2e7d32]/20 border border-[#2e7d32]/40 text-[#a8e6b0] hover:bg-[#2e7d32]/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp: {whatsappDisplay}</span>
              </a>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#833ab4]/20 via-[#fd1d1d]/20 to-[#fcb045]/20 border border-white/10 text-[#f5c6cb] hover:text-white transition-colors text-xs"
              >
                <Instagram className="w-3.5 h-3.5 text-[#fcb045]" />
                <span>Instagram: {instagramHandle}</span>
              </a>

              <a
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white/90 hover:text-white transition-colors text-xs"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.69 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.34V8.58a8.27 8.27 0 0 0 4.84 1.55v-3.44a4.85 4.85 0 0 1-.93 0z" />
                </svg>
                <span>TikTok: {tiktokHandle}</span>
              </a>

              <div className="flex flex-wrap items-center gap-6">
                <a href="#sobre" className="hover:text-white transition-colors">
                  Sobre
                </a>
                <a href="#cuidado" className="hover:text-white transition-colors">
                  O que trabalhamos
                </a>
                <a href="#como-funciona" className="hover:text-white transition-colors">
                  Como funciona
                </a>
                <a href="#instagram" className="hover:text-white transition-colors">
                  Redes Sociais
                </a>
                <a href="#faq" className="hover:text-white transition-colors">
                  Perguntas frequentes
                </a>
                <a href="#contato" className="hover:text-white transition-colors">
                  Contato
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8a7b6e]">
            <div className="flex flex-wrap items-center gap-3">
              <p>
                © {new Date().getFullYear()} Marcela Gasques. Todos os direitos reservados.
              </p>
              <span>·</span>
              <button
                type="button"
                onClick={() => setAdminOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-[#b8a695] hover:text-[#faf8f5] transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-white/5"
                title="Acessar painel para alterar textos do site"
              >
                <Lock className="w-3 h-3 text-[#8c422f]" />
                <span className="font-medium">Painel de Textos</span>
              </button>
            </div>
            <p className="max-w-md text-center md:text-right text-[11px] leading-relaxed">
              Atendimento em conformidade com o Código de Ética do Psicólogo (CFP).
              Em caso de urgência emocional ou crise, ligue para o CVV no número 188.
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING ADMIN QUICK ACCESS BADGE FOR LOGGED-IN ADMIN */}
      {isAdminLoggedIn && (
        <div className="fixed top-24 right-6 z-40 bg-[#231c17]/95 backdrop-blur-md text-[#faf8f5] px-3.5 py-2 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline font-medium">ADMIN Conectado</span>
          <button
            onClick={() => setAdminOpen(true)}
            className="px-3 py-1 bg-[#8c422f] hover:bg-[#6e3020] text-white rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar Textos</span>
          </button>
        </div>
      )}

      {/* ADMIN CMS MODAL */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        onLoginSuccess={handleAdminLoginSuccess}
        onLogout={handleAdminLogout}
        content={content}
        onUpdateContent={(newContent) => setContent(newContent)}
      />

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={getWhatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com Marcela Gasques no WhatsApp"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#2e7d32] text-white shadow-xl hover:bg-[#1b5e20] hover:scale-105 active:scale-95 transition-all group"
      >
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="text-xs font-semibold tracking-wide pr-1">
          {content.contato.buttonText}
        </span>
      </a>
    </div>
  );
}
