// =============================================================================
// app/[programId]/unidades/page.tsx
// Tela de Designação de Unidades - Padronizada Final (Passo 25.1).
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
  Clock, 
  Building2, 
  CheckCircle2, 
  Search, 
  Filter, 
  Accessibility, 
  ArrowRight, 
  User, 
  BrainCircuit, 
  CheckCircle, 
  Download, 
  Loader2, 
  X,
  Sparkles,
  Home,
  FileText,
  Users
} from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  cpf: string;
  tags: { text: string; type: "priority" | "info" }[];
  socialNote?: string;
  neighborSuggestion?: string;
  neighborAvatar?: string;
}

interface UnitState {
  id: string;
  label: string;
  status: "disponivel" | "ocupado" | "selecionado" | "bloqueado";
  isPriority: boolean;
}

export default function UnidadesPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Lista de Candidatos
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "joaquim-ferreira",
      name: "Joaquim Ferreira de Souza",
      cpf: "452.***.***-09",
      tags: [{ text: "PRIORIDADE: TÉRREO", type: "priority" }],
      socialNote: "Candidato idoso com dificuldades de locomoção relatadas na triagem inicial. Necessita de acomodação acessível.",
      neighborSuggestion: "Sugestão de Vizinhança: Nenhuma informada"
    },
    {
      id: "maria-gracas",
      name: "Maria das Graças Silva",
      cpf: "129.***.***-44",
      tags: [
        { text: "IDOSO (65+)", type: "info" },
        { text: "PRIORIDADE: TÉRREO", type: "priority" }
      ],
      socialNote: "Candidata apresenta mobilidade reduzida crônica. Necessita de proximidade com pontos de acesso e rampas externas.",
      neighborSuggestion: "José Mendes (Identificado em pré-cadastro)",
      neighborAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjsCuRXdNRYCSzSiY3MVgqMhH_w6MFtOqxbI1xI7YBwSbwC8UOKWW-viyw03kxS40oVyXlFEOFwduGTBGkHY6Hku4nxcQesuX_1AQO8g0AnMs8ZIWo8fYWibIy6I_AxSMF2e3ygc6WoUTQy0HR9C3Wy8QbNVBSgTxZbGKBD2ea_C8vPN8SNH7AMOswpiE5lYc7AITXUe9lDNf2yr3DWT73sN9EFdSTueyX59Uv_N6nNesI4sRE1gQAY-cbrlgHiIQSzt6GFyQwgaU"
    },
    {
      id: "roberto-carlos",
      name: "Roberto Carlos Oliveira",
      cpf: "882.***.***-12",
      tags: [],
      socialNote: "Demanda geral. Sem condicionantes físicas registradas no dossiê socioeconômico.",
      neighborSuggestion: "Sugestão de Vizinhança: Nenhuma informada"
    }
  ]);

  // Estados Interativos de Designação
  const [selectedCandidateId, setSelectedCandidateId] = useState("maria-gracas");
  const [activeFloor, setActiveFloor] = useState<"térreo" | "1º andar" | "2º andar">("térreo");
  
  // Designações salvas (candidateId -> unitId)
  const [designations, setDesignations] = useState<Record<string, string>>({
    "maria-gracas": "T01" // Inicialmente Maria está na T01
  });

  // Lista de unidades por andar
  const [unitsFloor1, setUnitsFloor1] = useState<UnitState[]>([
    { id: "T01", label: "T01", status: "disponivel", isPriority: true },
    { id: "T02", label: "T02", status: "ocupado", isPriority: false },
    { id: "T03", label: "T03", status: "disponivel", isPriority: true },
    { id: "T04", label: "T04", status: "bloqueado", isPriority: false },
    { id: "T05", label: "T05", status: "disponivel", isPriority: false },
    { id: "T06", label: "T06", status: "disponivel", isPriority: false },
    { id: "T07", label: "T07", status: "ocupado", isPriority: false },
    { id: "T08", label: "T08", status: "disponivel", isPriority: false }
  ]);

  const [unitsFloor2, setUnitsFloor2] = useState<UnitState[]>([
    { id: "101", label: "101", status: "disponivel", isPriority: false },
    { id: "102", label: "102", status: "ocupado", isPriority: false },
    { id: "103", label: "103", status: "disponivel", isPriority: false },
    { id: "104", label: "104", status: "disponivel", isPriority: false },
    { id: "105", label: "105", status: "disponivel", isPriority: false },
    { id: "106", label: "106", status: "disponivel", isPriority: false },
    { id: "107", label: "107", status: "disponivel", isPriority: false },
    { id: "108", label: "108", status: "disponivel", isPriority: false }
  ]);

  const [unitsFloor3, setUnitsFloor3] = useState<UnitState[]>([
    { id: "201", label: "201", status: "disponivel", isPriority: false },
    { id: "202", label: "202", status: "disponivel", isPriority: false },
    { id: "203", label: "203", status: "disponivel", isPriority: false },
    { id: "204", label: "204", status: "ocupado", isPriority: false },
    { id: "205", label: "205", status: "disponivel", isPriority: false },
    { id: "206", label: "206", status: "disponivel", isPriority: false },
    { id: "207", label: "207", status: "disponivel", isPriority: false },
    { id: "208", label: "208", status: "disponivel", isPriority: false }
  ]);

  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Unidade atualmente selecionada no grid para o candidato ativo
  const currentAssignedUnit = designations[selectedCandidateId] || null;

  // Busca lista de unidades do andar ativo
  const getActiveUnits = () => {
    if (activeFloor === "1º andar") return unitsFloor2;
    if (activeFloor === "2º andar") return unitsFloor3;
    return unitsFloor1;
  };

  // Atualiza status local do grid considerando a unidade selecionada
  const getRenderedUnits = () => {
    const baseUnits = getActiveUnits();
    return baseUnits.map(unit => {
      // Se a unidade for a atualmente associada ao candidato selecionado
      if (unit.id === currentAssignedUnit) {
        return { ...unit, status: "selecionado" as const };
      }
      // Evita sobrepor outras unidades ocupadas
      return unit;
    });
  };

  // Ao clicar em uma unidade
  const handleSelectUnit = (unit: UnitState) => {
    if (unit.status === "ocupado") {
      setToastMessage("Esta unidade já está ocupada por outro beneficiário.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (unit.status === "bloqueado") {
      setToastMessage("Esta unidade está bloqueada para manutenção técnica ou reserva legal.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    
    // Associa temporariamente a unidade ao candidato selecionado
    setDesignations(prev => ({
      ...prev,
      [selectedCandidateId]: unit.id
    }));
  };

  // Confirmar Designação definitiva
  const handleConfirmDesignation = () => {
    if (!currentAssignedUnit) {
      setToastMessage("Selecione um apartamento no mapa antes de confirmar.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const candidate = candidates.find(c => c.id === selectedCandidateId);
    
    // Atualiza o status da unidade selecionada para "ocupado" no grid correspondente
    const updateGrid = (grid: UnitState[]) => grid.map(u => {
      if (u.id === currentAssignedUnit) {
        return { ...u, status: "ocupado" as const };
      }
      return u;
    });

    if (activeFloor === "térreo") setUnitsFloor1(updateGrid);
    else if (activeFloor === "1º andar") setUnitsFloor2(updateGrid);
    else if (activeFloor === "2º andar") setUnitsFloor3(updateGrid);

    setToastMessage(`Designação homologada! Unidade ${currentAssignedUnit} vinculada a ${candidate?.name}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Exportar dados para a Caixa (Gera relatório e download client-side)
  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToastMessage("Dados de designação exportados com sucesso!");

      // Conteúdo do relatório
      const dataText = `==================================================
SIGAH - RELATÓRIO DE DESIGNAÇÃO DE UNIDADES
==================================================
Programa Habitacional: ${programId.toUpperCase()}
Empreendimento: Residencial Solar dos Ipês - Bloco A

DESIGNAÇÕES HOMOLOGADAS:
${candidates.map(c => `- Beneficiário: ${c.name}\n  CPF: ${c.cpf}\n  Unidade: ${designations[c.id] || "PENDENTE"}`).join("\n\n")}

Exportado em: ${new Date().toLocaleTimeString("pt-BR")} - ${new Date().toLocaleDateString("pt-BR")}
==================================================`;

      const blob = new Blob([dataText], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `designacao_unidades_${programId}_${Date.now()}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  const activeCandidate = candidates.find(c => c.id === selectedCandidateId);
  const renderedUnits = getRenderedUnits();

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
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho */}
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                <span>Processos</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-primary font-black">Designação de Unidades</span>
              </nav>
              <h2 className="text-3xl font-extrabold text-primary tracking-tight">Designação de Unidades</h2>
            </div>

            {/* Alerta de Prazo */}
            <div className="bg-[#ffdbca] p-4 rounded-xl flex items-center gap-4 border-l-4 border-[#6a3a20] shadow-sm select-none">
              <div className="bg-[#6a3a20] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-white shrink-0" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#341100] uppercase tracking-widest mb-0.5">Prazo de Envio</p>
                <p className="text-[#6a3a20] font-bold text-sm">48h para envio à Caixa</p>
              </div>
            </div>

            {/* Bento Métricas Card */}
            <section className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl shadow-primary/10 select-none">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-sans text-primary-fixed-dim uppercase tracking-widest text-[10px] font-black mb-1">
                      Visão Geral da Demanda
                    </p>
                    <h2 className="font-heading font-black text-4xl">165</h2>
                    <p className="text-on-primary-container text-[10px] font-bold uppercase tracking-tight mt-1">
                      Total de Envolvidos
                    </p>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                    <Building2 className="text-primary-fixed-dim w-6 h-6 shrink-0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="font-heading font-black text-2xl text-emerald-400">120</h3>
                    <p className="text-on-primary-container text-[9px] font-black uppercase mt-1">Candidatos Aptos</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="font-heading font-black text-2xl text-secondary-fixed-dim">45</h3>
                    <p className="text-on-primary-container text-[9px] font-black uppercase mt-1">Unidades Disponíveis</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                <Building2 className="w-[140px] h-[140px] text-white shrink-0" />
              </div>
            </section>

            {/* Exportar Lote */}
            <section className="select-none">
              <button 
                onClick={handleExportData}
                disabled={isExporting}
                className="w-full py-4 bg-secondary text-white rounded-xl font-heading font-bold text-xs uppercase tracking-widest shadow-lg shadow-secondary/15 hover:brightness-110 active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processando e enviando lote...</span>
                  </>
                ) : (
                  <>
                    <span>EXPORTAR PARA AGENTE FINANCEIRO</span>
                    <Download className="w-4.5 h-4.5 text-white" />
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-on-surface-variant mt-2 font-bold opacity-60">
                Última exportação realizada há 2 dias
              </p>
            </section>

            {/* Atalho para Designação Acessível */}
            <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0059bb] flex items-center justify-center shrink-0">
                  <Accessibility className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-primary text-base">Designação Acessível</h4>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed max-w-xl font-semibold">
                    Gerencie a vinculação de candidatos PCD ou idosos com laudo aprovado para unidades adaptadas no térreo com acessibilidade total.
                  </p>
                </div>
              </div>
              <a 
                href={`/${programId}/unidades/acessivel`}
                className="w-full sm:w-auto px-6 py-3.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center shrink-0 hover:brightness-110 active:scale-95 transition-all shadow-md border-none"
              >
                Acessar Vinculação
              </a>
            </section>

            {/* Atalho para Gerenciamento de Adaptações */}
            <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 select-none">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-heading font-black text-primary text-base">Gestão de Adaptações e Construtoras</h4>
                  <p className="text-on-surface-variant text-xs mt-1 leading-relaxed max-w-xl font-semibold">
                    Monitore cronogramas físicos e prazos limites (trava contratual) com as construtoras responsáveis pelas reformas de acessibilidade.
                  </p>
                </div>
              </div>
              <a 
                href={`/${programId}/unidades/adaptacoes`}
                className="w-full sm:w-auto px-6 py-3.5 bg-primary text-white rounded-xl text-[10px] font-bold uppercase tracking-wider text-center shrink-0 hover:brightness-110 active:scale-95 transition-all shadow-md border-none"
              >
                Gerenciar Prazos
              </a>
            </section>

            {/* Lista de Atendimento */}
            <section className="space-y-5">
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-bold text-xl text-primary">Lista de Atendimento</h3>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors border-none cursor-pointer">
                    <Search className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors border-none cursor-pointer">
                    <Filter className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cards de Candidatos */}
              <div className="flex flex-col gap-4">
                {candidates.map((cand) => {
                  const isSelected = cand.id === selectedCandidateId;
                  const unitAssigned = designations[cand.id];

                  return (
                    <div 
                      key={cand.id}
                      onClick={() => setSelectedCandidateId(cand.id)}
                      className={`p-5 rounded-2xl flex flex-col gap-4 shadow-sm border-2 cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? "bg-surface-container-lowest border-secondary shadow-lg shadow-secondary/5" 
                          : "bg-surface-container-lowest border-transparent hover:border-secondary-fixed"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center select-none ${
                          isSelected ? "bg-secondary text-white" : "bg-surface-container-low text-primary"
                        }`}>
                          <User className="w-5 h-5 shrink-0" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="font-heading font-black text-on-surface text-sm">{cand.name}</h4>
                            {isSelected && (
                              <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-secondary text-white rounded-full tracking-wider">
                                EM SELEÇÃO
                              </span>
                            )}
                          </div>
                          <p className="text-on-surface-variant text-xs mt-0.5 select-none font-bold">CPF: {cand.cpf}</p>
                          
                          {unitAssigned && (
                            <p className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200/50 rounded-lg p-1.5 mt-2 font-bold w-fit flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Unidade Vinculada: {unitAssigned}
                            </p>
                          )}

                          <div className="mt-2.5 flex flex-wrap gap-2 select-none">
                            {cand.tags.map(t => (
                              <span 
                                key={t.text} 
                                className={`text-[8px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 tracking-wider ${
                                  t.type === "priority" 
                                    ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" 
                                    : "bg-surface-container-high text-on-surface-variant"
                                }`}
                              >
                                {t.type === "priority" && <Accessibility className="w-3.5 h-3.5 text-on-tertiary-fixed-variant" />}
                                {t.text}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Informações detalhadas expandidas no candidato ativo */}
                      {isSelected && (
                        <div className="space-y-3 mt-2 border-t border-outline-variant/30 pt-4 animate-fade-in">
                          {cand.socialNote && (
                            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20">
                              <div className="flex items-center gap-1.5 mb-1.5 select-none">
                                <BrainCircuit className="w-4 h-4 text-secondary shrink-0" />
                                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Trabalho Social</p>
                              </div>
                              <p className="text-xs italic leading-relaxed text-on-surface-variant">
                                "{cand.socialNote}"
                              </p>
                            </div>
                          )}

                          {cand.neighborSuggestion && cand.neighborSuggestion !== "Sugestão de Vizinhança: Nenhuma informada" && (
                            <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/20 flex items-center gap-3 select-none">
                              {cand.neighborAvatar ? (
                                <img 
                                  alt="José Mendes" 
                                  className="w-8 h-8 rounded-full border border-white object-cover shrink-0" 
                                  src={cand.neighborAvatar} 
                                />
                              ) : (
                                <div className="w-8 h-8 bg-slate-200 text-primary rounded-full flex items-center justify-center shrink-0">
                                  <User className="w-4 h-4" />
                                </div>
                              )}
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Sugestão de Vizinhança</p>
                                <p className="text-xs font-bold text-on-surface">
                                  {cand.neighborSuggestion} <span className="text-[10px] font-normal text-on-surface-variant">(Identificado em pré-cadastro)</span>
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {!isSelected && (
                        <button className="w-full py-3 bg-primary text-white hover:brightness-110 rounded-xl font-heading font-black text-[10px] uppercase tracking-wider shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-1.5 cursor-pointer border-none">
                          <span>DESIGNAR ENDEREÇO</span>
                          <ArrowRight className="w-3.5 h-3.5 text-white shrink-0" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Mapa de Unidades */}
            <section className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm">
              
              <div className="p-6 bg-primary text-white select-none">
                <h4 className="font-heading font-black text-xl leading-tight">Mapa de Unidades</h4>
                <p className="text-xs opacity-75 font-semibold mt-1">Residencial Solar dos Ipês - Bloco A</p>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Seleção do Andar */}
                <div className="flex gap-1.5 p-1.5 bg-surface-container rounded-xl select-none">
                  {(["térreo", "1º andar", "2º andar"] as const).map(floor => (
                    <button 
                      key={floor}
                      onClick={() => setActiveFloor(floor)}
                      className={`flex-1 py-2.5 text-[10px] font-black rounded-lg uppercase tracking-wider cursor-pointer border-none transition-all ${
                        activeFloor === floor 
                          ? "bg-white text-secondary shadow-md" 
                          : "text-on-surface-variant hover:bg-slate-200"
                      }`}
                    >
                      {floor === "térreo" ? "Piso Térreo" : floor}
                    </button>
                  ))}
                </div>

                {/* Grid de Unidades */}
                <div className="grid grid-cols-4 gap-3 select-none">
                  {renderedUnits.map((unit) => {
                    const isOccupied = unit.status === "ocupado";
                    const isSelected = unit.status === "selecionado";
                    const isBlocked = unit.status === "bloqueado";

                    return (
                      <div 
                        key={unit.id}
                        onClick={() => handleSelectUnit(unit)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center relative group transition-all duration-300 border-2 ${
                          isSelected 
                            ? "bg-secondary text-white border-secondary shadow-lg shadow-secondary/20 scale-105" 
                            : isOccupied 
                            ? "bg-surface-container-high text-on-surface-variant/30 opacity-55 border-transparent cursor-not-allowed" 
                            : isBlocked
                            ? "bg-surface-container-high text-on-surface-variant/30 opacity-55 border-transparent cursor-not-allowed"
                            : "bg-secondary-container/5 border-secondary/20 text-on-surface hover:bg-secondary-container/10 cursor-pointer"
                        }`}
                      >
                        <span className="text-[10px] font-bold">{unit.label}</span>
                        {isSelected ? (
                          <CheckCircle2 className="w-5 h-5 mt-1 text-white shrink-0" />
                        ) : isOccupied ? (
                          <User className="w-5 h-5 mt-1 text-on-surface-variant/40 shrink-0" />
                        ) : isBlocked ? (
                          <X className="w-5 h-5 mt-1 text-on-surface-variant/40 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 mt-1.5 rounded-full border border-on-surface-variant/30"></div>
                        )}

                        {/* Tag de Prioridade */}
                        {unit.isPriority && (
                          <div className={`absolute -top-2 -right-2 text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm border ${
                            isSelected 
                              ? "bg-tertiary-fixed text-on-tertiary-fixed-variant border-white/20" 
                              : "bg-tertiary-fixed text-on-tertiary-fixed-variant border-outline-variant/30"
                          }`}>
                            PRIO
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bloco de Confirmação da Designação */}
                <div className="bg-white p-5 rounded-2xl border border-outline-variant/20 shadow-sm space-y-4">
                  <div className="flex flex-col border-l-4 border-secondary pl-4 py-0.5">
                    <p className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider select-none">
                      Unidade Selecionada
                    </p>
                    <p className="font-heading font-black text-primary text-lg">
                      {currentAssignedUnit ? `Unidade ${currentAssignedUnit} - Bloco A` : "Nenhuma unidade selecionada"}
                    </p>
                    {activeCandidate?.tags.some(t => t.text.includes("TÉRREO")) && activeFloor === "térreo" && currentAssignedUnit && (
                      <p className="text-[10px] text-emerald-600 font-bold uppercase mt-1 flex items-center gap-1 select-none">
                        <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                        Prioridade Térrea Atendida
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={handleConfirmDesignation}
                    disabled={!currentAssignedUnit}
                    className="w-full bg-primary hover:bg-primary-container text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 uppercase text-xs tracking-widest cursor-pointer border-none disabled:opacity-55 disabled:cursor-not-allowed transition-all active:scale-[0.99]"
                  >
                    <CheckCircle className="w-4.5 h-4.5 text-white shrink-0" />
                    CONFIRMAR DESIGNAÇÃO
                  </button>
                </div>

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
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Users className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Fila</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <FileText className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Listas</span>
        </a>
      </nav>

    </div>
  );
}
