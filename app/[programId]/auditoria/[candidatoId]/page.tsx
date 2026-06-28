// =============================================================================
// app/[programId]/auditoria/[candidatoId]/page.tsx
// Auditoria - Detalhe do Candidato (Dossiê) (Passo 30.1).
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
  ChevronRight,
  ShieldCheck,
  FileText,
  Download,
  Info,
  CheckCircle2,
  X,
  UploadCloud,
  Loader2,
  Calendar,
  AlertTriangle,
  History,
  TrendingUp,
  Briefcase,
  Users,
  Home
} from "lucide-react";

interface AuditTimelineItem {
  date: string;
  time: string;
  title: string;
  desc: string;
  actor: string;
  actorAvatar?: string;
  isSystem?: boolean;
  verified?: boolean;
}

interface LinkedDocItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: "validado" | "pendente" | "recusado";
}

export default function CandidatoAuditDossiePage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;
  const candidatoId = params.candidatoId as string;

  // Estados dos Documentos
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Estados dos Modais
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [uploadDocName, setUploadDocName] = useState("");
  const [uploadDocType, setUploadDocType] = useState("PDF");
  const [uploadDocSize, setUploadDocSize] = useState("2.1MB");

  // Lista de Documentos
  const [documents, setDocuments] = useState<LinkedDocItem[]>([
    { id: "doc-1", name: "Comprovante de Residência", type: "PDF", size: "1.2MB", status: "validado" },
    { id: "doc-2", name: "Carteira de Trabalho", type: "JPG", size: "4.5MB", status: "validado" },
    { id: "doc-3", name: "Laudo Médico (PCD)", type: "PDF", size: "2.8MB", status: "pendente" }
  ]);

  // Lista do Timeline de Auditoria
  const [timeline, setTimeline] = useState<AuditTimelineItem[]>([
    {
      date: "25 OUT 2023",
      time: "14:30",
      title: "Candidato Classificado no Certame",
      desc: "Processamento automático via motor de regras SIGAH v4.2",
      actor: "Motor do Sistema",
      isSystem: true
    },
    {
      date: "22 OUT 2023",
      time: "09:15",
      title: "Documentação Validada",
      desc: "Verificação manual de comprovante de residência e laudo médico.",
      actor: "Ana Carolina Paiva (Auditoria Regional)",
      actorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEKjj5MtW9cGy7Dd20_rGmLb5_82T2mUkQ23Rz0J2U2rqpP2H8f4D7sCOAzBuHcWcuF1EbxwGWcW2qCEdScgarhCtRh9OUbFOXqZveFyY4geL4kzqd_Ko-amQ-aiwAUweTqK0nzQGoLg5EMrUN_WhuTEgac6UTUkyL6X0009AHfQrLYL2ombDBQwD7W_dzUwNO7kU1A8A48LP9fKcFXN-VWGuAChSId45EqnVGZjnL9oDRIZiDKbrOXVpsF6wnHRoGjnAPN9ORErw",
      verified: true
    },
    {
      date: "15 OUT 2023",
      time: "18:45",
      title: "Cadastro Realizado",
      desc: "Inscrição efetuada via Portal do Cidadão.",
      actor: "O Próprio Candidato"
    }
  ]);

  // Exportar PDF do Dossiê
  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToastMessage("Dossiê de auditoria compilado e baixado em PDF!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  // Simular upload de documento
  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocName.trim()) {
      alert("Por favor, informe o nome do documento.");
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newDoc: LinkedDocItem = {
        id: `doc-${Date.now()}`,
        name: uploadDocName,
        type: uploadDocType,
        size: uploadDocSize,
        status: "pendente"
      };

      setDocuments(prev => [...prev, newDoc]);
      
      // Adiciona ação no timeline
      const newTimeline: AuditTimelineItem = {
        date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
        time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        title: `Documento Adicionado: ${uploadDocName}`,
        desc: "Novo arquivo inserido no prontuário para homologação de auditoria.",
        actor: "Painel do Auditor (PA)"
      };
      setTimeline(prev => [newTimeline, ...prev]);

      setIsUploading(false);
      setShowUploadModal(false);
      setUploadDocName("");

      setToastMessage(`Documento "${uploadDocName}" anexado com sucesso!`);
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Validar Documento Pendente
  const handleValidateDoc = (docId: string, name: string) => {
    setDocuments(prev => prev.map(d => {
      if (d.id === docId) {
        return { ...d, status: "validado" };
      }
      return d;
    }));

    const newTimeline: AuditTimelineItem = {
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
      time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      title: `Documento Validado: ${name}`,
      desc: "Status alterado para homologado após conferência regulatória.",
      actor: "Painel do Auditor (PA)",
      verified: true
    };
    setTimeline(prev => [newTimeline, ...prev]);

    setToastMessage(`Documento "${name}" homologado com sucesso!`);
    setTimeout(() => setToastMessage(null), 3000);
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
          
          <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full space-y-6">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho de Identidade */}
            <section className="mb-4">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 select-none">
                <div>
                  <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-secondary shrink-0" />
                    Dossiê de Auditoria
                  </div>
                  <h1 className="text-2xl font-black text-[#001e40] tracking-tight">
                    Ricardo Mendonça Souza
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <p className="text-slate-500 font-mono text-sm">CPF: 045.***.***-82</p>
                    <span className="flex items-center gap-2 px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full text-[10px] font-black uppercase tracking-wider">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      Aguardando Convocação
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => setShowJustificationModal(true)}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-primary font-bold text-xs uppercase tracking-widest transition-colors rounded-xl border-none cursor-pointer"
                  >
                    <Info className="w-4 h-4 text-primary shrink-0" />
                    Justificativa
                  </button>
                  <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 bg-primary-container text-white font-bold text-xs uppercase tracking-widest transition-all hover:opacity-90 rounded-xl shadow-md border-none cursor-pointer"
                  >
                    {isExporting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-white shrink-0" />
                        <span>Exportar Relatório</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Layout Assimétrico: 8x4 Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
              
              {/* Coluna Esquerda: Classificação e Linha do Tempo */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Rastreabilidade da Classificação */}
                <div className="bg-slate-50 p-8 rounded-2xl border border-outline-variant/15 shadow-sm space-y-6">
                  <div className="flex justify-between items-end select-none">
                    <div>
                      <h2 className="text-lg font-black text-[#001e40] mb-1">Rastreabilidade da Classificação</h2>
                      <p className="text-xs text-slate-400 font-semibold">Critérios socioeconômicos validados pelo sistema de auditoria cruzada.</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block mb-1">Pontuação Total</span>
                      <span className="text-2xl font-black text-secondary">85 pts</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 select-none">
                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                      <Users className="w-5 h-5 text-secondary shrink-0" />
                      <div>
                        <p className="text-[8px] uppercase font-black text-slate-400 leading-none mb-1">Mulher Chefe</p>
                        <p className="text-xs font-black text-[#001e40]">+30 Pontos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                      <Info className="w-5 h-5 text-secondary shrink-0" />
                      <div>
                        <p className="text-[8px] uppercase font-black text-slate-400 leading-none mb-1">Baixa Renda</p>
                        <p className="text-xs font-black text-[#001e40]">+25 Pontos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                      <AlertTriangle className="w-5 h-5 text-secondary shrink-0" />
                      <div>
                        <p className="text-[8px] uppercase font-black text-slate-400 leading-none mb-1">Área de Risco</p>
                        <p className="text-xs font-black text-[#001e40]">+20 Pontos</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
                      <Users className="w-5 h-5 text-secondary shrink-0" />
                      <div>
                        <p className="text-[8px] uppercase font-black text-slate-400 leading-none mb-1">PCD</p>
                        <p className="text-xs font-black text-[#001e40]">+10 Pontos</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Linha do Tempo de Auditoria */}
                <div className="bg-white p-8 rounded-2xl border border-outline-variant/15 shadow-sm">
                  <h2 className="text-lg font-black text-[#001e40] mb-8 select-none">Linha do Tempo de Auditoria</h2>
                  
                  <div className="space-y-0 relative border-l-2 border-slate-100 ml-4">
                    {timeline.map((item, idx) => (
                      <div key={idx} className="relative pl-10 pb-10 last:pb-4">
                        <div className={`absolute -left-[11px] top-0 w-5 h-5 rounded-full ring-4 ring-white ${
                          item.verified 
                            ? "bg-secondary" 
                            : item.isSystem 
                            ? "bg-emerald-500" 
                            : "bg-slate-300"
                        }`}></div>
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded select-none">
                              {item.date} • {item.time}
                            </span>
                            <h3 className="font-extrabold text-sm text-[#001e40] mt-2">{item.title}</h3>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                              {item.desc}
                            </p>
                            
                            <div className="flex items-center gap-2 mt-3 select-none">
                              {item.actorAvatar ? (
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shrink-0">
                                  <img className="w-full h-full object-cover" src={item.actorAvatar} alt={item.actor} />
                                </div>
                              ) : (
                                <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                                  <Users className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                              )}
                              <span className="text-[10px] font-bold text-slate-400">Responsável: {item.actor}</span>
                            </div>
                          </div>

                          {item.verified && (
                            <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 select-none" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Coluna Direita: Documentos Vinculados & Resumo */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Documentos Vinculados */}
                <div className="bg-slate-50 p-8 rounded-2xl border border-outline-variant/15 shadow-sm">
                  <h2 className="text-base font-black text-[#001e40] mb-6 select-none">Documentos Vinculados</h2>
                  
                  <div className="space-y-4">
                    {documents.map(doc => (
                      <div 
                        key={doc.id} 
                        className="bg-white p-4 rounded-xl flex items-center justify-between border border-slate-200 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            doc.status === "validado" 
                              ? "bg-blue-50 text-secondary" 
                              : "bg-amber-50 text-amber-600"
                          }`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-black text-[#001e40] truncate">{doc.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold select-none">{doc.type} • {doc.size}</p>
                          </div>
                        </div>

                        <div className="shrink-0 select-none">
                          {doc.status === "validado" ? (
                            <CheckCircle2 className="w-5 h-5 text-secondary" />
                          ) : (
                            <button 
                              onClick={() => handleValidateDoc(doc.id, doc.name)}
                              className="text-[9px] font-black bg-amber-50 hover:bg-emerald-500 hover:text-white border border-amber-200 hover:border-emerald-500 px-2 py-1 rounded transition-colors text-amber-700 uppercase tracking-wide cursor-pointer"
                            >
                              Pendente
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="w-full mt-6 py-3.5 border-2 border-dashed border-slate-350 text-slate-400 hover:text-[#001e40] font-black text-[9px] uppercase tracking-widest hover:bg-white transition-colors rounded-xl cursor-pointer"
                  >
                    Adicionar Novo Documento
                  </button>
                </div>

                {/* Resumo Estatístico */}
                <div className="bg-[#001e40] p-8 rounded-2xl text-white shadow-md space-y-6">
                  <p className="text-[9px] uppercase tracking-[0.2em] font-black text-slate-300 select-none">
                    Resumo da Auditoria
                  </p>

                  <div className="space-y-4 select-none">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-xs text-slate-300 font-semibold">Risco de Inconsistência</span>
                      <span className="text-xs font-black text-emerald-400">Baixo (4%)</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-xs text-slate-300 font-semibold">Tempo em Fila</span>
                      <span className="text-xs font-black">12 Dias</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-300 font-semibold">Última Revisão</span>
                      <span className="text-xs font-black">Ontem</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20 select-none">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-[#001e40] bg-secondary flex items-center justify-center text-[9px] font-black text-white">M1</div>
                        <div className="w-8 h-8 rounded-full border-2 border-[#001e40] bg-slate-700 flex items-center justify-center text-[9px] font-black text-white">A2</div>
                        <div className="w-8 h-8 rounded-full border-2 border-[#001e40] bg-[#003366] flex items-center justify-center text-[9px] font-black text-white">+3</div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300">5 auditores acessaram este perfil</span>
                    </div>
                  </div>
                </div>

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
          href={`/${programId}/auditoria`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <ShieldCheck className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Audit</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <FileText className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Relatórios</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: JUSTIFICATIVAS DE AUDITORIA
          ========================================== */}
      {showJustificationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowJustificationModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Justificativa do Prontuário</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowJustificationModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs text-[#001e40] leading-relaxed font-semibold">
                <strong>Justificativa da Auditoria Regional:</strong><br />
                O candidato Ricardo Mendonça Souza apresentou laudo médico PCD de especialista do SUS ratificando incapacidade funcional permanente, o que justifica a pontuação adicional de vulnerabilidade (+10 pts) regulada no Edital. A base cadastral do Cadastro Único Nacional foi cruzada e homologada em 22/10/2023.
              </div>
              
              <div className="pt-2 select-none">
                <button 
                  onClick={() => setShowJustificationModal(false)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  FECHAR DETALHES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: UPLOAD DE NOVO DOCUMENTO
          ========================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowUploadModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Anexar Novo Documento</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowUploadModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddDocument} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Nome do Documento
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  placeholder="Ex: Declaração de Renda, Certidão de Casamento..."
                  value={uploadDocName}
                  onChange={(e) => setUploadDocName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                    Formato
                  </label>
                  <select 
                    className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                    value={uploadDocType}
                    onChange={(e) => setUploadDocType(e.target.value)}
                  >
                    <option value="PDF">PDF</option>
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                  </select>
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                    Tamanho Estimado
                  </label>
                  <input 
                    className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                    placeholder="Ex: 2.5MB"
                    value={uploadDocSize}
                    onChange={(e) => setUploadDocSize(e.target.value)}
                  />
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center select-none bg-slate-50">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  Arraste arquivos aqui ou clique para buscar
                </span>
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setShowUploadModal(false)}
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
                    <span>CONFIRMAR</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
