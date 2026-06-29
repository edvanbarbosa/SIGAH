// =============================================================================
// app/[programId]/convocacao/page.tsx
// Gestão de Prazos - Padronizada Final (Passo 30.1).
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
  Timer,
  AlertTriangle,
  History,
  CheckCircle2,
  X,
  ArrowRight,
  Loader2,
  UserX,
  Calendar,
  Home,
  Users,
  FileText,
  ShieldCheck
} from "lucide-react";

interface CountdownItem {
  id: string;
  name: string;
  role: string;
  edital: string;
  daysRemaining: number;
  progressPercent: number;
  avatar: string;
  status: "active" | "expired";
}

interface AbsenteeItem {
  name: string;
  reason: string;
  date: string;
  type: string;
}

export default function GestaoPrazosFinalPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Contadores
  const [totalDisqualifications, setTotalDisqualifications] = useState(14);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Lista de Contagem Regressiva
  const [countdownList, setCountdownList] = useState<CountdownItem[]>([
    {
      id: "carlos-alberto",
      name: "Carlos Alberto Silva",
      role: "Analista de Sistemas",
      edital: "Edital 004/2023",
      daysRemaining: 42,
      progressPercent: 70,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbB27bZ_C2-b3Jr4i3KQV91Tjx-JYloH4Olf5TvP5asupKQXh1H708m__Wf4lWaCTTQ9d6q8S6luSjdE_TiLvl6kwbie2qiehT42MPHUxKuwr6MfyvFdpAZ6acOu9zBYVeymFzd_2WJLUahl7W5DwB_h_s8VdzvcGCDdO2udJvlsUuaU56jZ-9-qugjP5yo_OaxX_aiCUxUL3L0qin_JrvFWtsl6PtcxRhEbUWKllpgZgM15dDIsjELN7jBWi2XJI3WyIwTwcEp3I",
      status: "active"
    },
    {
      id: "mariana-ferreira",
      name: "Mariana Ferreira Souza",
      role: "Assistente Social",
      edital: "Edital 004/2023",
      daysRemaining: 0,
      progressPercent: 100,
      avatar: "https://lh3.googleusercontent.com/aida/AP1WRLtbWT3_4u1rzLoQTUItWjV1AhrWu2g1kFPqeevViREZYxdafG6WmZtoYvrr77CKUNwFTTdOTSf-P7bT1ZvvhkVJuOAUQzOArh-U8JM8wkA3o6rnRBSAVDQp-LEOyvrU6yk8o3wIXYy-gvGaXUE2djLNmPPUT5GTLY_KgzqADfu7eJ2QK0y9SfcWS-eZ0Lu0xmM8Bno7IJTR15XuWT-cFINWnDQh3ag0ognURKCUIibkVT_TMXZPVCDhVW0",
      status: "expired"
    }
  ]);

  // Lista de Desclassificados
  const [absentees, setAbsentees] = useState<AbsenteeItem[]>([
    {
      name: "Roberto Mendes de Oliveira",
      reason: "Não comparecimento para entrega de documentos.",
      date: "12/10/2023",
      type: "Automático"
    },
    {
      name: "Lúcia Helena Santos",
      reason: "Prazo de assinatura de contrato expirado.",
      date: "08/10/2023",
      type: "Automático"
    },
    {
      name: "Fernando Costa Júnior",
      reason: "Ausência injustificada na convocação presencial.",
      date: "05/10/2023",
      type: "Automático"
    }
  ]);

  // Estado dos Modais
  const [selectedCandidate, setSelectedCandidate] = useState<CountdownItem | null>(null);
  const [showLogDetails, setShowLogDetails] = useState<string | null>(null);

  // Executar Notificação de Desclassificação
  const handleNotifyDisqualification = (candidateId: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const target = countdownList.find(c => c.id === candidateId);
      if (!target) return;

      // Remove da contagem
      setCountdownList(prev => prev.filter(c => c.id !== candidateId));

      // Adiciona na lista de desclassificados
      const newAbsentee: AbsenteeItem = {
        name: target.name,
        reason: target.status === "expired" 
          ? "Comparecimento não identificado no prazo legal de convocação."
          : "Cancelamento solicitado pelo analista de conformidade.",
        date: new Date().toLocaleDateString("pt-BR"),
        type: "Automático"
      };

      setAbsentees(prev => [newAbsentee, ...prev]);
      setTotalDisqualifications(prev => prev + 1);
      setIsProcessing(false);

      setToastMessage(`Candidato ${target.name} desclassificado. Notificações oficiais expedidas!`);
      setTimeout(() => setToastMessage(null), 4000);
    }, 1200);
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
          
          <main className="pt-24 px-4 md:p-10 max-w-[1000px] mx-auto w-full space-y-6">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <header className="select-none flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <nav className="flex text-on-surface-variant text-[10px] font-black uppercase tracking-widest gap-2 mb-4">
                  <span>Concursos</span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                  <span className="text-secondary font-black">Gestão de Convocação</span>
                </nav>
                <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-1">
                  Status de Convocações
                </h1>
                <p className="text-on-surface-variant text-xs font-semibold">
                  Edital 004/2023 • Gestão Administrativa
                </p>
              </div>
              <button 
                onClick={() => router.push(`/${programId}/convocacao/gestao`)}
                className="bg-primary hover:bg-[#003366] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border-none shadow-sm active:scale-95 transition-all"
              >
                <span>Acessar Fila de Chamada →</span>
              </button>
            </header>

            {/* Card Bento: Total de Desclassificações Automáticas */}
            <div className="bg-error p-8 rounded-2xl text-white flex flex-col justify-center shadow-lg shadow-error/25 relative overflow-hidden select-none">
              <div className="absolute top-4 right-4 opacity-10">
                <UserX className="w-24 h-24 text-white" />
              </div>
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <AlertTriangle className="w-5 h-5 text-red-100" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-red-200">
                  Total de Desclassificações Automáticas
                </h3>
              </div>
              <div className="text-5xl font-black mb-4 relative z-10">
                {totalDisqualifications}
              </div>
              <p className="text-[10px] text-white/80 font-bold relative z-10">
                Atualizado em tempo real pelo sistema de gestão de prazos do edital.
              </p>
            </div>

            {/* Seção: Contagem Regressiva */}
            <section className="space-y-4">
              <div className="flex justify-between items-center select-none">
                <h3 className="text-lg font-black text-primary flex items-center gap-2">
                  <Timer className="w-5 h-5 text-secondary" />
                  Contagem Regressiva
                </h3>
                <span className="text-[9px] font-black bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full uppercase tracking-widest border border-slate-200">
                  Prazo: 60 Dias
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {countdownList.map(candidate => (
                  <div key={candidate.id}>
                    {candidate.status === "active" ? (
                      /* Card Ativo */
                      <div className="bg-white rounded-2xl p-6 flex justify-between items-center border border-outline-variant/15 shadow-sm relative overflow-hidden">
                        <div className="flex flex-col gap-4 relative z-10">
                          <div>
                            <p className="text-base font-black text-[#001e40]">{candidate.name}</p>
                            <p className="text-slate-500 text-xs font-semibold">
                              {candidate.edital} • {candidate.role}
                            </p>
                          </div>
                          
                          <div className="space-y-2">
                            <span className="text-[10px] font-black text-secondary uppercase tracking-wider">
                              {candidate.daysRemaining} dias restantes
                            </span>
                            <div className="h-2 w-48 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-secondary rounded-full" 
                                style={{ width: `${candidate.progressPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          <button 
                            onClick={() => setSelectedCandidate(candidate)}
                            className="bg-slate-100 hover:bg-slate-250 px-4 py-2 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest transition-all w-fit border-none cursor-pointer"
                          >
                            Ver Detalhes
                          </button>
                        </div>

                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                          <img 
                            alt={candidate.name} 
                            className="w-full h-full object-cover" 
                            src={candidate.avatar} 
                          />
                        </div>
                      </div>
                    ) : (
                      /* Card Expirado (Aviso Vermelho) */
                      <div className="bg-white rounded-2xl p-6 flex flex-col border border-error-container shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1.5 h-full bg-error"></div>
                        
                        <div className="flex justify-between items-start mb-4 relative z-10 select-none">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[8px] font-black bg-error text-white px-2 py-0.5 rounded uppercase tracking-wider">
                                Atenção
                              </span>
                              <span className="text-[9px] font-black text-error uppercase tracking-widest">
                                Prazo Expirado
                              </span>
                            </div>
                            <p className="text-base font-black text-primary mt-1">{candidate.name}</p>
                            <p className="text-slate-500 text-xs font-semibold">
                              {candidate.edital} • {candidate.role}
                            </p>
                          </div>

                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                            <img 
                              alt={candidate.name} 
                              className="w-full h-full object-cover" 
                              src={candidate.avatar} 
                            />
                          </div>
                        </div>

                        <div className="bg-error/5 border border-error/15 rounded-xl p-3 mb-6 flex items-center gap-3 select-none">
                          <AlertTriangle className="w-5 h-5 text-error shrink-0" />
                          <p className="text-xs font-bold text-error">
                            Comparecimento não identificado no prazo legal de convocação.
                          </p>
                        </div>

                        <button 
                          onClick={() => handleNotifyDisqualification(candidate.id)}
                          disabled={isProcessing}
                          className="w-full bg-error hover:brightness-95 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md border-none cursor-pointer"
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                          ) : (
                            <>
                              <span>Notificar Desclassificação</span>
                              <ArrowRight className="w-4 h-4 text-white" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Seção: Desclassificados por Ausência */}
            <section className="bg-white rounded-2xl p-6 shadow-sm border border-outline-variant/15">
              
              <div className="mb-6 select-none">
                <h3 className="text-[10px] font-black text-[#001e40] uppercase tracking-widest mb-1">
                  Desclassificados por Ausência
                </h3>
                <p className="text-slate-400 text-[10px] font-bold">
                  Candidatos que não cumpriram o prazo convocatório de 60 dias.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {absentees.map((item, idx) => (
                  <div key={idx} className="flex items-center py-4 hover:bg-slate-50 transition-colors px-4 rounded-lg">
                    <div className="w-2.5 h-2.5 rounded-full bg-error mr-6 shrink-0"></div>
                    <div className="flex-grow">
                      <p className="text-xs font-black text-[#001e40]">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                        Motivo: {item.reason}
                      </p>
                      <div className="flex gap-3 mt-1.5 select-none">
                        <span className="text-[8px] bg-tertiary-fixed text-on-tertiary-fixed-variant px-2.5 py-1 rounded uppercase font-black">
                          {item.type}
                        </span>
                        <button 
                          onClick={() => setShowLogDetails(item.name)}
                          className="text-[9px] text-[#0059bb] hover:underline font-black uppercase tracking-wider border-none bg-transparent cursor-pointer"
                        >
                          Log do sistema
                        </button>
                      </div>
                    </div>
                    <div className="text-right shrink-0 select-none">
                      <p className="text-[9px] font-black text-slate-400 uppercase">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => {
                  setToastMessage("Carregando histórico completo de ausências do edital...");
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="w-full mt-6 py-4 flex items-center justify-center gap-2 border border-outline-variant rounded-xl text-[#001e40] text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all border-none bg-transparent cursor-pointer"
              >
                <History className="w-4 h-4" />
                Ver Histórico Completo
              </button>

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
          href={`/${programId}/convocacao`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Timer className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Prazos</span>
        </a>
        <a 
          href={`/${programId}/cadastro`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Inscrições</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: DETALHES DE PENDÊNCIA
          ========================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCandidate(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Detalhes da Pendência</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setSelectedCandidate(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 select-none">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <img alt={selectedCandidate.name} className="w-full h-full object-cover" src={selectedCandidate.avatar} />
                </div>
                <div>
                  <h4 className="text-base font-black text-[#001e40]">{selectedCandidate.name}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{selectedCandidate.role}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  <span>Edital Regulador</span>
                  <span>{selectedCandidate.edital}</span>
                </div>
                <p className="text-xs text-[#001e40] leading-relaxed font-semibold">
                  O candidato encontra-se convocado para a fase de entrega de documentos comprobatórios socioeconômicos. Restam <strong>{selectedCandidate.daysRemaining} dias</strong> para a expiração do prazo limite regulamentar.
                </p>
              </div>

              <div className="pt-4 select-none">
                <button 
                  onClick={() => setSelectedCandidate(null)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  FECHAR DETALHES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: DETALHES DO LOG DO SISTEMA
          ========================================== */}
      {showLogDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowLogDetails(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Log de Ação do Sistema</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowLogDetails(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-mono text-[10px] text-slate-600 leading-relaxed">
                <span className="text-blue-600 font-bold block mb-1">SYSTEM_DAEMON // EVENT_LOG // ID: {Math.floor(100000 + Math.random() * 900000)}</span>
                [INFO] candidate: {showLogDetails}<br />
                [INFO] action: SYSTEM_AUTO_DISQUALIFICATION<br />
                [INFO] status: EXPIRED_DEADLINE_60_DAYS<br />
                [INFO] date: {new Date().toLocaleDateString("pt-BR")}<br />
                [INFO] message: Candidate failed to submit compliance forms on due date. Record flagged and moved to inactive queue.
              </div>

              <div className="pt-2 select-none">
                <button 
                  onClick={() => setShowLogDetails(null)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  FECHAR LOG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
