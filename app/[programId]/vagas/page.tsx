// =============================================================================
// app/[programId]/vagas/page.tsx
// Tela de Gestão de Vagas e Reserva Legal (Monitoramento de Cotas)
// Baseada fielmente na tela correspondente do projeto "DESIGN SIGAH" no Stitch.
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { 
  AlertTriangle, 
  MapPin, 
  CheckCircle,
  FileText,
  RefreshCw,
  Users,
  Grid,
  Percent
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  inscriptionNumber: string;
  badge: string;
  badgeColor: string;
  cotaType: "vulnerabilidade" | "idoso" | "pcd" | "geral";
}

const MOCK_SELECTED: Candidate[] = [
  { id: "s1", name: "Adriano Silva de Oliveira", inscriptionNumber: "82941", badge: "VULNERABILIDADE", badgeColor: "bg-primary text-white", cotaType: "vulnerabilidade" },
  { id: "s2", name: "Maria Rita Ferreira", inscriptionNumber: "10293", badge: "IDOSOS", badgeColor: "bg-tertiary text-white", cotaType: "idoso" },
  { id: "s3", name: "Lucas Carvalho Rocha", inscriptionNumber: "99382", badge: "PCD", badgeColor: "bg-secondary text-white", cotaType: "pcd" }
];

const MOCK_SUPLENTES: Candidate[] = [
  { id: "sp1", name: "Gisele Souza Lima", inscriptionNumber: "44210", badge: "VULNERABILIDADE", badgeColor: "bg-primary text-white", cotaType: "vulnerabilidade" },
  { id: "sp2", name: "Roberto Mendes Silva", inscriptionNumber: "20931", badge: "IDOSOS", badgeColor: "bg-tertiary text-white", cotaType: "idoso" },
  { id: "sp3", name: "Fernanda Oliveira Borges", inscriptionNumber: "88321", badge: "DEMANDA GERAL", badgeColor: "bg-outline-variant text-primary font-bold", cotaType: "geral" }
];

export default function VagasReservaLegalPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados interativos da UI
  const [activeTab, setActiveTab] = useState<"selecionados" | "suplentes">("selecionados");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Valores fixos baseados fielmente no Stitch "Gestão de Vagas e Monitoramento de Cotas"
  const totalUnits = 500;
  const occupiedUnits = 425;
  const availableVacancies = 75;
  const occupancyPercentage = 85;

  const handleExportData = () => {
    // Gera dados CSV simulados
    const list = activeTab === "selecionados" ? MOCK_SELECTED : MOCK_SUPLENTES;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Nome,Inscricao,Cota\n"
      + list.map(c => `"${c.id}","${c.name}","${c.inscriptionNumber}","${c.badge}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cotas_${activeTab}_${programId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefreshVacancies = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setNotification("Vagas e status de cotas atualizados com o banco de dados.");
      setTimeout(() => setNotification(null), 3000);
    }, 1200);
  };

  const handleGenerateFinalList = () => {
    setNotification("Lista final de contemplados gerada, homologada e publicada com sucesso!");
    setTimeout(() => setNotification(null), 5000);
  };

  const currentList = activeTab === "selecionados" ? MOCK_SELECTED : MOCK_SUPLENTES;

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-5xl mx-auto px-6 py-10 mb-28 md:mb-28 space-y-8">
            
            {/* Mensagem / Toast de Feedback */}
            {notification && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{notification}</span>
              </div>
            )}

            {/* Cabeçalho da Seção com Barra de Progresso de Ocupação */}
            <section className="mb-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-2">
                    Gestão de Vagas e Reserva Legal
                  </h2>
                  <p className="text-on-surface-variant font-medium text-sm sm:text-base">
                    Monitoramento em tempo real do programa habitacional
                  </p>
                </div>
                <div className="w-full md:w-80 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-primary">
                    <span>Ocupação das Unidades</span>
                    <span>{occupancyPercentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary-container transition-all duration-500" 
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Alerta de Cota Operacional (Stitch) */}
            <section className="bg-[#ffdbca] text-[#341100] border-l-8 border-tertiary p-6 rounded-xl shadow-lg flex items-start gap-4 mb-8">
              <AlertTriangle className="text-tertiary w-8 h-8 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-black text-lg tracking-tight uppercase mb-1">
                  Alerta de Cota Operacional
                </h4>
                <p className="text-[#723610] leading-relaxed text-sm font-medium">
                  A ocupação para <span className="font-bold underline">Áreas de Risco</span> atingiu <span className="font-bold">19% do limite de 20%</span>. 
                  Risco iminente de ultrapassar o teto operacional permitido pela legislação vigente.
                </p>
              </div>
            </section>

            {/* Bento Grid para Informações Gerais e Análises */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Card 1: Status Geral de Ocupação (col-span-8) */}
              <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/10 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-heading text-lg font-bold text-primary">Status Geral de Ocupação</h3>
                  <div className="bg-primary/5 px-3 py-1 rounded-full text-xs font-bold text-primary tracking-widest uppercase">
                    Outubro 2023
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
                  {/* Gráfico circular */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90">
                      <circle 
                        className="text-surface-container-highest" 
                        cx="48" 
                        cy="48" 
                        fill="transparent" 
                        r="40" 
                        stroke="currentColor" 
                        strokeWidth="8"
                      ></circle>
                      <circle 
                        className="text-secondary transition-all duration-700" 
                        cx="48" 
                        cy="48" 
                        fill="transparent" 
                        r="40" 
                        stroke="currentColor" 
                        strokeDasharray="251.2" 
                        strokeDashoffset={251.2 * (1 - occupancyPercentage / 100)} 
                        strokeWidth="8"
                      ></circle>
                    </svg>
                    <span className="absolute font-heading font-black text-xl text-primary">
                      {occupancyPercentage}%
                    </span>
                  </div>

                  {/* Números das Unidades */}
                  <div className="grid grid-cols-2 gap-8 flex-grow w-full text-center sm:text-left">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-primary">{totalUnits}</span>
                      <span className="text-on-surface-variant font-bold text-[10px] uppercase tracking-wider">
                        Total de Unidades
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-secondary">{availableVacancies}</span>
                      <span className="text-on-surface-variant font-bold text-[10px] uppercase tracking-wider">
                        Vagas Disponíveis
                      </span>
                    </div>
                  </div>
                </div>

                {/* Barra de Progresso Horizontal */}
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between items-center text-sm font-bold text-primary">
                    <span>Ocupação Total</span>
                    <span>{occupiedUnits} / {totalUnits}</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary-container transition-all duration-500" 
                      style={{ width: `${occupancyPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card 2: Residencial Alvorada (col-span-4) */}
              <div className="md:col-span-4 bg-primary rounded-xl overflow-hidden shadow-lg flex flex-col group relative min-h-[300px]">
                <img 
                  alt="Canteiro de obras" 
                  className="w-full h-48 object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpwxmN3PBcFD-aFfvbYCWYPQRebVwIbOsoeW3Aidk7N6TcTWWXT_BYptbpE9PTwVEmareDysvc3HBVv6Mojnl9ROfiquo1rpxy8sVi--5Cm99Imetub4hBgTK7HrX065JYehgIqvEgT1AtpMjwZV7Qyh0xUA8pPeC40adssY_n7ZirjorQ7SihUqoKjKGj9LtaP1T5yarLS1ISH8MEerH-zoTj4q2mOUv0hbUgs7W1T8D4GPV7FfWyemaHHrpy2KduCMcMCQkWqvw"
                />
                <div className="p-6 text-on-primary flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-bold text-lg mb-2">Residencial Alvorada</h4>
                    <p className="text-xs opacity-70 leading-relaxed font-medium">
                      Unidade habitacional modelo em fase final de vistoria para entrega imediata.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-secondary-fixed font-bold text-sm">
                    <MapPin className="w-4 h-4 text-secondary-fixed" /> Brasília, DF
                  </div>
                </div>
              </div>

              {/* Card 3: Distribuição de Cotas (col-span-4) - Read-only */}
              <div className="md:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
                <h3 className="text-lg font-bold text-primary mb-6">Distribuição de Cotas</h3>
                
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  {/* Reserva de Extrema Vulnerabilidade - 50% */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-primary shrink-0"></span>
                          Reserva de Extrema Vulnerabilidade
                        </span>
                        <span className="text-[10px] text-on-surface-variant font-normal ml-5">
                          Bolsa Família, BPC ou Microcefalia
                        </span>
                      </span>
                      <span>50%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>

                  {/* PCD - 3% */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-secondary shrink-0"></span>
                        PCD
                      </span>
                      <span>3%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "3%" }}></div>
                    </div>
                  </div>

                  {/* Idosos - 3% */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-tertiary shrink-0"></span>
                        Idosos
                      </span>
                      <span>3%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary rounded-full" style={{ width: "3%" }}></div>
                    </div>
                  </div>

                  {/* Demanda Geral - 44% */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-outline-variant shrink-0"></span>
                        Demanda Geral
                      </span>
                      <span>44%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full bg-outline-variant rounded-full" style={{ width: "44%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: List Section (col-span-8) - Interactive tabs */}
              <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden shadow-sm border border-outline-variant/10 flex flex-col">
                <div className="flex border-b border-outline-variant/10 bg-white">
                  <button 
                    onClick={() => setActiveTab("selecionados")}
                    className={`flex-1 py-4 text-sm font-bold border-b-4 transition-all ${
                      activeTab === "selecionados" 
                        ? "border-secondary text-primary bg-surface-container-lowest" 
                        : "border-transparent text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    Selecionados
                  </button>
                  <button 
                    onClick={() => setActiveTab("suplentes")}
                    className={`flex-1 py-4 text-sm font-medium transition-all ${
                      activeTab === "suplentes" 
                        ? "border-secondary text-primary bg-surface-container-lowest font-bold" 
                        : "border-transparent text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    Suplentes
                  </button>
                </div>
                
                <div className="p-4 space-y-2 bg-white flex-grow">
                  {currentList.map((candidate) => (
                    <div 
                      key={candidate.id} 
                      className={`flex items-center justify-between p-4 rounded-lg group hover:bg-secondary/5 transition-colors duration-300 ${
                        candidate.id.startsWith("sp") ? "bg-surface-container-low/30" : "bg-surface-container-lowest border border-outline-variant/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                          {candidate.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-primary text-sm sm:text-base">{candidate.name}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold mt-0.5">
                            Inscrição #{candidate.inscriptionNumber}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest shrink-0 ${candidate.badgeColor}`}>
                        {candidate.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </main>

          {/* Sticky Bottom Actions Bar */}
          <div className="fixed bottom-0 left-0 lg:left-72 right-0 bg-surface/90 backdrop-blur-md px-8 py-6 flex flex-col md:flex-row gap-4 justify-end items-center z-30 shadow-[0_-8px_24px_rgba(0,30,64,0.05)] border-t border-outline-variant/15">
            <button 
              onClick={handleExportData}
              className="w-full md:w-auto px-8 py-3 rounded-lg border border-outline-variant text-primary font-bold text-sm hover:bg-surface-container transition-all cursor-pointer bg-white"
            >
              Exportar Dados
            </button>
            <button 
              onClick={handleRefreshVacancies}
              disabled={isRefreshing}
              className="w-full md:w-auto px-8 py-3 rounded-lg border border-secondary text-secondary font-bold text-sm hover:bg-secondary/5 transition-all cursor-pointer bg-white flex items-center justify-center gap-2"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : null}
              Atualizar Vagas
            </button>
            <button 
              onClick={handleGenerateFinalList}
              className="w-full md:w-auto px-10 py-3 rounded-lg bg-gradient-to-br from-primary to-primary-container text-white font-extrabold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 cursor-pointer border-none"
            >
              <CheckCircle className="w-4 h-4" />
              Gerar Lista Final
            </button>
          </div>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/90 dark:bg-[#001e40]/90 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Grid className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/cadastro`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cadastro</span>
        </a>
        <a 
          href={`/${programId}/vagas`}
          className="flex flex-col items-center justify-center text-[#0059bb] dark:text-[#0070ea] scale-110"
        >
          <Percent className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Cotas</span>
        </a>
        <a 
          href="#"
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <FileText className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Listas</span>
        </a>
      </nav>

    </div>
  );
}
