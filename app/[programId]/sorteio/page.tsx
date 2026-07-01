// =============================================================================
// app/[programId]/sorteio/page.tsx
// Gestão de Sorteio e Suplência (Passo 6.4 / Etapa 59).
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
  Building,
  History,
  Lock,
  Accessibility,
  UserCheck,
  TrendingDown,
  Info,
  Play,
  RotateCw,
  Eye,
  CheckCircle2,
  X,
  FileDown,
  Upload,
  Dices,
  ChevronRight,
  ShieldCheck,
  Download,
  AlertTriangle,
  Home,
  Users,
  User
} from "lucide-react";

interface Candidate {
  class: string;
  name: string;
  protocol: string;
  quota: string;
  quotaColorClass: string;
  cpf: string;
  details: {
    idade: number;
    renda: number;
    nis: string;
    endereco: string;
  };
}

export default function GestaoSorteioPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados principais do Sorteio
  const [lotteryStatus, setLotteryStatus] = useState<"idle" | "running" | "completed">("idle");
  const [activeTab, setActiveTab] = useState<"titulares" | "suplentes">("titulares");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExportingLog, setIsExportingLog] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Dados dos Titulares (Sorteados)
  const titulares: Candidate[] = [
    {
      class: "#001",
      name: "Maria Oliveira Santos",
      protocol: "SIG-2023-9912",
      quota: "PCD",
      quotaColorClass: "bg-[#0059bb]/10 text-[#0059bb] border border-[#0059bb]/20",
      cpf: "***.442.128-**",
      details: {
        idade: 42,
        renda: 1200,
        nis: "123.45678.90-1",
        endereco: "Rua das Flores, Apto 101, Canoas/RS"
      }
    },
    {
      class: "#002",
      name: "João Augusto Ferreira",
      protocol: "SIG-2023-1104",
      quota: "Idoso",
      quotaColorClass: "bg-[#381300]/10 text-[#381300] border border-[#ffdbca]/30",
      cpf: "***.091.238-**",
      details: {
        idade: 67,
        renda: 1412,
        nis: "987.65432.10-9",
        endereco: "Av. Rio Branco, 450, Canoas/RS"
      }
    },
    {
      class: "#003",
      name: "Ana Paula Lima",
      protocol: "SIG-2023-4581",
      quota: "Geral",
      quotaColorClass: "bg-[#43474f]/10 text-[#43474f] border border-[#c3c6d1]/20",
      cpf: "***.772.308-**",
      details: {
        idade: 29,
        renda: 2100,
        nis: "456.78912.34-5",
        endereco: "Rua Esperança, Casa 12, Canoas/RS"
      }
    },
    {
      class: "#004",
      name: "Ricardo Alcantara Mendes",
      protocol: "SIG-2023-7729",
      quota: "Geral",
      quotaColorClass: "bg-[#43474f]/10 text-[#43474f] border border-[#c3c6d1]/20",
      cpf: "***.123.456-**",
      details: {
        idade: 38,
        renda: 1450,
        nis: "124.45678.99-0",
        endereco: "Rua Mathias Velho, 880, Canoas/RS"
      }
    }
  ];

  // Dados dos Suplentes (Reserva)
  const suplentes: Candidate[] = [
    {
      class: "S#001",
      name: "Roberto Mendes Costa",
      protocol: "SIG-2023-8822",
      quota: "Geral",
      quotaColorClass: "bg-[#43474f]/10 text-[#43474f] border border-[#c3c6d1]/20",
      cpf: "***.123.456-**",
      details: {
        idade: 35,
        renda: 1800,
        nis: "332.11290.44-5",
        endereco: "Rua da Várzea, 12, Canoas/RS"
      }
    },
    {
      class: "S#002",
      name: "Clara Nunes Oliveira",
      protocol: "SIG-2023-7182",
      quota: "PCD",
      quotaColorClass: "bg-[#0059bb]/10 text-[#0059bb] border border-[#0059bb]/20",
      cpf: "***.889.332-**",
      details: {
        idade: 31,
        renda: 980,
        nis: "554.21890.33-2",
        endereco: "Bairro Harmonia, Bloco C, Canoas/RS"
      }
    },
    {
      class: "S#003",
      name: "José Bonifácio Silva",
      protocol: "SIG-2023-3392",
      quota: "Idoso",
      quotaColorClass: "bg-[#381300]/10 text-[#381300] border border-[#ffdbca]/30",
      cpf: "***.554.218-**",
      details: {
        idade: 71,
        renda: 1412,
        nis: "122.90112.55-6",
        endereco: "Rua República, Apto 402, Canoas/RS"
      }
    }
  ];

  // Executar sorteio
  const handleExecuteLottery = () => {
    setLotteryStatus("running");
    setToastMessage("Processando algoritmo de sorteio auditável...");
    setTimeout(() => {
      setLotteryStatus("completed");
      setToastMessage("Sorteio eletrônico concluído e chaves públicas criptografadas registradas!");
      setTimeout(() => setToastMessage(null), 4000);
    }, 2000);
  };

  // Exportar Log Criptografado
  const handleExportLog = () => {
    setIsExportingLog(true);
    setToastMessage("Exportando logs assinados digitalmente...");
    setTimeout(() => {
      setIsExportingLog(false);
      setToastMessage("Arquivo de log (XML/Criptografado) baixado com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Publicar e Notificar
  const handlePublish = () => {
    setIsPublishing(true);
    setToastMessage("Homologando resultados no Diário Oficial e notificando candidatos...");
    setTimeout(() => {
      setIsPublishing(false);
      setToastMessage("Resultados publicados com sucesso no portal SIGAH!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1800);
  };

  const activeList = activeTab === "titulares" ? titulares : suplentes;

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-7xl mx-auto px-6 pt-24 pb-32">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho */}
            <section className="mb-8 select-none">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="font-headline text-3xl font-black text-primary mb-2 tracking-tight">
                    Sorteio e Suplência
                  </h2>
                  <div className="flex items-center gap-2 text-on-surface-variant font-semibold text-xs sm:text-sm">
                    <Building className="text-secondary w-4.5 h-4.5 shrink-0" />
                    <span>Projeto Ativo: <span className="text-primary font-black">Residencial Solar dos Ipês</span></span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setToastMessage("Abrindo histórico de sorteios anteriores...")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-250 hover:bg-slate-50 transition-colors text-xs font-black text-primary uppercase tracking-wider bg-transparent cursor-pointer"
                  >
                    <History className="w-4 h-4 text-secondary shrink-0" />
                    <span>Ver Histórico</span>
                  </button>
                  <button 
                    onClick={() => setToastMessage("Carregando chaves públicas e hashes do sorteio...")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-250 hover:bg-slate-50 transition-colors text-xs font-black text-primary uppercase tracking-wider bg-transparent cursor-pointer"
                  >
                    <Lock className="w-4 h-4 text-secondary shrink-0" />
                    <span>Log de Auditoria</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Layout em Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              
              {/* Esquerda: Parâmetros de Cota Legal (4 Colunas) */}
              <div className="xl:col-span-4 flex flex-col gap-6 select-none">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">
                  Parâmetros de Cota Legal
                </h3>

                {/* Card Cota PCD */}
                <div className="bg-white p-6 rounded-2xl border-l-4 border-secondary border-y border-r border-slate-200/60 shadow-sm flex flex-col gap-4 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-secondary/15 rounded-full text-secondary shrink-0">
                      <Accessibility className="w-5 h-5" />
                    </div>
                    <span className="bg-secondary text-white text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      Automático
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline text-base font-extrabold text-primary">Cota PCD</h4>
                    <p className="text-3xl font-black text-secondary mt-1">
                      3% <span className="text-xs font-normal text-on-surface-variant font-bold">(Mín. Legal)</span>
                    </p>
                  </div>
                </div>

                {/* Card Cota Idosos */}
                <div className="bg-white p-6 rounded-2xl border-l-4 border-secondary border-y border-r border-slate-200/60 shadow-sm flex flex-col gap-4 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-secondary/15 rounded-full text-secondary shrink-0">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <span className="bg-secondary text-white text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      Automático
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline text-base font-extrabold text-primary">Cota Idosos</h4>
                    <p className="text-3xl font-black text-secondary mt-1">
                      3% <span className="text-xs font-normal text-on-surface-variant font-bold">(Mín. Legal)</span>
                    </p>
                  </div>
                </div>

                {/* Card Prioridade Mulher Chefe */}
                <div className="bg-white p-6 rounded-2xl border-l-4 border-[#381300] border-y border-r border-slate-200/60 shadow-sm flex flex-col gap-4 hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-[#ffdbca] rounded-full text-[#381300] shrink-0 font-extrabold">
                      ♀
                    </div>
                    <span className="bg-[#381300] text-white text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-wider">
                      Prioridade
                    </span>
                  </div>
                  <div>
                    <h4 className="font-headline text-base font-extrabold text-primary">Mulher Chefe de Família</h4>
                    <p className="text-xs text-on-surface-variant font-bold leading-relaxed mt-2">
                      Critério prioritário ordinário para desempate de pontuações equivalentes.
                    </p>
                  </div>
                </div>

              </div>

              {/* Direita: Execução e Resultados (8 Colunas) */}
              <div className="xl:col-span-8 flex flex-col gap-6">
                
                {/* Painel de Execução do Sorteio */}
                <div className="bg-[#f3f4f5] rounded-3xl p-6 md:p-8 border border-slate-200/50 shadow-sm relative overflow-hidden select-none">
                  
                  {/* Decoração */}
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>

                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="flex-1 space-y-4">
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="bg-primary text-white text-[8px] px-3 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                          <ShieldCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                          <span>Processo Auditável</span>
                        </span>
                        <span className="text-xs text-on-surface-variant font-bold">
                          Status: {" "}
                          <span className={`font-black ${lotteryStatus === "completed" ? "text-emerald-700" : "text-primary"}`}>
                            {lotteryStatus === "completed" ? "Sorteio Realizado" : "Pronto para Sorteio"}
                          </span>
                        </span>
                      </div>

                      <h3 className="font-headline text-2xl font-black text-primary leading-tight">
                        Execução do Sorteio Eletrônico
                      </h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Candidatos Aptos</p>
                          <p className="text-2xl font-black text-primary mt-1">1.542</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
                          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider">Unidades Disponíveis</p>
                          <p className="text-2xl font-black text-primary mt-1">500</p>
                        </div>
                      </div>

                      {/* Caixa de Alerta */}
                      <div className="flex items-start gap-3 p-4 bg-[#ffdbca]/40 rounded-xl border border-[#ffdbca]">
                        <AlertTriangle className="text-[#723610] w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-xs text-[#723610] leading-normal font-bold">
                          A demanda (1.542) excede o número de unidades (500). O sistema gerará automaticamente uma lista de suplência de 30% (150 famílias).
                        </p>
                      </div>

                      {lotteryStatus === "idle" && (
                        <button 
                          onClick={handleExecuteLottery}
                          className="px-8 py-4 rounded-xl text-white font-black text-xs uppercase tracking-wider bg-gradient-to-br from-[#001e40] to-[#003366] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border-none cursor-pointer shadow-lg shadow-primary/15"
                        >
                          <Dices className="w-5 h-5 text-white shrink-0" />
                          <span>Executar Sorteio Eletrônico</span>
                        </button>
                      )}

                      {lotteryStatus === "running" && (
                        <button 
                          disabled
                          className="px-8 py-4 rounded-xl text-white font-black text-xs uppercase tracking-wider bg-[#001e40] opacity-80 transition-all flex items-center justify-center gap-2 border-none w-full md:w-auto"
                        >
                          <RotateCw className="w-5 h-5 animate-spin text-white shrink-0" />
                          <span>Processando Algoritmo...</span>
                        </button>
                      )}

                      {lotteryStatus === "completed" && (
                        <button 
                          disabled
                          className="px-8 py-4 rounded-xl text-white font-black text-xs uppercase tracking-wider bg-emerald-600 transition-all flex items-center justify-center gap-2 border-none w-full md:w-auto shadow-md"
                        >
                          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                          <span>Sorteio Realizado</span>
                        </button>
                      )}

                    </div>

                    <div className="hidden md:flex w-40 h-40 bg-white/70 backdrop-blur-md rounded-full p-4 border border-white/40 shadow-inner shrink-0 items-center justify-center">
                      <div className={`w-full h-full rounded-full border-4 border-dashed border-secondary/25 flex flex-col items-center justify-center ${lotteryStatus === "running" ? "animate-spin" : ""}`}>
                        <Dices className={`w-10 h-10 text-secondary transition-all ${lotteryStatus === "completed" ? "scale-110 rotate-12" : ""}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção de Resultados (Tabs) */}
                {lotteryStatus === "completed" && (
                  <div className="space-y-4 animate-fade-in">
                    
                    {/* Abas */}
                    <div className="flex border-b border-slate-200 select-none">
                      <button 
                        onClick={() => setActiveTab("titulares")}
                        className={`px-6 py-3 border-b-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer bg-transparent border-none ${
                          activeTab === "titulares" 
                            ? "border-secondary text-secondary" 
                            : "border-transparent text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        Titulares (500)
                      </button>
                      <button 
                        onClick={() => setActiveTab("suplentes")}
                        className={`px-6 py-3 border-b-2 font-black text-xs uppercase tracking-wider transition-all cursor-pointer bg-transparent border-none ${
                          activeTab === "suplentes" 
                            ? "border-secondary text-secondary" 
                            : "border-transparent text-on-surface-variant hover:text-primary"
                        }`}
                      >
                        Suplentes (150)
                      </button>
                    </div>

                    {/* Tabela de Resultados */}
                    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-[#f3f4f5] select-none">
                            <tr>
                              <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                                Class.
                              </th>
                              <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                                Beneficiário
                              </th>
                              <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                                Cota
                              </th>
                              <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                                CPF
                              </th>
                              <th className="px-6 py-4 text-[9px] font-black text-on-surface-variant uppercase tracking-widest text-right">
                                Ação
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {activeList.map((cand) => (
                              <tr key={cand.class} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-xs font-black text-primary">
                                  {cand.class}
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-xs font-extrabold text-primary leading-tight">{cand.name}</p>
                                  <p className="text-[10px] text-slate-450 mt-1 font-bold select-none uppercase tracking-wider">
                                    Protocolo: {cand.protocol}
                                  </p>
                                </td>
                                <td className="px-6 py-4 select-none">
                                  <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${cand.quotaColorClass}`}>
                                    {cand.quota}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-mono text-xs font-semibold text-on-surface-variant">
                                  {cand.cpf}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <button 
                                    onClick={() => setSelectedCandidate(cand)}
                                    className="text-primary hover:bg-slate-100 p-2 rounded-full transition-colors border-none cursor-pointer bg-transparent"
                                  >
                                    <Eye className="w-4.5 h-4.5 text-[#0059bb]" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center select-none">
                        <button 
                          onClick={() => setToastMessage("Visualizando lista completa via PDF...")}
                          className="text-secondary font-black text-xs hover:underline uppercase tracking-wider border-none bg-transparent cursor-pointer"
                        >
                          Ver lista completa ({activeTab === "titulares" ? "500" : "150"} itens)
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* Publicação Oficial e Controles do Rodapé */}
            {lotteryStatus === "completed" && (
              <div className="mt-12 bg-white border border-slate-200/60 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm animate-fade-in select-none">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#f3f4f5] rounded-full flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-primary uppercase tracking-wider">Aguardando Publicação Oficial</p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5 font-bold">O resultado foi gerado e criptografado com sucesso.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button 
                    onClick={handleExportLog}
                    disabled={isExportingLog}
                    className="px-6 py-3.5 border border-slate-250 hover:bg-slate-50 text-xs font-black text-primary rounded-xl flex items-center justify-center gap-2 cursor-pointer bg-transparent uppercase tracking-wider transition-all"
                  >
                    {isExportingLog ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 text-secondary shrink-0" />
                    )}
                    <span>Exportar Log (Criptografado)</span>
                  </button>

                  <button 
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="px-8 py-3.5 bg-secondary text-white rounded-xl text-xs font-black hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border-none cursor-pointer uppercase tracking-wider"
                  >
                    {isPublishing ? (
                      <RotateCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Upload className="w-4 h-4 text-white shrink-0" />
                    )}
                    <span>Publicar e Notificar Agente</span>
                  </button>
                </div>
              </div>
            )}

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL DE DETALHES DO CANDIDATO SORTEADO
          ========================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 select-none">
              <div>
                <h3 className="text-base font-black text-primary uppercase tracking-wide">Comprovante de Sorteio</h3>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase">
                  Dossiê e Dados de Ticket Auditável
                </p>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent flex items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs font-semibold text-primary">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">Nome</span>
                  <span className="font-bold text-xs">{selectedCandidate.name}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">CPF</span>
                  <span className="font-bold text-xs">{selectedCandidate.cpf}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">NIS (CadÚnico)</span>
                  <span className="font-bold text-xs">{selectedCandidate.details.nis}</span>
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-450 uppercase block">Renda Familiar</span>
                  <span className="font-bold text-xs">
                    R$ {selectedCandidate.details.renda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[9px] font-black text-slate-450 uppercase block mb-1">Cota Enquadrada</span>
                <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${selectedCandidate.quotaColorClass}`}>
                  {selectedCandidate.quota}
                </span>
              </div>

              <div>
                <span className="text-[9px] font-black text-slate-450 uppercase block mb-1">Endereço Declarado</span>
                <p className="text-xs text-on-surface-variant leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-150 font-medium">
                  {selectedCandidate.details.endereco}
                </p>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => setSelectedCandidate(null)}
              className="w-full py-3.5 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none shadow-md"
            >
              Fechar Detalhes
            </button>

          </div>
        </div>
      )}

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 flex justify-around items-center px-4 pb-4 pt-2 bg-white border-t border-slate-200/50 rounded-t-xl select-none shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <Home className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-4 py-1 active:scale-90 duration-200 border-none cursor-pointer">
          <Dices className="w-5 h-5 text-[#0059bb]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Sorteio</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <Users className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Fila</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <User className="w-5 h-5 text-[#43474f]" />
          <span className="font-label text-[10px] font-medium tracking-wide">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
