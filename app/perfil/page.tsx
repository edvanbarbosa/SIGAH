// =============================================================================
// app/perfil/page.tsx
// Tela global de edição do perfil do operador (Passo 10.4).
// Baseada nas diretrizes estéticas "The Institutional Architect" (DESIGN.md).
// Implementa renderização condicional baseada no perfil de acesso (RF076).
// =============================================================================

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  MapPin, 
  Lock, 
  ArrowLeft, 
  Check, 
  Loader2,
  AlertCircle,
  Camera,
  Briefcase,
  Settings,
  FileText,
  Building,
  Users,
  Home,
  Landmark,
  Phone,
  ClipboardList
} from "lucide-react";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { Header } from "@/components/layout/Header";

interface ActionItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
}

const getRoleActions = (profile: string, programId: string): ActionItem[] => {
  switch (profile) {
    case "gestor":
      return [
        { label: "Configurar Ciclos", href: `/${programId}/ciclos`, icon: Settings, description: "Gerenciar prazos, regras e datas dos editais habitacionais." },
        { label: "Auditoria do Sistema", href: `/${programId}/auditoria`, icon: Shield, description: "Consultar relatórios e logs de rastreabilidade de ações." },
        { label: "Relatórios Gerenciais", href: `/${programId}/relatorios`, icon: FileText, description: "Exportar dados estatísticos e consolidados dos beneficiários." },
      ];
    case "assistente_social":
      return [
        { label: "Acompanhamento Social", href: `/${programId}/social`, icon: Briefcase, description: "Registrar visitas, relatórios PTS e laudos de vulnerabilidade." },
        { label: "Cadastro Geral", href: `/${programId}/cadastro`, icon: Users, description: "Consultar listagem e andamento das famílias inscritas no programa." },
        { label: "Filtros de Enquadramento", href: `/${programId}/enquadramento`, icon: Check, description: "Avaliar e validar famílias candidatas frente às regras sociais." },
      ];
    case "agente_financeiro":
      return [
        { label: "Validar Enquadramento", href: `/${programId}/enquadramento`, icon: Landmark, description: "Checar compatibilidade cadastral e de renda para aprovação de crédito." },
        { label: "Exportação Caixa", href: `/${programId}/exportacao`, icon: Check, description: "Gerar arquivos normativos de remessa digital para a Caixa Econômica." },
        { label: "Gestão de Contratos", href: `/${programId}/unidades`, icon: Building, description: "Vincular unidades físicas e acompanhar assinatura de contratos." },
      ];
    case "auditor":
      return [
        { label: "Logs de Auditoria", href: `/${programId}/auditoria`, icon: Shield, description: "Análise detalhada de todas as operações e alterações de dados efetuadas." },
        { label: "Relatórios de Transparência", href: `/${programId}/relatorios`, icon: FileText, description: "Gerar e exportar relatórios de acompanhamento de enquadramento social." },
        { label: "Averiguação de Irregularidades", href: `/${programId}/denuncias/averiguacao`, icon: AlertCircle, description: "Painel para monitoramento de inconsistências apontadas na base." },
      ];
    case "cidadao":
      return [
        { label: "Meu Cadastro Familiar", href: `/${programId}/cadastro/ana-silva`, icon: Users, description: "Visualizar composição social e dados declarados para habitação." },
        { label: "Dossiê Habitacional", href: `/${programId}/ana-silva`, icon: FileText, description: "Consultar o andamento da sua solicitação e documentação enviada." },
        { label: "Meu Imóvel", href: `/${programId}/meu-imovel`, icon: Home, description: "Verificar o status da unidade habitacional vinculada a você." },
      ];
    default:
      return [];
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useUser();

  // Estados para os campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Estados de controle de UI
  const [activeTab, setActiveTab] = useState<"dados" | "seguranca">("dados");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [formError, setFormError] = useState("");

  // Estados para controle de hidratação e links dinâmicos de programas
  const [mounted, setMounted] = useState(false);
  const [activeProgramId, setActiveProgramId] = useState("mcmv-far");

  // Sincroniza os estados locais com o contexto do usuário
  useEffect(() => {
    setMounted(true);
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
    // Tenta resgatar o último programa habitacional ativo acessado pelo operador
    if (typeof window !== "undefined") {
      const lastProgram = localStorage.getItem("sigah_last_program") || "mcmv-far";
      setActiveProgramId(lastProgram);
    }
  }, [user]);

  // Redireciona para o login caso não haja sessão
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("sigah_token") : null;
    if (!token) {
      router.push("/auth/login");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (activeTab === "dados") {
      // Validações básicas de formato para dados cadastrais
      if (!name.trim() || !email.trim()) {
        setFormError("Nome e E-mail corporativo são campos obrigatórios.");
        return;
      }
    } else {
      // Validações básicas para alteração de senha
      if (!password.trim() || !confirmPassword.trim()) {
        setFormError("Por favor, preencha todos os campos de senha.");
        return;
      }
      if (password.length < 6) {
        setFormError("A senha deve ter no mínimo 6 caracteres.");
        return;
      }
      if (password !== confirmPassword) {
        setFormError("A confirmação de senha não coincide com a nova senha.");
        return;
      }
    }

    setLoading(true);

    // Latência de simulação de rede (800ms)
    setTimeout(async () => {
      let result: { success: boolean; error?: string } = { success: true };
      
      if (activeTab === "dados") {
        result = await updateProfile(name, email, phone, address);
      }
      
      setLoading(false);

      if (result.success) {
        setToastType("success");
        setToastMessage(
          activeTab === "dados" 
            ? "Perfil atualizado com sucesso!" 
            : "Senha atualizada com sucesso!"
        );
        setShowToast(true);
        if (activeTab === "seguranca") {
          setPassword("");
          setConfirmPassword("");
        }
        
        // Esconde o Toast após 3 segundos
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastType("error");
        setToastMessage(result.error || "Erro ao salvar alterações.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    }, 800);
  };

  const profileLabels: Record<string, string> = {
    gestor: "Gestor Público",
    assistente_social: "Assistente Social",
    agente_financeiro: "Agente Financeiro",
    auditor: "Auditor (Controle)",
    cidadao: "Cidadão"
  };

  const activeRole = user ? profileLabels[user.profile] : "Operador do Systema";
  const activeRegion = user?.region || "Região Leste";
  const activeAvatar = user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDtPmbamYvNE6arXUN6VUCVWXZHn4IqHQ2GzgNaq1RVlF6MpedF8FMk4SSOA_a7nWrNk2iwWYvRWNA3eiEzNdT_Yc37uU0XaD9CIl8iFY1SvjbcQdKl99Stqbetq3GKo6A-mD50-PQjzTVdZm0uuQgvPtYFyEvN3oMgGlSkHdNImmlOwp-D4b8-6LKmvYL46cR0ucwCmIlbXmu1Jqk69GvBSpsNhIf-gpj-lWQo06koV8XZohaCisQ0965yTyiAbAhIjB4NGB5E8sk";
  if (!mounted) {
    return (
      <div className="bg-[#f8f9fa] min-h-screen flex items-center justify-center font-sans">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] font-sans min-h-screen flex flex-col selection:bg-[#0059bb]/10 selection:text-[#0059bb]">
      {/* ── Toast de Feedback Flutuante ── */}
      {showToast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-[0px_16px_32px_rgba(0,30,64,0.12)] border border-outline-variant/15 transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toastType === "success" 
            ? "bg-emerald-50 text-emerald-800 border-emerald-500/20" 
            : "bg-red-50 text-red-800 border-red-500/20"
        }`}>
          {toastType === "success" ? (
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="text-sm font-bold tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* ── 1. Header Oficial Reutilizado (DRY) ── */}
      <Header unreadNotificationsCount={2} />

      {/* ── 2. Conteúdo Principal ── */}
      <main className="flex-grow pt-24 pb-20 max-w-5xl mx-auto w-full px-6 md:px-12 flex flex-col">
        
        {/* Título da Página e Ação de Voltar no Main */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight leading-tight">
              Meus Dados
            </h1>
            <p className="text-[#43474f] text-sm mt-1">
              Atualize suas informações de acesso e credenciais de operador do sistema.
            </p>
          </div>
          <Link 
            href="/home" 
            className="inline-flex items-center gap-2 font-sans text-sm font-bold text-on-surface-variant hover:text-primary hover:bg-[#001e40]/5 transition-colors cursor-pointer border border-[#c3c6d1]/20 hover:border-primary/20 px-4 py-2.5 rounded-xl self-start sm:self-center shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Hub
          </Link>
        </div>

        {/* Layout Bento (Split) sem Linhas, feito com Contraste de Fundo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Mini Menu Lateral + Ficha Resumida do Operador */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Ficha Resumida do Operador */}
            <div className="bg-white rounded-3xl p-6 shadow-[0px_20px_40px_rgba(0,30,64,0.03)] border border-outline-variant/10 flex flex-col items-center text-center">
              {/* Imagem do Perfil Bento */}
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#0059bb]/20 shadow-md">
                  <img 
                    alt={`Avatar do Operador ${name}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={activeAvatar} 
                  />
                </div>
                <button 
                  type="button" 
                  className="absolute bottom-0.5 right-0.5 bg-gradient-to-br from-primary to-primary-container text-white p-2 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white"
                  title="Alterar avatar (Simulado)"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Informações do usuário */}
              <h2 className="font-heading font-bold text-base text-primary truncate max-w-full">
                {name || "Carregando..."}
              </h2>
              <p className="text-xs text-[#43474f] font-medium mt-0.5">{email || "carregando..."}</p>

              <div className="w-full mt-4 pt-4 border-t border-[#c3c6d1]/10 flex flex-col gap-3">
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-lg bg-[#001e40]/5 flex items-center justify-center text-[#001e40] shrink-0">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] text-outline font-black uppercase tracking-wider">Perfil</p>
                    <p className="text-xs font-bold text-primary">{activeRole}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-7 h-7 rounded-lg bg-[#0059bb]/5 flex items-center justify-center text-[#0059bb] shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-[9px] text-outline font-black uppercase tracking-wider">Região de Atuação</p>
                    <p className="text-xs font-bold text-primary">{activeRegion}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mini Menu Lateral de Ações */}
            <div className="bg-white rounded-3xl p-5 shadow-[0px_20px_40px_rgba(0,30,64,0.03)] border border-outline-variant/10 flex flex-col gap-1.5">
              <span className="text-[9px] text-outline font-black uppercase tracking-wider px-2 mb-1 block">
                Minha Conta
              </span>
              
              <button
                type="button"
                onClick={() => {
                  setActiveTab("dados");
                  setFormError("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all duration-300 ${
                  activeTab === "dados"
                    ? "bg-[#0059bb]/5 text-[#0059bb]"
                    : "text-on-surface-variant hover:bg-[#f8f9fa] hover:text-primary"
                }`}
              >
                <UserIcon className={`w-4 h-4 ${activeTab === "dados" ? "text-[#0059bb]" : "text-[#737780]"}`} />
                <span>Dados Cadastrais</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("seguranca");
                  setFormError("");
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm transition-all duration-300 ${
                  activeTab === "seguranca"
                    ? "bg-[#0059bb]/5 text-[#0059bb]"
                    : "text-on-surface-variant hover:bg-[#f8f9fa] hover:text-primary"
                }`}
              >
                <Lock className={`w-4 h-4 ${activeTab === "seguranca" ? "text-[#0059bb]" : "text-[#737780]"}`} />
                <span>Segurança</span>
              </button>

              {/* Ações do perfil específicas */}
              {mounted && user && getRoleActions(user.profile, activeProgramId).length > 0 && (
                <>
                  <div className="w-full mt-3 pt-3 border-t border-[#c3c6d1]/10">
                    <span className="text-[9px] text-outline font-black uppercase tracking-wider px-2 mb-1 block">
                      Ações de {activeRole}
                    </span>
                  </div>
                  {getRoleActions(user.profile, activeProgramId).map((action, idx) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={idx}
                        href={action.href}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left font-semibold text-sm text-on-surface-variant hover:bg-[#f8f9fa] hover:text-primary transition-all duration-300 group"
                        title={action.description}
                      >
                        <Icon className="w-4 h-4 text-[#737780] group-hover:text-primary transition-colors shrink-0" />
                        <span className="truncate">{action.label}</span>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Form Card Principal */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-[0px_24px_48px_rgba(0,30,64,0.04)] border border-outline-variant/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {formError && (
                <div className="bg-red-50 border border-red-500/20 text-red-800 text-sm p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="font-bold">{formError}</span>
                </div>
              )}

              {activeTab === "dados" ? (
                /* Seção 1: Dados Cadastrais */
                <div className="space-y-5">
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-primary uppercase tracking-wider">
                      Informações Básicas
                    </h3>
                    <p className="text-xs text-[#43474f] mt-0.5">Atualize seus dados pessoais e de contato corporativo.</p>
                  </div>
                  
                  {/* Nome Completo */}
                  <div className="space-y-1.5">
                    <label htmlFor="profileName" className="block text-xs font-black uppercase tracking-wider text-on-surface-variant">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        id="profileName"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border border-[#c3c6d1]/20 rounded-xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="NOME DO OPERADOR"
                      />
                    </div>
                  </div>

                  {/* E-mail Institucional */}
                  <div className="space-y-1.5">
                    <label htmlFor="profileEmail" className="block text-xs font-black uppercase tracking-wider text-on-surface-variant">
                      E-mail Corporativo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="profileEmail"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border border-[#c3c6d1]/20 rounded-xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                        placeholder="operador@sigah.gov.br"
                      />
                    </div>
                  </div>

                  {/* Telefone e Endereço adicionais para o cidadão */}
                  {user?.profile === "cidadao" && (
                    <>
                      {/* Telefone */}
                      <div className="space-y-1.5">
                        <label htmlFor="profilePhone" className="block text-xs font-black uppercase tracking-wider text-on-surface-variant">
                          Telefone de Contato
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737780]">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            id="profilePhone"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border border-[#c3c6d1]/20 rounded-xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                      </div>

                      {/* Endereço Residencial */}
                      <div className="space-y-1.5">
                        <label htmlFor="profileAddress" className="block text-xs font-black uppercase tracking-wider text-on-surface-variant">
                          Endereço Residencial
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#737780]">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <input
                            id="profileAddress"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border border-[#c3c6d1]/20 rounded-xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                            placeholder="Rua, Número, Bairro, Cidade/UF"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* Seção 2: Alteração de Senha */
                <div className="space-y-5">
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-primary uppercase tracking-wider">
                      Alteração de Senha
                    </h3>
                    <p className="text-xs text-[#43474f] mt-0.5">Preencha os campos abaixo para atualizar suas credenciais de acesso.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Nova Senha */}
                    <div className="space-y-1.5">
                      <label htmlFor="profilePass" className="block text-xs font-black uppercase tracking-wider text-on-surface-variant">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="profilePass"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border border-[#c3c6d1]/20 rounded-xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                          placeholder="Mínimo de 6 caracteres"
                        />
                      </div>
                    </div>

                    {/* Confirmar Senha */}
                    <div className="space-y-1.5">
                      <label htmlFor="profileConfirmPass" className="block text-xs font-black uppercase tracking-wider text-on-surface-variant">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          id="profileConfirmPass"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-11 pr-4 py-3.5 bg-[#f8f9fa] border border-[#c3c6d1]/20 rounded-xl text-on-surface placeholder:text-outline font-medium focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                          placeholder="Repita a nova senha"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Link
                  href="/home"
                  className="px-6 py-3.5 border border-outline-variant/35 text-on-surface-variant hover:text-primary hover:bg-[#f3f4f5] rounded-xl font-bold text-sm transition-all duration-300 animate-in fade-in"
                >
                  Cancelar
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Salvar Alterações</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
