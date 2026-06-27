// =============================================================================
// app/[programId]/ciclos/page.tsx
// Tela de Parametrização de Ciclos - Padronizada (Passo 27.1).
// Baseada no mockup do Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import {
  ChevronRight,
  Clock,
  History,
  Calendar,
  Download,
  MoreVertical,
  ShieldCheck,
  Info,
  Plus,
  CheckCircle2,
  X,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Settings,
  Home,
  Users,
  FileText
} from "lucide-react";

interface CycleHistoryItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  subscribers: number;
  status: "Finalizado" | "Arquivado" | "Em Andamento";
}

export default function CiclosParametrizacaoPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estado dos Parâmetros
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [startDate, setStartDate] = useState("2023-11-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [candidatesCount, setCandidatesCount] = useState(12482);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Histórico de Ciclos
  const [cyclesHistory, setCyclesHistory] = useState<CycleHistoryItem[]>([
    {
      id: "cycle-1",
      name: "Ciclo Habitacional 2023.1",
      startDate: "01 Jan 2023",
      endDate: "30 Jun 2023",
      subscribers: 45102,
      status: "Finalizado"
    },
    {
      id: "cycle-2",
      name: "Ciclo Emergencial Enchentes",
      startDate: "15 Out 2022",
      endDate: "15 Dez 2022",
      subscribers: 8430,
      status: "Arquivado"
    }
  ]);

  // Estado do Modal de Novo Ciclo
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCycleName, setNewCycleName] = useState("");
  const [newCycleStart, setNewCycleStart] = useState("");
  const [newCycleEnd, setNewCycleEnd] = useState("");

  // Alternar Status das Inscrições
  const handleToggleSystem = () => {
    setIsSystemActive(prev => !prev);
    setToastMessage(isSystemActive ? "Inscrições encerradas temporariamente." : "Ciclo de inscrições reativado com sucesso!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Salvar Parâmetros
  const handleSaveParams = () => {
    setToastMessage("Parâmetros do ciclo habitacional salvos com sucesso!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Exportar Parâmetros (Gera TXT client-side)
  const handleExportParams = () => {
    setToastMessage("Parâmetros do sistema exportados!");

    const dataText = `==================================================
SIGAH - PARÂMETROS CONFIGURADOS DE CICLO HABITACIONAL
==================================================
Programa Habitacional: ${programId.toUpperCase()}
Status das Inscrições: ${isSystemActive ? "ABERTAS / ATIVO" : "FECHADAS / INATIVO"}
Período do Ciclo Atual:
  - Início: ${startDate}
  - Término: ${endDate}
Total de Inscritos: ${candidatesCount}

HISTÓRICO DE CICLOS ANTERIORES:
${cyclesHistory.map(c => `- ${c.name}\n  Período: ${c.startDate} a ${c.endDate}\n  Inscritos: ${c.subscribers}\n  Status: ${c.status}`).join("\n\n")}

Exportado em: ${new Date().toLocaleTimeString("pt-BR")} - ${new Date().toLocaleDateString("pt-BR")}
==================================================`;

    const blob = new Blob([dataText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `parametros_ciclos_${programId}_${Date.now()}.txt`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lançar Novo Ciclo
  const handleCreateNewCycle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCycleName.trim() || !newCycleStart || !newCycleEnd) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const formatDate = (dateStr: string) => {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const monthIdx = parseInt(parts[1]) - 1;
        return `${parts[2]} ${months[monthIdx]} ${parts[0]}`;
      }
      return dateStr;
    };

    const newCycle: CycleHistoryItem = {
      id: `cycle-${Date.now()}`,
      name: newCycleName,
      startDate: formatDate(newCycleStart),
      endDate: formatDate(newCycleEnd),
      subscribers: 0,
      status: "Em Andamento"
    };

    setCyclesHistory(prev => [newCycle, ...prev]);
    setIsModalOpen(false);
    setNewCycleName("");
    setNewCycleStart("");
    setNewCycleEnd("");

    setToastMessage(`Novo ciclo "${newCycle.name}" criado com sucesso.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-secondary-fixed min-h-screen pb-24 flex flex-col">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto space-y-8 w-full">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho */}
            <section className="space-y-1 select-none">
              <h2 className="text-3xl font-extrabold text-secondary tracking-tight">Parametrização de Ciclos</h2>
              <p className="text-on-surface-variant text-sm">
                Gerencie os períodos de inscrição e a disponibilidade do sistema para novos candidatos.
              </p>
            </section>

            {/* Layout Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Conteúdo Principal */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Painel de Controle */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-sm">
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 select-none">
                    <div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black mb-3 uppercase tracking-wider ${
                        isSystemActive 
                          ? "bg-secondary-container text-on-secondary-container" 
                          : "bg-error-container text-on-error-container"
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          isSystemActive ? "bg-secondary animate-pulse" : "bg-error"
                        }`}></span>
                        {isSystemActive ? "SISTEMA ATIVO" : "SISTEMA INATIVO"}
                      </span>
                      <h3 className="text-lg font-black text-primary">Controle de Inscrições</h3>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-full px-5 border border-outline-variant/30">
                      <span className="font-sans text-[10px] font-black text-on-surface-variant uppercase tracking-wider">
                        Inscrições Abertas
                      </span>
                      <button 
                        onClick={handleToggleSystem}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer border-none ${
                          isSystemActive ? "bg-secondary" : "bg-slate-300"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-250 ${
                          isSystemActive ? "translate-x-6" : "translate-x-1"
                        }`}></span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    
                    {/* Seleção de Datas */}
                    <div className="space-y-4">
                      <label className="block font-sans text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                        Período do Ciclo Atual
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                          <input 
                            className="w-full bg-surface-container-low border-b-2 border-secondary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-all text-primary font-bold" 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                          <span className="text-[9px] text-on-surface-variant mt-1.5 block font-bold select-none uppercase">
                            Data de Início
                          </span>
                        </div>
                        <div className="relative">
                          <input 
                            className="w-full bg-surface-container-low border-b-2 border-secondary focus:ring-0 text-sm py-3 px-4 rounded-t-lg transition-all text-primary font-bold" 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                          <span className="text-[9px] text-on-surface-variant mt-1.5 block font-bold select-none uppercase">
                            Data de Término
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Estatísticas Rápidas */}
                    <div className="bg-secondary-fixed rounded-2xl p-6 flex flex-col justify-center border border-secondary-container/50 shadow-sm select-none">
                      <p className="text-on-secondary-fixed-variant font-sans text-[10px] font-black uppercase tracking-wider mb-1">
                        Candidatos no ciclo atual
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-on-secondary-fixed leading-none">
                          {candidatesCount.toLocaleString("pt-BR")}
                        </span>
                        <span className="text-on-secondary-fixed-variant font-bold text-xs">+12% hoje</span>
                      </div>
                      <div className="w-full bg-on-secondary-fixed/15 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-secondary h-full w-[65%] rounded-full"></div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 pt-6 border-t border-surface-container-high flex justify-end gap-3 select-none">
                    <button 
                      onClick={() => {
                        setStartDate("2023-11-01");
                        setEndDate("2023-12-31");
                      }}
                      className="px-6 py-2.5 text-on-surface-variant hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors border-none bg-transparent cursor-pointer"
                    >
                      Descartar
                    </button>
                    <button 
                      onClick={handleSaveParams}
                      className="px-8 py-2.5 bg-secondary text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98] border-none cursor-pointer"
                    >
                      Salvar Parâmetros
                    </button>
                  </div>

                </div>

                {/* Histórico de Ciclos */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-outline-variant/20 shadow-sm">
                  
                  <div className="flex justify-between items-center mb-6 select-none">
                    <h3 className="text-lg font-black text-primary">Histórico de Ciclos</h3>
                    <button 
                      onClick={handleExportParams}
                      className="text-secondary font-black text-xs uppercase tracking-widest flex items-center gap-1.5 hover:opacity-80 border-none bg-transparent cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-secondary" />
                      Exportar
                    </button>
                  </div>

                  <div className="space-y-4">
                    {cyclesHistory.map(cycle => (
                      <div 
                        key={cycle.id}
                        className="bg-surface-container-lowest p-4 md:p-5 rounded-2xl border border-surface-container-high flex items-center justify-between hover:border-secondary/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-secondary select-none">
                            <History className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-heading font-black text-on-surface text-sm">{cycle.name}</h4>
                            <p className="text-xs text-on-surface-variant font-medium select-none">
                              {cycle.startDate} - {cycle.endDate} • {cycle.subscribers.toLocaleString("pt-BR")} inscritos
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 select-none">
                          <span className={`hidden sm:inline-block text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                            cycle.status === "Finalizado" 
                              ? "bg-slate-100 text-slate-700" 
                              : cycle.status === "Arquivado"
                              ? "bg-slate-200 text-slate-700"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                          }`}>
                            {cycle.status}
                          </span>
                          <button className="p-2 hover:bg-slate-100 rounded-full border-none bg-transparent cursor-pointer">
                            <MoreVertical className="w-4 h-4 text-on-surface-variant" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* Sidebar Contextual */}
              <aside className="lg:col-span-4 space-y-6 select-none">
                
                {/* Integridade do Sistema */}
                <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden shadow-lg shadow-primary-container/10">
                  <div className="relative z-10 space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7 text-secondary-fixed-dim" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-black tracking-tight">Integridade do Sistema</h3>
                      <p className="text-xs text-white/80 leading-relaxed font-semibold">
                        O portal de autoatendimento está operando em capacidade nominal. Todas as APIs de validação de CPF e renda estão conectadas.
                      </p>
                    </div>

                    <ul className="space-y-3 pt-2">
                      <li className="flex items-center gap-3 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed shrink-0"></span>
                        Banco de Dados: Estável
                      </li>
                      <li className="flex items-center gap-3 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed shrink-0"></span>
                        Gateway de Documentos: Ativo
                      </li>
                      <li className="flex items-center gap-3 text-[11px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed shrink-0"></span>
                        Servidor de Autenticação: 99.9% Uptime
                      </li>
                    </ul>
                  </div>

                  <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                </div>

                {/* Diretrizes de Parametrização */}
                <div className="bg-white rounded-2xl p-6 border border-surface-container-high shadow-sm space-y-5">
                  <h4 className="font-heading font-black text-primary text-sm flex items-center gap-2">
                    <Info className="w-4.5 h-4.5 text-secondary shrink-0" />
                    Diretrizes de Parametrização
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                      <p className="text-[10px] font-black text-primary mb-1 uppercase tracking-wider">
                        Impacto na Publicidade
                      </p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        Alterar as datas do ciclo atualizará automaticamente o cronograma oficial no portal público.
                      </p>
                    </div>
                    <div className="p-4 bg-surface-container-low rounded-xl border border-surface-container-high">
                      <p className="text-[10px] font-black text-primary mb-1 uppercase tracking-wider">
                        Bloqueio Manual
                      </p>
                      <p className="text-xs text-on-surface-variant leading-relaxed">
                        O fechamento manual interrompe sessões ativas de preenchimento imediatamente.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Accent Image Card */}
                <div className="rounded-2xl overflow-hidden border border-surface-container-high h-48 relative shadow-sm">
                  <img 
                    alt="Sede Administrativa Central" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwi8oJJ5thJNHr818TIkinNYKKawLjPlfJo-T1sDxJtAm--sjYq9sfa3Tcss6I6v3KmIsFU_akQQPaGREvvCjKmVkH-MPgA6LT19351BGCIwigXHXRw-hzk2EMx5Geunv4US53WEMr-Cvp4iELvJJYoVFoF8PVjObk_y-0Nf8WzZ_C9dJt-OIO-RKAy8c9oSvHLED3zH3MuS0A-QZwCAYh8xLlchS0N2YnmQaVRt1uqf5wcsjIksj7wQAR9xOj1ndq5FAKgiHB-NM"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end p-4">
                    <span className="text-white text-[9px] font-black uppercase tracking-wider">
                      Sede Administrativa Central - Brasília, DF
                    </span>
                  </div>
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
          href={`/${programId}/classificacao`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Fila</span>
        </a>
        <a 
          href={`/${programId}/ciclos`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Settings className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Painel</span>
        </a>
      </nav>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-secondary text-white rounded-full shadow-lg shadow-secondary/35 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 border-none cursor-pointer"
      >
        <Plus className="w-7 h-7 text-white" />
      </button>

      {/* ==========================================
          MODAL: NOVO CICLO
          ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-primary">Registrar Novo Ciclo</h3>
              <button 
                className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateNewCycle} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Nome do Ciclo Habitacional
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  placeholder="Ex: Ciclo Habitacional 2024.1, Ciclo Emergencial..."
                  value={newCycleName}
                  onChange={(e) => setNewCycleName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Data de Início
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  type="date"
                  value={newCycleStart}
                  onChange={(e) => setNewCycleStart(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Data de Término
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  type="date"
                  value={newCycleEnd}
                  onChange={(e) => setNewCycleEnd(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-on-surface-variant font-black text-xs border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  CONFIRMAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
