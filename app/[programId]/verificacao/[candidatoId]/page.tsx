// =============================================================================
// app/[programId]/verificacao/[candidatoId]/page.tsx
// Tela de Gerenciamento de Verificação Documental (Passo 23.2).
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
  Check, 
  Hourglass, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Loader2,
  Edit,
  ArrowRight,
  ClipboardCheck,
  Award,
  Users,
  BarChart2,
  Home,
  Clock,
  Key
} from "lucide-react";

interface DocItem {
  id: string;
  title: string;
  description: string;
  status: "VALIDADO" | "Pendente" | "EM ANÁLISE";
}

export default function VerificacaoDocumentalPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;
  const candidatoId = params.candidatoId as string;

  // Formata o nome do candidato a partir do ID (ex: "roberto-almeida" -> "ROBERTO ALMEIDA")
  const formatName = (slug: string) => {
    if (!slug) return "ROBERTO ALMEIDA SANTOS";
    return slug
      .replace(/-/g, " ")
      .split(" ")
      .map(word => word.toUpperCase())
      .join(" ");
  };

  const candidateName = formatName(candidatoId);
  const candidateInitials = candidateName.split(" ").map(w => w[0]).join("").substring(0, 2);

  // Lista de documentos interativa
  const [docs, setDocs] = useState<DocItem[]>([
    {
      id: "identidade",
      title: "Identidade e Estado Civil",
      description: "RG, CPF e Certidão de Nasc./Casamento.",
      status: "VALIDADO"
    },
    {
      id: "declaracao",
      title: "Declaração de Adesão",
      description: "Aguardando assinatura digital ou física.",
      status: "Pendente"
    },
    {
      id: "vedacoes",
      title: "Vedações (Art. 9º)",
      description: "Cruzamento de dados e impedimentos legais.",
      status: "EM ANÁLISE"
    },
    {
      id: "elegibilidade",
      title: "Elegibilidade",
      description: "Atestado de conformidade do Ente Público.",
      status: "VALIDADO"
    }
  ]);

  // Estados dos Modais
  const [complementModal, setComplementModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [complementText, setComplementText] = useState("");
  const [sendingComplement, setSendingComplement] = useState(false);
  const [validatingFinal, setValidatingFinal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Alterna o status do documento de forma cíclica ao clicar
  const handleToggleDocStatus = (id: string) => {
    setDocs(prev => prev.map(doc => {
      if (doc.id === id) {
        let newStatus: "VALIDADO" | "Pendente" | "EM ANÁLISE";
        if (doc.status === "VALIDADO") newStatus = "Pendente";
        else if (doc.status === "Pendente") newStatus = "EM ANÁLISE";
        else newStatus = "VALIDADO";
        return { ...doc, status: newStatus };
      }
      return doc;
    }));
  };

  // Envio de complementação documental
  const handleSendComplement = () => {
    if (!complementText.trim()) return;
    setSendingComplement(true);
    setTimeout(() => {
      setSendingComplement(false);
      setComplementModal(false);
      setComplementText("");
      setNotification("Notificação enviada ao cidadão solicitando a complementação de documentos.");
      
      // Ajusta o documento pendente para "EM ANÁLISE" para simular o processo
      setDocs(prev => prev.map(d => d.status === "Pendente" ? { ...d, status: "EM ANÁLISE" } : d));

      setTimeout(() => setNotification(null), 4000);
    }, 1500);
  };

  // Validar aptidão final
  const handleValidateAptidao = () => {
    setValidatingFinal(true);
    setTimeout(() => {
      setValidatingFinal(false);
      // Força a validação de todos os documentos
      setDocs(prev => prev.map(doc => ({ ...doc, status: "VALIDADO" })));
      setSuccessModal(true);
    }, 1800);
  };

  // Cálculo reativo do progresso da análise com base nos documentos validados
  const validatedDocsCount = docs.filter(d => d.status === "VALIDADO").length;
  const analysisProgress = Math.round((validatedDocsCount / docs.length) * 100);

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-4xl mx-auto px-6 pt-10 pb-40 space-y-8">
            
            {/* Feedback Notification */}
            {notification && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{notification}</span>
              </div>
            )}

            {/* Cabeçalho */}
            <div className="space-y-4">
              <nav className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                <span>Gestão</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-primary font-black">Processos</span>
              </nav>
              <div className="space-y-1">
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">Verificação Documental</h2>
                <p className="text-on-surface-variant text-sm font-medium">
                  Análise de conformidade e validação de aptidão final do beneficiário selecionado.
                </p>
              </div>
            </div>

            {/* Card do Candidato */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center font-extrabold text-xl shadow-lg shadow-secondary/15 select-none">
                    {candidateInitials}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-primary leading-tight">{candidateName}</h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 select-none">
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                        CPF: <span className="text-on-surface font-semibold">123.456.789-00</span>
                      </p>
                      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
                        NIS: <span className="text-on-surface font-semibold">1.234.567.890-1</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-center select-none">
                  <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-200/50">
                    <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                    Compatível
                  </span>
                </div>
              </div>

              {/* Alerta de Validade */}
              <div className="p-4 bg-primary/5 rounded-xl flex items-start gap-3.5 border-l-4 border-secondary select-none">
                <Calendar className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">
                    Monitoramento de Validade
                  </p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Pesquisa de Enquadramento válida por 24 meses. <span className="font-bold text-primary">Expira em: 15/09/2025</span>
                  </p>
                </div>
              </div>
            </section>

            {/* Status de Validação */}
            <section className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-sm select-none">
              <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-8">
                Status de Validação
              </h3>
              
              <div className="relative px-2">
                {/* Linha de Progresso de Fundo */}
                <div className="absolute top-4 left-0 w-full h-1 bg-slate-100 rounded-full"></div>
                {/* Linha de Progresso Ativa */}
                <div 
                  className="absolute top-4 left-0 h-1 bg-secondary rounded-full z-10 progress-bar-glow transition-all duration-500"
                  style={{ width: `${analysisProgress === 100 ? 100 : 33 + analysisProgress * 0.33}%` }}
                ></div>
                
                <div className="flex justify-between relative z-20">
                  {/* Passo 1 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center border-4 border-white shadow-sm shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-primary leading-none">Coleta</p>
                      <p className="text-[9px] text-on-surface-variant mt-1 font-semibold">Concluída</p>
                    </div>
                  </div>

                  {/* Passo 2 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-colors duration-500 ${
                      analysisProgress > 0 ? "bg-secondary text-white" : "bg-slate-200 text-on-surface-variant"
                    }`}>
                      <Hourglass className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-primary leading-none">Análise</p>
                      <p className="text-[9px] text-secondary font-black mt-1">{analysisProgress}%</p>
                    </div>
                  </div>

                  {/* Passo 3 */}
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 transition-colors duration-500 ${
                      analysisProgress === 100 ? "bg-secondary text-white" : "bg-slate-100 text-on-surface-variant"
                    }`}>
                      {analysisProgress === 100 ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <span className="text-[10px] font-black">03</span>
                      )}
                    </div>
                    <div className="text-center">
                      <p className={`text-[10px] font-bold leading-none ${analysisProgress === 100 ? "text-primary" : "text-on-surface-variant opacity-60"}`}>
                        Homologação
                      </p>
                      <p className="text-[9px] text-on-surface-variant mt-1 font-semibold opacity-60">
                        {analysisProgress === 100 ? "Pronto" : "Pendente"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Checklist Documental */}
            <section className="space-y-4">
              <div className="flex items-end justify-between px-2 select-none">
                <div>
                  <h3 className="text-xl font-bold text-primary">Checklist Documental</h3>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                    Protocolos RF046.3 e RF046.4
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {docs.map((doc) => (
                  <div 
                    key={doc.id}
                    onClick={() => handleToggleDocStatus(doc.id)}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-transparent hover:border-secondary/20 transition-all shadow-sm group cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 select-none ${
                        doc.status === "VALIDADO" 
                          ? "bg-secondary/10 text-secondary" 
                          : doc.status === "Pendente" 
                          ? "bg-red-50 text-error" 
                          : "bg-primary/5 text-primary"
                      }`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-primary text-sm leading-tight group-hover:text-secondary transition-colors">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-on-surface-variant mt-0.5 font-medium">{doc.description}</p>
                      </div>
                    </div>

                    <div className="shrink-0 select-none">
                      <span className={`text-[9px] font-black tracking-widest px-3 py-1 rounded-full border ${
                        doc.status === "VALIDADO"
                          ? "text-secondary bg-secondary/5 border-secondary/15"
                          : doc.status === "Pendente"
                          ? "text-error bg-error/5 border-error/15"
                          : "text-primary bg-primary/5 border-primary/15"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Warning Area */}
            <div className="flex items-center gap-3.5 p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 select-none">
              <AlertTriangle className="text-primary/45 w-5 h-5 shrink-0" />
              <p className="text-[10px] font-medium text-on-surface-variant">
                <span className="font-black text-primary uppercase">Aviso RF046.8:</span> A validação completa é condicionante obrigatória para a entrega física da unidade habitacional ao beneficiário.
              </p>
            </div>

          </main>

          {/* 4. Rodapé de Ações Fixo (Sticky Footer) */}
          <footer className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-lg border-t border-primary/10 px-6 py-4 xl:pl-[312px]">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 select-none">
              <button 
                onClick={() => setComplementModal(true)}
                className="flex-grow px-6 py-3.5 border-2 border-primary/10 rounded-xl text-xs font-black text-primary uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 cursor-pointer bg-transparent"
              >
                <Edit className="w-4 h-4 shrink-0" />
                Solicitar Complementação
              </button>
              <button 
                onClick={handleValidateAptidao}
                disabled={validatingFinal}
                className="flex-grow px-8 py-3.5 bg-secondary hover:brightness-110 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg shadow-secondary/15 transition-transform flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {validatingFinal ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <ClipboardCheck className="w-4.5 h-4.5 shrink-0" />
                    <span>Validar Aptidão Final</span>
                  </>
                )}
              </button>
            </div>
          </footer>

        </div>

      </div>

      {/* ==========================================
          MODAL DE SOLICITAR COMPLEMENTAÇÃO
          ========================================== */}
      {complementModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4 select-none">
              <div>
                <h3 className="text-lg font-black text-primary leading-tight">Solicitar Complementação</h3>
                <p className="text-xs text-on-surface-variant font-semibold mt-1">
                  Notificar candidato sobre pendências documentais
                </p>
              </div>
              <button 
                onClick={() => {
                  if (!sendingComplement) setComplementModal(false);
                }}
                className="text-on-surface-variant hover:text-primary p-1.5 rounded-lg hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-outline-variant/30 select-none">
                <p className="text-xs font-bold text-primary">{candidateName}</p>
                <p className="text-[10px] text-on-surface-variant font-black mt-0.5 uppercase">NIS: 1.234.567.890-1</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-wider select-none">
                  Descreva os documentos pendentes / rasuras
                </label>
                <textarea 
                  value={complementText}
                  onChange={(e) => setComplementText(e.target.value)}
                  placeholder="Ex: A Declaração de Adesão precisa ser assinada fisicamente e o RG apresenta rasura na foto. Favor providenciar novas cópias..."
                  rows={4}
                  className="w-full bg-white border border-outline-variant rounded-xl p-3.5 text-xs font-semibold focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 select-none">
              <button
                onClick={() => setComplementModal(false)}
                disabled={sendingComplement}
                className="w-full py-3.5 border-2 border-outline/20 text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors active:scale-95 cursor-pointer bg-transparent"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendComplement}
                disabled={sendingComplement || !complementText.trim()}
                className="w-full py-3.5 bg-secondary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-colors active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md shadow-secondary/15 disabled:opacity-55 disabled:cursor-not-allowed"
              >
                {sendingComplement ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar Solicitação</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          MODAL DE SUCESSO DE APTIDÃO FINAL
          ========================================== */}
      {successModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl shadow-2xl p-8 flex flex-col items-center text-center gap-5 border border-outline-variant/10 select-none">
            
            <div className="w-14 h-14 bg-green-100 border border-green-300 text-green-700 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <Award className="w-7 h-7 text-green-700 shrink-0" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-primary leading-tight">Aptidão Final Validada!</h3>
              <p className="text-xs text-on-surface-variant font-semibold">
                Roberto Almeida Santos está apto para receber a unidade habitacional.
              </p>
            </div>

            <div className="bg-slate-50 border border-outline-variant/35 rounded-xl p-4 w-full space-y-1.5 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-[9px] font-black uppercase text-outline">Protocolo</span>
                <span className="font-bold text-primary">#VD-ROBERTO-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] font-black uppercase text-outline">Status Geral</span>
                <span className="font-bold text-green-700">HOMOLOGADO</span>
              </div>
            </div>

            <button
              onClick={() => {
                setSuccessModal(false);
                router.push(`/${programId}/cadastro`);
              }}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 transition-colors active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md"
            >
              <span>Voltar aos Candidatos</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
