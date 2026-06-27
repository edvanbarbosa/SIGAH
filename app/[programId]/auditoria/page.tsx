// =============================================================================
// app/[programId]/auditoria/page.tsx
// Painel de Auditoria e Transparência Unificado (Passo 30.1).
// Baseado fielmente no Stitch, projeto "DESIGN SIGAH".
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
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  CheckCircle2,
  FileText,
  Clock,
  X,
  Users,
  Info,
  Loader2,
  Home
} from "lucide-react";

interface ActivityLogItem {
  id: string;
  type: "update" | "disqualification" | "batch";
  title: string;
  actor: string;
  role: string;
  time: string;
  detailPayload: string;
}

export default function AuditoriaPainelPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Filtros e Buscas
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("todos");

  // Estatísticas e Métricas
  const [alertsCount, setAlertsCount] = useState(7);
  const [mitigationEfficiency, setMitigationEfficiency] = useState(94);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  // Lista de Logs de Atividades Recentes
  const [logs, setLogs] = useState<ActivityLogItem[]>([
    {
      id: "log-1",
      type: "update",
      title: "Atualização de Cadastro",
      actor: "Ricardo M.",
      role: "Analista Sênior",
      time: "Hoje, 14:22",
      detailPayload: "Alteração de renda declarada da Família Nascimento Rocha de R$ 1.500,00 para R$ 2.800,00. Cruzamento realizado com base de dados do Cadastro Único Federal."
    },
    {
      id: "log-2",
      type: "disqualification",
      title: "Desclassificação",
      actor: "Sistema Automático",
      role: "Regra RF04",
      time: "Hoje, 11:05",
      detailPayload: "Desclassificação automática do candidato Ricardo Silva de Oliveira (Inscrição #4402-B) por confirmação de fraude/abandono local na unidade habitacional."
    },
    {
      id: "log-3",
      type: "batch",
      title: "Auditoria de Lote",
      actor: "Ana Paula L.",
      role: "Coordenação",
      time: "Ontem, 17:45",
      detailPayload: "Homologação de lote de enquadramento contendo 142 beneficiários compatíveis para a remessa da Caixa Econômica Federal."
    }
  ]);

  // Estado do Modal de Detalhe
  const [selectedDetailLog, setSelectedDetailLog] = useState<ActivityLogItem | null>(null);

  // Gerar Link Público (Portaria 738/2024)
  const handleGeneratePublicLink = () => {
    setIsGeneratingLink(true);
    setTimeout(() => {
      setIsGeneratingLink(false);
      setToastMessage("Link de transparência pública copiado para a área de transferência!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  // Filtragem dos Logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.detailPayload.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedType === "todos") return matchesSearch;
    return matchesSearch && log.type === selectedType;
  });

  return (
    <div className="bg-slate-50 text-esplanada-navy font-sans pb-24 md:pb-0 flex flex-col min-h-screen">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-6 md:px-12 pb-12 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Título & Pesquisa */}
            <section className="space-y-4 select-none">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold text-[#001e40] tracking-tight">
                  Auditoria e Transparência
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                  Monitoramento de integridade sistêmica e conformidade com as diretrizes de transparência pública.
                </p>
              </div>

              {/* Controles de Busca */}
              <div className="space-y-3 pt-2 max-w-md">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </span>
                  <input 
                    className="w-full bg-slate-200/60 border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#001e40] font-semibold text-[#001e40]" 
                    placeholder="Buscar por analista, ação ou detalhe..." 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <button 
                  onClick={() => setShowFilters(prev => !prev)}
                  className="w-full bg-slate-200/60 text-[#001e40] font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:bg-slate-200 transition-all cursor-pointer border-none"
                >
                  <Filter className="w-4 h-4 text-[#001e40]" />
                  Filtros Avançados
                </button>

                {showFilters && (
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 animate-fade-in">
                    <span className="font-sans text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                      Tipo de Ação
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {["todos", "update", "disqualification", "batch"].map(type => (
                        <button
                          key={type}
                          onClick={() => setSelectedType(type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer border-none ${
                            selectedType === type
                              ? "bg-[#001e40] text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {type === "todos" ? "Todos" : type === "update" ? "Atualização" : type === "disqualification" ? "Bloqueio" : "Lotes"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Dashboard de Métricas (Assimétrico) */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              
              {/* Alertas de Integridade */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-150/70 relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                      Alertas de Integridade
                    </h3>
                    <span className="text-6xl font-black text-[#001e40] block py-2">
                      {alertsCount.toString().padStart(2, "0")}
                    </span>
                  </div>
                  <div className="bg-amber-100 p-2.5 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-amber-800" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Alertas críticos que requerem atenção imediata da equipe de auditoria.
                </p>
              </div>

              {/* Divergências Resolvidas */}
              <div className="bg-[#001e40] p-6 rounded-2xl shadow-md text-white flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[10px] font-black tracking-widest text-slate-300 uppercase">
                    Divergências Resolvidas
                  </h3>
                  <span className="bg-white/10 text-[9px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5 text-slate-200 shrink-0" />
                    +5.2%
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl font-black">{mitigationEfficiency}%</span>
                    <div className="flex-1 bg-white/20 h-2 rounded-full relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-500" style={{ width: `${mitigationEfficiency}%` }}></div>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-300 font-semibold leading-normal">
                    Eficiência de mitigação de riscos baseada no ciclo operacional corrente.
                  </p>
                </div>
              </div>

            </section>

            {/* Painel Regulatório (Portaria 738/2024) */}
            <section className="bg-slate-100 p-6 rounded-2xl border border-slate-200/60 space-y-6">
              <div className="flex items-start gap-3 select-none">
                <ShieldCheck className="w-6 h-6 text-[#001e40] shrink-0 mt-0.5" />
                <h3 className="text-lg font-black text-[#001e40] leading-tight">
                  Transparência Pública<br />
                  <span className="text-xs text-slate-500 font-semibold">(Portaria 738/2024)</span>
                </h3>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Em conformidade com a Portaria 738/2024, os dados disponibilizados publicamente passam por um processo rigoroso de <strong>anonimização</strong>. Informações sensíveis como CPF, endereços completos e dados socioeconômicos privados são ofuscados para garantir a privacidade do cidadão enquanto mantém a auditabilidade do processo seletivo.
              </p>

              <button 
                onClick={handleGeneratePublicLink}
                disabled={isGeneratingLink}
                className="w-full md:w-auto bg-[#001e40] hover:bg-[#003366] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10 active:scale-95 border-none cursor-pointer"
              >
                {isGeneratingLink ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Gerando Link...</span>
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 text-white shrink-0" />
                    <span>Gerar Link Público</span>
                  </>
                )}
              </button>
            </section>

            {/* Log de Atividades Recentes */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-150/70 overflow-hidden">
              
              <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center select-none">
                <h3 className="font-extrabold text-[#001e40] text-base">Log de Atividades Recentes</h3>
                <button 
                  onClick={() => router.push(`/${programId}/auditoria/logs`)}
                  className="text-blue-600 text-xs font-black hover:underline uppercase tracking-wider border-none bg-transparent cursor-pointer text-right leading-tight"
                >
                  Ver Histórico<br />Completo
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <div key={log.id} className="p-5 space-y-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-xl select-none ${
                        log.type === "update" 
                          ? "bg-blue-50 text-blue-600" 
                          : log.type === "disqualification"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        <FileText className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-[#001e40]">{log.title}</h4>
                        <p className="text-[10px] text-slate-400 font-bold select-none">
                          {log.actor} • <span className="font-semibold text-slate-500">{log.role}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-semibold select-none">
                        {log.time}
                      </span>
                      <button 
                        onClick={() => setSelectedDetailLog(log)}
                        className="text-[10px] font-black border border-slate-200 px-3 py-1.5 rounded-lg text-[#001e40] hover:bg-slate-100 transition-all uppercase tracking-wider border-none bg-transparent cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </section>

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
          href={`/${programId}/auditoria`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <ShieldCheck className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Audit</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <FileText className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Relatórios</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: DETALHES DE LOG DE AUDITORIA
          ========================================== */}
      {selectedDetailLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedDetailLog(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200/50 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Detalhes da Atividade</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setSelectedDetailLog(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 select-none">
                <span className="bg-[#001e40]/10 text-[#001e40] px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  ID: {selectedDetailLog.id}
                </span>
                <span className="text-xs text-slate-400 font-bold">{selectedDetailLog.time}</span>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-[#001e40]">{selectedDetailLog.title}</h4>
                <p className="text-xs text-slate-500 font-bold select-none">
                  Operador: {selectedDetailLog.actor} ({selectedDetailLog.role})
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                <p className="text-xs text-[#001e40] leading-relaxed font-semibold">
                  {selectedDetailLog.detailPayload}
                </p>
              </div>

              <div className="pt-4 select-none">
                <button 
                  onClick={() => setSelectedDetailLog(null)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  FECHAR JANELA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
