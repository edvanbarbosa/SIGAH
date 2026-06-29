// =============================================================================
// app/[programId]/vistorias/chamados-lista/page.tsx
// Assistência Técnica - Chamados Padronizada (Passo 25.1).
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
  Clock,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Phone,
  Bookmark,
  ChevronRight as ChevronRightIcon,
  X,
  Droplet,
  Tv,
  Zap,
  Building,
  User,
  ShieldCheck,
  Calendar,
  Home,
  MessageSquare,
  Wrench,
  ClipboardList
} from "lucide-react";

interface ActiveTicket {
  id: string;
  title: string;
  protocol: string;
  status: "agendado" | "analise";
  statusText: string;
  detail: string;
  icon: React.ComponentType<any>;
}

export default function AssistenciaTecnicaChamadosPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<ActiveTicket | null>(null);

  // Chamados Ativos
  const [tickets, setTickets] = useState<ActiveTicket[]>([
    {
      id: "t-1",
      title: "Infiltração - Banheiro Suíte",
      protocol: "#2024-0891",
      status: "agendado",
      statusText: "AGENDADO",
      detail: "Visita: 15/10 às 14:00",
      icon: Droplet
    },
    {
      id: "t-2",
      title: "Ajuste de Esquadria",
      protocol: "#2024-0902",
      status: "analise",
      statusText: "EM ANÁLISE",
      detail: "Aguardando perito",
      icon: Tv
    },
    {
      id: "t-3",
      title: "Queda de Disjuntor Constante",
      protocol: "#2024-0875",
      status: "agendado",
      statusText: "AGENDADO",
      detail: "Visita: Hoje às 16:30",
      icon: Zap
    }
  ]);

  // Histórico de Fechados
  const historyItems = [
    { title: "Rachadura Parede Sala", date: "Concluído em 12/09" },
    { title: "Troca de Sifão Cozinha", date: "Concluído em 05/08" }
  ];

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
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Seção */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 select-none">
              <div>
                <h2 className="font-heading text-3xl font-black text-primary tracking-tight">
                  Assistência Técnica
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-semibold">
                  Gerencie e acompanhe os chamados da sua unidade habitacional.
                </p>
              </div>

              <button 
                onClick={() => router.push(`/${programId}/vistorias/chamado`)}
                className="bg-primary-container text-white px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-primary active:scale-95 transition-all shadow-md border-none cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-white shrink-0" />
                <span>Abrir Novo Chamado</span>
              </button>
            </section>

            {/* Layout Grid Bento */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Coluna Esquerda: Chamados Ativos (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-8 select-none">
                    <h3 className="font-black text-sm text-[#001e40] uppercase tracking-wide">
                      Chamados em Aberto
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {tickets.length} Ativos
                    </span>
                  </div>

                  <div className="space-y-4">
                    {tickets.map(ticket => {
                      const IconComponent = ticket.icon;
                      return (
                        <div 
                          key={ticket.id}
                          onClick={() => setSelectedTicket(ticket)}
                          className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200/60"
                        >
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-blue-50 text-[#0059bb] flex items-center justify-center rounded-xl shrink-0 select-none">
                              <IconComponent className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                              <h4 className="font-black text-[#001e40] text-sm">{ticket.title}</h4>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5 select-none">Protocolo: {ticket.protocol}</p>
                            </div>
                          </div>

                          <div className="mt-4 md:mt-0 flex items-center justify-between md:gap-12 select-none">
                            <div className="flex flex-col md:items-end">
                              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase ${
                                ticket.status === "agendado" 
                                  ? "bg-blue-100 text-secondary border border-blue-200" 
                                  : "bg-slate-100 text-slate-550 border border-slate-200"
                              }`}>
                                {ticket.statusText}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold mt-1.5">{ticket.detail}</span>
                            </div>
                            <ChevronRightIcon className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Metadados e Suporte (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Resumo da Unidade */}
                <div className="bg-[#001e40] text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
                  <div className="relative z-10 space-y-4">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">Sua Unidade</p>
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight">Edifício Horizon</h3>
                      <p className="text-xs text-slate-300 font-semibold mt-0.5">Bloco B - Apto 142</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/10 select-none">
                      <ShieldCheck className="w-4.5 h-4.5 text-secondary shrink-0" />
                      <span className="text-[10px] font-bold">Garantia vigente até 2029</span>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/15 -mr-10 -mt-10 rounded-full blur-3xl select-none"></div>
                </div>

                {/* Status de Satisfação */}
                <div className="bg-slate-100 rounded-2xl p-6 border border-slate-200 select-none">
                  <h4 className="font-black text-xs text-[#001e40] uppercase tracking-wider mb-4">Status de Satisfação</h4>
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-3xl font-black text-secondary leading-none">92%</span>
                    <span className="text-[10px] text-slate-500 font-semibold pb-0.5 leading-none">chamados concluídos</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: "92%" }}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-4 leading-relaxed font-semibold">
                    Nossa equipe técnica trabalha para garantir a excelência estrutural da sua moradia seguindo as normas NBR.
                  </p>
                </div>

                {/* Central de Suporte */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm select-none">
                  <h4 className="font-black text-xs text-[#001e40] uppercase tracking-wider mb-4">Precisa de Ajuda?</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">0800 450 1000</span>
                    </div>
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80" onClick={() => {
                      setToastMessage("Acessando a central de manuais e tutoriais da construtora...");
                      setTimeout(() => setToastMessage(null), 3000);
                    }}>
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <Bookmark className="w-4 h-4 text-slate-600" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Base de Conhecimento</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Histórico Recente (Seção Horizontal) */}
            <section className="mt-12 select-none">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-sm text-[#001e40] uppercase tracking-wider">Histórico Recente</h3>
                <button 
                  onClick={() => {
                    setToastMessage("Mostrando histórico completo de chamados fechados...");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-secondary text-xs font-black uppercase tracking-wider border-none bg-transparent hover:underline cursor-pointer flex items-center gap-1"
                >
                  Ver Tudo
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {historyItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 flex items-center justify-center rounded-xl shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#001e40]">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{item.date}</p>
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
          href={`/${programId}/vistorias/chamados-lista`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Wrench className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Chamados</span>
        </a>
        <a 
          href={`/${programId}/vistorias/checklist-nbr`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Normas</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL DETALHE DO CHAMADO SELECIONADO
          ========================================== */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTicket(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Detalhe do Chamado</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setSelectedTicket(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 select-none">
                <span className="text-[8px] font-black text-secondary bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit block">
                  Assunto / Serviço
                </span>
                <p className="text-xs font-black text-[#001e40]">{selectedTicket.title}</p>
                <p className="text-[10px] text-slate-550 font-bold">{selectedTicket.protocol}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 select-none">
                <span className="text-[8px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit block">
                  Andamento da Equipe
                </span>
                <p className="text-xs font-black text-[#001e40]">{selectedTicket.statusText}</p>
                <p className="text-[10px] text-slate-550 font-bold">{selectedTicket.detail}</p>
              </div>

              <div className="pt-4 select-none">
                <button 
                  onClick={() => setSelectedTicket(null)}
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
