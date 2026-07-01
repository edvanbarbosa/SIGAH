// =============================================================================
// app/[programId]/classificacao/hierarquizacao/page.tsx
// Hierarquização de Famílias - Ajustada (Passo 17.2).
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
  Info,
  Search,
  Filter,
  Play,
  CheckCircle,
  Eye,
  FileText,
  HeartPulse,
  Users,
  AlertTriangle,
  History,
  CheckCircle2,
  Loader2,
  Download,
  UploadCloud,
  ArrowUpDown
} from "lucide-react";

interface RankedFamily {
  position: number;
  name: string;
  cpf: string;
  isExtremeVulnerability: boolean;
  score: number;
  isEmpate: boolean;
  criteriaTags: { text: string; icon: any }[];
}

export default function HierarquizacaoAjustadaPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingSuccess, setIsProcessingSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Lista de Famílias Rankeadas (mock do Stitch)
  const rankedFamilies: RankedFamily[] = [
    {
      position: 1,
      name: "Maria Socorro dos Santos",
      cpf: "***.492.113-**",
      isExtremeVulnerability: true,
      score: 140,
      isEmpate: false,
      criteriaTags: [
        { text: "Saúde", icon: HeartPulse },
        { text: "Risco", icon: AlertTriangle },
        { text: "Chefia Fem.", icon: Users }
      ]
    },
    {
      position: 2,
      name: "Joaquim Barbosa Ferreira",
      cpf: "***.001.328-**",
      isExtremeVulnerability: false,
      score: 115,
      isEmpate: true,
      criteriaTags: [
        { text: "Tempo", icon: History },
        { text: "Composição", icon: Users }
      ]
    },
    {
      position: 3,
      name: "Franciele Oliveira Lima",
      cpf: "***.882.443-**",
      isExtremeVulnerability: true,
      score: 115,
      isEmpate: true,
      criteriaTags: [
        { text: "Saúde", icon: HeartPulse }
      ]
    }
  ];

  // Filtragem Simples
  const filteredFamilies = rankedFamilies.filter(fam =>
    fam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fam.cpf.includes(searchQuery)
  );

  // Ações
  const handleProcessRanking = () => {
    setIsProcessing(true);
    setToastMessage("Sincronizando vulnerabilidades e recalculando pesos do ranking...");
    setTimeout(() => {
      setIsProcessing(false);
      setIsProcessingSuccess(true);
      setToastMessage("Processamento concluído. Ranking de candidatos atualizado!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 2000);
  };

  const handlePublishResults = () => {
    setToastMessage("Publicando lista oficial de classificação no Diário Oficial...");
    setTimeout(() => {
      setToastMessage("Resultados publicados com sucesso na transparência!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
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
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Header Secundário */}
            <div className="space-y-1 select-none">
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                Classificação e Hierarquização
              </h2>
              <p className="text-slate-400 text-xs font-semibold">
                Edital 002/2024 • Processamento oficial de candidatos baseado em critérios normativos
              </p>
            </div>

            {/* Bento Grid: Status e Reservas Legais */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Processamento Card */}
              <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2 text-secondary select-none">
                    <Info className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Status do Processamento</span>
                  </div>
                  <h3 className="font-headline text-2xl font-black text-primary leading-tight">
                    Hierarquização em Andamento
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold leading-relaxed max-w-lg">
                    O sistema está aplicando 12 critérios de vulnerabilidade sobre a base de candidatos ativos do Edital 002/2024.
                  </p>
                </div>

                <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 select-none">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black mb-1">Candidatos Totais</p>
                      <p className="text-4xl font-headline font-black text-primary">12.482</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-slate-400 font-black mb-1">Processados</p>
                      <p className="text-4xl font-headline font-black text-secondary">8.910</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleProcessRanking}
                    disabled={isProcessing}
                    className={`px-6 py-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl border-none cursor-pointer active:scale-95 transition-all w-full md:w-auto text-white ${
                      isProcessingSuccess 
                        ? "bg-emerald-600 hover:brightness-105" 
                        : "bg-primary hover:brightness-110"
                    }`}
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                    ) : isProcessingSuccess ? (
                      <>
                        <CheckCircle className="w-4.5 h-4.5 text-white" />
                        <span>Ranking Atualizado</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4.5 h-4.5 text-white shrink-0 fill-white" />
                        <span>Processar Ranking</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Reserva Obrigatória Card */}
              <div className="lg:col-span-4 bg-tertiary-container text-white p-6 md:p-8 rounded-2xl flex flex-col justify-between border-l-8 border-l-[#d8885c] shadow-lg relative overflow-hidden select-none">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="text-[10px] font-black uppercase tracking-wider text-white">Reserva Obrigatória</span>
                  </div>
                  <h3 className="font-headline text-xl font-extrabold text-white leading-tight">
                    50% para Extrema Vulnerabilidade
                  </h3>
                  <p className="text-xs font-semibold opacity-90 leading-relaxed">
                    Prioridade legal: Bolsa Família, BPC e casos de Microcefalia comprovada.
                  </p>
                </div>

                <div className="mt-8 space-y-2">
                  <div className="h-2 w-full bg-[#381300] rounded-full overflow-hidden">
                    <div className="h-full bg-[#d8885c] w-[71%]"></div>
                  </div>
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-wider">
                    <span>Reserva Preenchida</span>
                    <span>4.455 / 6.241</span>
                  </div>
                </div>
              </div>

            </section>

            {/* Active Scoring Criteria Cards */}
            <section className="space-y-4 select-none">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-sm font-black text-primary uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-secondary shrink-0" />
                  <span>Critérios de Pontuação Ativos</span>
                </h3>
                <button className="text-secondary text-[10px] font-black uppercase tracking-wider hover:underline border-none bg-transparent cursor-pointer">
                  Configurar Pesos
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Saúde & Violência */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-secondary-container/10 text-secondary rounded-xl">
                      <HeartPulse className="w-6 h-6 shrink-0" />
                    </div>
                    <span className="bg-secondary text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">50 pts</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-black text-sm text-primary mb-1">Saúde & Violência</h4>
                    <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">Câncer, Doenças Raras e Violência Doméstica (Validado).</p>
                  </div>
                </div>

                {/* Composição Familiar */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-secondary-container/10 text-secondary rounded-xl">
                      <Users className="w-6 h-6 shrink-0" />
                    </div>
                    <span className="bg-secondary text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">30 pts</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-black text-sm text-primary mb-1">Composição Familiar</h4>
                    <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">Crianças, Chefia Feminina, Quilombola e Etnias.</p>
                  </div>
                </div>

                {/* Risco Geológico */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-secondary-container/10 text-secondary rounded-xl">
                      <AlertTriangle className="w-6 h-6 shrink-0" />
                    </div>
                    <span className="bg-secondary text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">40 pts</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-black text-sm text-primary mb-1">Risco Geológico</h4>
                    <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">Laudo da Defesa Civil em áreas de risco iminente.</p>
                  </div>
                </div>

                {/* Tempo de Cadastro */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between gap-4">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-secondary-container/10 text-secondary rounded-xl">
                      <History className="w-6 h-6 shrink-0" />
                    </div>
                    <span className="bg-secondary text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">20 pts</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-black text-sm text-primary mb-1">Tempo de Cadastro</h4>
                    <p className="text-slate-400 text-[10px] font-semibold leading-relaxed">Pontuação progressiva por ano no sistema.</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Families list container */}
            <section className="space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
                <div>
                  <h3 className="font-headline font-black text-[#001e40] text-sm uppercase tracking-wide">
                    Lista de Famílias Rankeadas
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold mt-1">Critério de desempate: Maior idade do titular.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-250/20 max-w-md w-full md:w-auto">
                  <div className="relative flex-grow">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Buscar por nome ou CPF..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:w-64 pl-10 pr-4 py-2 text-xs bg-transparent border-none focus:ring-0 text-primary font-black"
                    />
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <button className="px-4 py-2 border-none bg-transparent hover:bg-slate-200 text-slate-500 hover:text-primary rounded-lg font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                    <Filter className="w-4.5 h-4.5" />
                    <span>Filtrar</span>
                  </button>
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {filteredFamilies.map((fam) => (
                  <div
                    key={fam.position}
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
                  >
                    {/* Left rank colored tab */}
                    {fam.position === 1 && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-secondary"></div>
                    )}

                    <div className="flex items-center gap-5">
                      {/* Rank Position Badge */}
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl shadow select-none ${
                        fam.position === 1 
                          ? "bg-primary text-white" 
                          : "bg-slate-100 text-slate-550 border border-slate-200"
                      }`}>
                        {fam.position}º
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-lg text-primary">{fam.name}</h4>
                          {fam.isExtremeVulnerability && (
                            <span className="bg-tertiary-container text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider select-none">
                              Extrema Vulnerabilidade
                            </span>
                          )}
                          {fam.isEmpate && (
                            <span className="bg-secondary/10 text-secondary border border-secondary/20 text-[8px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider select-none flex items-center gap-1">
                              <ArrowUpDown className="w-3 h-3 shrink-0" />
                              Empate
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-400 text-xs font-semibold select-none">CPF: {fam.cpf}</p>
                        
                        {/* Selected Criteria Tags */}
                        <div className="flex flex-wrap gap-2 pt-2 select-none">
                          {fam.criteriaTags.map((tag, idx) => {
                            const Icon = tag.icon;
                            return (
                              <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/50 rounded-lg text-[9px] font-black text-slate-500 uppercase">
                                <Icon className="w-3.5 h-3.5 text-secondary shrink-0" />
                                <span>{tag.text}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:border-l md:border-slate-100 md:pl-8 select-none">
                      <div className="text-left md:text-right">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Pontuação</p>
                        <p className="text-3xl font-headline font-black text-primary">
                          {fam.score} <span className="text-xs text-secondary font-black">pts</span>
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-primary rounded-xl cursor-pointer transition-all active:scale-90">
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        {fam.isExtremeVulnerability && (
                          <button className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-primary rounded-xl cursor-pointer transition-all active:scale-90">
                            <FileText className="w-4.5 h-4.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </section>

          </main>

          {/* Floating Actions bottom */}
          <div className="fixed bottom-8 right-8 flex flex-col sm:flex-row gap-4 items-center z-50 select-none">
            <button className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-slate-50 hover:bg-white text-slate-650 hover:text-primary border border-slate-250 shadow-lg cursor-pointer font-black text-xs uppercase tracking-wider active:scale-95 transition-all">
              <Download className="w-4.5 h-4.5" />
              <span>Exportar Lista</span>
            </button>
            <button
              onClick={handlePublishResults}
              className="flex items-center gap-2 px-6 py-4 rounded-full bg-secondary hover:brightness-110 text-white border-none shadow-2xl cursor-pointer font-black text-xs uppercase tracking-wider active:scale-95 transition-all"
            >
              <UploadCloud className="w-4.5 h-4.5 text-white" />
              <span>Publicar Resultado</span>
            </button>
          </div>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

    </div>
  );
}
