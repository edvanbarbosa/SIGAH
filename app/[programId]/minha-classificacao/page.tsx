// =============================================================================
// app/[programId]/minha-classificacao/page.tsx
// Tela de Minha Classificação - Cidadão (Passo 21.2).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Info, 
  DollarSign, 
  Users, 
  User, 
  Home as HomeIcon, 
  Download, 
  Eye, 
  Loader2,
  CheckCircle,
  Clock,
  History,
  Key
} from "lucide-react";

export default function MinhaClassificacaoPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados locais
  const [downloading, setDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manipula download de comprovante em TXT
  const handleDownloadCertificate = () => {
    setDownloading(true);
    setSuccessMessage(null);
    setTimeout(() => {
      setDownloading(false);

      const content = `COMPROVANTE OFICIAL DE INSCRICAO E CLASSIFICACAO\n\nSistema: SIGAH - Gestão de Habitação\nPrograma: ${config.name}\nCódigo de Identificação: #SIGAH-${Math.floor(100000 + Math.random() * 900000)}\nData Emissão: ${new Date().toLocaleString()}\n\nNome do Beneficiário: ANA SILVA (Cidadão)\nPosição Atual na Fila: 142º Lugar\nProgresso Geral: 142 de 500 Vagas Contempladas\nStatus da Zona: Zona de Pré-Convocação Atingida\n\nDETALHAMENTO DE PONTUACAO SOCIAL:\n- Renda Familiar (Até 1.5 salários mínimos): +30 Pontos\n- Dependentes (3 ou mais dependentes): +25 Pontos\n- Mulher Chefe de Família (Monoparental): +20 Pontos\n- Vulnerabilidade Social (Moradia em Área de Risco): +10 Pontos\n--------------------------------------------\nTOTAL ACUMULADO: 85 PONTOS\n\nDocumento emitido digitalmente para fins de comprovação institucional.\n`;
      
      const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `comprovante_classificacao_sigah.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccessMessage("Comprovante baixado com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 1500);
  };

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Top Navigation Bar (Institucional Cidadão) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-white/95 dark:bg-[#001e40]/95 backdrop-blur-xl border-b border-[#001e40]/10 shadow-[0_4px_12px_rgba(0,30,64,0.03)] select-none">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary font-black text-xl">menu</span>
          </div>
          <h1 className="text-lg font-black text-primary font-heading tracking-tight">SIGAH</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-secondary/20">
            <img 
              alt="Avatar do usuário" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEmcHcvD82Z7Uead3xrqFQd9DxetM3wsibcJa7X9-KLikbbnxY8LAznmMWYqc3r-_aR9Ar6LOG-wEuAyi1d7PhMmmfbvDdL9Od7TUJi1InUsDqVK9NBhVQYueuBheI7mLJvRTZgZXR1FU5RPC-NBfm8HIL9AMhLrg3CkcRhTSo6nmL9rplKZUNOoNO2IsWnGgE96Gqie05VxIHzHLvxU0lTwEzXiNyzAzSmw3iOErbOEfVw-sWQ4B72ejDOlKEcjeP9-hC5q_ljzs" 
            />
          </div>
        </div>
      </nav>

      {/* 2. Conteúdo Principal */}
      <main className="flex-grow pt-24 pb-32 px-6 max-w-3xl mx-auto w-full space-y-8">
        
        {/* Banner de Sucesso */}
        {successMessage && (
          <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in select-none">
            <CheckCircle className="w-6 h-6 text-green-700 bg-green-200/50 p-1 rounded-full shrink-0" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}

        {/* Main Highlight Card (Gradiente Azul) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl shadow-primary/10 select-none">
          <div className="relative z-10">
            <p className="font-sans text-primary-fixed-dim uppercase tracking-widest text-[10px] font-black mb-2">
              Classificação Geral
            </p>
            <h2 className="font-heading font-black text-4xl mb-2 tracking-tight">Sua Posição: 142º</h2>
            <p className="text-on-primary-container text-xs leading-relaxed max-w-md font-medium">
              Você está no caminho certo! Acompanhe as atualizações do sistema para os próximos passos da convocação.
            </p>

            <div className="mt-8">
              <div className="flex justify-between items-end mb-2 text-xs font-bold">
                <span>Progresso da Fila</span>
                <span>142 de 500 vagas</span>
              </div>
              
              {/* Progresso de Vagas com sombra */}
              <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                  className="bg-secondary-container h-full rounded-full shadow-[0_0_12px_rgba(0,112,234,0.5)] transition-all duration-1000" 
                  style={{ width: "28.4%" }}
                ></div>
              </div>
              
              <p className="mt-4 text-xs font-semibold text-secondary-fixed flex items-center gap-2">
                <Info className="w-4.5 h-4.5 text-secondary-fixed shrink-0" />
                <span>Zona de pré-convocação atingida</span>
              </p>
            </div>
          </div>
          {/* Abstract background shape */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-secondary/15 rounded-full blur-3xl"></div>
        </section>

        {/* Social Points Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between select-none">
            <h3 className="font-heading font-black text-xl text-primary">Pontuação Social</h3>
            <span className="bg-surface-container-highest px-3.5 py-1 rounded-full text-xs font-black text-primary border border-outline-variant/30 tracking-wider">
              Total: 85 pts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Renda Familiar */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-2 border-primary-fixed/30 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-blue-50 p-2.5 rounded-xl text-secondary border border-blue-100 shrink-0 select-none">
                <DollarSign className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-on-surface text-sm">Renda Familiar</h4>
                <p className="text-on-surface-variant text-xs mb-2 font-medium mt-0.5">Até 1.5 salários mínimos</p>
                <span className="text-secondary font-black text-sm block">+30 pontos</span>
              </div>
            </div>

            {/* Dependentes */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-2 border-primary-fixed/30 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-blue-50 p-2.5 rounded-xl text-secondary border border-blue-100 shrink-0 select-none">
                <Users className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-on-surface text-sm">Dependentes</h4>
                <p className="text-on-surface-variant text-xs mb-2 font-medium mt-0.5">3 ou mais dependentes</p>
                <span className="text-secondary font-black text-sm block">+25 pontos</span>
              </div>
            </div>

            {/* Mulher Chefe */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-2 border-primary-fixed/30 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-blue-50 p-2.5 rounded-xl text-secondary border border-blue-100 shrink-0 select-none">
                <User className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-on-surface text-sm">Mulher Chefe</h4>
                <p className="text-on-surface-variant text-xs mb-2 font-medium mt-0.5">Unidade monoparental</p>
                <span className="text-secondary font-black text-sm block">+20 pontos</span>
              </div>
            </div>

            {/* Vulnerabilidade */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-2 border-primary-fixed/30 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="bg-blue-50 p-2.5 rounded-xl text-secondary border border-blue-100 shrink-0 select-none">
                <HomeIcon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-on-surface text-sm">Vulnerabilidade</h4>
                <p className="text-on-surface-variant text-xs mb-2 font-medium mt-0.5">Moradia em área de risco</p>
                <span className="text-secondary font-black text-sm block">+10 pontos</span>
              </div>
            </div>

          </div>
        </section>

        {/* Actions Section */}
        <section className="flex flex-col gap-3 pt-2">
          <button 
            onClick={handleDownloadCertificate}
            disabled={downloading}
            className="w-full py-4 bg-primary text-white rounded-xl font-heading font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer border-none text-xs uppercase tracking-wider"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Gerando comprovante...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 shrink-0" />
                <span>Baixar Comprovante de Inscrição</span>
              </>
            )}
          </button>
          <button className="w-full py-4 border-2 border-outline/20 hover:bg-slate-50 text-primary rounded-xl font-heading font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer bg-transparent text-xs uppercase tracking-wider">
            <Eye className="w-4 h-4 shrink-0" />
            Ver Detalhes do Programa
          </button>
        </section>

        {/* Contextual Help */}
        <div className="p-6 bg-surface-container-low rounded-2xl text-center border border-outline-variant/10 select-none">
          <p className="text-xs text-on-surface-variant mb-1 font-semibold">Dúvidas sobre sua pontuação?</p>
          <a className="text-secondary font-black text-xs hover:underline underline-offset-4" href="#">
            Consultar Edital FAR nº {programId.toUpperCase()}-2024
          </a>
        </div>

      </main>

      {/* 3. Rodapé Institucional */}
      <Footer />

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Citizen)
          ========================================== */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/95 dark:bg-[#001e40]/95 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href="/acesso"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <HomeIcon className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/minha-classificacao`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Clock className="w-5 h-5 text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Fila</span>
        </a>
        <a 
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <History className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Histórico</span>
        </a>
        <a 
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <User className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Perfil</span>
        </a>
      </nav>

    </div>
  );
}
