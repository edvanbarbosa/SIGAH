// =============================================================================
// app/[programId]/vistorias/checklist-nbr/page.tsx
// Checklist de Conformidade NBR - Padronizado (Passo 13.1).
// Baseado fielmente no Stitch, projeto "DESIGN SIGAH".
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
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  Loader2,
  FileText,
  Bookmark,
  Info,
  CheckSquare,
  Award,
  Home,
  Users
} from "lucide-react";

interface NbrChecklistItem {
  id: string;
  title: string;
  desc: string;
  status: "conforme" | "defeito" | "aviso" | null;
  observation?: string;
  hasAttachmentButton?: boolean;
  attachmentName?: string;
}

export default function NbrChecklistPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Estados de Modais
  const [showAttachmentModal, setShowAttachmentModal] = useState<string | null>(null);
  const [showFinalReportModal, setShowFinalReportModal] = useState(false);

  // Item de anexo
  const [attachedFileName, setAttachedFileName] = useState("");

  // Lista de Itens do Checklist NBR (Baseado no Mockup do Stitch)
  const [checklist, setChecklist] = useState<NbrChecklistItem[]>([
    {
      id: "nbr-1",
      title: "Room/Bedroom Windows",
      desc: "As janelas de dormitórios e salas de estar não podem estar voltadas exclusivamente para poços internos de ventilação, conforme código de obras vigente.",
      status: "defeito",
      observation: "Abertura inadequada na face norte do bloco B."
    },
    {
      id: "nbr-2",
      title: "Service Area Ventilation",
      desc: "Aberturas em poços internos para áreas de serviço são permitidas, desde que apresentada comprovação técnica de iluminação zenital mínima.",
      status: "aviso",
      hasAttachmentButton: true,
      attachmentName: undefined
    },
    {
      id: "nbr-3",
      title: "Ventilation Towers",
      desc: "Certificação arquitetônica confirmada. Os poços internos funcionam como torres abertas integradas às áreas comuns.",
      status: "conforme"
    },
    {
      id: "nbr-4",
      title: "Ground Floor Access",
      desc: "Verificação concluída: a base dos poços no pavimento térreo permanece sem fechamento total.",
      status: "conforme"
    }
  ]);

  // Atualizar Status do Item
  const handleStatusChange = (id: string, newStatus: "conforme" | "defeito" | "aviso") => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          // Se mudou para conforme, remove observações e anexos antigos se não necessários
          attachmentName: newStatus === "conforme" ? undefined : item.attachmentName
        };
      }
      return item;
    }));

    setToastMessage(`Status do item atualizado para ${newStatus === "conforme" ? "Conforme" : newStatus === "defeito" ? "Com Defeito" : "Aviso"}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simular Upload do Laudo
  const handleUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachedFileName.trim()) {
      alert("Por favor, digite o nome ou descrição do arquivo.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setChecklist(prev => prev.map(item => {
        if (item.id === showAttachmentModal) {
          return {
            ...item,
            attachmentName: attachedFileName,
            status: "conforme" // Muda para conforme automaticamente após anexar o laudo exigido
          };
        }
        return item;
      }));

      setIsUploading(false);
      setShowAttachmentModal(null);
      setAttachedFileName("");

      setToastMessage("Laudo de luminosidade técnica anexado com sucesso!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  // Finalizar Relatório
  const handleFinalizeReport = () => {
    // Verifica se há algum item nulo ou pendente de laudo
    const hasPendingLaudo = checklist.some(i => i.hasAttachmentButton && i.status === "aviso" && !i.attachmentName);
    if (hasPendingLaudo) {
      setToastMessage("Atenção: Por favor, anexe o laudo de luminosidade obrigatório antes de prosseguir.");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    setIsFinishing(true);
    setTimeout(() => {
      setIsFinishing(false);
      setShowFinalReportModal(true);
    }, 1500);
  };

  // Calcular Progresso
  const totalItems = checklist.length;
  const compliantCount = checklist.filter(i => i.status === "conforme").length;
  const progressPercent = Math.round((compliantCount / totalItems) * 100);

  return (
    <div className="bg-surface text-primary min-h-screen pb-24 md:pb-0 flex flex-col font-sans">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <header className="select-none">
              <h2 className="text-3xl font-extrabold text-[#001e40] tracking-tight mb-2">
                Checklist de Auditoria Técnica
              </h2>
              <p className="text-slate-400 text-xs font-semibold max-w-2xl">
                Relatório de conformidade arquitetônica para certificação de torres residenciais e habitabilidade institucional.
              </p>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Painel Resumo (Esquerda) */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                
                <section className="p-8 rounded-2xl bg-[#001e40] text-white shadow-sm flex flex-col justify-between">
                  <h3 className="text-base font-black mb-8 flex items-center gap-3 text-white select-none">
                    <ClipboardCheck className="w-5 h-5 text-white shrink-0" />
                    Resumo da Auditoria
                  </h3>

                  <div className="space-y-6 mb-10 text-sm select-none">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Status Geral</span>
                      <span className="font-black text-white">{progressPercent}% Concluído</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Referência</span>
                      <span className="font-black text-right text-white">Vão 04-A</span>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider mb-2">
                        <span className="text-slate-300">Itens Conformes</span>
                        <span>{compliantCount} / {totalItems}</span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden bg-white/20">
                        <div 
                          className="bg-secondary h-full rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleFinalizeReport}
                    disabled={isFinishing}
                    className="w-full py-4 text-white font-black rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4 bg-secondary border-none cursor-pointer text-xs uppercase tracking-widest"
                  >
                    {isFinishing ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <FileText className="w-4 h-4 text-white shrink-0" />
                        <span>Finalizar Relatório</span>
                      </>
                    )}
                  </button>

                  <p className="text-[9px] text-center text-slate-400 font-semibold italic select-none">
                    Ao finalizar, o PDF será gerado para análise técnica.
                  </p>
                </section>

                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-250 flex items-start gap-3 select-none">
                  <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-black text-[#723610] text-xs mb-1 uppercase tracking-wider">Instruções de Apoio</h5>
                    <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
                      Caso identifique um defeito estrutural grave, utilize o campo de observações para detalhar as dimensões e localização exata do problema.
                    </p>
                  </div>
                </div>

              </div>

              {/* Checklist Principal (Direita) */}
              <div className="lg:col-span-8 space-y-4">
                
                <section className="bg-white p-8 rounded-2xl border border-outline-variant/15 shadow-sm space-y-8">
                  <div className="flex items-center gap-3 select-none">
                    <Bookmark className="w-5 h-5 text-secondary shrink-0" />
                    <h3 className="text-lg font-black text-primary">Conformidade Arquitetônica</h3>
                  </div>

                  <div className="divide-y divide-slate-100 space-y-8">
                    {checklist.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className={`checklist-item pt-6 first:pt-0 flex flex-col md:flex-row md:items-start justify-between gap-6`}
                      >
                        <div className="flex-grow space-y-1">
                          <h4 className="text-xs font-black text-primary uppercase tracking-wider">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                            {item.desc}
                          </p>

                          {/* Seção de Anexo */}
                          {item.hasAttachmentButton && (
                            <div className="pt-3">
                              {item.attachmentName ? (
                                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-250 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider w-fit">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span>Laudo Anexo: {item.attachmentName}</span>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setShowAttachmentModal(item.id)}
                                  className="text-secondary hover:underline font-black text-[10px] flex items-center gap-1 border-none bg-transparent cursor-pointer uppercase tracking-wider"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  Anexar Laudo de Luminosidade
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Status Badges e Seletor */}
                        <div className="flex flex-col gap-2 shrink-0 select-none">
                          <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
                            <button 
                              onClick={() => handleStatusChange(item.id, "conforme")}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer border-none ${
                                item.status === "conforme" 
                                  ? "bg-secondary text-white" 
                                  : "text-slate-500 hover:bg-slate-200 bg-transparent"
                              }`}
                            >
                              Conforme
                            </button>
                            <button 
                              onClick={() => handleStatusChange(item.id, "defeito")}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer border-none ${
                                item.status === "defeito" 
                                  ? "bg-red-500 text-white" 
                                  : "text-slate-500 hover:bg-slate-200 bg-transparent"
                              }`}
                            >
                              Defeito
                            </button>
                            <button 
                              onClick={() => handleStatusChange(item.id, "aviso")}
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer border-none ${
                                item.status === "aviso" 
                                  ? "bg-amber-500 text-white" 
                                  : "text-slate-500 hover:bg-slate-200 bg-transparent"
                              }`}
                            >
                              Aviso
                            </button>
                          </div>

                          {/* Tag de Status Ativo */}
                          <div className="flex justify-end">
                            {item.status === "conforme" && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">
                                Conforme
                              </span>
                            )}
                            {item.status === "defeito" && (
                              <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">
                                Com Defeito
                              </span>
                            )}
                            {item.status === "aviso" && (
                              <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">
                                Aviso
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
          href={`/${programId}/vistorias`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <CheckSquare className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Vistorias</span>
        </a>
        <a 
          href={`/${programId}/cadastro`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Membros</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: ANEXAR LAUDO TÉCNICO
          ========================================== */}
      {showAttachmentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowAttachmentModal(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Anexar Laudo NBR</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowAttachmentModal(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleUploadAttachment} className="p-6 space-y-4">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Nome do Arquivo
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  placeholder="Ex: laudo_iluminacao_servico_assinado.pdf"
                  value={attachedFileName}
                  onChange={(e) => setAttachedFileName(e.target.value)}
                  required
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center select-none bg-slate-50">
                <Upload className="w-8 h-8 text-slate-400 mb-2 animate-bounce" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Carregar Laudo Assinado (PDF)
                </span>
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setShowAttachmentModal(null)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="flex-1 py-3 bg-[#001e40] text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>ANEXAR ARQUIVO</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: RELATÓRIO FINAL GERADO
          ========================================== */}
      {showFinalReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowFinalReportModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Relatório Técnico NBR</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowFinalReportModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 border border-emerald-250 p-4 rounded-xl select-none">
                <Award className="w-8 h-8 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-black block uppercase tracking-wider">Conformidade Arquitetônica Homologada!</span>
                  <p className="text-emerald-700 font-semibold mt-0.5">Certificado emitido e enviado ao sistema central.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-mono text-[10px] text-slate-600 leading-relaxed">
                <span className="text-blue-600 font-bold block mb-1">SIGAH // COMPLIANCE_NBR // VÃO 04-A</span>
                ----------------------------------------<br />
                - CONFORMIDADE GERAL: {progressPercent}%<br />
                - JANELAS DE DORMITÓRIOS: DEFEITO REGISTRADO<br />
                - ÁREA DE SERVIÇO: LAUDO ANEXADO & CERTIFICADO<br />
                - TORRE DE VENTILAÇÃO: CONFORME<br />
                - BASE DO PAVIMENTO: CONFORME<br />
                - AUDITOR: CONTROLADORIA GERAL SIGAH
              </div>

              <div className="pt-2 select-none">
                <button 
                  onClick={() => {
                    setShowFinalReportModal(false);
                    router.push(`/${programId}/vistorias`);
                  }}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  VOLTAR PARA VISTORIAS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
