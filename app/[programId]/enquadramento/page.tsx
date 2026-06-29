// =============================================================================
// app/[programId]/enquadramento/page.tsx
// Tela de Pesquisa de Enquadramento - Padronizada (Passo 22.2).
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
  Send, 
  Search, 
  Filter, 
  Loader2, 
  ShieldCheck, 
  User, 
  UserMinus, 
  AlertTriangle, 
  CheckCircle2, 
  List, 
  Grid, 
  MoreVertical, 
  Calendar, 
  Plus, 
  Users, 
  BarChart2, 
  Home, 
  Clock, 
  Key,
  X,
  FileText,
  Bookmark
} from "lucide-react";

interface CandidateLote {
  id: string;
  name: string;
  nis: string;
  status: "Compatível" | "Incompatível" | "Processando" | "Justificado";
  tags: string[];
  justification?: string;
}

export default function PesquisaEnquadramentoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados locais
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Status: Todos");
  
  const [candidates, setCandidates] = useState<CandidateLote[]>([
    {
      id: "maria-eduarda",
      name: "Maria Eduarda da Silva",
      nis: "123.456.789-01",
      status: "Compatível",
      tags: ["CADMUT OK", "CADÚNICO OK"]
    },
    {
      id: "joao-ricardo",
      name: "João Ricardo Menezes",
      nis: "987.654.321-02",
      status: "Incompatível",
      tags: ["Vínculo Prévio"]
    },
    {
      id: "beatriz-oliveira",
      name: "Beatriz Oliveira Costa",
      nis: "555.444.333-88",
      status: "Processando",
      tags: []
    }
  ]);

  // Logs de processamento
  const [logs, setLogs] = useState([
    {
      id: "log1",
      title: "Lote #8812 processado",
      desc: "412 famílias compatibilizadas.",
      time: "Hoje, 14:22"
    },
    {
      id: "log2",
      title: "Relatório exportado",
      desc: "Exportado para PDF por admin_mcmv.",
      time: "Hoje, 09:15"
    }
  ]);

  // Métricas do Lote
  const [compatiblesCount, setCompatiblesCount] = useState(842);
  const [incompatiblesCount, setIncompatiblesCount] = useState(442);
  const [totalCount, setTotalCount] = useState(1284);

  // Estados de ações
  const [sendingLote, setSendingLote] = useState(false);
  const [exceptionCandidate, setExceptionCandidate] = useState<CandidateLote | null>(null);
  const [exceptionJustification, setExceptionJustification] = useState("");
  const [savingException, setSavingException] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Envio de lote para pesquisa Caixa
  const handleSendLote = () => {
    setSendingLote(true);
    setSuccessBanner(null);
    setTimeout(() => {
      setSendingLote(false);
      
      // Incrementa as métricas
      setTotalCount(prev => prev + 1);
      setCompatiblesCount(prev => prev + 1);
      setSuccessBanner("Lote de Remessa consolidado e transmitido com sucesso!");

      // Gera arquivo XML de Remessa
      const xmlRemessa = `<?xml version="1.0" encoding="UTF-8"?>\n<RemessaEnquadramento>\n  <Header>\n    <Programa>${programId.toUpperCase()}</Programa>\n    <DataGeracao>${new Date().toISOString()}</DataGeracao>\n    <TotalRegistros>${candidates.length}</TotalRegistros>\n  </Header>\n  <Registros>\n${candidates.map(c => `    <Candidato>\n      <Nome>${c.name}</Nome>\n      <NIS>${c.nis}</NIS>\n      <StatusAtual>${c.status}</StatusAtual>\n    </Candidato>`).join("\n")}\n  </Registros>\n</RemessaEnquadramento>\n`;
      
      const blob = new Blob([xmlRemessa], { type: "text/xml;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `remessa_caixa_${programId}_${Date.now()}.xml`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Adiciona um log
      const newLog = {
        id: `log-${Date.now()}`,
        title: `Lote de Remessa transmitido`,
        desc: `Consolidado de ${candidates.length} registros encaminhado para Caixa.`,
        time: "Agora"
      };
      setLogs(prev => [newLog, ...prev]);

      setTimeout(() => setSuccessBanner(null), 3000);
    }, 1500);
  };

  // Tratar Exceção (Justificativa Administrativa)
  const handleSaveException = () => {
    if (!exceptionCandidate || !exceptionJustification.trim()) return;
    setSavingException(true);
    setTimeout(() => {
      setSavingException(false);
      
      // Atualiza o candidato na lista
      setCandidates(prev => prev.map(c => {
        if (c.id === exceptionCandidate.id) {
          return {
            ...c,
            status: "Justificado",
            tags: [...c.tags, "EXCEÇÃO OK"],
            justification: exceptionJustification
          };
        }
        return c;
      }));

      // Atualiza métricas
      setIncompatiblesCount(prev => prev - 1);
      setCompatiblesCount(prev => prev + 1);

      setSuccessBanner(`Exceção registrada para ${exceptionCandidate.name}. Candidato compatibilizado.`);
      
      // Adiciona um log
      const newLog = {
        id: `log-${Date.now()}`,
        title: `Exceção de Enquadramento tratada`,
        desc: `Justificativa para ${exceptionCandidate.name}: "${exceptionJustification}"`,
        time: "Agora"
      };
      setLogs(prev => [newLog, ...prev]);

      setExceptionCandidate(null);
      setExceptionJustification("");
      setTimeout(() => setSuccessBanner(null), 3500);
    }, 1200);
  };

  // Filtragem dos candidatos
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.nis.includes(searchQuery);
    const matchesStatus = statusFilter === "Status: Todos" || 
      (statusFilter === "Compatível" && (c.status === "Compatível" || c.status === "Justificado")) ||
      (statusFilter === "Incompatível" && c.status === "Incompatível") ||
      (statusFilter === "Processando" && c.status === "Processando");
    return matchesSearch && matchesStatus;
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
            
            {/* Mensagem de sucesso */}
            {successBanner && (
              <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in select-none">
                <CheckCircle2 className="w-6 h-6 text-green-700 bg-green-200/50 p-1 rounded-full shrink-0" />
                <span className="text-xs font-bold">{successBanner}</span>
              </div>
            )}

            {/* Cabeçalho da Página */}
            <div className="space-y-1">
              <h2 className="text-3xl font-heading font-black text-primary tracking-tight">
                Pesquisa de Enquadramento
              </h2>
              <p className="text-on-surface-variant text-sm font-medium">
                Gestão de elegibilidade e conformidade financeira.
              </p>
            </div>

            {/* Métricas de Enquadramento (Bento High-Contrast Card) */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-container p-8 text-white shadow-xl shadow-primary/15 select-none">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-sans text-primary-fixed-dim uppercase tracking-widest text-[10px] font-bold mb-1">
                      Métricas de Enquadramento
                    </p>
                    <h2 className="font-heading font-black text-4xl tracking-tight">
                      {totalCount.toLocaleString("pt-BR")}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] font-extrabold text-secondary-fixed bg-white/10 px-2 py-0.5 rounded border border-white/5">
                        Sincronizado há 5min
                      </span>
                      <p className="text-on-primary-container text-[10px] font-semibold uppercase tracking-wider">
                        Total Enviados
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
                      <h3 className="font-heading font-black text-2xl text-emerald-400">
                        {compatiblesCount.toLocaleString("pt-BR")}
                      </h3>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-emerald-400/20 text-emerald-400 rounded border border-emerald-400/10">
                        65% Lote
                      </span>
                    </div>
                    <p className="text-on-primary-container text-[9px] font-black uppercase tracking-wider leading-snug">
                      Famílias<br />Compatíveis
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/15">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="font-heading font-black text-2xl text-error-container">
                        {incompatiblesCount.toLocaleString("pt-BR")}
                      </h3>
                      <span className="text-[8px] font-extrabold uppercase px-2 py-0.5 bg-error-container/20 text-error-container rounded border border-error-container/10">
                        Ação Necessária
                      </span>
                    </div>
                    <p className="text-on-primary-container text-[9px] font-black uppercase tracking-wider leading-snug">
                      Famílias<br />Incompatíveis
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-secondary/15 rounded-full blur-3xl"></div>
              <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-primary-container/40 rounded-full blur-3xl"></div>
            </section>

            {/* Consolidar Lote Section */}
            <section className="relative overflow-hidden rounded-3xl bg-primary-container p-8 text-white shadow-xl shadow-primary/15">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 select-none">
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm border border-white/5 shrink-0">
                    <Bookmark className="text-primary-fixed-dim w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-black text-xl">Consolidar Lote</h4>
                </div>

                <p className="text-on-primary-container text-xs leading-relaxed font-semibold">
                  Prepare as famílias selecionadas para envio ao Agente Financeiro. Esta ação gera o arquivo de remessa normativa.
                </p>

                <button 
                  onClick={handleSendLote}
                  disabled={sendingLote}
                  className="w-full py-4 bg-secondary text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-secondary/20 hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
                >
                  {sendingLote ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Consolidando e enviando lote...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4.5 h-4.5 shrink-0" />
                      <span>ENVIAR LOTE PARA PESQUISA</span>
                    </>
                  )}
                </button>
              </div>

              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 select-none">
                <FileText className="w-[160px] h-[160px] text-white shrink-0" />
              </div>
            </section>

            {/* Filtros Avançados */}
            <section className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/35 space-y-6">
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary shrink-0" /> 
                  Filtros Avançados
                </h3>
                <button 
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("Status: Todos");
                  }}
                  className="text-[10px] font-black text-secondary hover:underline uppercase tracking-wider cursor-pointer border-none bg-transparent"
                >
                  Limpar
                </button>
              </div>

              <div className="space-y-5">
                {/* Busca Rápida */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider select-none">
                    Busca Rápida
                  </label>
                  <div className="relative">
                    <Search className="w-4.5 h-4.5 text-on-surface-variant absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por Nome ou CPF..."
                      className="w-full bg-white border border-outline-variant rounded-lg py-3.5 pl-11 pr-4 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Status do Enquadramento */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider select-none">
                    Status do Enquadramento
                  </label>
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-white border border-outline-variant rounded-lg p-3.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary appearance-none cursor-pointer pr-10"
                  >
                    <option value="Status: Todos">Status: Todos</option>
                    <option value="Compatível">Compatível</option>
                    <option value="Incompatível">Incompatível</option>
                    <option value="Processando">Processando</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Candidatos no Lote */}
            <section className="space-y-6">
              
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-black text-xl text-primary">Candidatos no Lote</h3>
                <div className="flex gap-1.5">
                  <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary border-none cursor-pointer">
                    <List className="w-4.5 h-4.5" />
                  </button>
                  <button className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant hover:text-primary border-none cursor-pointer">
                    <Grid className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {filteredCandidates.map((cand) => (
                  <div 
                    key={cand.id}
                    className={`bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/20 border-b-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-all duration-300 ${
                      cand.status === "Compatível" || cand.status === "Justificado"
                        ? "border-b-emerald-500/50" 
                        : cand.status === "Incompatível"
                        ? "border-b-error/50"
                        : "border-b-primary-fixed/30"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center select-none ${
                        cand.status === "Compatível" || cand.status === "Justificado"
                          ? "bg-emerald-50 text-emerald-600"
                          : cand.status === "Incompatível"
                          ? "bg-red-50 text-error"
                          : "bg-slate-100 text-on-surface-variant"
                      }`}>
                        {cand.status === "Processando" ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-black text-on-surface text-sm">{cand.name}</h4>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider ${
                            cand.status === "Compatível"
                              ? "bg-emerald-500 text-white"
                              : cand.status === "Justificado"
                              ? "bg-teal-600 text-white"
                              : cand.status === "Incompatível"
                              ? "bg-error text-white"
                              : "bg-surface-variant text-on-surface-variant"
                          }`}>
                            {cand.status}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-xs mt-0.5 font-bold uppercase select-none">NIS: {cand.nis}</p>
                        
                        {cand.justification && (
                          <p className="text-[10px] text-teal-700 font-semibold bg-teal-50 border border-teal-200/50 rounded-lg p-2 mt-2 select-none italic">
                            Justificativa: {cand.justification}
                          </p>
                        )}

                        <div className="mt-2.5 flex gap-2 select-none">
                          {cand.tags.map(t => (
                            <span key={t} className="text-[8px] font-black uppercase px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded border border-outline-variant/30 tracking-wider">
                              {t}
                            </span>
                          ))}
                          {cand.status === "Processando" && (
                            <p className="text-[10px] text-on-surface-variant italic mt-0.5">
                              Aguardando retorno do Webservice CAIXA...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {cand.status !== "Processando" && (
                      <div className="flex gap-2">
                        {cand.status === "Incompatível" ? (
                          <button 
                            onClick={() => {
                              setExceptionCandidate(cand);
                              setExceptionJustification("");
                            }}
                            className="flex-grow py-3 bg-primary text-white hover:brightness-110 rounded-xl font-heading font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
                          >
                            <span>TRATAR EXCEÇÃO</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => router.push(`/${programId}/enquadramento/renda`)}
                            className="flex-grow py-3 bg-primary text-white hover:brightness-110 rounded-xl font-heading font-black text-[10px] uppercase tracking-wider active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
                          >
                            <span>VER DETALHES</span>
                          </button>
                        )}
                        <button className="px-4 py-3 bg-surface-container-high hover:bg-slate-200 text-on-surface rounded-xl active:scale-95 transition-transform border-none cursor-pointer">
                          {cand.status === "Incompatível" ? (
                            <UserMinus className="w-4 h-4 text-error" />
                          ) : (
                            <MoreVertical className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Processing Logs (Linha do tempo) */}
            <section className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/35 space-y-6">
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary shrink-0" />
                  Logs de Processamento
                </h3>
                <button className="text-[10px] font-black text-secondary hover:underline uppercase tracking-wider cursor-pointer border-none bg-transparent">
                  Ver Auditoria
                </button>
              </div>

              <div className="space-y-5">
                {logs.map((log, idx) => (
                  <div key={log.id} className="flex gap-4 items-start relative pb-4 before:content-[''] before:absolute before:left-[11px] before:top-6 before:bottom-0 before:w-[2px] before:bg-outline-variant/30 last:before:hidden">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm shrink-0 z-10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-on-surface font-bold leading-tight">{log.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{log.desc}</p>
                      <span className="text-[9px] font-extrabold text-on-surface-variant/70 uppercase block mt-1 tracking-wider">{log.time}</span>
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
          MODAL DE TRATAR EXCEÇÃO
          ========================================== */}
      {exceptionCandidate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4 select-none">
              <div>
                <h3 className="text-lg font-black text-primary leading-tight">Tratar Exceção de Enquadramento</h3>
                <p className="text-xs text-on-surface-variant font-semibold mt-1">
                  Registrar justificativa administrativa de enquadramento
                </p>
              </div>
              <button 
                onClick={() => {
                  if (!savingException) setExceptionCandidate(null);
                }}
                className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-outline-variant/30 select-none">
                <p className="text-xs font-bold text-primary">{exceptionCandidate.name}</p>
                <p className="text-[10px] text-on-surface-variant font-black mt-0.5 uppercase">NIS: {exceptionCandidate.nis}</p>
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-700 font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>Motivo da Incompatibilidade: Vínculo Prévio Detectado</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider select-none">
                  Justificativa Administrativa / Portaria de Isenção
                </label>
                <textarea 
                  value={exceptionJustification}
                  onChange={(e) => setExceptionJustification(e.target.value)}
                  placeholder="Informe o número do processo administrativo ou a justificativa legal para enquadramento excepcional..."
                  rows={4}
                  className="w-full bg-white border border-outline-variant rounded-xl p-3.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 select-none">
              <button
                onClick={() => setExceptionCandidate(null)}
                disabled={savingException}
                className="w-full py-3.5 border-2 border-outline/20 text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer bg-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveException}
                disabled={savingException || !exceptionJustification.trim()}
                className="w-full py-3.5 bg-secondary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-colors active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md shadow-secondary/15 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {savingException ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <span>Compatibilizar</span>
                )}
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
          <Clock className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Fila</span>
        </a>
        <a 
          href={`/${programId}/enquadramento`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <ShieldCheck className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Registro</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <BarChart2 className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Relatórios</span>
        </a>
      </nav>

      {/* FAB: Floating Action Button */}
      <button className="fixed right-6 bottom-20 w-14 h-14 bg-gradient-to-br from-secondary to-primary text-white rounded-2xl shadow-xl shadow-primary/40 flex items-center justify-center active:scale-95 hover:scale-105 transition-transform group z-40 md:flex hidden">
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>

    </div>
  );
}
