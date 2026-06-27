// =============================================================================
// app/[programId]/social/page.tsx
// Tela de Acompanhamento Social e Comunicações (Passo 27.1).
// Baseada no mockup do Stitch, projeto "DESIGN SIGAH".
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
  TrendingUp,
  History,
  Phone,
  Home,
  Users,
  Briefcase,
  FileText,
  CheckCircle2,
  Plus,
  X,
  Info,
  MoreVertical,
  ExternalLink,
  Bell,
  Building2,
  Loader2,
  AlertTriangle,
  Heart
} from "lucide-react";

interface CommItem {
  id: string;
  family: string;
  date: string;
  type: string;
  team: string;
  summary: string;
  iconType: "home_health" | "call" | "groups";
}

interface CadUnicoAlert {
  id: string;
  type: "income" | "member";
  title: string;
  name: string;
  notified: boolean;
}

interface SocialOpinion {
  id: string;
  ref: string;
  title: string;
  date: string;
  tech: string;
  status: "Aprovado" | "Em Análise" | "Arquivado";
}

export default function AcompanhamentoSocialPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Dados
  const [totalFamilies, setTotalFamilies] = useState(1482);
  const [totalPendencies, setTotalPendencies] = useState(24);

  const [communications, setCommunications] = useState<CommItem[]>([
    {
      id: "comm-1",
      family: "Família Oliveira Santos",
      date: "Hoje, 14:30",
      type: "Visita Técnica",
      team: "Assistência Regional Sul",
      summary: "Verificação de vulnerabilidade pós-chuvas. Família solicitou inclusão em programa de auxílio moradia temporário devido a danos estruturais.",
      iconType: "home_health"
    },
    {
      id: "comm-2",
      family: "Maria das Graças Silva",
      date: "Ontem, 09:15",
      type: "Contato Telefônico",
      team: "Gestão de Benefícios",
      summary: "Esclarecimento sobre a pendência documental no Cadastro Único. A beneficiária foi orientada a comparecer ao posto de atendimento local.",
      iconType: "call"
    },
    {
      id: "comm-3",
      family: "Condomínio Brisas da Serra",
      date: "22 Out, 16:00",
      type: "Reunião Comunitária",
      team: "Mobilização Social",
      summary: "Debate sobre normas de convivência e gestão compartilhada dos elevadores. Participação de 60% dos moradores.",
      iconType: "groups"
    }
  ]);

  const [cadUnicoAlerts, setCadUnicoAlerts] = useState<CadUnicoAlert[]>([
    {
      id: "alert-1",
      type: "income",
      title: "Mudança de Renda",
      name: "Família Nascimento Rocha",
      notified: false
    },
    {
      id: "alert-2",
      type: "member",
      title: "Inclusão de Membro",
      name: "Ana Paula de Souza",
      notified: false
    }
  ]);

  const [opinions, setOpinions] = useState<SocialOpinion[]>([
    {
      id: "op-1",
      ref: "Unidade 402-B",
      title: "Parecer de Designação Social",
      date: "15/10/2023",
      tech: "Carlos Andrade",
      status: "Aprovado"
    },
    {
      id: "op-2",
      ref: "Unidade 105-A",
      title: "Avaliação de Reassentamento",
      date: "12/10/2023",
      tech: "Juliana Mello",
      status: "Em Análise"
    },
    {
      id: "op-3",
      ref: "Geral Bloco C",
      title: "Relatório de Impacto Social",
      date: "08/10/2023",
      tech: "Carlos Andrade",
      status: "Arquivado"
    }
  ]);

  // Estados dos Modais
  const [isCommModalOpen, setIsCommModalOpen] = useState(false);
  const [newCommFamily, setNewCommFamily] = useState("");
  const [newCommType, setNewCommType] = useState("Visita Técnica");
  const [newCommTeam, setNewCommTeam] = useState("");
  const [newCommSummary, setNewCommSummary] = useState("");

  const [isOpinionModalOpen, setIsOpinionModalOpen] = useState(false);
  const [newOpRef, setNewOpRef] = useState("");
  const [newOpTitle, setNewOpTitle] = useState("Parecer de Designação Social");
  const [newOpTech, setNewOpTech] = useState("");
  const [newOpStatus, setNewOpStatus] = useState<"Aprovado" | "Em Análise" | "Arquivado">("Aprovado");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notifyingAlertId, setNotifyingAlertId] = useState<string | null>(null);

  // Lançar Novo Atendimento
  const handleConfirmComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommFamily.trim() || !newCommTeam.trim() || !newCommSummary.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newComm: CommItem = {
      id: `comm-${Date.now()}`,
      family: newCommFamily,
      date: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      type: newCommType,
      team: newCommTeam,
      summary: newCommSummary,
      iconType: newCommType === "Visita Técnica" ? "home_health" : newCommType === "Contato Telefônico" ? "call" : "groups"
    };

    setCommunications(prev => [newComm, ...prev]);
    setIsCommModalOpen(false);
    setNewCommFamily("");
    setNewCommTeam("");
    setNewCommSummary("");

    setToastMessage("Atendimento social registrado com sucesso!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Lançar Novo Parecer
  const handleConfirmOpinion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpRef.trim() || !newOpTech.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newOp: SocialOpinion = {
      id: `op-${Date.now()}`,
      ref: newOpRef,
      title: newOpTitle,
      date: new Date().toLocaleDateString("pt-BR"),
      tech: newOpTech,
      status: newOpStatus
    };

    setOpinions(prev => [newOp, ...prev]);
    setIsOpinionModalOpen(false);
    setNewOpRef("");
    setNewOpTech("");

    setToastMessage("Parecer do Trabalho Social publicado!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Notificar Caixa Econômica (Alerta CadÚnico)
  const handleNotifyCaixa = (alertId: string) => {
    setNotifyingAlertId(alertId);
    setTimeout(() => {
      setCadUnicoAlerts(prev => prev.map(item => {
        if (item.id === alertId) {
          return { ...item, notified: true };
        }
        return item;
      }));
      setNotifyingAlertId(null);
      setToastMessage("Notificação de cruzamento cadastral enviada à Caixa.");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-secondary-fixed selection:text-on-secondary-fixed min-h-screen pb-24 flex flex-col">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-6 max-w-7xl mx-auto space-y-8 w-full">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Trilha de Navegação & Título */}
            <div className="space-y-2">
              <nav className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                <span>Administração</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-primary font-black">Trabalho Social</span>
              </nav>
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">Acompanhamento Social</h2>
            </div>

            {/* Resumo de Métricas (Assimétrico) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:shadow-lg border border-slate-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-8 -mt-8"></div>
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Panorama Geral
                  </span>
                  <h3 className="text-2xl font-headline font-extrabold text-primary mt-2">
                    Famílias em Acompanhamento
                  </h3>
                </div>
                <div className="mt-8 flex items-baseline gap-4">
                  <span className="text-6xl font-headline font-black text-primary tracking-tighter">
                    {totalFamilies}
                  </span>
                  <div className="flex items-center text-secondary font-semibold text-sm bg-secondary-fixed/30 px-3 py-1 rounded-full">
                    <TrendingUp className="w-4 h-4 mr-1 shrink-0 text-secondary" />
                    +12% este mês
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between border-l-4 border-error shadow-sm">
                <div>
                  <span className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Status de Trabalho
                  </span>
                  <h3 className="text-lg font-headline font-bold text-primary mt-2">
                    Pendências de Trabalho Social
                  </h3>
                </div>
                <div className="mt-4 flex flex-col">
                  <span className="text-5xl font-headline font-black text-on-surface tracking-tighter">
                    {totalPendencies}
                  </span>
                  <div className="mt-4 flex gap-2">
                    <span className="px-3 py-1 bg-error-container text-on-error-container rounded-full font-sans text-[9px] font-black uppercase tracking-wider">
                      Crítico
                    </span>
                    <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full font-sans text-[9px] font-black uppercase tracking-wider">
                      Atenção
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Grid Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Histórico de Comunicação */}
              <section className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-3">
                    <History className="w-5 h-5 text-secondary shrink-0" />
                    Histórico de Comunicação
                  </h2>
                  <button 
                    onClick={() => setIsCommModalOpen(true)}
                    className="text-xs font-black text-secondary hover:underline transition-all bg-transparent border-none cursor-pointer uppercase tracking-wider"
                  >
                    Registrar Atendimento
                  </button>
                </div>

                <div className="space-y-4">
                  {communications.map(item => (
                    <div 
                      key={item.id}
                      className="group bg-surface-container-lowest p-6 rounded-xl border border-slate-100 hover:shadow-md transition-all duration-300 flex gap-6 items-start"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shrink-0 select-none">
                        {item.iconType === "call" ? (
                          <Phone className="w-5 h-5 shrink-0" />
                        ) : item.iconType === "home_health" ? (
                          <Home className="w-5 h-5 shrink-0" />
                        ) : (
                          <Users className="w-5 h-5 shrink-0" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-black text-on-surface text-base">{item.family}</h4>
                          <span className="text-xs text-on-surface-variant font-semibold select-none">{item.date}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-1 items-center select-none">
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-container text-on-surface-variant rounded">
                            {item.type}
                          </span>
                          <span className="text-[10px] text-outline font-bold">
                            Equipe: {item.team}
                          </span>
                        </div>
                        <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sidebar Lateral */}
              <aside className="lg:col-span-4 space-y-8 select-none">
                
                {/* Painel Alertas do CadÚnico */}
                <div className="bg-surface-container-high rounded-2xl p-6 space-y-4 border border-slate-200/50">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="w-5 h-5 text-secondary shrink-0 animate-bounce" />
                    <h2 className="font-heading text-lg font-bold text-primary">Alertas do CadÚnico</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {cadUnicoAlerts.map(alertItem => (
                      <div key={alertItem.id} className="bg-surface-container-lowest p-4 rounded-xl flex flex-col gap-3 border border-slate-200/30">
                        <div>
                          <span className={`text-[9px] font-black uppercase tracking-wider ${
                            alertItem.type === "income" ? "text-tertiary-container" : "text-secondary"
                          }`}>
                            {alertItem.title}
                          </span>
                          <p className="text-sm font-bold text-on-surface mt-0.5">{alertItem.name}</p>
                        </div>
                        
                        {alertItem.notified ? (
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg py-2 text-center flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Notificação Enviada
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleNotifyCaixa(alertItem.id)}
                            disabled={notifyingAlertId === alertItem.id}
                            className="w-full bg-primary hover:bg-primary-container text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            {notifyingAlertId === alertItem.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                <span>Notificando...</span>
                              </>
                            ) : (
                              <span>NOTIFICAR AGENTE FINANCEIRO</span>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apoio Técnico Elevadores */}
                <div className="relative overflow-hidden rounded-2xl bg-primary-container p-6 text-white shadow-xl shadow-primary/10">
                  <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                    <Building2 className="w-[120px] h-[120px] text-white shrink-0" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-secondary-fixed shrink-0" />
                      <h3 className="font-heading font-black text-base">Apoio Técnico (Elevadores)</h3>
                    </div>
                    <p className="text-xs text-primary-fixed leading-relaxed font-semibold">
                      Monitoramento de manutenção preventiva e suporte à gestão de condomínios verticais.
                    </p>
                    <div className="pt-2">
                      <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-3 mb-3">
                        <span className="text-xs font-bold">Chamados em Aberto</span>
                        <span className="text-lg font-black text-emerald-400">04</span>
                      </div>
                      <button 
                        onClick={() => router.push(`/${programId}/vagas/elevadores`)}
                        className="w-full bg-secondary hover:brightness-110 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border-none cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-white" />
                        Gerenciar Manutenções
                      </button>
                    </div>
                  </div>
                </div>

              </aside>

            </div>

            {/* Pareceres do Trabalho Social */}
            <section className="space-y-6 pb-12">
              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
                <div className="flex items-center gap-3 select-none">
                  <Heart className="w-5 h-5 text-primary shrink-0" />
                  <h2 className="font-heading text-xl font-bold text-primary">Pareceres do Trabalho Social</h2>
                </div>
                <button 
                  onClick={() => setIsOpinionModalOpen(true)}
                  className="bg-secondary hover:brightness-110 text-white px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-wider hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 border-none cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-white" />
                  Novo Parecer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {opinions.map(op => (
                  <div 
                    key={op.id}
                    className="bg-surface-container-low p-6 rounded-xl border border-transparent hover:border-outline-variant transition-all flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-4 select-none">
                      <span className="bg-surface-container-highest px-3 py-1 rounded text-[9px] font-black uppercase tracking-wider text-on-surface-variant">
                        Ref: {op.ref}
                      </span>
                      <button className="text-outline hover:text-primary border-none bg-transparent cursor-pointer">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-1">
                      <h5 className="font-heading font-black text-primary text-sm">{op.title}</h5>
                      <p className="text-[10px] text-on-surface-variant font-bold select-none">
                        Emissão: {op.date} • Técnico: {op.tech}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 select-none">
                      <span className={`text-[8px] font-black uppercase px-2.5 py-0.5 rounded tracking-wider ${
                        op.status === "Aprovado" 
                          ? "bg-secondary-fixed text-on-secondary-fixed-variant" 
                          : op.status === "Em Análise"
                          ? "bg-tertiary-fixed text-on-tertiary-fixed-variant"
                          : "bg-slate-200 text-slate-700"
                      }`}>
                        {op.status}
                      </span>
                      <button 
                        onClick={() => {
                          setToastMessage(`Abertura do dossiê digital para parecer em ${op.ref}`);
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="text-secondary hover:underline text-xs font-black flex items-center gap-1 border-none bg-transparent cursor-pointer uppercase tracking-wider"
                      >
                        Visualizar 
                        <ExternalLink className="w-3 h-3 text-secondary shrink-0" />
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
          href={`/${programId}/classificacao`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5 text-on-surface-variant" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Fila</span>
        </a>
        <a 
          href={`/${programId}/social`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Briefcase className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Social</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: REGISTRAR ATENDIMENTO (COMMUNICATION)
          ========================================== */}
      {isCommModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCommModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-primary">Registrar Atendimento</h3>
              <button 
                className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsCommModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleConfirmComm} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Família / Beneficiário Alvo
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  placeholder="Ex: Família Silva Ramos, Maria das Graças..."
                  value={newCommFamily}
                  onChange={(e) => setNewCommFamily(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Tipo de Atendimento
                </label>
                <select 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  value={newCommType}
                  onChange={(e) => setNewCommType(e.target.value)}
                >
                  <option value="Visita Técnica">Visita Técnica</option>
                  <option value="Contato Telefônico">Contato Telefônico</option>
                  <option value="Reunião Comunitária">Reunião Comunitária</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Equipe Responsável
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary" 
                  placeholder="Ex: Assistência Regional Sul, Mobilização..." 
                  type="text"
                  value={newCommTeam}
                  onChange={(e) => setNewCommTeam(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Resumo das Ações / Solicitações
                </label>
                <textarea 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 rounded-t-lg text-sm text-primary" 
                  placeholder="Descreva detalhadamente o parecer de campo..." 
                  rows={3}
                  value={newCommSummary}
                  onChange={(e) => setNewCommSummary(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-on-surface-variant font-black text-xs border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsCommModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  REGISTRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: NOVO PARECER
          ========================================== */}
      {isOpinionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={() => setIsOpinionModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-primary">Novo Parecer Social</h3>
              <button 
                className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsOpinionModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleConfirmOpinion} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Referência Imóvel / Bloco
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  placeholder="Ex: Unidade 204-C, Geral Bloco A..."
                  value={newOpRef}
                  onChange={(e) => setNewOpRef(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Título do Parecer
                </label>
                <select 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  value={newOpTitle}
                  onChange={(e) => setNewOpTitle(e.target.value)}
                >
                  <option value="Parecer de Designação Social">Parecer de Designação Social</option>
                  <option value="Avaliação de Reassentamento">Avaliação de Reassentamento</option>
                  <option value="Relatório de Impacto Social">Relatório de Impacto Social</option>
                  <option value="Laudo de Vunerabilidade Emergencial">Laudo de Vulnerabilidade Emergencial</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Assistente Social Responsável
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary" 
                  placeholder="Ex: Carlos Andrade, Juliana Mello..." 
                  type="text"
                  value={newOpTech}
                  onChange={(e) => setNewOpTech(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Status Inicial
                </label>
                <select 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  value={newOpStatus}
                  onChange={(e) => setNewOpStatus(e.target.value as any)}
                >
                  <option value="Aprovado">Aprovado</option>
                  <option value="Em Análise">Em Análise</option>
                  <option value="Arquivado">Arquivado</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-on-surface-variant font-black text-xs border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsOpinionModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  PUBLICAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
