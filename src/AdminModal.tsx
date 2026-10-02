import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  RefreshCw,
  Phone,
  Shield,
  FileText,
  UserCheck,
  Layers,
  HelpCircle,
  Share2,
  Send,
  Plus,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { SiteContent, defaultSiteContent } from './defaultContent';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  content: SiteContent;
  onUpdateContent: (newContent: SiteContent) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  onLoginSuccess,
  onLogout,
  content,
  onUpdateContent,
}) => {
  const [activeTab, setActiveTab] = useState<
    'geral' | 'hero' | 'sobre' | 'frentes' | 'passos' | 'redes' | 'faq' | 'contato'
  >('geral');
  const [formData, setFormData] = useState<SiteContent>(content);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login credentials state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Sync with prop when opened
  useEffect(() => {
    if (isOpen) {
      setFormData(content);
      setSaveSuccess(false);
      setErrorMessage(null);
      setLoginError(null);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const userClean = usernameInput.trim().toUpperCase();
    const passClean = passwordInput.trim();

    if (userClean === 'ADMIN' && passClean === 'Gasques123@') {
      onLoginSuccess();
      setUsernameInput('');
      setPasswordInput('');
    } else {
      setLoginError('Usuário ou senha incorretos. Use usuário ADMIN e sua senha.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage(null);

    try {
      // 1. Update state immediately so UI updates in real-time
      onUpdateContent(formData);

      // 2. Persist in Firestore doc
      const docRef = doc(db, 'site_content', 'main');
      const payload = {
        ...formData,
        updatedAt: new Date().toISOString(),
        updatedBy: 'ADMIN',
      };

      await setDoc(docRef, payload, { merge: true });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao salvar no Firestore:', err);
      try {
        handleFirestoreError(err, OperationType.WRITE, 'site_content/main');
      } catch (e: unknown) {
        setErrorMessage(
          'Erro ao salvar as informações no banco de dados. Tente novamente.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm(
        'Tem certeza que deseja restaurar todos os textos originais do site? Todas as edições atuais serão substituídas pelos textos padrão.'
      )
    ) {
      setFormData(defaultSiteContent);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col border border-[#ded2c1] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#231c17] text-[#faf8f5] flex items-center justify-between border-b border-[#362d26] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8c422f] text-white flex items-center justify-center font-serif font-bold text-lg">
              M
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium leading-tight">
                Painel de Edição de Textos
              </h3>
              <p className="text-[11px] text-[#b09e8e]">
                Altere os textos do site a qualquer momento com salvamento em nuvem
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isAdminLoggedIn && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-[#ded2c1]">
                <UserCheck className="w-3.5 h-3.5 text-green-400" />
                <span className="font-semibold text-white">ADMIN</span>
                <button
                  onClick={onLogout}
                  title="Sair do painel"
                  className="hover:text-white transition-colors ml-1 p-1 hover:bg-white/10 rounded-md cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAdminLoggedIn ? (
          /* Login Screen with Username and Password */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto flex flex-col items-center justify-center flex-1 w-full">
            <div className="w-14 h-14 rounded-2xl bg-[#faf8f5] border border-[#e5d9ca] flex items-center justify-center text-[#8c422f] mb-4 shadow-xs">
              <Shield className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-serif text-[#231c17] mb-1">
              Acesso ao Painel
            </h4>
            <p className="text-xs text-[#6e5f52] leading-relaxed mb-6">
              Digite seu usuário e senha de administrador para editar os textos do site.
            </p>

            {loginError && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleCredentialsSubmit} className="w-full space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#55473c] mb-1.5">
                  Usuário
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8a7a6c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Digite ADMIN"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#ded2c1] bg-[#faf8f5] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c422f]/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#55473c] mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8a7a6c] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#ded2c1] bg-[#faf8f5] text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8c422f]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7a6c] hover:text-[#231c17] transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-xl text-xs font-semibold bg-[#8c422f] text-white hover:bg-[#6e3020] transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar no Painel</span>
              </button>
            </form>
          </div>
        ) : (
          /* Main Editor Interface */
          <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-[#faf8f5] border-b md:border-b-0 md:border-r border-[#e5d9ca] p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 select-none">
              <button
                onClick={() => setActiveTab('geral')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'geral'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span>Contatos & CRP</span>
              </button>

              <button
                onClick={() => setActiveTab('hero')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'hero'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span>Início (Hero)</span>
              </button>

              <button
                onClick={() => setActiveTab('sobre')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'sobre'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span>Sobre Marcela</span>
              </button>

              <button
                onClick={() => setActiveTab('frentes')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'frentes'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 shrink-0" />
                <span>O que trabalhamos</span>
              </button>

              <button
                onClick={() => setActiveTab('passos')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'passos'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Como Funciona</span>
              </button>

              <button
                onClick={() => setActiveTab('redes')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'redes'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 shrink-0" />
                <span>Redes Sociais</span>
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'faq'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>FAQ (Perguntas)</span>
              </button>

              <button
                onClick={() => setActiveTab('contato')}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-left transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'contato'
                    ? 'bg-[#8c422f] text-white shadow-xs'
                    : 'text-[#55473c] hover:bg-[#f0e7dc]'
                }`}
              >
                <Send className="w-3.5 h-3.5 shrink-0" />
                <span>Vamos conversar?</span>
              </button>
            </div>

            {/* Form Fields Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 max-h-[60vh] md:max-h-none">
              
              {/* TAB: GERAL */}
              {activeTab === 'geral' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2">
                    <h4 className="font-semibold text-[#231c17] text-sm">
                      Informações de Contato & Credenciais
                    </h4>
                    <p className="text-xs text-[#7a6b5e]">
                      Atualize o WhatsApp, CRP e links das redes sociais.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#55473c] mb-1">
                        Número WhatsApp (com DDI e DDD, apenas dígitos)
                      </label>
                      <input
                        type="text"
                        value={formData.whatsappNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsappNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#55473c] mb-1">
                        Exibição Formatada do WhatsApp
                      </label>
                      <input
                        type="text"
                        value={formData.whatsappDisplay}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsappDisplay: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#55473c] mb-1">
                        Registro CRP
                      </label>
                      <input
                        type="text"
                        value={formData.crp}
                        onChange={(e) =>
                          setFormData({ ...formData, crp: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#55473c] mb-1">
                        Usuário Instagram (com @)
                      </label>
                      <input
                        type="text"
                        value={formData.instagramHandle}
                        onChange={(e) =>
                          setFormData({ ...formData, instagramHandle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#55473c] mb-1">
                        Usuário TikTok (com @)
                      </label>
                      <input
                        type="text"
                        value={formData.tiktokHandle}
                        onChange={(e) =>
                          setFormData({ ...formData, tiktokHandle: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: HERO */}
              {activeTab === 'hero' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2">
                    <h4 className="font-semibold text-[#231c17] text-sm">
                      Seção Inicial (Hero)
                    </h4>
                    <p className="text-xs text-[#7a6b5e]">
                      Textos do primeiro bloco que o visitante vê ao abrir a página.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Linha superior (Eyebrow)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.eyebrow}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, eyebrow: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Título Principal (H1)
                    </label>
                    <input
                      type="text"
                      value={formData.hero.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs font-medium focus:ring-2 focus:ring-[#8c422f]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Subtítulo Explicativo
                    </label>
                    <textarea
                      rows={3}
                      value={formData.hero.subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#55473c] mb-1">
                        Texto do Botão Primário
                      </label>
                      <input
                        type="text"
                        value={formData.hero.ctaPrimary}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, ctaPrimary: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#55473c] mb-1">
                        Texto do Botão Secundário
                      </label>
                      <input
                        type="text"
                        value={formData.hero.ctaSecondary}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hero: { ...formData.hero, ctaSecondary: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SOBRE */}
              {activeTab === 'sobre' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2">
                    <h4 className="font-semibold text-[#231c17] text-sm">
                      Seção Sobre Marcela Gasques
                    </h4>
                    <p className="text-xs text-[#7a6b5e]">
                      Apresentação profissional, formação e fundamentação clínica.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={formData.about.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs font-medium focus:ring-2 focus:ring-[#8c422f]/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      1º Parágrafo
                    </label>
                    <textarea
                      rows={3}
                      value={formData.about.p1}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, p1: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      2º Parágrafo
                    </label>
                    <textarea
                      rows={3}
                      value={formData.about.p2}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, p2: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      3º Parágrafo
                    </label>
                    <textarea
                      rows={3}
                      value={formData.about.p3}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, p3: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Frase em Destaque (Citação)
                    </label>
                    <input
                      type="text"
                      value={formData.about.quote}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: { ...formData.about, quote: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs focus:ring-2 focus:ring-[#8c422f]/30"
                    />
                  </div>
                </div>
              )}

              {/* TAB: FRENTES */}
              {activeTab === 'frentes' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2">
                    <h4 className="font-semibold text-[#231c17] text-sm">
                      O que trabalhamos em psicoterapia
                    </h4>
                    <p className="text-xs text-[#7a6b5e]">
                      Personalize os temas e pilares das sessões individuais.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={formData.possibilidadesTitle}
                      onChange={(e) =>
                        setFormData({ ...formData, possibilidadesTitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs font-medium focus:ring-2 focus:ring-[#8c422f]/30"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    {formData.possibilidades.map((p, index) => (
                      <div
                        key={p.id || index}
                        className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e5d9ca] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8c422f]">
                            Tema {index + 1} ({p.numero})
                          </span>
                        </div>
                        <input
                          type="text"
                          value={p.titulo}
                          onChange={(e) => {
                            const updated = [...formData.possibilidades];
                            updated[index].titulo = e.target.value;
                            setFormData({ ...formData, possibilidades: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#ded2c1] text-xs font-semibold bg-white"
                          placeholder="Título do tema"
                        />
                        <textarea
                          rows={2}
                          value={p.descricao}
                          onChange={(e) => {
                            const updated = [...formData.possibilidades];
                            updated[index].descricao = e.target.value;
                            setFormData({ ...formData, possibilidades: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#ded2c1] text-xs bg-white resize-none"
                          placeholder="Descrição resumida"
                        />
                        <textarea
                          rows={2}
                          value={p.detalhes}
                          onChange={(e) => {
                            const updated = [...formData.possibilidades];
                            updated[index].detalhes = e.target.value;
                            setFormData({ ...formData, possibilidades: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#ded2c1] text-xs bg-white resize-none"
                          placeholder="Detalhes aprofundados"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PASSOS */}
              {activeTab === 'passos' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2">
                    <h4 className="font-semibold text-[#231c17] text-sm">
                      Como funciona o atendimento
                    </h4>
                    <p className="text-xs text-[#7a6b5e]">
                      Etapas de agendamento e acompanhamento das sessões.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Título da Seção
                    </label>
                    <input
                      type="text"
                      value={formData.comoFunciona.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          comoFunciona: {
                            ...formData.comoFunciona,
                            title: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    {formData.comoFunciona.steps.map((st, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e5d9ca] space-y-2"
                      >
                        <span className="text-xs font-bold text-[#8c422f]">
                          Passo {st.numero}
                        </span>
                        <input
                          type="text"
                          value={st.titulo}
                          onChange={(e) => {
                            const updated = [...formData.comoFunciona.steps];
                            updated[index].titulo = e.target.value;
                            setFormData({
                              ...formData,
                              comoFunciona: {
                                ...formData.comoFunciona,
                                steps: updated,
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#ded2c1] text-xs font-semibold bg-white"
                        />
                        <textarea
                          rows={2}
                          value={st.descricao}
                          onChange={(e) => {
                            const updated = [...formData.comoFunciona.steps];
                            updated[index].descricao = e.target.value;
                            setFormData({
                              ...formData,
                              comoFunciona: {
                                ...formData.comoFunciona,
                                steps: updated,
                              },
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#ded2c1] text-xs bg-white resize-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: REDES */}
              {activeTab === 'redes' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2">
                    <h4 className="font-semibold text-[#231c17] text-sm">
                      Seção Redes Sociais
                    </h4>
                    <p className="text-xs text-[#7a6b5e]">
                      Chamada e texto de apresentação do Instagram e TikTok.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Linha de introdução
                    </label>
                    <input
                      type="text"
                      value={formData.social.eyebrow}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social: { ...formData.social, eyebrow: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Título (H2)
                    </label>
                    <input
                      type="text"
                      value={formData.social.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social: { ...formData.social, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Texto de Descrição
                    </label>
                    <textarea
                      rows={3}
                      value={formData.social.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          social: { ...formData.social, description: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB: FAQ */}
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-[#231c17] text-sm">
                        Perguntas Frequentes (FAQ)
                      </h4>
                      <p className="text-xs text-[#7a6b5e]">
                        Adicione, remova ou edite respostas para as dúvidas de pacientes.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          faqList: [
                            ...formData.faqList,
                            {
                              pergunta: 'Nova dúvida frequente...',
                              resposta: 'Escreva a resposta acolhedora aqui...',
                            },
                          ],
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8c422f] text-white rounded-lg text-xs font-medium hover:bg-[#6e3020] transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nova Pergunta</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {formData.faqList.map((faq, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e5d9ca] space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#8c422f]">
                            Pergunta {index + 1}
                          </span>
                          {formData.faqList.length > 1 && (
                            <button
                              onClick={() => {
                                const updated = formData.faqList.filter((_, i) => i !== index);
                                setFormData({ ...formData, faqList: updated });
                              }}
                              className="text-red-500 hover:text-red-700 p-1 rounded-md transition-colors cursor-pointer"
                              title="Remover pergunta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={faq.pergunta}
                          onChange={(e) => {
                            const updated = [...formData.faqList];
                            updated[index].pergunta = e.target.value;
                            setFormData({ ...formData, faqList: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#ded2c1] text-xs font-semibold bg-white"
                          placeholder="Texto da pergunta"
                        />
                        <textarea
                          rows={3}
                          value={faq.resposta}
                          onChange={(e) => {
                            const updated = [...formData.faqList];
                            updated[index].resposta = e.target.value;
                            setFormData({ ...formData, faqList: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#ded2c1] text-xs bg-white resize-none"
                          placeholder="Texto da resposta"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: CONTATO */}
              {activeTab === 'contato' && (
                <div className="space-y-4">
                  <div className="border-b border-[#f0e7dc] pb-2">
                    <h4 className="font-semibold text-[#231c17] text-sm">
                      Seção "Vamos conversar?"
                    </h4>
                    <p className="text-xs text-[#7a6b5e]">
                      Chamada, subtítulo e opções de atendimento do formulário.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Título (H2)
                    </label>
                    <input
                      type="text"
                      value={formData.contato.title}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contato: { ...formData.contato, title: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Subtítulo acolhedor
                    </label>
                    <textarea
                      rows={3}
                      value={formData.contato.subtitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contato: { ...formData.contato, subtitle: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={formData.contato.buttonText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contato: { ...formData.contato, buttonText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#55473c] mb-1">
                      Pergunta do campo de seleção
                    </label>
                    <input
                      type="text"
                      value={formData.contato.fieldLabel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contato: { ...formData.contato, fieldLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#ded2c1] text-xs"
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer Actions */}
        {isAdminLoggedIn && (
          <div className="px-6 py-4 bg-[#f8f5f0] border-t border-[#ded2c1] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefaults}
                className="inline-flex items-center gap-1.5 text-xs text-[#7a6b5e] hover:text-[#8c422f] transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar padrões</span>
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Alterações salvas com sucesso!</span>
                </div>
              )}

              {errorMessage && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#ded2c1] text-xs font-medium text-[#4a3e35] hover:bg-[#eae0d2] transition-colors cursor-pointer"
              >
                Fechar
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#2e7d32] text-white hover:bg-[#1b5e20] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
