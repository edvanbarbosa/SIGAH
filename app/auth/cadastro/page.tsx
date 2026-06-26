// =============================================================================
// app/auth/cadastro/page.tsx
// Tela de cadastro de novo usuário.
// Baseado no layout da tela de login.
// =============================================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Landmark, ArrowRight, KeyRound, Mail, User, Phone, CalendarDays, BadgeInfo } from "lucide-react";
import { LandingFooter } from "@/components/layout/LandingFooter";

// Ilustração vetorial que combina habitação e segurança/cadastro
const RegisterIllustration = () => (
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

      {/* Ícone de Usuário / Cadastro */}
      <circle cx="200" cy="220" r="30" fill="#001e40" />
      <circle cx="200" cy="210" r="10" fill="#84cc16" />
      <path d="M185 235 C185 225 195 225 200 225 C205 225 215 225 215 235 L218 245 H182 L185 235 Z" fill="#84cc16" />

      {/* Elementos flutuantes remetendo a dados e processo digital */}
      <rect x="70" y="80" width="24" height="24" rx="6" fill="#eab308" />
      <circle cx="320" cy="100" r="12" fill="#0059bb" />
      <rect x="300" y="300" width="16" height="16" rx="4" fill="#84cc16" />
    </svg>

    {/* Selo de Segurança Glassmorphism */}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 px-4 sm:px-6 shadow-xl flex items-center justify-center gap-3 w-[90%] max-w-max">
      <div className="w-2.5 h-2.5 bg-[#eab308] rounded-full shrink-0 shadow-[0_0_10px_rgba(234,179,8,0.8)]"></div>
      <span className="text-white text-xs sm:text-sm font-bold tracking-wide text-center">Cadastro de Cidadão</span>
    </div>
  </div>
);

export default function CadastroPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    nascimento: "",
    senha: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.nome || !formData.cpf || !formData.email || !formData.telefone || !formData.nascimento || !formData.senha) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      // Simulação de cadastro bem-sucedido
      router.push("/auth/login");
    }, 1500);
  };

  const registerFormContent = (
    <div className="w-full space-y-8">
      <div className="space-y-3">
        <h1 className="font-heading font-extrabold text-3xl lg:text-4xl text-primary leading-tight tracking-tight">
          Crie sua conta
        </h1>
        <p className="text-on-surface-variant text-base leading-relaxed">
          Preencha os dados abaixo para se cadastrar no SIGAH e ter acesso aos programas habitacionais.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-error/10 border border-error text-error text-sm p-4 rounded-xl flex items-center gap-3">
            <span className="font-bold">{error}</span>
          </div>
        )}

        <div className="space-y-5">
          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label htmlFor="nome" className="block text-sm font-bold text-on-surface">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                <User className="w-5 h-5" />
              </div>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                value={formData.nome}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Ex: João da Silva"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* CPF */}
            <div className="space-y-1.5">
              <label htmlFor="cpf" className="block text-sm font-bold text-on-surface">
                CPF
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                  <BadgeInfo className="w-5 h-5" />
                </div>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="000.000.000-00"
                />
              </div>
            </div>

            {/* Data de Nascimento */}
            <div className="space-y-1.5">
              <label htmlFor="nascimento" className="block text-sm font-bold text-on-surface">
                Data de Nascimento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <input
                  id="nascimento"
                  name="nascimento"
                  type="date"
                  required
                  value={formData.nascimento}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* E-mail */}
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
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="exemplo@email.com"
                />
              </div>
            </div>

            {/* Telefone */}
            <div className="space-y-1.5">
              <label htmlFor="telefone" className="block text-sm font-bold text-on-surface">
                Telefone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label htmlFor="senha" className="block text-sm font-bold text-on-surface">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline-variant">
                <KeyRound className="w-5 h-5" />
              </div>
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={formData.senha}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Crie uma senha forte"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-white py-4 rounded-xl font-bold text-center text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:hover:shadow-md"
          >
            <span>{loading ? "Criando conta..." : "Cadastrar"}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-on-surface-variant">
            Já possui uma conta?{" "}
            <Link href="/auth/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Fazer login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* Header Simplificado */}
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Landmark className="text-primary w-6 h-6" />
            <span className="font-heading font-extrabold text-primary text-xl tracking-tighter">
              SIGAH
            </span>
          </Link>
          <Link href="/inicio" className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            Voltar ao Início
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow pt-16 flex flex-col justify-center w-full">
        
        {/* LAYOUT MOBILE */}
        <div className="lg:hidden flex flex-col min-h-[calc(100vh-4rem)]">
          <section className="w-full aspect-[4/3] sm:aspect-video relative overflow-hidden shrink-0">
            <RegisterIllustration />
          </section>

          <div className="w-full flex-grow relative z-10 -mt-6">
            <div className="bg-white rounded-t-3xl p-6 sm:p-8 shadow-[0_-8px_32px_rgba(0,30,64,0.08)] h-full border-t border-outline-variant/10">
              <div className="max-w-md mx-auto">
                {registerFormContent}
              </div>
            </div>
          </div>
        </div>

        {/* LAYOUT DESKTOP */}
        <div className="hidden lg:flex flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 items-center justify-center py-12">
          <div className="grid grid-cols-2 gap-16 xl:gap-24 items-center w-full max-w-5xl">
            
            {/* Esquerda: Formulário */}
            <div className="flex justify-end w-full">
              <div className="w-full max-w-[460px]">
                {registerFormContent}
              </div>
            </div>

            {/* Direita: Imagem/SVG */}
            <div className="flex justify-start w-full">
              <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_24px_48px_rgba(0,30,64,0.12)] border border-outline-variant/15">
                <RegisterIllustration />
              </div>
            </div>

          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
}
