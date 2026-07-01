// =============================================================================
// app/[programId]/suplencia/page.tsx
// Tela de Gestão de Fila de Reintegração (Passo 20.2).
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
  ChevronRight, 
  Search, 
  AlertOctagon, 
  Award, 
  MapPin, 
  AlertTriangle, 
  Calendar, 
  Briefcase, 
  Download, 
  FileText, 
  UserCheck, 
  X,
  Loader2,
  ListOrdered,
  Home,
  Clock,
  Key,
  Check,
  BarChart2,
  Users
} from "lucide-react";

interface CandidateApto {
  id: string;
  name: string;
  initials: string;
  cpf: string;
  pontos: number;
  criterio: string;
}

export default function FilaReintegracaoPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estado dos filtros de Unidade Alvo
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState("Residencial Esplanada das Flores - Bloco A");
  const [inputUnidade, setInputUnidade] = useState("204-B");

  // Estado dos dados da unidade carregada (atualizados ao filtrar)
  const [unidadeData, setUnidadeData] = useState({
    nome: "APTO 204-B",
    localizacao: "Residencial Esplanada das Flores, Bloco A",
    status: "Com Avarias",
    ultimaVistoria: "12/10/2023",
    agenteFinanceiro: "Caixa Econômica Federal",
    imagem: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVLKfmqDH0eYHhbMAmyOgBF8A7yOJtAPefwI-5cz00tEICdhjYDYXjupdTMkStCy4qg7mF5vLsWp21s0InKfCc_ygerYXxjZytFiZk_IzVHsoIrVpNgYcHBQnIktkHgyScetPeIKo1J9jKfaCBgZEfZjkDfD4xvqAi7mPrfAZDYuPQHIV38diunHY9fPgBbq5pbAZ-QNL2FTiHBMy-pMGOxiGb0rVi2kmJpc47Tvv6yBZjzD8IiPA4ZzZib73LmfjncxlbNfAMUI8"
  });

  // Lista de candidatos aptos
  const [candidatos] = useState<CandidateApto[]>([
    {
      id: "ricardo",
      name: "Ricardo Mendonça de Souza",
      initials: "RM",
      cpf: "123.***.***-09",
      pontos: 94,
      criterio: "Distrato Involuntário"
    },
    {
      id: "ana-lucia",
      name: "Ana Lúcia Ferreira",
      initials: "AL",
      cpf: "456.***.***-12",
      pontos: 88,
      criterio: "Suplente Original"
    },
    {
      id: "joao-marcos",
      name: "João Marcos Oliveira",
      initials: "JM",
      cpf: "789.***.***-55",
      pontos: 82,
      criterio: "Vítima de Calamidade"
    }
  ]);

  // Estado interativo de carregamento do botão filtrar
  const [filtering, setFiltering] = useState(false);

  // Estado de emissão do termo
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApto | null>(null);
  const [issuingTerm, setIssuingTerm] = useState(false);
  const [termSuccess, setTermSuccess] = useState(false);

  // Manipula ação de filtrar unidade
  const handleFilter = () => {
    setFiltering(true);
    setTimeout(() => {
      setFiltering(false);
      // Simula alteração de dados baseando-se no input do usuário
      const cleanUnit = inputUnidade.trim().toUpperCase();
      setUnidadeData({
        nome: cleanUnit.startsWith("APTO") ? cleanUnit : `APTO ${cleanUnit}`,
        localizacao: selectedEmpreendimento,
        status: cleanUnit === "204-B" ? "Com Avarias" : "Regular/Pronto",
        ultimaVistoria: cleanUnit === "204-B" ? "12/10/2023" : "18/12/2023",
        agenteFinanceiro: "Caixa Econômica Federal",
        imagem: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVLKfmqDH0eYHhbMAmyOgBF8A7yOJtAPefwI-5cz00tEICdhjYDYXjupdTMkStCy4qg7mF5vLsWp21s0InKfCc_ygerYXxjZytFiZk_IzVHsoIrVpNgYcHBQnIktkHgyScetPeIKo1J9jKfaCBgZEfZjkDfD4xvqAi7mPrfAZDYuPQHIV38diunHY9fPgBbq5pbAZ-QNL2FTiHBMy-pMGOxiGb0rVi2kmJpc47Tvv6yBZjzD8IiPA4ZzZib73LmfjncxlbNfAMUI8"
      });
    }, 1000);
  };

  // Confirma e exporta o termo gerado
  const handleConfirmTerm = () => {
    if (!selectedCandidate) return;
    setIssuingTerm(true);
    setTimeout(() => {
      setIssuingTerm(false);
      setTermSuccess(true);
      
      // Gera arquivo de texto com o Termo e inicia o download
      const termContent = `TERMO DE REINTEGRACAO E SUBSTITUICAO DE POSSE\n\nIdentificador do Termo: #TR-${selectedCandidate.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}\nData Emissao: ${new Date().toLocaleDateString()}\n\nCandidato Substituto: ${selectedCandidate.name}\nCPF: ${selectedCandidate.cpf}\nPontuacao: ${selectedCandidate.pontos} Pts\nCriterio Prioritario: ${selectedCandidate.criterio}\n\nUnidade Habitacional Destinada:\nEmpreendimento: ${unidadeData.localizacao}\nUnidade: ${unidadeData.nome}\n\nAgente Financeiro Responsavel: ${unidadeData.agenteFinanceiro}\n\nAssinatura do Assistente Social Autorizador: ____________________________\nAssinatura do Candidato Substituto: ____________________________\n\nSIGAH - Sistema Integrado de Gestao Habitacional\n`;
      
      const blob = new Blob([termContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `termo_substituicao_${selectedCandidate.id}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setTermSuccess(false);
        setSelectedCandidate(null);
      }, 2000);
    }, 1500);
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
          
          <main className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-32 space-y-8">
            
            {/* Breadcrumb e Título */}
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-xs font-black text-on-surface-variant uppercase tracking-widest select-none">
                <span>Fila</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-primary font-black">Gestão de Beneficiários</span>
              </nav>
              <div className="space-y-1">
                <h2 className="text-4xl font-extrabold text-primary tracking-tight">Fila de Reintegração</h2>
                <p className="text-on-surface-variant font-medium max-w-2xl text-sm sm:text-base">
                  Gerencie a substituição de beneficiários e a fila de prioridades conforme os critérios legais estabelecidos.
                </p>
              </div>
            </div>

            {/* Filter Section (Clean Card) */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm">
              <div className="flex flex-col md:flex-row items-stretch md:items-end gap-6">
                
                {/* Empreendimento */}
                <div className="flex-grow max-w-md flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                    Empreendimento
                  </label>
                  <select 
                    value={selectedEmpreendimento}
                    onChange={(e) => setSelectedEmpreendimento(e.target.value)}
                    className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-xl py-3.5 px-4 text-on-surface text-xs font-semibold cursor-pointer"
                  >
                    <option value="Residencial Esplanada das Flores - Bloco A">Residencial Esplanada das Flores - Bloco A</option>
                    <option value="Condomínio Portal do Sol - Fase II">Condomínio Portal do Sol - Fase II</option>
                    <option value="Conjunto Habitacional Novo Horizonte">Conjunto Habitacional Novo Horizonte</option>
                  </select>
                </div>

                {/* Unidade */}
                <div className="w-full md:w-48 flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                    Unidade
                  </label>
                  <input 
                    type="text"
                    value={inputUnidade}
                    onChange={(e) => setInputUnidade(e.target.value)}
                    placeholder="Ex: 204-B"
                    className="w-full bg-surface-container-low border-none focus:ring-2 focus:ring-secondary/20 rounded-xl py-3.5 px-4 text-on-surface text-xs font-semibold"
                  />
                </div>

                {/* Botão Filtrar */}
                <button 
                  onClick={handleFilter}
                  disabled={filtering}
                  className="bg-primary hover:brightness-110 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 text-xs uppercase tracking-wider cursor-pointer border-none"
                >
                  {filtering ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4.5 h-4.5 shrink-0" />
                  )}
                  <span>Filtrar Unidade</span>
                </button>

              </div>
            </section>

            {/* Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Hierarquia & Lista de Aptos */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Hierarquia de Prioridades (RF042) */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/20 space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4 select-none">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-container-low rounded-full flex items-center justify-center shrink-0">
                        <AlertOctagon className="w-5 h-5 text-primary shrink-0" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">Hierarquia de Prioridades (RF042)</h3>
                    </div>
                    <span className="text-[9px] bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-black uppercase tracking-wider border border-primary/10">
                      Critério Legal
                    </span>
                  </div>

                  <div className="space-y-4">
                    {/* Priority 01 */}
                    <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border-l-4 border-red-500 hover:bg-slate-100 transition-colors">
                      <span className="text-3xl font-black text-red-500/25 italic select-none">01</span>
                      <div className="flex-grow">
                        <h4 className="font-bold text-primary text-sm sm:text-base">Distrato Involuntário</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Prioridade máxima absoluta para rescisões não causadas pelo beneficiário.</p>
                      </div>
                      <span className="text-[8px] font-black tracking-widest text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded select-none">
                        CRÍTICO
                      </span>
                    </div>

                    {/* Priority 02 */}
                    <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border-l-4 border-secondary/45 hover:bg-slate-100 transition-colors">
                      <span className="text-3xl font-black text-secondary/25 italic select-none">02</span>
                      <div className="flex-grow">
                        <h4 className="font-bold text-primary text-sm sm:text-base">Suplente da Seleção Original</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Candidatos habilitados no sorteio ou seleção inicial do empreendimento.</p>
                      </div>
                    </div>

                    {/* Priority 03 */}
                    <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border-l-4 border-secondary/45 hover:bg-slate-100 transition-colors">
                      <span className="text-3xl font-black text-secondary/25 italic select-none">03</span>
                      <div className="flex-grow">
                        <h4 className="font-bold text-primary text-sm sm:text-base">Vítimas de Calamidade</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Eventos decretados pós 01/01/2023 com comprovação da Defesa Civil.</p>
                      </div>
                    </div>

                    {/* Priority 04 */}
                    <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border-l-4 border-outline-variant hover:bg-slate-100 transition-colors">
                      <span className="text-3xl font-black text-outline-variant/40 italic select-none">04</span>
                      <div className="flex-grow">
                        <h4 className="font-bold text-primary text-sm sm:text-base">Remanejamento de Obras do PAC</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Famílias removidas para execução de obras de infraestrutura federal.</p>
                      </div>
                    </div>

                    {/* Priority 05 */}
                    <div className="flex items-center gap-5 p-4 bg-slate-50 rounded-xl border-l-4 border-outline-variant hover:bg-slate-100 transition-colors">
                      <span className="text-3xl font-black text-outline-variant/40 italic select-none">05</span>
                      <div className="flex-grow">
                        <h4 className="font-bold text-primary text-sm sm:text-base">Áreas de Risco (Risco Alto/Muito Alto)</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Embasamento técnico via PMRR ou laudo geológico específico.</p>
                      </div>
                    </div>
                  </div>

                </section>

                {/* Candidates List */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/20 space-y-6">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 select-none">
                    <div>
                      <h3 className="text-xl font-bold text-primary">Candidatos Aptos para Substituição</h3>
                      <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                        Ordenação automática por pontuação e critérios legais
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-surface-container-low rounded-lg text-primary hover:bg-surface-container-highest transition-colors border-none cursor-pointer">
                        <ListOrdered className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2 bg-surface-container-low rounded-lg text-primary hover:bg-surface-container-highest transition-colors border-none cursor-pointer">
                        <Download className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {candidatos.map((cand) => (
                      <div 
                        key={cand.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-outline-variant/10 hover:border-secondary/20 transition-all gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-black text-xs select-none">
                            {cand.initials}
                          </div>
                          <div>
                            <p className="font-bold text-primary text-sm">{cand.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-black uppercase mt-0.5 select-none">
                              CPF: {cand.cpf}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10">
                          <div className="flex items-center justify-between sm:block gap-4 select-none">
                            <div className="text-left sm:text-right">
                              <p className="text-[9px] font-black text-secondary uppercase tracking-wider leading-none mb-1">Pontuação</p>
                              <p className="text-lg font-black text-primary">{cand.pontos} pts</p>
                            </div>
                            <div className="w-36">
                              <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider leading-none mb-1">Critério</p>
                              <p className={`text-xs font-bold truncate ${cand.criterio === "Distrato Involuntário" ? "text-red-600" : "text-primary"}`}>
                                {cand.criterio}
                              </p>
                            </div>
                          </div>

                          <button 
                            onClick={() => setSelectedCandidate(cand)}
                            className="w-full sm:w-auto px-5 py-3 bg-secondary text-white rounded-lg font-black text-[10px] uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-none"
                          >
                            Emitir Termo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </section>

              </div>

              {/* Right Column: Resumo da Unidade Alvo */}
              <div className="lg:col-span-4 space-y-8">
                
                <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-outline-variant/20 space-y-6">
                  
                  <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                    Resumo da Unidade
                  </h3>

                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-outline-variant/20 select-none">
                    <img 
                      alt="Localização da Unidade" 
                      className="w-full h-full object-cover brightness-95 grayscale contrast-125" 
                      src={unidadeData.imagem} 
                    />
                    <div className="absolute top-3.5 right-3.5 bg-primary px-3 py-1.5 rounded-lg text-white text-[10px] font-black tracking-widest shadow-lg">
                      {unidadeData.nome}
                    </div>
                  </div>

                  <div className="space-y-5">
                    {/* Localização */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest select-none">Localização</p>
                        <p className="text-xs font-bold text-primary leading-relaxed mt-0.5">{unidadeData.localizacao}</p>
                      </div>
                    </div>

                    {/* Status Atual */}
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${unidadeData.status === "Com Avarias" ? "text-red-500" : "text-green-600"}`} />
                      <div>
                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest select-none">Status Atual</p>
                        <p className={`text-xs font-black mt-0.5 uppercase ${unidadeData.status === "Com Avarias" ? "text-red-600" : "text-green-600"}`}>
                          {unidadeData.status}
                        </p>
                      </div>
                    </div>

                    {/* Última Vistoria */}
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest select-none">Última Vistoria</p>
                        <p className="text-xs font-bold text-primary leading-relaxed mt-0.5">{unidadeData.ultimaVistoria}</p>
                      </div>
                    </div>

                    {/* Agente Financeiro */}
                    <div className="flex items-start gap-3">
                      <Briefcase className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest select-none">Agente Financeiro</p>
                        <p className="text-xs font-bold text-primary leading-relaxed mt-0.5">{unidadeData.agenteFinanceiro}</p>
                      </div>
                    </div>
                  </div>

                  {/* Botões do Laudo */}
                  <div className="pt-4 border-t border-slate-100 select-none">
                    <button className="w-full py-3 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/10 active:scale-95 transition-all cursor-pointer border-none">
                      Ver Laudo de Vistoria
                    </button>
                  </div>

                </section>

              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL DE PRÉVIA E EMISSÃO DE TERMO
          ========================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-xl rounded-2xl shadow-2xl p-6 flex flex-col gap-6 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4 select-none">
              <div>
                <h3 className="text-lg font-black text-primary leading-tight">Emitir Termo de Substituição</h3>
                <p className="text-xs text-on-surface-variant font-semibold mt-1">
                  Atribuição de Unidade por Reintegração de Posse
                </p>
              </div>
              <button 
                onClick={() => {
                  if (!issuingTerm && !termSuccess) setSelectedCandidate(null);
                }}
                className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Preview */}
            <div className="bg-slate-50 border border-outline-variant/40 rounded-xl p-5 space-y-4 max-h-96 overflow-y-auto font-sans text-xs">
              
              {termSuccess ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3 select-none">
                  <div className="w-12 h-12 bg-green-100 border border-green-300 text-green-700 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6 text-green-700 shrink-0" />
                  </div>
                  <h4 className="font-extrabold text-sm text-green-800">Termo de Substituição Gerado!</h4>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed max-w-xs">
                    O documento foi assinado eletronicamente e o download do arquivo foi iniciado com sucesso.
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-center border-b border-dashed border-outline-variant/30 pb-3 select-none">
                    <p className="font-black text-primary text-[10px] tracking-widest uppercase">
                      TERMO DE REINTEGRAÇÃO E SUBSTITUIÇÃO DE POSSE
                    </p>
                    <p className="text-[8px] text-outline font-extrabold tracking-widest uppercase mt-0.5">
                      SISTEMA DE CADASTRO E CLASSIFICAÇÃO HABITACIONAL - SIGAH
                    </p>
                  </div>

                  <div className="space-y-2 leading-relaxed">
                    <p>
                      Pelo presente termo, declara-se a atribuição e entrega da unidade habitacional descrita abaixo ao candidato substituto, de acordo com o regulamento do programa habitacional de <strong>{unidadeData.localizacao}</strong>.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 bg-white p-3 rounded-lg border border-outline-variant/25 select-none my-3">
                      <div>
                        <span className="text-[8px] font-black uppercase text-outline block">Substituto</span>
                        <span className="font-bold text-primary">{selectedCandidate.name}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black uppercase text-outline block">CPF</span>
                        <span className="font-bold text-primary">{selectedCandidate.cpf}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black uppercase text-outline block">Destinação</span>
                        <span className="font-bold text-primary">{unidadeData.nome}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black uppercase text-outline block">Critério Prioridade</span>
                        <span className="font-bold text-primary">{selectedCandidate.criterio}</span>
                      </div>
                    </div>

                    <p>
                      Fica estabelecido que o beneficiário substituto concorda integralmente com as condições do Edital Geral, sujeitando-se às vistorias físicas obrigatórias e prazos para assinatura do contrato definitivo de posse.
                    </p>
                  </div>
                </>
              )}

            </div>

            {/* Actions */}
            {!termSuccess && (
              <div className="flex flex-col sm:flex-row gap-3 select-none">
                <button
                  onClick={() => setSelectedCandidate(null)}
                  disabled={issuingTerm}
                  className="w-full py-3.5 border-2 border-outline/20 text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer bg-transparent"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmTerm}
                  disabled={issuingTerm}
                  className="w-full py-3.5 bg-secondary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-colors active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md shadow-secondary/15"
                >
                  {issuingTerm ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 shrink-0" />
                      <span>Confirmar e Emitir</span>
                    </>
                  )}
                </button>
              </div>
            )}

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
          <Clock className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Fila</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <BarChart2 className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Relatórios</span>
        </a>
        <a 
          href={`/${programId}/suplencia`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Users className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Suplentes</span>
        </a>
      </nav>

    </div>
  );
}
// =============================================================================
