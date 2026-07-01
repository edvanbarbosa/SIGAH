// =============================================================================
// app/[programId]/relatorios/page.tsx
// Tela de Relatórios Gerenciais (Passo 19.1).
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
  ShieldCheck, 
  BarChart2, 
  Filter as FilterIcon, 
  ChevronDown, 
  Calendar, 
  CheckSquare, 
  FileSpreadsheet, 
  FileText, 
  Download, 
  TrendingUp, 
  Eye, 
  Loader2,
  CheckCircle,
  Home,
  Clock,
  Key
} from "lucide-react";

export default function RelatoriosGerenciaisPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estado dos Filtros
  const [empreendimento, setEmpreendimento] = useState("Todos os Empreendimentos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [cotaPcd, setCotaPcd] = useState(false);
  const [cotaIdosos, setCotaIdosos] = useState(false);

  // Estado de carregamento nos botões
  const [applyingFilters, setApplyingFilters] = useState(false);
  const [generatingReportId, setGeneratingReportId] = useState<string | null>(null);
  const [exportingDataset, setExportingDataset] = useState(false);
  
  // Estado das métricas (atualizáveis por filtros)
  const [inscricoesAtivas, setInscricoesAtivas] = useState(12482);
  const [candidatosAptos, setCandidatosAptos] = useState(8910);
  const [vagasDisponiveis, setVagasDisponiveis] = useState(456);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Manipulador de aplicação de filtros
  const handleApplyFilters = () => {
    setApplyingFilters(true);
    setSuccessBanner(null);
    setTimeout(() => {
      setApplyingFilters(false);
      // Altera valores de métricas para simular a filtragem
      if (cotaPcd || cotaIdosos || empreendimento !== "Todos os Empreendimentos") {
        setInscricoesAtivas(3412);
        setCandidatosAptos(2180);
        setVagasDisponiveis(124);
      } else {
        setInscricoesAtivas(12482);
        setCandidatosAptos(8910);
        setVagasDisponiveis(456);
      }
      setSuccessBanner("Filtros aplicados com sucesso! Métricas atualizadas.");
      setTimeout(() => setSuccessBanner(null), 3000);
    }, 1200);
  };

  // Limpa todos os filtros
  const handleClearFilters = () => {
    setEmpreendimento("Todos os Empreendimentos");
    setDataInicio("");
    setDataFim("");
    setCotaPcd(false);
    setCotaIdosos(false);
    setInscricoesAtivas(12482);
    setCandidatosAptos(8910);
    setVagasDisponiveis(456);
    setSuccessBanner("Filtros limpos.");
    setTimeout(() => setSuccessBanner(null), 2000);
  };

  // Auxiliar para download de arquivos simulados client-side
  const downloadSimulatedFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trata a geração de relatórios individuais
  const handleGenerateReport = (reportId: string, reportName: string) => {
    setGeneratingReportId(reportId);
    setTimeout(() => {
      setGeneratingReportId(null);
      
      // Gera conteúdo CSV de mock
      const csvContent = `Relatorio;${reportName}\nPrograma;${programId}\nData Geracao;${new Date().toLocaleDateString()}\nFiltros;Empreendimento: ${empreendimento}, PCD: ${cotaPcd}, Idosos: ${cotaIdosos}\n\nPosicao;Nome;CPF;Status;Pontos\n1;Maria Oliveira Silva;***.452.891-**;Selecionado;48\n2;Joao Batista dos Santos;***.112.553-**;Selecionado;42\n3;Ana Terra Indigena;***.884.221-**;Suplente;40\n`;
      downloadSimulatedFile(`${reportId}_${programId}.csv`, csvContent);
    }, 1500);
  };

  // Trata exportação do dataset consolidado completo
  const handleExportDataset = (format: string) => {
    setExportingDataset(true);
    setTimeout(() => {
      setExportingDataset(false);
      
      const csvContent = `DATASET CONSOLIDADO SIGAH - ${programId.toUpperCase()}\nExportado em;${new Date().toLocaleString()}\nInscricoes Ativas;${inscricoesAtivas}\nAptos;${candidatosAptos}\nVagas;${vagasDisponiveis}\n\nNome Completo;CPF;NIS;Renda;Cota;Pontuacao;Fase\nMaria Oliveira Silva;123.452.891-00;123.45289.10-1;1412;Demanda Social;48;Dossie\nJoao Batista dos Santos;234.112.553-11;234.11255.31-2;850;Idosos;42;Vistoria\nAna Terra Indigena;345.884.221-22;345.88422.12-3;0;Demanda Social;40;Dossie\nJuliana Mendes Nogueira;456.771.602-33;456.77160.23-4;600;PCD;38;Cadastro\n`;
      downloadSimulatedFile(`dataset_consolidado_${programId}.${format}`, csvContent);
    }, 1800);
  };

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
            
            {/* Mensagem de sucesso */}
            {successBanner && (
              <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in select-none">
                <CheckCircle className="w-6 h-6 text-green-700 bg-green-200/50 p-1 rounded-full shrink-0" />
                <span className="text-xs font-bold">{successBanner}</span>
              </div>
            )}

            {/* Cabeçalho da Página */}
            <div className="space-y-1">
              <h2 className="text-3xl font-heading font-black text-primary tracking-tight">
                Relatórios Gerenciais
              </h2>
              <p className="text-on-surface-variant text-sm font-medium">
                Análise estratégica e monitoramento de programas habitacionais.
              </p>
            </div>

            {/* Audit Badge */}
            <div className="p-4 bg-primary-container/10 border border-primary/10 text-primary rounded-xl flex items-center gap-3 select-none">
              <div className="bg-primary text-white p-2 rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <p className="font-bold text-xs font-heading uppercase tracking-wider text-primary">
                Suporte a Auditoria e Conformidade
              </p>
            </div>

            {/* Métricas Globais (Bento High-Contrast Section) */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl shadow-primary/15 select-none">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-sans text-primary-fixed-dim uppercase tracking-widest text-[10px] font-bold mb-1">
                      Métricas Globais
                    </p>
                    <h2 className="font-heading font-black text-4xl tracking-tight">
                      {inscricoesAtivas.toLocaleString("pt-BR")}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] font-extrabold text-secondary-fixed bg-white/10 px-2 py-0.5 rounded border border-white/5">
                        +2.4% vs mês ant.
                      </span>
                      <p className="text-on-primary-container text-[10px] font-semibold uppercase tracking-wider">
                        Inscrições Ativas
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/5 shrink-0">
                    <BarChart2 className="text-primary-fixed-dim w-6 h-6" />
                  </div>
                </div>

                {/* Sub-cards Bento */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/15">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-heading font-black text-2xl text-tertiary-fixed">
                        {candidatosAptos.toLocaleString("pt-BR")}
                      </h3>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-tertiary-fixed/20 text-tertiary-fixed rounded border border-tertiary-fixed/10">
                        95% Meta
                      </span>
                    </div>
                    <p className="text-on-primary-container text-[9px] font-black uppercase tracking-wider leading-snug">
                      Candidatos<br />Aptos
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/15">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-heading font-black text-2xl text-error-container">
                        {vagasDisponiveis.toLocaleString("pt-BR")}
                      </h3>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-error-container/20 text-error-container rounded border border-error-container/10">
                        Demanda
                      </span>
                    </div>
                    <p className="text-on-primary-container text-[9px] font-black uppercase tracking-wider leading-snug">
                      Vagas<br />Disponíveis
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary/15 rounded-full blur-3xl"></div>
              <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-primary-container/40 rounded-full blur-3xl"></div>
            </section>

            {/* Filtros Avançados */}
            <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/35 space-y-6">
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                  <FilterIcon className="w-5 h-5 text-primary shrink-0" /> 
                  Filtros Avançados
                </h3>
                <button 
                  onClick={handleClearFilters}
                  className="text-[10px] font-black text-secondary hover:underline uppercase tracking-wider cursor-pointer border-none bg-transparent"
                >
                  Limpar
                </button>
              </div>

              <div className="space-y-5">
                {/* Empreendimento */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider select-none">
                    Empreendimento
                  </label>
                  <div className="relative">
                    <select 
                      value={empreendimento}
                      onChange={(e) => setEmpreendimento(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-lg p-3.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer pr-10"
                    >
                      <option value="Todos os Empreendimentos">Todos os Empreendimentos</option>
                      <option value="Residencial Esplanada I">Residencial Esplanada I</option>
                      <option value="Condomínio Horizonte Azul">Condomínio Horizonte Azul</option>
                    </select>
                    <ChevronDown className="w-4.5 h-4.5 text-on-surface-variant absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Período */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider select-none">
                    Período
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="date"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-lg p-3.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                    <input 
                      type="date"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="w-full bg-white border border-outline-variant rounded-lg p-3.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Cotas Sociais */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider select-none">
                    Cotas Sociais
                  </label>
                  <div className="space-y-3 pt-1">
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                      <input 
                        type="checkbox"
                        checked={cotaPcd}
                        onChange={(e) => setCotaPcd(e.target.checked)}
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">
                        Pessoas com Deficiência (PcD)
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                      <input 
                        type="checkbox"
                        checked={cotaIdosos}
                        onChange={(e) => setCotaIdosos(e.target.checked)}
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-medium text-on-surface group-hover:text-primary transition-colors">
                        Idosos (60+)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Botão Aplicar */}
                <button 
                  onClick={handleApplyFilters}
                  disabled={applyingFilters}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl uppercase text-xs tracking-wider shadow-md hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  {applyingFilters ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Filtrando...</span>
                    </>
                  ) : (
                    <span>Aplicar Filtros</span>
                  )}
                </button>
              </div>
            </section>

            {/* Relatórios Disponíveis */}
            <section className="space-y-6">
              
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-black text-xl text-primary">Relatórios Disponíveis</h3>
                <div className="flex gap-1.5">
                  <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary border-none cursor-pointer">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary border-none cursor-pointer">
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Relatório 1 */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-4 border-b-primary-fixed/30 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-secondary/10 rounded-full flex items-center justify-center text-secondary select-none">
                      <FileSpreadsheet className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-on-surface text-sm">Acompanhamento de Convocações</h4>
                      <p className="text-on-surface-variant text-xs mt-1 leading-relaxed font-medium">
                        Listagem detalhada de candidatos convocados e pendências documentais.
                      </p>
                      <div className="mt-2.5 flex gap-2 select-none">
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded border border-outline-variant/30 tracking-wider">
                          Auditado
                        </span>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded border border-outline-variant/30 tracking-wider">
                          Semanal
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateReport("convocacoes", "Acompanhamento de Convocações")}
                      disabled={generatingReportId !== null}
                      className="flex-grow py-3.5 bg-primary text-white hover:brightness-110 rounded-xl font-heading font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
                    >
                      {generatingReportId === "convocacoes" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Gerando...</span>
                        </>
                      ) : (
                        <span>GERAR CSV</span>
                      )}
                    </button>
                    <button className="px-4 py-3.5 bg-surface-container-high hover:bg-slate-200 text-on-surface rounded-xl active:scale-95 transition-transform border-none cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Relatório 2 */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-4 border-b-tertiary-fixed/50 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 shrink-0 bg-tertiary-fixed/20 rounded-full flex items-center justify-center text-on-tertiary-fixed-variant select-none">
                      <FileText className="w-5 h-5 text-on-tertiary-fixed-variant" />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-on-surface text-sm">Relatório de Auditoria de Cotas</h4>
                      <p className="text-on-surface-variant text-xs mt-1 leading-relaxed font-medium">
                        Validação automática de critérios de reserva legal e prioridades.
                      </p>
                      <div className="mt-2.5 flex gap-2 select-none">
                        <span className="text-[8px] font-black bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded border border-tertiary-fixed/20 tracking-wider">
                          Crítico
                        </span>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded border border-outline-variant/30 tracking-wider">
                          Tempo Real
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleGenerateReport("auditoria_cotas", "Relatório de Auditoria de Cotas")}
                      disabled={generatingReportId !== null}
                      className="flex-grow py-3.5 bg-primary text-white hover:brightness-110 rounded-xl font-heading font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
                    >
                      {generatingReportId === "auditoria_cotas" ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Gerando...</span>
                        </>
                      ) : (
                        <span>GERAR CSV</span>
                      )}
                    </button>
                    <button className="px-4 py-3.5 bg-surface-container-high hover:bg-slate-200 text-on-surface rounded-xl active:scale-95 transition-transform border-none cursor-pointer">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Exportação Consolidada */}
            <section className="relative overflow-hidden rounded-3xl bg-primary-container p-8 text-white shadow-xl shadow-primary/15">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 select-none">
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/5 shrink-0">
                    <Download className="text-primary-fixed-dim w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-black text-xl">Exportação Consolidada</h4>
                </div>

                <p className="text-on-primary-container text-xs leading-relaxed font-semibold">
                  Gere relatórios certificados para auditorias externas ou conselhos fiscais integrando todos os filtros ativos.
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleExportDataset("csv")}
                    disabled={exportingDataset}
                    className="w-full py-4 bg-secondary text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                  >
                    {exportingDataset ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Exportando Dataset...</span>
                      </>
                    ) : (
                      <>
                        <FileSpreadsheet className="w-4 h-4 shrink-0" />
                        <span>EXPORTAR DATASET (.CSV)</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleExportDataset("pdf")}
                      disabled={exportingDataset}
                      className="py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer text-white"
                    >
                      <FileText className="w-3.5 h-3.5 text-white shrink-0" /> 
                      PDF
                    </button>
                    <button 
                      onClick={() => handleExportDataset("xlsx")}
                      disabled={exportingDataset}
                      className="py-3 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer text-white"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-white shrink-0" /> 
                      XLSX
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 select-none">
                <TrendingUp className="w-[160px] h-[160px] text-white shrink-0" />
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
          <Clock className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Fila</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <BarChart2 className="w-5 h-5 text-secondary" style={{ fontVariationSettings: "'FILL' 1" }} />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Relatórios</span>
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
