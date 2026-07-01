// =============================================================================
// app/[programId]/denuncias/averiguacao/page.tsx
// Tela de Averiguação Local e Desclassificação (Passo 29.1).
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
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Plus,
  X,
  Info,
  MoreVertical,
  Gavel,
  Mail,
  Camera,
  History,
  Loader2,
  ArrowLeft,
  Home,
  Users
} from "lucide-react";

interface TechnicalReport {
  id: string;
  title: string;
  date: string;
  inspector: string;
  status: "FINALIZADO" | "REVISADO" | "EM ANÁLISE";
  content: string;
  borderClass: string;
}

interface EvidenceLog {
  id: string;
  date: string;
  title: string;
  description: string;
  iconType: "camera" | "gavel" | "warning";
  photos?: string[];
}

export default function AveriguacaoLocalPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados de Dados - Pareceres Técnicos
  const [reports, setReports] = useState<TechnicalReport[]>([
    {
      id: "rep-1",
      title: "Relatório de Visita Técnica In Loco",
      date: "14 Out 2023",
      inspector: "Ana Clara Mendes (Assistente Social)",
      status: "FINALIZADO",
      content: "Unidade habitacional encontrada em estado de abandono. Vizinhos relatam que o beneficiário original não reside no local há mais de 6 meses. Evidências de sublocação para terceiros identificadas através de depoimentos colhidos no condomínio.",
      borderClass: "border-primary"
    },
    {
      id: "rep-2",
      title: "Análise de Consumo Energético",
      date: "28 Out 2023",
      inspector: "Marcos Vinícius (Analista de Dados)",
      status: "REVISADO",
      content: "Histórico de consumo da concessionária de energia elétrica (ENEL) apresenta faturamento mínimo (taxa de disponibilidade) nos últimos 8 meses, corroborando a hipótese de não ocupação efetiva por parte do núcleo familiar beneficiado.",
      borderClass: "border-secondary"
    }
  ]);

  // Estados de Dados - Linha de Tempo
  const [evidenceLogs, setEvidenceLogs] = useState<EvidenceLog[]>([
    {
      id: "log-1",
      date: "02 NOV 2023 - 09:15",
      title: "Upload de Evidência Fotográfica",
      description: "Anexado 4 fotos da fachada e interior da unidade (Lote 12-B) apresentando deterioração.",
      iconType: "camera",
      photos: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDT_7x9wF7jZ1I4HUWlqrGZvBtOHqE44SduCvJFXglXY1WQs1k71_KZLrIsZX-ys1oGnteY4vG0tTOa9cQB3VwL_gLTQmO5jjkVrj0CFriTIpU-ep1Pm9WMX3jCjf_hRjj73auRIS7tgBg4gvcaZDBL4nVUEql1u1l-EBskoZPYtbXwjHlER-2VQa76DC1JmxwBahB0LplbyYV02aAUVjQ5i4CLLtjlDHBSXaRuev1x__mQy7lBdtOHOGj0tAkCQZm5He506xrVooY",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAhIplJa2YpSwWv57XzEt4KDSmrO8kxKqgYDoVAB42DVTbH0N3dLQkWqczbrW3OTbo6K41L6eOWCQXn0HSPdg8eC56TxZQDcth_3Cxmrcz1YF5VnXvUkv1FQaplJUXqJXAlPLr2-tgMVZ-aBTC-Rdn3MK9KIW5jqp_6mUMfffIJZZAIt2evSi_NnAAEfH9V4f1SBiimE_VYk6do30B-F_wJHEAzbEFSC4xG8xKncdCPT6sPBgII7EB0J2djHPiKxzOQ1b4oRl_yc_w"
      ]
    },
    {
      id: "log-2",
      date: "25 OUT 2023 - 14:40",
      title: "Notificação Extrajudicial Emitida",
      description: 'Enviado via AR (Aviso de Recebimento) para o endereço cadastrado. Recebido por terceiro: "João de Barro".',
      iconType: "gavel"
    },
    {
      id: "log-3",
      date: "10 OUT 2023 - 11:20",
      title: "Denúncia Anônima Registrada",
      description: "Relato de venda irregular da chave do imóvel em grupo de rede social local.",
      iconType: "warning"
    }
  ]);

  // Estados do Formulário de Conclusão
  const [investigationStatus, setInvestigationStatus] = useState("fraude");
  const [conclusiveOpinion, setConclusiveOpinion] = useState(
    "Com base na vistoria de campo que constatou o abandono da unidade e na comprovação de consumo elétrico nulo nos últimos 8 meses, além dos depoimentos vizinhos coletados, confirma-se o desvio de finalidade (sublocação/venda). Fica recomendada a desclassificação imediata do beneficiário."
  );

  // Estados dos Modais
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newRepTitle, setNewRepTitle] = useState("Relatório de Visita Técnica In Loco");
  const [newRepInspector, setNewRepInspector] = useState("");
  const [newRepContent, setNewRepContent] = useState("");

  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [newPhotoDesc, setNewPhotoDesc] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Registrar Novo Parecer Técnico
  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepInspector.trim() || !newRepContent.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newReport: TechnicalReport = {
      id: `rep-${Date.now()}`,
      title: newRepTitle,
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
      inspector: newRepInspector,
      status: "EM ANÁLISE",
      content: newRepContent,
      borderClass: reports.length % 2 === 0 ? "border-primary" : "border-secondary"
    };

    setReports(prev => [...prev, newReport]);
    setIsReportModalOpen(false);
    setNewRepInspector("");
    setNewRepContent("");

    setToastMessage("Parecer técnico adicionado ao processo.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Registrar Nova Evidência Fotográfica
  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoDesc.trim()) {
      alert("Por favor, preencha a descrição da evidência.");
      return;
    }

    const defaultImg = "https://lh3.googleusercontent.com/aida-public/AB6AXuDT_7x9wF7jZ1I4HUWlqrGZvBtOHqE44SduCvJFXglXY1WQs1k71_KZLrIsZX-ys1oGnteY4vG0tTOa9cQB3VwL_gLTQmO5jjkVrj0CFriTIpU-ep1Pm9WMX3jCjf_hRjj73auRIS7tgBg4gvcaZDBL4nVUEql1u1l-EBskoZPYtbXwjHlER-2VQa76DC1JmxwBahB0LplbyYV02aAUVjQ5i4CLLtjlDHBSXaRuev1x__mQy7lBdtOHOGj0tAkCQZm5He506xrVooY";

    const newLog: EvidenceLog = {
      id: `log-${Date.now()}`,
      date: "Hoje, " + new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      title: "Nova Evidência Registrada",
      description: newPhotoDesc,
      iconType: "camera",
      photos: [newPhotoUrl.trim() || defaultImg]
    };

    setEvidenceLogs(prev => [newLog, ...prev]);
    setIsPhotoModalOpen(false);
    setNewPhotoDesc("");
    setNewPhotoUrl("");

    setToastMessage("Nova evidência anexada à linha do tempo!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Notificar Agente Financeiro (Caixa)
  const handleNotifyAgent = () => {
    setIsNotifying(true);
    setTimeout(() => {
      setIsNotifying(false);
      setToastMessage("Notificação enviada com sucesso à Caixa Econômica Federal.");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1500);
  };

  // Efetivar Desclassificação por Fraude
  const handleConfirmDisqualification = () => {
    if (!conclusiveOpinion.trim()) {
      alert("Por favor, digite o parecer conclusivo antes de efetivar.");
      return;
    }

    setIsFinalizing(true);
    setTimeout(() => {
      setIsFinalizing(false);
      setToastMessage("Beneficiário desclassificado! Cadastro bloqueado e encaminhado ao Ministério Público.");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1800);
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-24 md:pb-0 flex flex-col">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-6 md:px-12 pb-12 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho do Dossiê */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant/20 pb-6 select-none">
              <div>
                <nav className="flex items-center gap-2 text-on-surface-variant text-xs mb-4 uppercase font-black tracking-widest">
                  <span>Irregularidades</span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                  <span className="text-primary font-black">Processo de Averiguação Local</span>
                </nav>
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">
                  Dossiê de Investigação: #4402-B
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Averiguação em Curso
                  </span>
                  <p className="text-on-surface-variant text-sm font-semibold">
                    Beneficiário: <span className="font-extrabold text-on-surface">Ricardo Silva de Oliveira</span>
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => {
                    setToastMessage("Gerando PDF oficial de auditoria...");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="bg-surface-container-highest text-on-surface-variant px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 border-none cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-on-surface-variant shrink-0" />
                  Exportar PDF
                </button>
                <button 
                  onClick={handleNotifyAgent}
                  disabled={isNotifying}
                  className="bg-primary hover:bg-primary-container text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/10 border-none cursor-pointer"
                >
                  {isNotifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Notificando...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-white shrink-0" />
                      <span>Notificar Agente Financeiro</span>
                    </>
                  )}
                </button>
              </div>
            </header>

            {/* Grid de Bento */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Coluna Esquerda: Pareceres & Histórico */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                
                {/* Pareceres Técnicos */}
                <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-primary flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                      Pareceres Técnicos
                    </h3>
                    <button 
                      onClick={() => setIsReportModalOpen(true)}
                      className="text-secondary text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline border-none bg-transparent cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Adicionar Parecer
                    </button>
                  </div>

                  <div className="space-y-4">
                    {reports.map(report => (
                      <div 
                        key={report.id} 
                        className={`bg-surface-container-low rounded-xl p-6 border-l-4 ${report.borderClass}`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-heading font-black text-on-surface text-sm">{report.title}</h4>
                            <p className="text-[10px] text-on-surface-variant font-bold select-none">
                              {report.date} • Responsável: {report.inspector}
                            </p>
                          </div>
                          <span className="bg-primary-container/10 text-primary-container px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase select-none">
                            {report.status}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {report.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Linha do tempo de Evidências */}
                <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-primary flex items-center gap-2 select-none">
                      <History className="w-5 h-5 text-secondary shrink-0" />
                      Linha do Tempo de Evidências
                    </h3>
                    <button 
                      onClick={() => setIsPhotoModalOpen(true)}
                      className="text-secondary text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:underline border-none bg-transparent cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Anexar Fotos
                    </button>
                  </div>

                  <div className="relative space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
                    {evidenceLogs.map(log => (
                      <div key={log.id} className="relative pl-10">
                        <span className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-white z-10 select-none ${
                          log.iconType === "camera" 
                            ? "bg-primary" 
                            : log.iconType === "gavel"
                            ? "bg-secondary"
                            : "bg-tertiary-container"
                        }`}>
                          {log.iconType === "camera" ? (
                            <Camera className="w-3.5 h-3.5" />
                          ) : log.iconType === "gavel" ? (
                            <Gavel className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                        </span>
                        
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-on-surface-variant select-none">
                            {log.date}
                          </span>
                          <p className="text-sm font-black text-on-surface">{log.title}</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">
                            {log.description}
                          </p>

                          {log.photos && log.photos.length > 0 && (
                            <div className="mt-3 flex gap-3">
                              {log.photos.map((photo, i) => (
                                <div key={i} className="w-20 h-20 bg-surface-container-high rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group cursor-zoom-in">
                                  <img 
                                    alt={`Evidência Fotográfica ${i + 1}`} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" 
                                    src={photo}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

              {/* Coluna Direita: Conclusão & Metadados */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                
                {/* Formulário Conclusivo */}
                <section className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 shadow-lg space-y-6">
                  <h3 className="text-lg font-black text-primary flex items-center gap-2 select-none">
                    <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                    Conclusão do Processo
                  </h3>
                  
                  <form className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-2 select-none uppercase tracking-wider">
                        Status da Investigação
                      </label>
                      <select 
                        value={investigationStatus}
                        onChange={(e) => setInvestigationStatus(e.target.value)}
                        className="w-full bg-surface-container-low border-none border-b-2 border-primary rounded-t-xl p-4 font-body text-sm font-bold text-primary focus:ring-0 focus:border-secondary transition-colors"
                      >
                        <option value="regular">Regularidade Confirmada</option>
                        <option value="irregular">Irregularidade Sanável</option>
                        <option value="fraude">Fraude Confirmada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant mb-2 select-none uppercase tracking-wider">
                        Parecer Conclusivo
                      </label>
                      <textarea 
                        className="w-full bg-surface-container-low border-none border-b-2 border-primary rounded-t-xl p-4 font-body text-sm text-primary leading-relaxed focus:ring-0 focus:border-secondary placeholder:text-outline/50" 
                        placeholder="Descreva os fundamentos jurídicos e técnicos para a desclassificação..." 
                        rows={5}
                        value={conclusiveOpinion}
                        onChange={(e) => setConclusiveOpinion(e.target.value)}
                        required
                      />
                    </div>

                    {investigationStatus === "fraude" && (
                      <div className="bg-error-container/20 p-4 rounded-xl border border-error/10 flex gap-3 select-none">
                        <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                        <p className="text-[10px] text-on-error-container leading-normal font-semibold">
                          <strong>Atenção:</strong> Ao efetivar a desclassificação por fraude, o beneficiário será bloqueado permanentemente de todos os programas habitacionais do estado e o processo será encaminhado ao Ministério Público.
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 select-none">
                      <button 
                        onClick={handleConfirmDisqualification}
                        disabled={isFinalizing}
                        className="w-full bg-primary py-4 rounded-xl text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary-container transition-all active:scale-[0.98] shadow-md border-none cursor-pointer"
                        type="button"
                      >
                        {isFinalizing ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>Efetivando Bloqueio...</span>
                          </>
                        ) : (
                          <>
                            <Gavel className="w-4 h-4 text-white shrink-0" />
                            <span>Efetivar Desclassificação</span>
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setToastMessage("Rascunho de parecer salvo localmente.");
                          setTimeout(() => setToastMessage(null), 3000);
                        }}
                        className="w-full border-2 border-outline-variant/30 py-4 rounded-xl text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all bg-transparent cursor-pointer"
                        type="button"
                      >
                        Salvar como Rascunho
                      </button>
                    </div>
                  </form>
                </section>

                {/* Metadados Contextuais */}
                <div className="bg-secondary-container/5 p-6 rounded-2xl border border-secondary/15 select-none space-y-4">
                  <h4 className="text-[10px] font-black text-secondary uppercase tracking-widest">
                    Metadados do Processo
                  </h4>
                  <ul className="space-y-3 text-xs">
                    <li className="flex justify-between font-semibold">
                      <span className="text-on-surface-variant">Abertura:</span>
                      <span className="text-primary font-bold">10/10/2023</span>
                    </li>
                    <li className="flex justify-between font-semibold">
                      <span className="text-on-surface-variant">Prazo Final:</span>
                      <span className="text-error font-extrabold">10/01/2024</span>
                    </li>
                    <li className="flex justify-between font-semibold">
                      <span className="text-on-surface-variant">Prioridade:</span>
                      <span className="text-tertiary-container font-black">ALTA</span>
                    </li>
                  </ul>
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
          href={`/${programId}/denuncias/averiguacao`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <AlertTriangle className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Denúncias</span>
        </a>
        <a 
          href={`/${programId}/cadastro`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cadastro</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: REGISTRAR PARECER TÉCNICO
          ========================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={() => setIsReportModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-primary">Novo Parecer Técnico</h3>
              <button 
                className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsReportModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddReport} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Título do Relatório
                </label>
                <select 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  value={newRepTitle}
                  onChange={(e) => setNewRepTitle(e.target.value)}
                >
                  <option value="Relatório de Visita Técnica In Loco">Relatório de Visita Técnica In Loco</option>
                  <option value="Análise de Consumo Energético">Análise de Consumo Energético</option>
                  <option value="Parecer da Mobilização Social">Parecer da Mobilização Social</option>
                  <option value="Análise Cadastral Avançada">Análise Cadastral Avançada</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Responsável Técnico
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold" 
                  placeholder="Nome do assistente / analista..." 
                  type="text"
                  value={newRepInspector}
                  onChange={(e) => setNewRepInspector(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Relatório Detalhado das Evidências
                </label>
                <textarea 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 rounded-t-lg text-sm text-primary leading-relaxed" 
                  placeholder="Escreva os achados e depoimentos locais..." 
                  rows={4}
                  value={newRepContent}
                  onChange={(e) => setNewRepContent(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-on-surface-variant font-black text-xs border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsReportModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  ADICIONAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REGISTRAR EVIDÊNCIA FOTOGRÁFICA
          ========================================== */}
      {isPhotoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={() => setIsPhotoModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-primary">Anexar Nova Evidência</h3>
              <button 
                className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsPhotoModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddPhoto} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Descrição da Evidência
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary font-bold"
                  placeholder="Ex: Foto da fechadura trocada, portão avariado..."
                  value={newPhotoDesc}
                  onChange={(e) => setNewPhotoDesc(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  URL da Foto (Opcional - Simulado)
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary" 
                  placeholder="Deixe em branco para usar imagem documental padrão" 
                  type="text"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-on-surface-variant font-black text-xs border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsPhotoModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  ANEXAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
