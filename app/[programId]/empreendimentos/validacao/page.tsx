// =============================================================================
// app/[programId]/empreendimentos/validacao/page.tsx
// Validação Técnica e Urbanística - Padronizada (Passo 28.1).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import {
  ChevronRight,
  Download,
  CheckCircle,
  Wrench,
  Map,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Home,
  FileText,
  Plus,
  Compass,
  ArrowRight,
  Check,
  Zap,
  Droplet,
  Trees,
  Info,
  X,
  Loader2,
  Activity,
  Award,
  Globe
} from "lucide-react";

export default function ValidacaoTecnicaUrbanisticaPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados de Controle
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [opinionText, setOpinionText] = useState("");
  const [donationType, setDonationType] = useState("municipal");
  const [registryCode, setRegistryCode] = useState("M-234.890-R3");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  
  // Status de Infraestrutura
  const [infraStatus, setInfraStatus] = useState({
    eletrica: "concluido",
    agua: "concluido",
    verdes: "pendente"
  });

  // Simulação de Upload
  const handleUploadClick = () => {
    setToastMessage("Selecionando Certidão de Diretrizes...");
    setTimeout(() => {
      setUploadedFile("certidao_diretrizes_assinado.pdf");
      setToastMessage("Certidão de Diretrizes anexada com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  // Emitir Termo de Compromisso
  const handleIssueTerm = () => {
    setIsProcessing(true);
    setToastMessage("Gerando Termo de Compromisso de Infraestrutura...");
    setTimeout(() => {
      setIsProcessing(false);
      setInfraStatus(prev => ({ ...prev, verdes: "concluido" }));
      setToastMessage("Termo de compromisso emitido! Áreas Verdes validadas.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  // Exportar Dossiê
  const handleExportDossier = () => {
    setToastMessage("Consolidando dossiê urbanístico e matricial para exportação...");
    setTimeout(() => {
      setToastMessage("Dossiê consolidado! Download do PDF iniciado.");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  // Aprovar Etapa
  const handleApproveStep = () => {
    setIsProcessing(true);
    setToastMessage("Registrando aprovação da etapa técnica de enquadramento...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Etapa aprovada com sucesso! Loteamento liberado para a fase de Cartório.");
      setTimeout(() => {
        setToastMessage(null);
        router.push(`/${programId}/empreendimentos`);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="bg-surface text-primary min-h-screen pb-24 md:pb-0 flex flex-col font-sans">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md mb-6">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Dashboard Hero / Context */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 select-none">
              <div>
                <span className="text-secondary font-black text-[10px] tracking-widest uppercase mb-2 block">
                  Habitação Social
                </span>
                <h2 className="text-3xl font-black text-primary tracking-tight leading-none">
                  Validação Urbana &amp; Técnica
                </h2>
                <p className="text-slate-500 text-xs max-w-2xl mt-2 font-semibold leading-relaxed">
                  Dossiê técnico para o Residencial "Portal da Alvorada" - Fase de conformidade com o Plano Diretor Estratégico.
                </p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  onClick={handleExportDossier}
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Exportar Dossiê</span>
                </button>
                <button 
                  onClick={handleApproveStep}
                  disabled={isProcessing}
                  className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0070ea] text-white rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg font-black text-xs uppercase tracking-wider border-none cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>Aprovar Etapa</span>
                </button>
              </div>
            </div>

            {/* Asymmetric Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Coluna Esquerda: Dossier & Registry (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Progresso do Loteamento */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-black text-sm text-[#001e40] uppercase tracking-wide flex items-center gap-2 select-none">
                    <Activity className="w-4.5 h-4.5 text-secondary shrink-0" />
                    Progresso da Aprovação Técnica
                  </h3>

                  <div className="relative pt-1 select-none">
                    <div className="flex mb-4 items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider py-1 px-3 rounded-full text-secondary bg-blue-50 border border-blue-100">
                          Em Análise Urbanística
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-primary">65% concluído</span>
                      </div>
                    </div>

                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-100">
                      <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-secondary" style={{ width: "65%" }}></div>
                    </div>

                    <div className="flex justify-between text-[8px] text-slate-400 font-black uppercase tracking-wider">
                      <span>Início</span>
                      <span className="text-secondary">Dossiê Urbano</span>
                      <span className="text-secondary">Cartório</span>
                      <span>Infraestrutura</span>
                      <span>Final</span>
                    </div>
                  </div>
                </section>

                {/* Dossiê Urbano */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex justify-between items-start select-none">
                    <div>
                      <h3 className="font-black text-sm text-[#001e40] uppercase tracking-wide">Dossiê Urbano</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">Conformidade com o Plano Diretor Municipal.</p>
                    </div>
                    <span className="bg-amber-50 text-amber-800 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-amber-200">
                      Atenção Necessária
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 border-l-4 border-l-amber-600">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 select-none">
                        Parecer Técnico Urbanístico
                      </label>
                      <textarea 
                        value={opinionText}
                        onChange={(e) => setOpinionText(e.target.value)}
                        className="w-full bg-transparent border-none border-b-2 border-primary focus:ring-0 focus:border-secondary transition-all resize-none text-xs font-bold text-slate-700 p-0" 
                        placeholder="Descreva a conformidade com as zonas de interesse social (ZEIS)..."
                        rows={4}
                      ></textarea>
                    </div>

                    <div 
                      onClick={handleUploadClick}
                      className="flex items-center gap-4 p-5 border-2 border-dashed border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors cursor-pointer group select-none"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0059bb] flex items-center justify-center shrink-0 group-hover:bg-secondary group-hover:text-white transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-sm text-[#001e40]">
                          {uploadedFile ? uploadedFile : "Anexar Certidão de Diretrizes"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Formatos suportados: PDF, JPG (Máx 10MB)</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Registro de Terreno */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-black text-sm text-[#001e40] uppercase tracking-wide select-none">Registro de Terreno</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
                      <span className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-2 select-none">Origem da Doação</span>
                      
                      <div className="flex gap-4 mt-2 select-none">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="land_type" 
                            value="municipal"
                            checked={donationType === "municipal"}
                            onChange={(e) => setDonationType(e.target.value)}
                            className="text-secondary focus:ring-secondary/20" 
                          />
                          <span className="text-xs font-black text-[#001e40]">Público Municipal</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="land_type" 
                            value="far"
                            checked={donationType === "far"}
                            onChange={(e) => setDonationType(e.target.value)}
                            className="text-secondary focus:ring-secondary/20" 
                          />
                          <span className="text-xs font-black text-[#001e40]">Fundo FAR</span>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl flex flex-col justify-between">
                      <span className="text-[9px] font-black text-slate-455 uppercase tracking-widest block mb-1 select-none">Matrícula Imobiliária</span>
                      <input 
                        type="text" 
                        value={registryCode}
                        onChange={(e) => setRegistryCode(e.target.value)}
                        className="w-full bg-transparent border-none border-b-2 border-primary focus:ring-0 text-xs font-bold text-slate-700 py-1"
                      />
                    </div>
                  </div>
                </section>

              </div>

              {/* Coluna Direita: Localização e Resumo (4 cols) */}
              <aside className="lg:col-span-4 space-y-8 select-none">
                
                {/* Mapa / Localização Contexto */}
                <div className="rounded-3xl overflow-hidden shadow-md h-64 relative group border border-slate-200">
                  <img 
                    alt="Mapa da Gleba" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbX1GiwAwHWM4mu35eEBLUnzhj_QCaoNxK1Ngt09XpK5d42IFnKQt4rqhDV4Jk1bQQPK9bKhWmkSdklsQcRT-mRx3PQfSGPXn6swNGrgVPng7Imo4PVct15IDM69eG4z2nmeQC1tH04S56969997nsvpW_RjAmyOGnX34p05ePbc2_YzROngf3yUInXDti3jy4Q7GxzxCcK39OcmV-oodjouAsOtROJyAQUlNGoeXba5GXWBTmsiCH09IvbfLOj8ssjiaKoCWpenI" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001e40]/80 to-transparent flex items-end p-6">
                    <div className="text-white space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest opacity-80 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" /> Localização da Gleba
                      </p>
                      <h4 className="font-heading font-black text-lg">Setor Norte - Quadra 12</h4>
                    </div>
                  </div>
                </div>

                {/* Infraestrutura Checklist */}
                <section className="bg-[#001e40] text-white p-8 rounded-3xl shadow-xl relative overflow-hidden space-y-6">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary opacity-15 rounded-full blur-3xl"></div>
                  
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-secondary shrink-0" />
                      Infraestrutura
                    </h3>
                    <p className="text-slate-300 text-[10px] font-semibold mt-2 leading-relaxed">
                      Declaração de responsabilidade pela manutenção dos equipamentos comuns (Praças, Iluminação e Drenagem).
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Zap className="w-4 h-4 text-secondary shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Rede Elétrica</span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Droplet className="w-4 h-4 text-secondary shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Água &amp; Esgoto</span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Trees className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Áreas Verdes</span>
                      </div>
                      {infraStatus.verdes === "concluido" ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                      )}
                    </div>
                  </div>

                  {infraStatus.verdes === "pendente" && (
                    <button 
                      onClick={handleIssueTerm}
                      className="w-full mt-2 py-3.5 bg-[#0059bb] hover:bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all border-none cursor-pointer shadow-md"
                    >
                      Emitir Termo de Compromisso
                    </button>
                  )}
                </section>

                {/* Resumo Crítico */}
                <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <span className="font-black text-[#001e40] text-xs uppercase tracking-wider">Resumo Crítico</span>
                  </div>
                  
                  <ul className="space-y-3 pl-0 list-none">
                    <li className="flex gap-2 text-[10px] text-slate-600 font-bold leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                      Pendente validação de recuo frontal conforme Art. 45 do PD.
                    </li>
                    <li className="flex gap-2 text-[10px] text-slate-600 font-bold leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                      Certidão de uso e ocupação do solo emitida com sucesso.
                    </li>
                  </ul>
                </div>

              </aside>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/95 dark:bg-[#001e40]/95 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Home className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/empreendimentos`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Globe className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Cadastro</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <FileText className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cotas</span>
        </a>
      </nav>

    </div>
  );
}
