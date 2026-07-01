// =============================================================================
// app/auth/login/page.tsx
// Tela de login e autenticação.
// Redesenhado com base no layout da tela de início (split-screen / stacked).
// Inclui ilustração vetorial nativa e melhorias de alinhamento.
// =============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserProfile } from "@/contexts/UserContext";
import { ArrowRight, KeyRound, Mail, UserCircle2, ChevronDown, Check, Briefcase, HeartHandshake, Building, Search, User } from "lucide-react";
import { LandingFooter } from "@/components/layout/LandingFooter";

const PROFILES = [
  { value: "gestor", label: "Gestor Público", icon: Briefcase },
  { value: "assistente_social", label: "Assistente Social", icon: HeartHandshake },
  { value: "agente_financeiro", label: "Agente Financeiro", icon: Building },
  { value: "auditor", label: "Auditor (Controle Externo)", icon: Search },
  { value: "cidadao", label: "Cidadão", icon: User },
];

// Ilustração vetorial que combina habitação e segurança/login
const LoginIllustration = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#001e40] to-[#004080] p-8 relative overflow-hidden">
    {/* Formas abstratas de fundo para dar profundidade e aspecto moderno */}
    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-[#0059bb] rounded-full mix-blend-screen filter blur-[80px] opacity-50"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0059bb] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>

    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[320px] drop-shadow-2xl z-10">
      {/* Halo de segurança ao redor */}
      <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="2" strokeDasharray="8 8" className="opacity-20" />
      <circle cx="200" cy="200" r="120" fill="white" className="opacity-5" />

      {/* Base da Casa */}
      <path d="M110 200 L200 120 L290 200 V300 C290 311 281 320 270 320 H130 C119 320 110 311 110 300 V200 Z" fill="white" />

      {/* Teto (Destaque Visual) */}
      <path d="M110 200 L200 120 L290 200" stroke="#0059bb" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

      {/* Fechadura / Ação de Login (Segurança) */}
      <circle cx="200" cy="220" r="26" fill="#001e40" />
      <path d="M188 238 L176 280 C174 286 178 292 186 292 H214 C222 292 226 286 224 280 L212 238 Z" fill="#001e40" />

      {/* Elementos flutuantes remetendo a dados e processo digital */}
      <rect x="70" y="80" width="24" height="24" rx="6" fill="#eab308" />
      <circle cx="320" cy="100" r="12" fill="#0059bb" />
      <rect x="300" y="300" width="16" height="16" rx="4" fill="#84cc16" />

      {/* Símbolo de Verificação no interior da fechadura */}
      <path d="M190 216 L198 224 L212 210" stroke="#84cc16" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

    {/* Selo de Segurança Glassmorphism */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 px-4 sm:px-6 shadow-xl flex items-center justify-center gap-3 w-[90%] max-w-max">
      <div className="w-2.5 h-2.5 bg-[#84cc16] rounded-full shrink-0 shadow-[0_0_10px_rgba(132,204,22,0.8)]"></div>
      <span className="text-white text-xs sm:text-sm font-bold tracking-wide text-center">Acesso Seguro Institucional</span>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState<UserProfile>("gestor");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      try {
        login({
          id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          name: email.split("@")[0].toUpperCase(),
          email,
          profile,
        });

        localStorage.setItem("sigah_token", "dummy_jwt_token");
        router.push("/home");
      } catch (err) {
        setError("Erro ao autenticar. Tente novamente.");
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  const loginFormContent = (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <h1 className="font-heading font-extrabold text-3xl lg:text-4xl text-primary leading-tight tracking-tight">
          Acesse sua conta
        </h1>
        <p className="text-on-surface-variant text-base leading-relaxed">
          Bem-vindo de volta ao SIGAH. Insira suas credenciais institucionais para continuar.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-error/10 border border-error text-error text-sm p-4 rounded-xl flex items-center gap-3">
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-bold text-on-surface">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="exemplo@sigah.gov.br"
              />
            </div>
          </div>

          <div className="space-y-1.5 relative">
            <label htmlFor="profile" className="block text-sm font-bold text-on-surface">
              Perfil de Acesso
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`w-full pl-12 pr-10 py-3.5 bg-surface-container-lowest border ${isProfileOpen ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant'} rounded-xl text-left focus:outline-none transition-all flex items-center justify-between group cursor-pointer`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary">
                  {React.createElement(PROFILES.find(p => p.value === profile)?.icon || UserCircle2, { className: "w-5 h-5" })}
                </div>
                <span className="text-on-surface font-medium truncate block">
                  {PROFILES.find(p => p.value === profile)?.label}
                </span>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-outline-variant group-hover:text-primary transition-colors">
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isProfileOpen ? 'rotate-180 text-primary' : ''}`} />
                </div>
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute z-20 mt-2 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {PROFILES.map((p) => {
                      const Icon = p.icon;
                      const isSelected = profile === p.value;
                      return (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => {
                            setProfile(p.value as UserProfile);
                            setIsProfileOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-primary/5 transition-colors ${isSelected ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface'}`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-outline-variant'}`} />
                          <span className="flex-1">{p.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="pass" className="block text-sm font-bold text-on-surface">
                Senha
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                id="pass"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-end pt-1">
              <Link href="/auth/recuperar" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                Esqueceu a senha?
              </Link>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold text-center text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:shadow-md"
        >
          <span>{loading ? "Autenticando..." : "Entrar no Sistema"}</span>
          {!loading && <ArrowRight className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">

      {/* 1. Header Simplificado */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="h-9 w-9 bg-gradient-to-br from-[#001e40] to-[#003366] rounded-lg flex items-center justify-center text-white font-heading font-black text-lg shadow-sm">
              S
            </div>
            <span className="font-heading font-black text-2xl tracking-tight text-[#001e40]">
              SIGAH
            </span>
          </Link>
          <Link href="/acesso" className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Voltar ao Início
          </Link>
        </div>
      </header>

      {/* 2. Conteúdo Principal */}
      <main className="flex-grow pt-16 flex flex-col justify-center w-full">

        {/* LAYOUT MOBILE (lg:hidden) */}
        <div className="lg:hidden flex flex-col min-h-[calc(100vh-4rem)]">
          {/* Imagem / SVG */}
          <section className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden shrink-0">
            <LoginIllustration />
          </section>

          {/* Card Flutuante */}
          <div className="w-full flex-grow relative z-10 -mt-6">
            <div className="bg-white rounded-t-3xl p-6 sm:p-8 shadow-[0_-8px_32px_rgba(0,30,64,0.08)] h-full border-t border-outline-variant/10">
              <div className="max-w-md mx-auto">
                {loginFormContent}
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT DESKTOP (hidden lg:block) */}
        <div className="hidden lg:flex flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 items-center justify-center py-12">
          <div className="grid grid-cols-2 gap-16 xl:gap-24 items-center w-full max-w-5xl">

            {/* Esquerda: Formulário (Alinhado à direita para ficar próximo ao centro) */}
            <div className="flex justify-end w-full">
              <div className="w-full max-w-[420px]">
                {loginFormContent}
              </div>
            </div>

            {/* Direita: Imagem/SVG (Alinhado à esquerda) */}
            <div className="flex justify-start w-full">
              <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_24px_48px_rgba(0,30,64,0.12)] border border-outline-variant/15">
                <LoginIllustration />
              </div>
            </div>

          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
