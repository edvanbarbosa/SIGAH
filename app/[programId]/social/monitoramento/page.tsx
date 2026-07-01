// =============================================================================
// app/[programId]/social/monitoramento/page.tsx
// Monitoramento Condominial - Padronização Final (Passo 30.1).
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
  PlusCircle,
  TrendingUp,
  AlertTriangle,
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
  Check,
  CheckCircle2,
  AlertCircle,
  Plus,
  Compass,
  ArrowUpRight,
  FileText,
  HelpCircle,
  Wrench,
  Activity,
  HeartHandshake,
  ShieldAlert,
  UserCheck,
  Building,
  UserX,
  Info
} from "lucide-react";

interface SocialActivity {
  id: string;
  title: string;
  dateTime: string;
  description: string;
  facilitator: string;
  location: string;
  icon: React.ComponentType<any>;
  statusText?: string;
}

interface PendingAction {
  id: string;
  title: string;
  description: string;
  statusColor: string; // bg-secondary, bg-tertiary-container, bg-secondary-container
  actions: string[];
}

export default function MonitoramentoCondominialPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados de Métricas
  const [engagementPct, setEngagementPct] = useState(84);
  const [conflictCount, setConflictCount] = useState(8);
  const [maintenancePct, setMaintenancePct] = useState(92);

  // Atividades
  const [activities, setActivities] = useState<SocialActivity[]>([
    {
      id: "act-recycling",
      title: "Oficina de Reciclagem Comunitária",
      dateTime: "Ontem, 14:00",
      description: "Participação de 25 famílias do Bloco B. Foco em separação de resíduos sólidos e geração de renda.",
      facilitator: "João Pedro",
      location: "Salão Comunitário",
      icon: Users
    },
    {
      id: "act-mediation",
      title: "Assembleia de Mediação de Conflitos",
      dateTime: "12 Mai, 19:30",
      description: "Reunião para tratar questões de ruído e uso de áreas comuns no Bloco D. Acordos estabelecidos.",
      facilitator: "--",
      location: "--",
      icon: HeartHandshake,
      statusText: "Concluído"
    }
  ]);

  // Ações Pendentes
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([
    {
      id: "act-visit",
      title: "Visita Técnica: Unidade 204",
      description: "Verificar vulnerabilidade social relatada por vizinhos.",
      statusColor: "bg-secondary",
      actions: ["Atender", "Adiar"]
    },
    {
      id: "act-debt",
      title: "Relatório de Inadimplência",
      description: "Cruzar dados financeiros com perfil socioeconômico.",
      statusColor: "bg-tertiary-container",
      actions: ["Gerar PDF"]
    },
    {
      id: "act-enxovais",
      title: "Entrega de Enxovais",
      description: "3 gestoras cadastradas para o projeto 'Bem Nascer'.",
      statusColor: "bg-secondary-container",
      actions: ["Agendar"]
    }
  ]);

  // inputs nova ocorrência
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Registrar ocorrência
  const handleCreateOccurrence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;

    setIsProcessing(true);
    setToastMessage("Registrando ocorrência social no prontuário...");
    setTimeout(() => {
      setIsProcessing(false);
      setShowAddModal(false);

      // incrementa conflitos se for do tipo conflito
      setConflictCount(prev => prev + 1);

      const newAct: SocialActivity = {
        id: `act-${Date.now()}`,
        title: newTitle,
        dateTime: "Agora mesmo",
        description: newDesc,
        facilitator: "Ana Silva",
        location: "Administração",
        icon: ShieldAlert
      };

      setActivities(prev => [newAct, ...prev]);
      setNewTitle("");
      setNewDesc("");
      setToastMessage(`Ocorrência "${newTitle}" registrada com sucesso!`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Ações de botões rápidos
  const handleExecuteAction = (actionId: string, actionName: string) => {
    setToastMessage(`Iniciando ação "${actionName}" para o item selecionado...`);
    setTimeout(() => {
      setToastMessage(`Ação "${actionName}" executada e registrada!`);
      setPendingActions(prev => prev.filter(p => p.id !== actionId));
      setTimeout(() => setToastMessage(null), 3000);
    }, 1000);
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
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                  <span>Trabalho Social</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  <span className="text-secondary font-black">Monitoramento Condominial</span>
                </nav>
                <h1 className="text-3xl font-black text-primary tracking-tight mt-2 select-none">
                  Monitoramento Condominial
                </h1>
                <p className="text-slate-500 text-xs mt-1 font-semibold select-none leading-relaxed">
                  Análise e acompanhamento das dinâmicas sociais e infraestruturais do Residencial Parque das Flores.
                </p>
              </div>

              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-secondary hover:brightness-110 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all border-none select-none"
              >
                <PlusCircle className="w-5 h-5 text-white" />
                Registrar Ocorrência Social
              </button>
            </div>

            {/* Bento Grid Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
              
              {/* Engajamento Social */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 border-b-4 border-b-secondary flex flex-col justify-between h-48 shadow-sm">
                <div className="flex justify-between items-start">
                  <Users className="w-8 h-8 text-secondary shrink-0" />
                  <span className="text-[9px] font-black text-secondary uppercase tracking-wider border border-blue-100 bg-blue-50 px-2.5 py-0.5 rounded-md">Métrica</span>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Engajamento Social</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-[#001e40]">{engagementPct}%</span>
                    <span className="text-emerald-700 font-black text-xs">+12% este mês</span>
                  </div>
                </div>
              </div>

              {/* Conflitos Registrados */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 border-b-4 border-b-amber-600 flex flex-col justify-between h-48 shadow-sm">
                <div className="flex justify-between items-start">
                  <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
                  <span className="text-[9px] font-black text-amber-800 uppercase tracking-wider border border-amber-200 bg-amber-50 px-2.5 py-0.5 rounded-md">Crítico</span>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Conflitos Registrados</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-[#001e40]">{conflictCount.toString().padStart(2, "0")}</span>
                    <span className="text-amber-700 font-black text-xs">4 em mediação</span>
                  </div>
                </div>
              </div>

              {/* Manutenção Preventiva */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 border-b-4 border-b-[#001e40] flex flex-col justify-between h-48 shadow-sm">
                <div className="flex justify-between items-start">
                  <Wrench className="w-8 h-8 text-primary shrink-0" />
                  <span className="text-[9px] font-black text-primary uppercase tracking-wider border border-slate-200 bg-slate-100 px-2.5 py-0.5 rounded-md">Operacional</span>
                </div>
                <div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">Manutenção Preventiva</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-[#001e40]">{maintenancePct}%</span>
                    <span className="text-slate-500 font-black text-xs">Concluído</span>
                  </div>
                </div>
              </div>

            </section>

            {/* Asymmetric Panels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Social Activities (8 cols) */}
              <div className="lg:col-span-8 space-y-8">
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between select-none">
                    <h2 className="text-lg font-black text-[#001e40] uppercase tracking-wide">Atividades Sociais Recentes</h2>
                    <button 
                      onClick={() => {
                        setToastMessage("Carregando todas as ocorrências passadas...");
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="text-secondary font-black bg-transparent border-none hover:underline cursor-pointer flex items-center gap-1 text-[11px] uppercase tracking-wider"
                    >
                      <span>Ver todas</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {activities.map(act => {
                      const IconComponent = act.icon;
                      return (
                        <div 
                          key={act.id}
                          className="group bg-slate-50 hover:bg-slate-100 p-6 rounded-2xl border border-slate-200/50 transition-all flex gap-6 items-start"
                        >
                          <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center select-none border border-slate-200/40 text-secondary">
                            <IconComponent className="w-6 h-6" />
                          </div>

                          <div className="flex-1">
                            <div className="flex justify-between items-start select-none">
                              <h3 className="font-black text-base text-[#001e40] group-hover:text-secondary transition-colors">
                                {act.title}
                              </h3>
                              <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200/60 px-2 py-1 rounded-md">
                                {act.dateTime}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 font-semibold mt-2 leading-relaxed">
                              {act.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-wider text-slate-650 select-none">
                              {act.statusText ? (
                                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                  <Check className="w-3.5 h-3.5" />
                                  Status: {act.statusText}
                                </span>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1 bg-white border border-slate-200/60 px-2.5 py-1 rounded-md">
                                    Facilitador: {act.facilitator}
                                  </span>
                                  <span className="flex items-center gap-1 bg-white border border-slate-200/60 px-2.5 py-1 rounded-md">
                                    Local: {act.location}
                                  </span>
                                </>
                              )}
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Banner / Próximo Evento */}
                <div className="relative h-64 rounded-2xl overflow-hidden shadow-md border border-slate-200 select-none">
                  <img 
                    alt="Community Workshop" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWC-j6LiqFJ416vVkM-5gHPy5V2MSsT2Odso2aD7SY6j97NlwVXzRDBIjnXKZB4rt6YUNl9-2ShKj7JU74osyvRFTG6q0Uny1xm8WZ9NA32k7QeqJ_2jdWt5Q27MRyzEjPTsZJBPeVFubDmNsKbU2TkY5b3s1ts9FYg76ayxcEYtOvKvlCgEvGab-ZkprLNwDk6j1BIyJt1qvoF01Mx-qC9orE6taMAQFZyhfVBwSysgP_c_-7FcOkH7g0TparLrYUioS6iULoCVQ" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001e40]/90 via-[#001e40]/40 to-transparent flex items-end p-8">
                    <div className="text-white space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-secondary bg-blue-50/10 px-2 py-0.5 rounded w-fit">
                        Próximo Evento
                      </p>
                      <h3 className="font-heading font-black text-2xl">Dia de Ação Coletiva: Plantio Urbano</h3>
                      <p className="opacity-90 text-xs font-semibold">Sábado, 09:00 - Área de Lazer Central</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Pending Actions & Support (4 cols) */}
              <aside className="lg:col-span-4 space-y-8 select-none">
                
                <div className="space-y-6">
                  <h2 className="text-lg font-black text-[#001e40] uppercase tracking-wide">Ações Pendentes</h2>

                  <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 space-y-6">
                    {pendingActions.map((act, index) => (
                      <div key={act.id} className="space-y-3">
                        <div className="flex gap-3">
                          <div className={`w-1.5 h-10 rounded-full shrink-0 ${act.statusColor}`}></div>
                          <div>
                            <p className="font-black text-sm text-primary leading-none">{act.title}</p>
                            <p className="text-[10px] text-slate-500 font-semibold mt-1.5">{act.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pl-4.5">
                          {act.actions.map(btn => (
                            <button 
                              key={btn}
                              onClick={() => handleExecuteAction(act.id, btn)}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer transition-all border-none ${
                                btn === "Atender" || btn === "Gerar PDF" || btn === "Agendar"
                                  ? "bg-secondary text-white hover:opacity-90"
                                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                              }`}
                            >
                              {btn}
                            </button>
                          ))}
                        </div>

                        {index < pendingActions.length - 1 && (
                          <div className="h-px bg-slate-200/60 mt-4"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suporte Técnico Card */}
                <div className="bg-[#001e40] p-8 rounded-3xl text-white relative overflow-hidden group space-y-4">
                  <div className="relative z-10 space-y-3">
                    <h3 className="font-heading font-black text-lg">Suporte Técnico SIGAH</h3>
                    <p className="text-[10px] text-slate-300 font-semibold leading-relaxed">
                      Dúvidas sobre o sistema ou precisa de treinamento para sua equipe?
                    </p>
                    <button 
                      onClick={() => {
                        setToastMessage("Encaminhando solicitação ao suporte da DTI...");
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="bg-white text-[#001e40] px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-blue-50 transition-all border-none cursor-pointer"
                    >
                      Solicitar Ajuda
                    </button>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-white/10 text-[120px] shrink-0 font-light select-none pointer-events-none">
                    ?
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
          MODAL DE NOVA OCORRÊNCIA SOCIAL
          ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAddModal(false)}></div>
          <form 
            onSubmit={handleCreateOccurrence}
            className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
          >
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Registrar Ocorrência Social</h3>
              <button 
                type="button"
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowAddModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                  Título do Caso
                </label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                  placeholder="Ex: Disputa por vaga de estacionamento Bloco A"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest select-none">
                  Descrição dos Fatos
                </label>
                <textarea 
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all resize-none"
                  placeholder="Descreva detalhadamente o ocorrido ou ação de mediação necessária..."
                  rows={4}
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3 select-none">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 font-black text-xs uppercase tracking-widest rounded-xl transition-all border-none cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-secondary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <span>Confirmar</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
