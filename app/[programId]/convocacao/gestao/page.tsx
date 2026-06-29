// =============================================================================
// app/[programId]/convocacao/gestao/page.tsx
// Gestão de Convocação - Padronizada por Referência (Passo 3.2).
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
  Search,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Calendar,
  Clock,
  Home,
  MessageSquare,
  Users,
  Settings,
  X,
  Loader2,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  PlusCircle,
  RefreshCw,
  Eye,
  FileText
} from "lucide-react";

interface CandidateConv {
  id: string;
  inscription: string;
  name: string;
  status: "convocado" | "aprovado" | "nao_compareceu" | "aguardando";
  statusText: string;
  statusBg: string;
  statusTextClass: string;
  detail: string;
  icon: React.ComponentType<any>;
  iconClass: string;
  isUrgent?: boolean;
}

export default function GestaoConvocacaoReferenciaPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "convocado" | "aprovado" | "nao_compareceu" | "aguardando">("todos");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateConv | null>(null);

  // Métricas
  const [waitingCount, setWaitingCount] = useState(1284);
  const [convokedCount, setConvokedCount] = useState(452);
  const [todayExpirations, setTodayExpirations] = useState(18);

  // Lista de Candidatos
  const [candidates, setCandidates] = useState<CandidateConv[]>([
    {
      id: "c-ana",
      inscription: "#00842-24",
      name: "Ana Beatriz Silveira",
      status: "convocado",
      statusText: "Convocado",
      statusBg: "bg-amber-50 text-amber-800 border-amber-200",
      statusTextClass: "text-amber-800",
      detail: "Expira em 3 dias",
      icon: Calendar,
      iconClass: "text-amber-600"
    },
    {
      id: "c-carlos",
      inscription: "#00791-24",
      name: "Carlos Eduardo Mendes",
      status: "aprovado",
      statusText: "Aprovado",
      statusBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      statusTextClass: "text-emerald-800",
      detail: "Documentação entregue",
      icon: CheckCircle2,
      iconClass: "text-emerald-600"
    },
    {
      id: "c-mariana",
      inscription: "#00755-24",
      name: "Mariana Souza Rocha",
      status: "nao_compareceu",
      statusText: "Não Compareceu",
      statusBg: "bg-red-50 text-red-800 border-red-200",
      statusTextClass: "text-red-650",
      detail: "Prazo encerrado",
      icon: AlertCircle,
      iconClass: "text-red-600",
      isUrgent: true
    },
    {
      id: "c-ricardo",
      inscription: "#00912-24",
      name: "Ricardo Oliveira",
      status: "aguardando",
      statusText: "Aguardando",
      statusBg: "bg-slate-50 text-slate-650 border-slate-200",
      statusTextClass: "text-slate-500",
      detail: "Próximo na fila",
      icon: Hourglass,
      iconClass: "text-slate-400"
    }
  ]);

  // Filtrar Lista
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.inscription.includes(searchQuery);
    const matchesStatus = statusFilter === "todos" ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Convocar Próximo
  const handleConvokeNext = () => {
    setIsProcessing(true);
    setToastMessage("Selecionando próximo candidato qualificado da fila...");
    setTimeout(() => {
      setIsProcessing(false);
      setWaitingCount(prev => prev - 1);
      setConvokedCount(prev => prev + 1);

      const newCand: CandidateConv = {
        id: `c-novo-${Date.now()}`,
        inscription: `#00915-24`,
        name: "Fernanda Cristina Melo",
        status: "convocado",
        statusText: "Convocado",
        statusBg: "bg-amber-50 text-amber-800 border-amber-200",
        statusTextClass: "text-amber-800",
        detail: "Expira em 5 dias",
        icon: Calendar,
        iconClass: "text-amber-600"
      };

      setCandidates(prev => [newCand, ...prev]);
      setToastMessage("Fernanda Cristina Melo convocada com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  // Reconvocar Suplente
  const handleReconvokeAlternate = () => {
    setIsProcessing(true);
    setToastMessage("Buscando suplente imediato na lista de reclassificados...");
    setTimeout(() => {
      setIsProcessing(false);

      const newCand: CandidateConv = {
        id: `c-suplente-${Date.now()}`,
        inscription: `#00940-24`,
        name: "Roberto Silveira Santos",
        status: "convocado",
        statusText: "Convocado",
        statusBg: "bg-amber-50 text-amber-800 border-amber-200",
        statusTextClass: "text-amber-800",
        detail: "Reconvocado (Suplente)",
        icon: Calendar,
        iconClass: "text-amber-600"
      };

      setCandidates(prev => [newCand, ...prev]);
      setToastMessage("Suplente Roberto Silveira Santos convocado!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  return (
    <div className="bg-surface text-primary min-h-screen pb-48 md:pb-0 flex flex-col font-sans">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:p-10 max-w-lg mx-auto w-full space-y-6">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Dashboard Header */}
            <section className="space-y-4">
              
              {/* Back to Deadline/Convocacao Status link */}
              <button 
                onClick={() => router.push(`/${programId}/convocacao`)}
                className="flex items-center gap-1.5 text-secondary font-black text-[10px] uppercase tracking-widest bg-transparent border-none hover:underline cursor-pointer"
              >
                ← Voltar ao Status de Convocação
              </button>

              <h1 className="text-2xl font-black text-primary font-heading tracking-tight select-none">
                Convocação de Candidatos
              </h1>

              {/* Bento Grid Metrics */}
              <div className="grid grid-cols-2 gap-3 select-none">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-secondary flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Aguardando</span>
                  <span className="text-2xl font-black text-[#001e40]">
                    {waitingCount.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-[#001e40] flex flex-col gap-1">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Convocados</span>
                  <span className="text-2xl font-black text-[#001e40]">
                    {convokedCount.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="col-span-2 bg-amber-100 p-4 rounded-xl shadow-sm border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[#5c3e00] text-[10px] font-black uppercase tracking-wider">Vencimento Hoje</span>
                    <div className="text-lg font-black text-[#5c3e00]">{todayExpirations} Processos</div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                </div>
              </div>
            </section>

            {/* Search and Filter */}
            <section className="space-y-3 select-none">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome ou CPF..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-secondary/20 text-xs font-bold text-slate-700 transition-all"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setStatusFilter("todos")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap flex items-center gap-1 cursor-pointer border-none ${
                    statusFilter === "todos" ? "bg-secondary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  <span>Todos</span>
                  <Filter className="w-3 h-3 shrink-0" />
                </button>
                <button 
                  onClick={() => setStatusFilter("convocado")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap cursor-pointer border-none ${
                    statusFilter === "convocado" ? "bg-secondary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Convocados
                </button>
                <button 
                  onClick={() => setStatusFilter("aprovado")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap cursor-pointer border-none ${
                    statusFilter === "aprovado" ? "bg-secondary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Aprovados
                </button>
                <button 
                  onClick={() => setStatusFilter("nao_compareceu")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap cursor-pointer border-none ${
                    statusFilter === "nao_compareceu" ? "bg-secondary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  Não Compareceu
                </button>
              </div>
            </section>

            {/* Candidate List */}
            <section className="space-y-4">
              {filteredCandidates.map(cand => {
                const IconComponent = cand.icon;
                return (
                  <div 
                    key={cand.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border border-slate-200 border-b-4 hover:shadow-md transition-all ${
                      cand.status === "nao_compareceu" ? "border-b-red-500/50" : "border-b-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3 select-none">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Inscrição: {cand.inscription}</span>
                        <h3 className="text-base font-black text-[#001e40] mt-0.5">{cand.name}</h3>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] font-black uppercase rounded-lg tracking-wider border ${cand.statusBg}`}>
                        {cand.statusText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className={`flex items-center gap-1 select-none ${cand.status === "nao_compareceu" ? "text-red-650" : "text-slate-500"}`}>
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <span>{cand.detail}</span>
                      </div>

                      <button 
                        onClick={() => setSelectedCandidate(cand)}
                        className="text-secondary font-black bg-transparent border-none hover:underline cursor-pointer flex items-center gap-1 text-[11px] uppercase tracking-wider"
                      >
                        <span>Ver Detalhes</span>
                        <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Floating Action Panel (Fixed Bottom Layout) */}
            <div className="fixed bottom-20 left-0 w-full px-4 z-40 pointer-events-none md:relative md:bottom-auto md:px-0 select-none">
              <div className="max-w-lg mx-auto flex flex-col gap-3 pointer-events-auto">
                <button 
                  onClick={handleConvokeNext}
                  disabled={isProcessing}
                  className="w-full bg-secondary hover:bg-secondary-container text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98] transition-all border-none cursor-pointer"
                >
                  <PlusCircle className="w-4.5 h-4.5 text-white shrink-0" />
                  <span>Convocar Próximo Candidato</span>
                </button>
                <button 
                  onClick={handleReconvokeAlternate}
                  disabled={isProcessing}
                  className="w-full bg-[#001e40] hover:bg-[#003366] text-white py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all border-none cursor-pointer opacity-90"
                >
                  <RefreshCw className="w-4.5 h-4.5 text-white shrink-0 animate-spin-hover" />
                  <span>Reconvocar Suplente</span>
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
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/95 dark:bg-[#001e40]/95 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Home className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/convocacao/gestao`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <FileText className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Fila</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Histórico</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL DETALHE DO CANDIDATO SELECIONADO
          ========================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCandidate(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Detalhes da Convocação</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setSelectedCandidate(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 select-none">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[8px] font-black text-secondary bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit block">
                  Identificação do Processo
                </span>
                <p className="text-xs font-black text-[#001e40]">{selectedCandidate.name}</p>
                <p className="text-[10px] text-slate-550 font-bold">Inscrição: {selectedCandidate.inscription}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[8px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit block">
                  Status Atual e Prazos
                </span>
                <p className="text-xs font-black text-[#001e40] capitalize">{selectedCandidate.statusText}</p>
                <p className="text-[10px] text-slate-550 font-bold">{selectedCandidate.detail}</p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  Fechar Detalhes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
