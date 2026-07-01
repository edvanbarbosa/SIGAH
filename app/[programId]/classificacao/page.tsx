// =============================================================================
// app/[programId]/classificacao/page.tsx
// Tela de Classificação de Famílias (Passo 17.1).
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
  Info, 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle, 
  X, 
  Activity, 
  AlertTriangle,
  User,
  Users,
  Compass,
  FileText,
  Calendar,
  Key,
  Home,
  CheckCircle2,
  Percent
} from "lucide-react";

interface CriteriaBreakdown {
  name: string;
  points: number;
}

interface CandidateRanking {
  position: number;
  name: string;
  cpf: string;
  isExpress: boolean;
  tags: { text: string; type: "error" | "secondary" | "neutral" | "orange" | "primary" }[];
  renda: number;
  pontos: number;
  breakdown: CriteriaBreakdown[];
  cota: "social" | "pcd" | "idoso" | "geral";
}

export default function ClassificacaoFamiliasPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Lista de candidatos ordenada no ranking
  const [candidates] = useState<CandidateRanking[]>([
    {
      position: 1,
      name: "Maria Oliveira Silva",
      cpf: "***.452.891-**",
      isExpress: true,
      tags: [
        { text: "Calamidade", type: "error" },
        { text: "Mulher Chefe", type: "secondary" },
        { text: "Saúde Crônica", type: "neutral" }
      ],
      renda: 1412.00,
      pontos: 48,
      cota: "social",
      breakdown: [
        { name: "Calamidade Pública (Área de Risco)", points: 20 },
        { name: "Mulher Chefe de Família", points: 15 },
        { name: "Membro com Doença Crônica Grave", points: 13 }
      ]
    },
    {
      position: 2,
      name: "João Batista dos Santos",
      cpf: "***.112.553-**",
      isExpress: false,
      tags: [
        { text: "Idoso", type: "orange" },
        { text: "Quilombola", type: "secondary" }
      ],
      renda: 850.00,
      pontos: 42,
      cota: "idoso",
      breakdown: [
        { name: "Critério de Idoso (Estatuto do Idoso)", points: 25 },
        { name: "Comunidade Quilombola Tradicional", points: 17 }
      ]
    },
    {
      position: 3,
      name: "Ana Terra Indígena",
      cpf: "***.884.221-**",
      isExpress: false,
      tags: [
        { text: "Indígena", type: "primary" },
        { text: "Mulher Chefe", type: "secondary" }
      ],
      renda: 0.00,
      pontos: 40,
      cota: "social",
      breakdown: [
        { name: "Representatividade de Comunidade Indígena", points: 25 },
        { name: "Mulher Chefe de Família", points: 15 }
      ]
    },
    {
      position: 4,
      name: "Juliana Mendes Nogueira",
      cpf: "***.771.602-**",
      isExpress: false,
      tags: [
        { text: "PCD", type: "primary" },
        { text: "Baixa Renda", type: "neutral" }
      ],
      renda: 600.00,
      pontos: 38,
      cota: "pcd",
      breakdown: [
        { name: "Membro com Deficiência (PCD)", points: 25 },
        { name: "Extrema Vulnerabilidade Social", points: 13 }
      ]
    },
    {
      position: 5,
      name: "Ricardo Barbosa Souza",
      cpf: "***.903.114-**",
      isExpress: false,
      tags: [
        { text: "Demanda Geral", type: "neutral" }
      ],
      renda: 1950.00,
      pontos: 15,
      cota: "geral",
      breakdown: [
        { name: "Critério Integridade Geral / Tempo Fila", points: 15 }
      ]
    }
  ]);

  // Estados de busca e filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCota, setSelectedCota] = useState<string>("todos");

  // Estado do candidato selecionado para visualização de detalhes
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRanking | null>(null);

  // Filtra candidatos com base na busca e na cota selecionada
  const filteredCandidates = candidates.filter(cand => {
    const matchesSearch = cand.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          cand.cpf.includes(searchTerm);
    const matchesCota = selectedCota === "todos" || cand.cota === selectedCota;
    return matchesSearch && matchesCota;
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
          
          <main className="w-full max-w-5xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-8">
            
            {/* Título e Subtítulo */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-heading font-black text-primary tracking-tight">
                  Classificação de Famílias
                </h2>
                <p className="text-on-surface-variant text-sm font-medium">
                  Consulte a listagem de candidatos conforme os critérios de prioridade social.
                </p>
              </div>
              <button
                onClick={() => router.push(`/${programId}/classificacao/hierarquizacao`)}
                className="bg-secondary text-white hover:brightness-110 px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
              >
                <span>VER HIERARQUIZAÇÃO AJUSTADA</span>
              </button>
            </div>

            {/* Hero Section / Critérios Vigentes */}
            <section className="bg-primary-container p-6 rounded-xl text-white shadow-lg overflow-hidden relative select-none">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-secondary rounded-full opacity-10 blur-2xl"></div>
              <div className="relative z-10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Info className="text-secondary w-5 h-5" />
                </div>
                <div className="space-y-3 flex-grow">
                  <h3 className="text-lg font-extrabold text-white">Critérios Vigentes</h3>
                  <p className="text-xs text-white/70 leading-relaxed font-semibold">
                    Classificação processada com base em critérios federais (PMCMV) e municipais ativos de acordo com a portaria 1.248/2023.
                  </p>
                  <div className="bg-white/10 p-3 rounded-lg border border-white/5">
                    <p className="text-[9px] font-black uppercase tracking-widest text-secondary-fixed mb-1">
                      Regra de Desempate
                    </p>
                    <p className="text-xs font-semibold">Prioridade para o Responsável Familiar com idade mais avançada.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Resumo Executivo (Bento Stats) */}
            <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-outline-variant/30 pb-4 gap-4 select-none">
                <div>
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Resumo Executivo</p>
                  <h3 className="text-3xl font-black text-primary">
                    75 <span className="text-xs font-extrabold text-on-surface-variant">Unidades Disponíveis</span>
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Total Geral</p>
                  <p className="text-xl font-black text-secondary">
                    500 <span className="text-xs font-semibold text-on-surface-variant">Unid.</span>
                  </p>
                </div>
              </div>

              {/* Progression bars de Cotas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
                {/* Demanda Social */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-on-surface">
                    <span>Demanda Social</span>
                    <span>40 / 250</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all" style={{ width: "16%" }}></div>
                  </div>
                </div>

                {/* PCD */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-on-surface">
                    <span>PCD (Deficientes)</span>
                    <span>15 / 50</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 transition-all" style={{ width: "30%" }}></div>
                  </div>
                </div>

                {/* Idosos */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-on-surface">
                    <span>Idosos</span>
                    <span>10 / 50</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all" style={{ width: "20%" }}></div>
                  </div>
                </div>

                {/* Demanda Geral */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-on-surface">
                    <span>Demanda Geral</span>
                    <span>10 / 150</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: "7%" }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Ranking List Header, Search and Filters */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1 select-none">
                <h3 className="font-extrabold text-lg text-primary">Ranking de Classificação</h3>
                <span className="text-[10px] font-black bg-surface-container-high px-2.5 py-1 rounded text-on-surface-variant tracking-wider">
                  V1.0.0
                </span>
              </div>

              {/* Barra de Filtros e Busca */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Campo de Busca */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant/50" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar candidato por nome ou CPF..."
                    className="w-full bg-surface-container-low border border-outline-variant/35 rounded-xl py-3.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all"
                  />
                </div>

                {/* Filtro por Cota */}
                <div className="relative w-full sm:w-56">
                  <Filter className="absolute left-3.5 top-3 w-4 h-4 text-on-surface-variant/50 select-none" />
                  <select
                    value={selectedCota}
                    onChange={(e) => setSelectedCota(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/35 rounded-xl py-3.5 pl-10 pr-4 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-secondary/50 focus:border-secondary transition-all appearance-none cursor-pointer"
                  >
                    <option value="todos">Todas as Cotas</option>
                    <option value="social">Demanda Social</option>
                    <option value="pcd">PCD (Deficientes)</option>
                    <option value="idoso">Idosos</option>
                    <option value="geral">Demanda Geral</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ranking Cards */}
            <section className="space-y-4">
              {filteredCandidates.length === 0 ? (
                <div className="text-center py-12 bg-surface-container-lowest border border-outline-variant/15 rounded-xl select-none">
                  <Info className="w-8 h-8 text-on-surface-variant/40 mx-auto mb-2 shrink-0" />
                  <p className="text-xs text-on-surface-variant font-semibold">Nenhum candidato encontrado com estes critérios.</p>
                </div>
              ) : (
                filteredCandidates.map((cand) => (
                  <div 
                    key={cand.position}
                    className="bg-surface-container-lowest p-5 rounded-xl shadow-sm border-l-4 border-secondary border border-outline-variant/30 space-y-4 hover:shadow-md transition-all duration-300"
                  >
                    
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <span className={`text-3xl font-black ${
                          cand.position === 1 ? "text-red-600" : cand.position === 2 ? "text-orange-500" : "text-secondary"
                        }`}>
                          {cand.position}º
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-primary">{cand.name}</h4>
                          <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mt-0.5">
                            CPF: {cand.cpf}
                          </p>
                        </div>
                      </div>

                      {cand.isExpress && (
                        <div className="bg-red-50 text-red-600 px-2 py-1 rounded-lg flex items-center gap-1 select-none border border-red-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 fill-red-50" />
                          <span className="text-[9px] font-black uppercase tracking-wider">Expressa</span>
                        </div>
                      )}
                    </div>

                    {/* Tags de Critérios */}
                    <div className="flex flex-wrap gap-1.5 select-none">
                      {cand.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx}
                          className={`text-[9px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider ${
                            tag.type === "error" 
                              ? "bg-red-600 text-white" 
                              : tag.type === "secondary" 
                              ? "bg-secondary/10 text-secondary border border-secondary/20" 
                              : tag.type === "orange" 
                              ? "bg-orange-500 text-white"
                              : tag.type === "primary"
                              ? "bg-primary text-white"
                              : "bg-surface-container-high text-on-surface-variant font-bold border border-outline-variant/30"
                          }`}
                        >
                          {tag.text}
                        </span>
                      ))}
                    </div>

                    {/* Detalhes de Renda e Pontos */}
                    <div className="flex justify-between items-center pt-4 border-t border-outline-variant/30 gap-6">
                      <div className="grid grid-cols-2 gap-6 flex-grow select-none">
                        <div>
                          <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Renda</p>
                          <p className="text-xs font-black text-primary mt-0.5">
                            {cand.renda === 0 ? "R$ 0,00" : `R$ ${cand.renda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Pontos</p>
                          <p className="text-xs font-black text-secondary uppercase mt-0.5">
                            {cand.pontos} Pts
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedCandidate(cand)}
                        className="bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-lg font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer border-none"
                      >
                        Detalhes 
                        <ChevronRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                  </div>
                ))
              )}

              {/* Spinner de Carregando */}
              <div className="flex flex-col items-center py-8 gap-3 opacity-40 select-none">
                <Activity className="animate-spin text-secondary w-6 h-6 shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-widest">Carregando mais famílias...</p>
              </div>
            </section>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL DETALHADO DE PONTUAÇÃO (Interativo)
          ========================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-6 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4 select-none">
              <div>
                <h3 className="text-lg font-black text-primary leading-tight">Detalhamento de Pontos</h3>
                <p className="text-xs text-on-surface-variant font-semibold mt-1">
                  Candidato: {selectedCandidate.name}
                </p>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of score criteria */}
            <div className="space-y-4">
              <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                Critérios Atendidos
              </p>
              <div className="divide-y divide-outline-variant/10 bg-slate-50 rounded-xl border border-outline-variant/20 p-4 space-y-3">
                {selectedCandidate.breakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 text-xs first:pt-0 last:pb-0">
                    <span className="font-semibold text-on-surface-variant leading-relaxed max-w-[240px]">
                      {item.name}
                    </span>
                    <span className="font-black text-secondary bg-secondary/5 px-2 py-0.5 rounded">
                      +{item.points} Pts
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Score box */}
            <div className="bg-secondary-container/20 p-4 rounded-xl border border-secondary/10 flex justify-between items-center select-none">
              <span className="font-bold text-sm text-primary">Pontuação Total:</span>
              <span className="text-lg font-black text-secondary uppercase">
                {selectedCandidate.pontos} Pts
              </span>
            </div>

            {/* Close action */}
            <button 
              onClick={() => setSelectedCandidate(null)}
              className="w-full py-3.5 bg-primary hover:bg-primary-container text-white font-bold rounded-xl text-xs uppercase tracking-wider active:scale-[0.98] transition-transform cursor-pointer border-none shadow-md"
            >
              Fechar Detalhes
            </button>

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
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Percent className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Fila</span>
        </a>
        <a 
          href={`/${programId}/denuncias`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Denúncias</span>
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
