// =============================================================================
// app/[programId]/auditoria/logs/page.tsx
// Tela de Logs de Auditoria - Otimizado para Mobile (Passo 30.1).
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
  Calendar,
  Search,
  User,
  ShieldCheck,
  Download,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  X,
  Home,
  Users,
  FileText
} from "lucide-react";

interface AuditLogRecord {
  id: string;
  timestamp: string;
  time: string;
  executor: string;
  executorBadge: string;
  action: string;
  actionType: "cadastro" | "designacao" | "bloqueio" | "export";
  details: string;
  status: "success" | "warning";
  disqualified?: boolean;
}

export default function AuditoriaLogsPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Filtros
  const [dateRange, setDateRange] = useState("01/10/2023 - 31/10/2023");
  const [executorSearch, setExecutorSearch] = useState("");
  const [selectedModule, setSelectedModule] = useState("Todos os Módulos");

  // Estados de Paginação e Loader
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [disqualifyingId, setDisqualifyingId] = useState<string | null>(null);

  // Lista Mutável de Logs
  const [logsList, setLogsList] = useState<AuditLogRecord[]>([
    {
      id: "8829-RA",
      timestamp: "24 Out, 2023",
      time: "14:32:15",
      executor: "ID: 8829-RA",
      executorBadge: "RA",
      action: "Cadastro Alterado",
      actionType: "cadastro",
      details: "Alteração de renda bruta familiar de R$ 2.400 para R$ 3.100 no prontuário #9902.",
      status: "success",
      disqualified: false
    },
    {
      id: "1021-GL",
      timestamp: "24 Out, 2023",
      time: "14:15:02",
      executor: "ID: 1021-GL",
      executorBadge: "GL",
      action: "Unidade Designada",
      actionType: "designacao",
      details: "Vínculo da Unidade Habitacional Bloco C - Apto 402 ao beneficiário Carlos Silva.",
      status: "success",
      disqualified: false
    },
    {
      id: "system-bot",
      timestamp: "24 Out, 2023",
      time: "13:58:44",
      executor: "SYSTEM-BOT",
      executorBadge: "SIS",
      action: "Acesso Bloqueado",
      actionType: "bloqueio",
      details: "Tentativa de login falha consecutiva detectada no IP: 192.168.1.45. Acesso bloqueado por 30min.",
      status: "warning"
    },
    {
      id: "5541-JF",
      timestamp: "24 Out, 2023",
      time: "12:10:11",
      executor: "ID: 5541-JF",
      executorBadge: "JF",
      action: "Exportação Realizada",
      actionType: "export",
      details: "Exportação de base completa de beneficiários solicitada pelo gestor de área.",
      status: "success"
    }
  ]);

  // Exportar Dataset CSV
  const handleExportCSV = () => {
    setToastMessage("Preparando remessa do dataset para download...");
    
    setTimeout(() => {
      const csvHeader = "ID,Timestamp,Time,Executor,Acao,Detalhes,Status\n";
      const csvRows = logsList.map(log => 
        `"${log.id}","${log.timestamp}","${log.time}","${log.executor}","${log.action}","${log.details.replace(/"/g, '""')}","${log.status}"`
      ).join("\n");
      
      const blob = new Blob([csvHeader + csvRows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `auditoria_logs_${programId}_${Date.now()}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setToastMessage("Dataset exportado com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
  };

  // Filtragem local
  const handleFilter = () => {
    setIsLoadingPage(true);
    setTimeout(() => {
      setIsLoadingPage(false);
      setToastMessage("Filtros aplicados com sucesso.");
      setTimeout(() => setToastMessage(null), 2500);
    }, 800);
  };

  // Alteração de página
  const handlePageChange = (page: number) => {
    setIsLoadingPage(true);
    setCurrentPage(page);
    setTimeout(() => {
      setIsLoadingPage(false);
    }, 600);
  };

  // Desclassificar por Fraude
  const handleDisqualify = (logId: string) => {
    setDisqualifyingId(logId);
    setTimeout(() => {
      setLogsList(prev => prev.map(item => {
        if (item.id === logId) {
          return { ...item, disqualified: true };
        }
        return item;
      }));
      setDisqualifyingId(null);
      setToastMessage("Candidato desclassificado com log de integridade cadastrado.");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  const filteredLogs = logsList.filter(log => {
    if (executorSearch) {
      return log.executor.toLowerCase().includes(executorSearch.toLowerCase()) || 
             log.details.toLowerCase().includes(executorSearch.toLowerCase());
    }
    return true;
  });

  return (
    <div className="bg-slate-50 text-primary pb-24 flex flex-col min-h-screen font-sans">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-6 md:space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota com Breadcrumb */}
            <div className="space-y-1 select-none">
              <nav className="flex items-center gap-2 text-on-surface-variant text-[10px] font-black uppercase tracking-widest">
                <span>Auditoria</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-primary font-black">Histórico de Rastreabilidade</span>
              </nav>
              <h2 className="text-2xl font-black text-[#001e40]">Logs de Rastreabilidade</h2>
            </div>

            {/* Bento Grid Header */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
              
              {/* Insight de Integridade */}
              <div className="lg:col-span-8 bg-white p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[240px] border border-slate-100 shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8"></div>
                <div className="relative z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2 block">
                    Visão Institucional
                  </span>
                  <h3 className="text-2xl font-headline font-black text-[#001e40] leading-tight">
                    Monitoramento de Integridade em Tempo Real
                  </h3>
                  <p className="text-slate-500 text-xs mt-3 max-w-md leading-relaxed font-semibold">
                    Rastreamento contínuo de todas as modificações no sistema habitacional, garantindo total transparência e conformidade regulatória.
                  </p>
                </div>
                <div className="flex gap-6 mt-8">
                  <div className="flex flex-col">
                    <span className="text-2xl font-headline font-black text-[#001e40]">2.4k</span>
                    <span className="text-[9px] uppercase font-black text-slate-400">Logs hoje</span>
                  </div>
                  <div className="w-[1px] bg-slate-200 h-10"></div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-headline font-black text-[#001e40]">99.9%</span>
                    <span className="text-[9px] uppercase font-black text-slate-400">Sincronia</span>
                  </div>
                </div>
              </div>

              {/* Card de Exportação Dataset */}
              <div className="lg:col-span-4 bg-primary-container p-8 rounded-3xl text-white flex flex-col justify-between border border-[#003366] shadow-md">
                <div>
                  <Download className="w-10 h-10 text-secondary" />
                  <h4 className="text-lg font-headline font-black mt-4">Extração de Evidências</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Gere relatórios certificados para auditorias externas e conselhos fiscais.
                  </p>
                </div>
                <button 
                  onClick={handleExportCSV}
                  className="w-full mt-6 bg-[#0059bb] hover:bg-secondary text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all border-none cursor-pointer"
                >
                  EXPORTAR DATASET (.CSV)
                </button>
              </div>

            </section>

            {/* Filtros Avançados */}
            <section className="bg-slate-100 p-6 rounded-3xl grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-slate-200/50 select-none">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">
                  Período
                </label>
                <div className="bg-white px-4 py-2 rounded-xl flex items-center space-x-2 border-b-2 border-primary">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 text-xs w-full text-primary font-bold" 
                    placeholder="01/10/2023 - 31/10/2023" 
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">
                  Usuário / ID
                </label>
                <div className="bg-white px-4 py-2 rounded-xl flex items-center space-x-2 border-b-2 border-primary/20 focus-within:border-primary">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 text-xs w-full text-primary font-bold" 
                    placeholder="Pesquisar executor..." 
                    type="text"
                    value={executorSearch}
                    onChange={(e) => setExecutorSearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">
                  Módulo
                </label>
                <div className="bg-white px-4 py-2 rounded-xl flex items-center space-x-2 border-b-2 border-primary/20">
                  <select 
                    value={selectedModule}
                    onChange={(e) => setSelectedModule(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-xs w-full text-primary font-bold appearance-none py-0"
                  >
                    <option>Todos os Módulos</option>
                    <option>Cadastro</option>
                    <option>Financeiro</option>
                    <option>Infraestrutura</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleFilter}
                className="bg-primary text-white hover:bg-primary-container px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors border-none cursor-pointer"
              >
                Filtrar
              </button>
            </section>

            {/* Listagem de Logs */}
            <section className="space-y-4">
              
              <div className="flex justify-between items-center px-4 select-none">
                <h3 className="font-headline font-black text-lg text-[#001e40]">Cronologia de Ações</h3>
                <span className="text-xs font-semibold text-slate-400">
                  Exibindo {filteredLogs.length} de 15.432 logs
                </span>
              </div>

              {isLoadingPage ? (
                <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border border-slate-100 shadow-sm select-none gap-3">
                  <Loader2 className="w-8 h-8 text-secondary animate-spin" />
                  <span className="text-xs font-bold text-slate-400">Carregando cronologia de logs...</span>
                </div>
              ) : (
                <div className="bg-slate-200/50 rounded-3xl overflow-hidden shadow-sm border border-slate-200">
                  
                  {/* Cabeçalho da Tabela - Desktop */}
                  <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden md:grid select-none">
                    <div className="col-span-2">Timestamp</div>
                    <div className="col-span-2">Usuário</div>
                    <div className="col-span-3">Ação Realizada</div>
                    <div className="col-span-4">Detalhes da Mudança</div>
                    <div className="col-span-1 text-right">Status</div>
                  </div>

                  {/* Linhas de Logs */}
                  <div className="divide-y divide-slate-200">
                    {filteredLogs.map(log => (
                      <div 
                        key={log.id} 
                        className="flex flex-col md:grid md:grid-cols-12 gap-4 p-6 md:px-8 bg-white items-start md:items-center hover:bg-slate-50 transition-colors duration-200"
                      >
                        {/* Timestamp */}
                        <div className="col-span-2 flex flex-col w-full select-none">
                          <span className="text-sm font-black text-[#001e40]">{log.timestamp}</span>
                          <span className="text-[10px] text-slate-400 font-bold">{log.time}</span>
                        </div>

                        {/* Usuário */}
                        <div className="col-span-2 flex items-center space-x-2 w-full select-none">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-secondary border border-slate-250">
                            {log.executorBadge}
                          </div>
                          <span className="text-xs font-bold text-primary">{log.executor}</span>
                        </div>

                        {/* Ação */}
                        <div className="col-span-3 w-full select-none">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            log.actionType === "cadastro"
                              ? "bg-blue-100 text-blue-800"
                              : log.actionType === "designacao"
                              ? "bg-amber-100 text-amber-800"
                              : log.actionType === "bloqueio"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {log.action}
                          </span>
                        </div>

                        {/* Detalhes */}
                        <div className="col-span-4 w-full">
                          <p className="text-xs text-slate-500 leading-relaxed mb-2 font-medium">
                            {log.details}
                          </p>
                          <div className="flex gap-2 flex-wrap items-center">
                            <span className="px-2 py-0.5 rounded text-[8px] font-black bg-slate-100 text-slate-400 uppercase tracking-widest select-none">
                              • Ao Imutável
                            </span>
                            <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest select-none">
                              ✓ Auditado
                            </span>
                            
                            {(log.actionType === "cadastro" || log.actionType === "designacao") && (
                              <>
                                {log.disqualified ? (
                                  <span className="ml-auto text-[8px] font-black text-rose-700 bg-rose-50 border border-rose-100 rounded px-2.5 py-1 uppercase tracking-wider select-none">
                                    Desclassificado
                                  </span>
                                ) : (
                                  <button 
                                    onClick={() => handleDisqualify(log.id)}
                                    disabled={disqualifyingId === log.id}
                                    className="ml-auto px-3 py-1 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-700 rounded text-[9px] font-black uppercase transition-colors duration-150 border-none cursor-pointer flex items-center gap-1"
                                  >
                                    {disqualifyingId === log.id ? (
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                      <span>Desclassificar por Fraude</span>
                                    )}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Status Check Icon */}
                        <div className="col-span-1 text-right w-full hidden md:flex justify-end select-none">
                          {log.status === "success" ? (
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-rose-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* Paginador */}
              <div className="flex justify-center space-x-2 pt-4 select-none">
                <button 
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-primary active:scale-95 transition-all border-none cursor-pointer disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {[1, 2, 3].map(page => (
                  <button 
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-xl font-bold text-xs transition-all border-none cursor-pointer ${
                      currentPage === page 
                        ? "bg-primary text-white shadow-md" 
                        : "bg-white text-primary hover:bg-slate-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => currentPage < 3 && handlePageChange(currentPage + 1)}
                  disabled={currentPage === 3}
                  className="w-10 h-10 rounded-xl bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-primary active:scale-95 transition-all border-none cursor-pointer disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
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

    </div>
  );
}
