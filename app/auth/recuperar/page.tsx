// =============================================================================
// app/auth/recuperar/page.tsx
// Tela de solicitação de recuperação de credenciais.
// Baseada no layout split-screen da tela de login e cadastro.
// =============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Mail, CheckCircle2, ChevronLeft } from "lucide-react";
import { LandingFooter } from "@/components/layout/LandingFooter";

// Ilustração vetorial sobre segurança/recuperação
const RecoverIllustration = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#001e40] to-[#004080] p-8 relative overflow-hidden">
    {/* Formas abstratas de fundo */}
    <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-[#0059bb] rounded-full mix-blend-screen filter blur-[80px] opacity-50"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#0059bb] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>

    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[320px] drop-shadow-2xl z-10">
      {/* Halo de segurança ao redor */}
      <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="2" strokeDasharray="8 8" className="opacity-20" />
      <circle cx="200" cy="200" r="120" fill="white" className="opacity-5" />

      {/* Cadeado (Lock) */}
      <path d="M150 190 V140 C150 110 170 90 200 90 C230 90 250 110 250 140 V190" stroke="white" strokeWidth="16" strokeLinecap="round" />
      <rect x="120" y="190" width="160" height="130" rx="16" fill="white" />
      
      {/* Fechadura */}
      <circle cx="200" cy="240" r="20" fill="#001e40" />
      <path d="M190 250 L180 280 H220 L210 250 Z" fill="#001e40" />

      {/* Elementos flutuantes remetendo a processo digital */}
      <rect x="70" y="80" width="24" height="24" rx="6" fill="#eab308" />
      <circle cx="320" cy="100" r="12" fill="#0059bb" />
      <rect x="300" y="300" width="16" height="16" rx="4" fill="#84cc16" />
    </svg>

    {/* Selo de Segurança Glassmorphism */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 px-4 sm:px-6 shadow-xl flex items-center justify-center gap-3 w-[90%] max-w-max">
      <div className="w-2.5 h-2.5 bg-[#84cc16] rounded-full shrink-0 shadow-[0_0_10px_rgba(132,204,22,0.8)]"></div>
      <span className="text-white text-xs sm:text-sm font-bold tracking-wide text-center">Recuperação Segura</span>
    </div>
  </div>
);

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Por favor, preencha o e-mail.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1200);
  };

  const formContent = sent ? (
    <div className="w-full space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mx-auto w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h1 className="font-heading font-extrabold text-3xl lg:text-4xl text-primary leading-tight tracking-tight">
        E-mail enviado!
      </h1>
      <p className="text-on-surface-variant text-base leading-relaxed max-w-sm mx-auto">
        Se o e-mail informado estiver cadastrado em nossa base, você receberá um link com as instruções para redefinição da sua senha em instantes.
      </p>
      <div className="pt-8">
        <Link
          href="/auth/login"
          className="w-full bg-surface-container-high text-on-surface py-4 rounded-xl font-bold text-center text-base shadow-sm hover:bg-outline-variant/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Voltar para o Login
        </Link>
      </div>
    </div>
  ) : (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <h1 className="font-heading font-extrabold text-3xl lg:text-4xl text-primary leading-tight tracking-tight">
          Recuperar Acesso
        </h1>
        <p className="text-on-surface-variant text-base leading-relaxed">
          Informe seu e-mail cadastrado para enviarmos as instruções de redefinição de senha.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-error/10 border border-error text-error text-sm p-4 rounded-xl flex items-center gap-3">
            <span className="font-bold">{error}</span>
          </div>
        )}

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

        <div className="pt-2 flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold text-center text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:shadow-md"
          >
            <span>{loading ? "Processando..." : "Enviar Instruções"}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>

          <Link
            href="/auth/login"
            className="w-full bg-transparent text-primary py-4 rounded-xl font-bold text-center text-base hover:bg-primary/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar</span>
          </Link>
        </div>
      </form>
    </div>
  );

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* Header Simplificado */}
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

      {/* Conteúdo Principal */}
      <main className="flex-grow pt-16 flex flex-col justify-center w-full">
        
        {/* LAYOUT MOBILE */}
        <div className="lg:hidden flex flex-col min-h-[calc(100vh-4rem)]">
          <section className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden shrink-0">
            <RecoverIllustration />
          </section>

          <div className="w-full flex-grow relative z-10 -mt-6">
            <div className="bg-white rounded-t-3xl p-6 sm:p-8 shadow-[0_-8px_32px_rgba(0,30,64,0.08)] h-full border-t border-outline-variant/10">
              <div className="max-w-md mx-auto">
                {formContent}
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT DESKTOP */}
        <div className="hidden lg:flex flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 items-center justify-center py-12">
          <div className="grid grid-cols-2 gap-16 xl:gap-24 items-center w-full max-w-5xl">
            
            {/* Esquerda: Formulário */}
            <div className="flex justify-end w-full">
              <div className="w-full max-w-[420px]">
                {formContent}
              </div>
            </div>

            {/* Direita: Imagem/SVG */}
            <div className="flex justify-start w-full">
              <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_24px_48px_rgba(0,30,64,0.12)] border border-outline-variant/15">
                <RecoverIllustration />
              </div>
            </div>

          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
