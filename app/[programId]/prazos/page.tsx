// =============================================================================
// app/[programId]/prazos/page.tsx
// Tela de Gestão de Prazos (Passo 18.2).
// Baseada fielmente no Stitch, projeto "DESIGN SIGAH".
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { 
  Clock, 
  AlertTriangle, 
  Bell, 
  History, 
  UserX, 
  BarChart2, 
  Info, 
  Check, 
  HelpCircle,
  TrendingUp,
  X,
  Home,
  Key
} from "lucide-react";

interface ActiveDeadline {
  id: string;
  name: string;
  avatar: string;
  details: string;
  type: "documentacao" | "assinatura" | "exames";
  daysRemaining: number; // Negativo significa atrasado
  statusLabel?: string;
  isUrgent?: boolean;
}

interface DisqualifiedCandidate {
  name: string;
  date: string;
  reason: string;
  type: string;
}

export default function GestaoPrazosPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos contadores de métricas
  const [metricEmDia, setMetricEmDia] = useState(1248);
  const [metricCritico, setMetricCritico] = useState(42);
  const [metricAtrasado, setMetricAtrasado] = useState(18);
  const [metricDesclassificados, setMetricDesclassificados] = useState(14);

  // Estado dos prazos ativos monitorados
  const [activeDeadlines, setActiveDeadlines] = useState<ActiveDeadline[]>([
    {
      id: "carlos-alberto",
      name: "Carlos Alberto Silva",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbB27bZ_C2-b3Jr4i3KQV91Tjx-JYloH4Olf5TvP5asupKQXh1H708m__Wf4lWaCTTQ9d6q8S6luSjdE_TiLvl6kwbie2qiehT42MPHUxKuwr6MfyvFdpAZ6acOu9zBYVeymFzd_2WJLUahl7W5DwB_h_s8VdzvcGCDdO2udJvlsUuaU56jZ-9-qugjP5yo_OaxX_aiCUxUL3L0qin_JrvFWtsl6PtcxRhEbUWKllpgZgM15dDIsjELN7jBWi2XJI3WyIwTwcEp3I",
      details: "Edital 004/2023 • Analista de Sistemas",
      type: "exames",
      daysRemaining: 42
    },
    {
      id: "mariana-luzia",
      name: "Mariana Luzia Silva",
      avatar: "https://lh3.googleusercontent.com/aida/AP1WRLtbWT3_4u1rzLoQTUItWjV1AhrWu2g1kFPqeevViREZYxdafG6WmZtoYvrr77CKUNwFTTdOTSf-P7bT1ZvvhkVJuOAUQzOArh-U8JM8wkA3o6rnRBSAVDQp-LEOyvrU6yk8o3wIXYy-gvGaXUE2djLNmPPUT5GTLY_KgzqADfu7eJ2QK0y9SfcWS-eZ0Lu0xmM8Bno7IJTR15XuWT-cFINWnDQh3ag0ognURKCUIibkVT_TMXZPVCDhVW0",
      details: "ID: 1105-C • Assinatura de Contrato",
      type: "assinatura",
      daysRemaining: 0, // Expirado
      isUrgent: true,
      statusLabel: "Urgente"
    },
    {
      id: "ricardo-mendonca",
      name: "Ricardo Mendonça Souza",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB48dHgPvLRRm9f47eFCOYe5ILzwWJ9TqbU2ZUPcC8junGqBGifZ8jfXtTOFdAMtid5mhQABSxdhk6ia335xgZIahenL0yBeG_y2Eb4QKkWJMK1l-XbaoTo0gzeRnXVtg6CSxK7cjIKUjOh2FgCyFLBdrUot7aXrbndFgAs5vusH5CyqoNYUF-omgomMbYhY06I7UZNU4TmKQspN2Wbvr1v-Xz-RTcbqyHYdiiUJPQLRQKk1XAo8zy4Kn5zncW-eqjkW3c2ct-Z7hM",
      details: "ID: 0092-A • Documentação",
      type: "documentacao",
      daysRemaining: -12 // Atrasado
    }
  ]);

  // Lista de desclassificados por ausência
  const [disqualifiedList, setDisqualifiedList] = useState<DisqualifiedCandidate[]>([
    {
      name: "Roberto Mendes de Oliveira",
      date: "12/10/2023",
      reason: "Não comparecimento para entrega de documentos dentro do prazo legal.",
      type: "Automático"
    },
    {
      name: "Lúcia Helena Santos",
      date: "08/10/2023",
      reason: "Prazo de assinatura de contrato expirado (Art. 42 do Edital).",
      type: "Automático"
    }
  ]);

  // Estado do filtro ativo
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  // Estado da caixa de diálogo de desclassificação
  const [candidateToDisqualify, setCandidateToDisqualify] = useState<ActiveDeadline | null>(null);

  // Executa o fluxo de notificação de desclassificação
  const handleDisqualify = () => {
    if (!candidateToDisqualify) return;
    const target = candidateToDisqualify;

    // Atualiza contadores
    setMetricAtrasado(prev => Math.max(0, prev - 1));
    setMetricDesclassificados(prev => prev + 1);

    // Remove da lista de ativos
    setActiveDeadlines(prev => prev.filter(cand => cand.id !== target.id));

    // Adiciona na lista de desclassificados
    setDisqualifiedList(prev => [
      {
        name: target.name,
        date: new Date().toLocaleDateString("pt-BR"),
        reason: target.type === "assinatura" 
          ? "Prazo de assinatura de contrato expirado." 
          : "Não comparecimento para entrega de documentos no prazo legal.",
        type: "Automático"
      },
      ...prev
    ]);

    setCandidateToDisqualify(null);
  };

  // Filtra prazos ativos de acordo com o pill de filtro selecionado
  const filteredDeadlines = activeDeadlines.filter(cand => {
    if (activeFilter === "todos") return true;
    return cand.type === activeFilter;
  });

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-3xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-8">
            
            {/* Seção 1: Destaque de Métricas (Bento Stats) */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl shadow-primary/15 select-none">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-sans text-primary-fixed-dim uppercase tracking-widest text-[10px] font-black mb-1">
                      Gestão Unificada de Prazos
                    </p>
                    <h2 className="font-heading font-black text-4xl tracking-tight">{metricEmDia}</h2>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] font-extrabold text-secondary-fixed bg-white/10 px-2 py-0.5 rounded border border-white/5">
                        +12% vs mês ant.
                      </span>
                      <p className="text-on-primary-container text-[10px] font-semibold uppercase tracking-wider">
                        Processos em Dia
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/5 shrink-0">
                    <BarChart2 className="text-primary-fixed-dim w-6 h-6" />
                  </div>
                </div>

                {/* Sub-cards Bento */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/15">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-heading font-black text-2xl text-tertiary-fixed">{metricCritico}</h3>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-tertiary-fixed/20 text-tertiary-fixed rounded border border-tertiary-fixed/10">
                        Crítico
                      </span>
                    </div>
                    <p className="text-on-primary-container text-[9px] font-black uppercase tracking-wider leading-snug">
                      Próximos ao<br />Vencimento
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/15">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-heading font-black text-2xl text-error-container">{metricAtrasado}</h3>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-error-container/20 text-error-container rounded border border-error-container/10">
                        Urgente
                      </span>
                    </div>
                    <p className="text-on-primary-container text-[9px] font-black uppercase tracking-wider leading-snug">
                      Processos<br />Atrasados
                    </p>
                  </div>
                </div>

                {/* Progresso de Desclassificações */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] font-sans font-black uppercase text-primary-fixed-dim block mb-1">
                        Desclassificações Automáticas
                      </span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-32 bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full rounded-full transition-all" style={{ width: `${Math.min(100, metricDesclassificados * 6)}%` }}></div>
                        </div>
                        <span className="text-xs font-sans font-bold">{metricDesclassificados} totais</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-secondary-fixed flex items-center gap-1.5 opacity-80">
                    <Info className="w-3.5 h-3.5" />
                    Atualizado em tempo real pelo sistema
                  </p>
                </div>
              </div>
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary/15 rounded-full blur-3xl"></div>
              <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-primary-container/40 rounded-full blur-3xl"></div>
            </section>

            {/* Alert Box de Atenção */}
            {metricAtrasado > 0 && (
              <div className="p-4 bg-tertiary-fixed/30 border border-tertiary-fixed/50 text-on-tertiary-fixed rounded-2xl flex items-center gap-3 animate-fade-in select-none">
                <div className="bg-tertiary-fixed p-2 rounded-xl text-tertiary shrink-0">
                  <AlertTriangle className="w-5 h-5 text-tertiary" />
                </div>
                <div>
                  <p className="font-bold text-xs font-heading">
                    Atenção: {metricAtrasado} processos expiram em 48h
                  </p>
                  <p className="text-[10px] text-on-tertiary-fixed-variant font-medium mt-0.5 leading-snug">
                    Revise as notificações de prazos expirados pendentes de providência técnica.
                  </p>
                </div>
              </div>
            )}

            {/* Monitoramento de Prazos */}
            <section className="space-y-6">
              
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-black text-xl text-primary">Monitoramento de Prazos</h3>
                <span className="bg-surface-container-highest px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase border border-outline-variant/30 tracking-wider">
                  Filtros
                </span>
              </div>

              {/* Pílulas de Filtros */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
                <button 
                  onClick={() => setActiveFilter("todos")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    activeFilter === "todos" 
                      ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/10" 
                      : "bg-surface-container-lowest border-outline-variant/35 text-on-surface-variant hover:bg-slate-100"
                  }`}
                >
                  Todos
                </button>
                <button 
                  onClick={() => setActiveFilter("documentacao")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    activeFilter === "documentacao" 
                      ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/10" 
                      : "bg-surface-container-lowest border-outline-variant/35 text-on-surface-variant hover:bg-slate-100"
                  }`}
                >
                  Documentação (120d)
                </button>
                <button 
                  onClick={() => setActiveFilter("assinatura")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    activeFilter === "assinatura" 
                      ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/10" 
                      : "bg-surface-container-lowest border-outline-variant/35 text-on-surface-variant hover:bg-slate-100"
                  }`}
                >
                  Assinatura (60d)
                </button>
                <button 
                  onClick={() => setActiveFilter("exames")}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all border cursor-pointer ${
                    activeFilter === "exames" 
                      ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/10" 
                      : "bg-surface-container-lowest border-outline-variant/35 text-on-surface-variant hover:bg-slate-100"
                  }`}
                >
                  Exames (30d)
                </button>
              </div>

              {/* Lista de Prazos Ativos */}
              <div className="flex flex-col gap-4">
                {filteredDeadlines.length === 0 ? (
                  <div className="text-center py-10 bg-surface-container-lowest border border-outline-variant/15 rounded-xl select-none">
                    <Info className="w-6 h-6 text-on-surface-variant/40 mx-auto mb-1.5 shrink-0" />
                    <p className="text-xs text-on-surface-variant font-semibold">Nenhum prazo correspondente ativo.</p>
                  </div>
                ) : (
                  filteredDeadlines.map((cand) => {
                    const isOverdue = cand.daysRemaining < 0;
                    const isExpired = cand.daysRemaining === 0;

                    if (isExpired) {
                      return (
                        <div 
                          key={cand.id} 
                          className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-4 border-b-red-600 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div className="bg-red-50 text-red-600 p-2.5 rounded-xl border border-red-100 shrink-0">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <h4 className="font-heading font-black text-on-surface text-sm">{cand.name}</h4>
                                <p className="text-on-surface-variant text-[11px] font-semibold mt-0.5">{cand.details}</p>
                                <span className="text-red-600 font-extrabold text-xs mt-1.5 block uppercase tracking-wider">
                                  Prazo Expirado
                                </span>
                              </div>
                            </div>
                            <span className="bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                              Urgente
                            </span>
                          </div>
                          <button 
                            onClick={() => setCandidateToDisqualify(cand)}
                            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-heading font-bold text-xs uppercase tracking-wider shadow-md shadow-red-600/10 active:scale-[0.99] transition-transform cursor-pointer border-none"
                          >
                            Notificar Desclassificação
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div 
                        key={cand.id}
                        className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-2 border-b-primary/10 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-outline-variant/25">
                            <img alt={cand.name} className="w-full h-full object-cover" src={cand.avatar} />
                          </div>
                          <div>
                            <h4 className="font-heading font-bold text-on-surface text-sm">{cand.name}</h4>
                            <p className="text-on-surface-variant text-[10px] font-medium">{cand.details}</p>
                            
                            <div className="flex items-center gap-1.5 mt-2">
                              {isOverdue ? (
                                <>
                                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                                  <span className="text-red-600 font-black text-xs">
                                    {Math.abs(cand.daysRemaining)} dias (Atraso)
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-secondary shrink-0" />
                                  <span className="text-secondary font-black text-xs">
                                    {cand.daysRemaining} dias restantes
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button 
                          className="px-4 py-2.5 border-2 border-outline/20 hover:bg-slate-100 text-on-surface rounded-xl font-heading font-bold text-[9px] uppercase tracking-wider transition-all cursor-pointer bg-transparent"
                        >
                          {isOverdue ? "Ver Processo" : "Detalhes"}
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Seção 2: Desclassificados por Ausência */}
            <section className="space-y-6">
              
              <div className="space-y-1 select-none">
                <h3 className="font-heading font-black text-xl text-primary">Desclassificados por Ausência</h3>
                <p className="text-on-surface-variant text-xs font-semibold">Candidatos que não cumpriram o prazo regulamentar.</p>
              </div>

              <div className="flex flex-col gap-3">
                {disqualifiedList.map((cand, idx) => (
                  <div 
                    key={idx}
                    className="bg-surface-container-low/40 p-4 rounded-xl border border-outline-variant/30 flex gap-4 items-start hover:bg-surface-container-low/60 transition-colors"
                  >
                    <div className="bg-slate-200/50 p-2.5 rounded-full text-on-surface-variant shrink-0 select-none">
                      <UserX className="w-5 h-5 text-on-surface-variant/80 shrink-0" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-1 select-none">
                        <h4 className="font-heading font-bold text-on-surface text-sm">{cand.name}</h4>
                        <span className="text-on-surface-variant text-[10px] font-semibold">{cand.date}</span>
                      </div>
                      <p className="text-on-surface-variant text-xs leading-relaxed mb-3 font-medium">
                        Motivo: {cand.reason}
                      </p>
                      <div className="flex items-center gap-3 select-none">
                        <span className="text-[9px] bg-tertiary-fixed text-on-tertiary-fixed px-2.5 py-0.5 rounded font-black uppercase tracking-wider">
                          {cand.type}
                        </span>
                        <a className="text-[10px] text-secondary font-black hover:underline cursor-pointer" href="#">
                          Ver log do sistema
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão de Histórico Completo */}
              <div className="pt-2 select-none">
                <button className="w-full py-4 border-2 border-outline-variant text-primary rounded-xl font-heading font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer bg-transparent text-xs uppercase tracking-wider">
                  <History className="w-4.5 h-4.5 shrink-0" />
                  Ver Histórico Completo
                </button>
              </div>

            </section>

            {/* Contextual Help / Edital */}
            <div className="mt-8 p-6 bg-surface-container-low rounded-2xl text-center border border-outline-variant/10 select-none">
              <p className="text-sm text-on-surface-variant mb-1 font-semibold">Dúvidas sobre os prazos?</p>
              <a className="text-secondary font-black text-sm hover:underline underline-offset-4" href="#">
                Consultar Edital Geral SIGAH
              </a>
            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          DIALOG DE CONFIRMAÇÃO DE DESCLASSIFICAÇÃO
          ========================================== */}
      {candidateToDisqualify && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            <div className="flex justify-between items-start border-b border-outline-variant/20 pb-3 select-none">
              <h3 className="text-lg font-black text-primary leading-tight">Confirmar Desclassificação?</h3>
              <button 
                onClick={() => setCandidateToDisqualify(null)}
                className="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
              Você está prestes a notificar e homologar a desclassificação automática de <strong>{candidateToDisqualify.name}</strong> por ausência de prazo regulamentar. Esta ação registrará o evento no diário oficial do sistema e é irreversível.
            </p>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setCandidateToDisqualify(null)}
                className="w-full py-3.5 border-2 border-outline/20 text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer bg-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleDisqualify}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors active:scale-95 border-none shadow-md shadow-red-600/10 cursor-pointer"
              >
                Confirmar Desclassificação
              </button>
            </div>

          </div>
        </div>
      )}

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
          <Clock className="w-5 h-5 animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Fila</span>
        </a>
        <a 
          href={`/${programId}/prazos`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Clock className="w-5 h-5 text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Prazos</span>
        </a>
        <a 
          href={`/${programId}/entregas`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Key className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Entregas</span>
        </a>
      </nav>

    </div>
  );
}
