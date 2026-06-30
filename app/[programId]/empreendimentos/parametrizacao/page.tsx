// =============================================================================
// app/[programId]/empreendimentos/parametrizacao/page.tsx
// Parametrização de Empreendimento (Passo 28.2 / Etapa 60).
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
  CheckCircle,
  Loader2,
  ChevronRight,
  Sliders
} from "lucide-react";

export default function ParametrizacaoEmpreendimentoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados locais reativos
  const [progressPercent, setProgressPercent] = useState(42);
  const [targetBracket, setTargetBracket] = useState("urbano1");
  const [hasElevator, setHasElevator] = useState(true);
  
  // Mapeamento de unidades térreas
  const [unitPcd, setUnitPcd] = useState(12);
  const [unitIdoso, setUnitIdoso] = useState(8);
  const [unitMobilidade, setUnitMobilidade] = useState(4);
  const totalUnits = unitPcd + unitIdoso + unitMobilidade;

  // Configurações Geográficas e Sociais
  const [proximityRadius, setProximityRadius] = useState(2);
  const [localCriteria, setLocalCriteria] = useState<string[]>([
    "Vulnerabilidade Social Específica",
    "Mulheres Vítimas de Violência"
  ]);
  const [newCriterionName, setNewCriterionName] = useState("");
  const [showAddCriteriaInput, setShowAddCriteriaInput] = useState(false);

  // Feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState(false);
  const [isPublishingCouncil, setIsPublishingCouncil] = useState(false);

  // Remover critério local
  const handleRemoveCriteria = (indexToRemove: number) => {
    setLocalCriteria(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setToastMessage("Critério local removido.");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Adicionar critério local
  const handleAddCriteria = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCriterionName.trim()) return;
    setLocalCriteria(prev => [...prev, newCriterionName.trim()]);
    setNewCriterionName("");
    setShowAddCriteriaInput(false);
    setToastMessage("Critério local adicionado!");
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Gerar relatório de auditoria
  const handleGenerateAuditReport = () => {
    setIsGeneratingAudit(true);
    setToastMessage("Consolidando logs de parametrização e histórico de glebas...");
    setTimeout(() => {
      setIsGeneratingAudit(false);
      setToastMessage("Relatório de auditoria gerado! Download do PDF iniciado.");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1500);
  };

  // Gerar publicidade conselho
  const handleGeneratePublicity = () => {
    setIsPublishingCouncil(true);
    setToastMessage("Transmitindo termo de parametrização para o Conselho de Habitação...");
    setTimeout(() => {
      setIsPublishingCouncil(false);
      setToastMessage("Publicidade no Diário do Conselho homologada com sucesso!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1800);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-5xl mx-auto px-6 pt-24 pb-32 space-y-6">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Breadcrumbs e Título */}
            <div className="select-none space-y-2">
              <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Planejamento</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span>Empreendimentos</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span className="text-secondary font-black">Parametrização</span>
              </nav>
              <h1 className="font-headline text-3xl font-black text-primary tracking-tight">
                Parametrização de Empreendimento
              </h1>
            </div>

            {/* Hero Section: Identification */}
            <section className="relative overflow-hidden rounded-2xl bg-[#003366] p-6 text-white shadow-md border border-[#001e40] select-none">
              <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-10">
                <span className="text-[120px] font-black leading-none">🏢</span>
              </div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-[#adc7ff] text-xs font-bold uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-lg">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span> 
                    <span>Ativo</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black font-headline tracking-tight">Residencial Solar dos Ipês</h2>
                <p className="text-[#799dd6] text-xs font-semibold max-w-md leading-relaxed">
                  Parametrização técnica e social para enquadramento habitacional e fluxo de auditoria.
                </p>
              </div>
            </section>

            {/* Main Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Controle de Execução Física (Col 8) */}
              <div className="md:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2 select-none">
                    <Sliders className="w-4.5 h-4.5 text-secondary shrink-0" />
                    <span>Controle de Execução Física</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-end select-none">
                      <span className="text-3xl font-black text-primary tracking-tight">{progressPercent}%</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Meta: 50% para Envio Caixa</span>
                    </div>

                    <div className="w-full bg-[#f3f4f5] h-3 rounded-full overflow-hidden select-none">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>

                    {/* Interactive Progress range selector */}
                    <div className="pt-2 select-none flex items-center gap-4">
                      <span className="text-[9px] font-black text-slate-450 uppercase shrink-0">Simular Progresso:</span>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        value={progressPercent}
                        onChange={(e) => setProgressPercent(parseInt(e.target.value))}
                        className="flex-grow accent-secondary cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl flex gap-3 items-start border-l-4 select-none transition-all duration-300 bg-[#ffdbca]/40 border-[#ffb690] text-[#381300]">
                  <span className="text-xl font-bold shrink-0 mt-0.5">⚠️</span>
                  <p className="text-xs font-bold leading-relaxed">
                    {progressPercent < 50 ? (
                      <span>
                        <strong>Atenção:</strong> A lista de beneficiários só poderá ser submetida à Caixa Econômica Federal após a obra atingir o marco de 50%.
                      </span>
                    ) : (
                      <span className="text-emerald-800">
                        <strong>✓ Liberado:</strong> O marco de 50% de obras foi atingido. A submissão da lista de beneficiários à Caixa Econômica está autorizada!
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Público-Alvo (Col 4) */}
              <div className="md:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-all duration-300 select-none">
                <div>
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">
                    Público-Alvo
                  </h3>
                  
                  <div className="space-y-4">
                    <label 
                      onClick={() => setTargetBracket("urbano1")}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                        targetBracket === "urbano1"
                          ? "border-secondary bg-secondary-container/10 text-primary font-bold shadow-sm"
                          : "border-slate-250 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase">Urbano 1</span>
                        {targetBracket === "urbano1" && (
                          <span className="text-secondary text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Renda até R$ 2.640,00</p>
                    </label>

                    <label 
                      onClick={() => setTargetBracket("urbano2")}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                        targetBracket === "urbano2"
                          ? "border-secondary bg-secondary-container/10 text-primary font-bold shadow-sm"
                          : "border-slate-250 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black uppercase">Urbano 2</span>
                        {targetBracket === "urbano2" && (
                          <span className="text-secondary text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold">Exceção via Indicação Direta</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Parametrização de Elevadores (Col 6) */}
              <div className="md:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 select-none">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
                    <span className="text-sm">🛗</span>
                    <span>Parametrização de Elevadores</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setHasElevator(!hasElevator)}
                    className={`w-11 h-6 rounded-full p-[2px] transition-all duration-300 border-none cursor-pointer flex items-center ${
                      hasElevator ? "bg-[#001e40] justify-end" : "bg-slate-200 justify-start"
                    }`}
                  >
                    <div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm"></div>
                  </button>
                </div>

                <div 
                  className={`space-y-4 transition-all duration-300 ${
                    hasElevator ? "opacity-100 scale-100 h-auto" : "opacity-0 pointer-events-none scale-95 h-0 overflow-hidden"
                  }`}
                >
                  <div className="p-3.5 bg-[#f3f4f5] rounded-xl flex items-center justify-between gap-3 border border-slate-200/50">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary">
                      <span className="text-sm">🏙</span>
                      <span>População &gt;= 750k hab.</span>
                    </div>
                    <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black">
                      VALIDADO
                    </span>
                  </div>

                  <div className="p-3.5 bg-secondary-container/10 rounded-xl flex gap-3 border-l-4 border-primary">
                    <span className="text-primary text-base font-extrabold mt-0.5">ℹ</span>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-primary uppercase leading-tight">Manutenção Obrigatória</p>
                      <p className="text-[10px] text-on-surface-variant font-bold leading-normal">
                        Convênio de manutenção garantida por 60 meses incluso no contrato.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mapeamento Unidades Térreas (Col 6) */}
              <div className="md:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between hover:shadow-md transition-all duration-300 select-none">
                <div>
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-4">
                    Mapeamento Unidades Térreas
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#f3f4f5] p-3 rounded-xl text-center border border-slate-200/40 relative">
                      <span className="block text-2xl font-black text-primary">{unitPcd}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">PCD</span>
                      <div className="flex justify-center gap-1.5 mt-2">
                        <button 
                          onClick={() => setUnitPcd(prev => Math.max(0, prev - 1))}
                          className="bg-white hover:bg-slate-100 text-primary w-5 h-5 rounded flex items-center justify-center font-bold border border-slate-250 cursor-pointer"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => setUnitPcd(prev => prev + 1)}
                          className="bg-white hover:bg-slate-100 text-primary w-5 h-5 rounded flex items-center justify-center font-bold border border-slate-250 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#f3f4f5] p-3 rounded-xl text-center border border-slate-200/40 relative">
                      <span className="block text-2xl font-black text-primary">{unitIdoso}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Idosos</span>
                      <div className="flex justify-center gap-1.5 mt-2">
                        <button 
                          onClick={() => setUnitIdoso(prev => Math.max(0, prev - 1))}
                          className="bg-white hover:bg-slate-100 text-primary w-5 h-5 rounded flex items-center justify-center font-bold border border-slate-250 cursor-pointer"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => setUnitIdoso(prev => prev + 1)}
                          className="bg-white hover:bg-slate-100 text-primary w-5 h-5 rounded flex items-center justify-center font-bold border border-slate-250 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="bg-[#f3f4f5] p-3 rounded-xl text-center border border-slate-200/40 relative">
                      <span className="block text-2xl font-black text-primary">{unitMobilidade}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Mobilidade</span>
                      <div className="flex justify-center gap-1.5 mt-2">
                        <button 
                          onClick={() => setUnitMobilidade(prev => Math.max(0, prev - 1))}
                          className="bg-white hover:bg-slate-100 text-primary w-5 h-5 rounded flex items-center justify-center font-bold border border-slate-250 cursor-pointer"
                        >
                          -
                        </button>
                        <button 
                          onClick={() => setUnitMobilidade(prev => prev + 1)}
                          className="bg-white hover:bg-slate-100 text-primary w-5 h-5 rounded flex items-center justify-center font-bold border border-slate-250 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-bold text-primary px-1 border-t border-slate-50 pt-3">
                  <span className="uppercase tracking-wider text-[10px] text-slate-400">Total de Unidades</span>
                  <span className="text-xl font-black">{totalUnits}</span>
                </div>
              </div>

              {/* Configurações Geográficas e Sociais (Col 12) */}
              <div className="md:col-span-12 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300">
                <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-6 select-none">
                  Configurações Geográficas e Sociais
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  
                  {/* Restrição por Proximidade */}
                  <div className="space-y-4 select-none">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 bg-secondary-container/10 rounded-full text-secondary shrink-0 font-extrabold">
                        📏
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-primary">Restrição por Proximidade</h4>
                        <p className="text-xs text-on-surface-variant font-semibold">
                          Válido apenas para municípios com população &gt; 300k.
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <input 
                            type="number"
                            value={proximityRadius}
                            onChange={(e) => setProximityRadius(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-16 h-10 text-xs rounded-xl border border-slate-250 bg-slate-50 focus:border-secondary focus:ring-0 font-black text-primary text-center"
                          />
                          <span className="text-xs font-bold text-[#43474f]">km de raio máximo</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Critérios Facultativos Locais */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between select-none">
                      <h4 className="text-sm font-black text-primary">
                        Critérios Facultativos Locais 
                      </h4>
                      <button 
                        onClick={() => setShowAddCriteriaInput(!showAddCriteriaInput)}
                        className="bg-secondary-container/15 hover:bg-secondary-container/30 text-secondary w-7 h-7 rounded-full flex items-center justify-center font-bold border-none cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {showAddCriteriaInput && (
                      <form onSubmit={handleAddCriteria} className="flex gap-2 select-none animate-fade-in">
                        <input 
                          type="text" 
                          required
                          value={newCriterionName}
                          onChange={(e) => setNewCriterionName(e.target.value)}
                          placeholder="Digite o novo critério..."
                          className="flex-grow text-xs rounded-xl border border-slate-250 bg-slate-50 px-3 py-2 text-primary font-bold focus:ring-0 focus:border-secondary"
                        />
                        <button 
                          type="submit"
                          className="bg-secondary text-white px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-none cursor-pointer"
                        >
                          Salvar
                        </button>
                      </form>
                    )}

                    <div className="flex flex-wrap gap-2 select-none">
                      {localCriteria.map((crit, idx) => (
                        <div 
                          key={idx}
                          className="flex items-center gap-2 bg-[#f3f4f5] px-3.5 py-1.5 rounded-full text-[11px] font-bold text-primary border border-slate-200/50 transition-all hover:bg-slate-100"
                        >
                          <span>{crit}</span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveCriteria(idx)}
                            className="text-error hover:text-red-700 font-extrabold cursor-pointer border-none bg-transparent flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      <div className="flex items-center gap-2 border border-dashed border-slate-350 px-3.5 py-1.5 rounded-full text-[11px] text-slate-400 italic">
                        Novo critério...
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Audit e Ações do Conselho */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-250/80">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 italic font-bold select-none">
                <span>🕒</span>
                <span>Última atualização em 24/05/2024 às 14:22 por admin_central</span>
              </div>
              
              <div className="flex gap-4 w-full md:w-auto select-none">
                <button 
                  onClick={handleGenerateAuditReport}
                  disabled={isGeneratingAudit}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 border border-slate-250 hover:bg-slate-50 text-xs font-black text-primary rounded-xl cursor-pointer bg-transparent uppercase tracking-wider transition-all"
                >
                  {isGeneratingAudit ? (
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  ) : (
                    <span>📄</span>
                  )}
                  <span>RELATÓRIO AUDITORIA</span>
                </button>

                <button 
                  onClick={handleGeneratePublicity}
                  disabled={isPublishingCouncil}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-br from-[#001e40] to-[#003366] text-white rounded-xl font-black text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none uppercase tracking-wider"
                >
                  {isPublishingCouncil ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>📢</span>
                  )}
                  <span>GERAR PUBLICIDADE CONSELHO</span>
                </button>
              </div>
            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 bg-white/95 backdrop-blur-md border-t border-slate-200/50 rounded-t-xl select-none flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">🏠</span>
          <span className="text-[10px] font-bold tracking-wide">Início</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-4 py-1 active:scale-90 duration-200 border-none cursor-pointer">
          <span className="text-xl">📋</span>
          <span className="text-[10px] font-bold tracking-wide">Fila</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">👥</span>
          <span className="text-[10px] font-bold tracking-wide">Social</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold tracking-wide">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
