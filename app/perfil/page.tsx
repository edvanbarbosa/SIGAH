// =============================================================================
// app/perfil/page.tsx
// Tela global de edição do perfil do operador (Passo 10.4).
// Baseada nas diretrizes estéticas "The Institutional Architect" (DESIGN.md).
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
  Camera
} from "lucide-react";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useUser();

  // Estados para os campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados de controle de UI
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [formError, setFormError] = useState("");

  // Sincroniza os estados locais com o contexto do usuário
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
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
    
    // Validações básicas de formato
    if (!name.trim() || !email.trim()) {
      setFormError("Nome e E-mail corporativo são campos obrigatórios.");
      return;
    }

    if (password && password !== confirmPassword) {
      setFormError("A confirmação de senha não coincide com a nova senha.");
      return;
    }

    setLoading(true);

    // Latência de simulação de rede (800ms)
    setTimeout(async () => {
      const result = await updateProfile(name, email);
      setLoading(false);

      if (result.success) {
        setToastType("success");
        setToastMessage("Perfil atualizado com sucesso!");
        setShowToast(true);
        setPassword("");
        setConfirmPassword("");
        
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

  const activeRole = user ? profileLabels[user.profile] : "Operador do Sistema";
  const activeRegion = user?.region || "Região Leste";
  const activeAvatar = user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDtPmbamYvNE6arXUN6VUCVWXZHn4IqHQ2GzgNaq1RVlF6MpedF8FMk4SSOA_a7nWrNk2iwWYvRWNA3eiEzNdT_Yc37uU0XaD9CIl8iFY1SvjbcQdKl99Stqbetq3GKo6A-mD50-PQjzTVdZm0uuQgvPtYFyEvN3oMgGlSkHdNImmlOwp-D4b8-6LKmvYL46cR0ucwCmIlbXmu1Jqk69GvBSpsNhIf-gpj-lWQo06koV8XZohaCisQ0965yTyiAbAhIjB4NGB5E8sk";

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

      {/* ── 1. Header Global Simplificado ── */}
      <header className="fixed top-0 w-full z-50 bg-[#f8f9fa]/80 backdrop-blur-xl border-b border-[#c3c6d1]/15 h-20 flex items-center">
        <div className="max-w-5xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <Link href="/home" className="flex items-center space-x-2.5 hover:opacity-90 transition-opacity">
            <div className="h-9 w-9 bg-gradient-to-br from-[#001e40] to-[#003366] rounded-lg flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
              S
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-[#001e40]">
              SIGAH
            </span>
          </Link>
          <Link 
            href="/home" 
            className="inline-flex items-center gap-2 font-sans text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Hub
          </Link>
        </div>
      </header>

      {/* ── 2. Conteúdo Principal ── */}
      <main className="flex-grow pt-28 pb-20 max-w-5xl mx-auto w-full px-6 md:px-12 flex flex-col justify-center">
        
        {/* Título da Página */}
        <div className="mb-8">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-[#001e40] tracking-tight leading-tight">
            Meus Dados
          </h1>
          <p className="text-[#43474f] text-sm mt-1">
            Atualize suas informações de acesso e credenciais de operador do sistema.
          </p>
        </div>

        {/* Layout Bento (Split) sem Linhas, feito com Contraste de Fundo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Bento Lateral: Ficha Resumida do Operador */}
          <div className="bg-white rounded-3xl p-8 shadow-[0px_20px_40px_rgba(0,30,64,0.03)] border border-outline-variant/10 flex flex-col items-center text-center">
            
            {/* Imagem do Perfil Bento */}
            <div className="relative group mb-6">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#0059bb]/20 shadow-md">
                <img 
                  alt={`Avatar do Operador ${name}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  src={activeAvatar} 
                />
              </div>
              <button 
                type="button" 
                className="absolute bottom-1 right-1 bg-gradient-to-br from-primary to-primary-container text-white p-2 rounded-full shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border-2 border-white"
                title="Alterar avatar (Simulado)"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Informações estáticas do cargo */}
            <h2 className="font-heading font-bold text-lg text-primary truncate max-w-full">
              {name || "Carregando..."}
            </h2>
            <p className="text-xs text-[#43474f] font-medium mt-0.5">{email || "carregando..."}</p>

            <div className="w-full mt-6 pt-6 border-t border-[#c3c6d1]/20 space-y-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#001e40]/5 flex items-center justify-center text-[#001e40] shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-wider">Perfil</p>
                  <p className="text-xs font-bold text-primary">{activeRole}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-left">
                <div className="w-8 h-8 rounded-lg bg-[#0059bb]/5 flex items-center justify-center text-[#0059bb] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-outline font-black uppercase tracking-wider">Região de Atuação</p>
                  <p className="text-xs font-bold text-primary">{activeRegion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card Principal */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 md:p-10 shadow-[0px_24px_48px_rgba(0,30,64,0.04)] border border-outline-variant/10">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {formError && (
                <div className="bg-red-50 border border-red-500/20 text-red-800 text-sm p-4 rounded-2xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="font-bold">{formError}</span>
                </div>
              )}

              {/* Seção 1: Dados Cadastrais */}
              <div className="space-y-5">
                <h3 className="font-heading font-extrabold text-base text-primary uppercase tracking-wider">
                  Informações Básicas
                </h3>
                
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
              </div>

              {/* Seção 2: Alteração de Senha */}
              <div className="space-y-5 pt-4 border-t border-[#c3c6d1]/10">
                <div>
                  <h3 className="font-heading font-extrabold text-base text-primary uppercase tracking-wider">
                    Alteração de Senha
                  </h3>
                  <p className="text-[10px] text-[#43474f] mt-0.5">Preencha apenas se desejar alterar sua senha atual.</p>
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

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-4 pt-4">
                <Link
                  href="/home"
                  className="px-6 py-3.5 border border-outline-variant/35 text-on-surface-variant hover:text-primary hover:bg-[#f3f4f5] rounded-xl font-bold text-sm transition-all duration-300"
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
