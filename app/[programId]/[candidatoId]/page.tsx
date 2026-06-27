// =============================================================================
// app/[programId]/[candidatoId]/page.tsx
// Tela de Dossiê de Habitação Completo (Passo 15.1).
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
  Download, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  CornerDownRight, 
  Eye, 
  FileText, 
  Upload, 
  CheckCircle,
  Building,
  Activity,
  Shield,
  Layers,
  Heart,
  BadgeAlert,
  ArrowRight,
  ClipboardList,
  Home,
  Percent,
  Key
} from "lucide-react";

interface DocState {
  id: string;
  title: string;
  description: string;
  category: "pessoais" | "saude" | "protecao" | "renda" | "residencia" | "outras";
  status: "validado" | "enviado" | "pendente";
  deadline?: string;
  icon: React.ComponentType<any>;
}

export default function CandidatoDossieDetailPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;
  const candidatoId = params.candidatoId as string;

  // Estados dos documentos do Dossiê para cálculo interativo
  const [docList, setDocList] = useState<DocState[]>([
    { id: "rg_cpf", title: "RG e CPF", description: "Cópia autenticada e digitalizada", category: "pessoais", status: "validado", icon: FileText },
    { id: "certidao", title: "Certidões (Nascimento/Casamento)", description: "Cópia digitalizada legível", category: "pessoais", status: "pendente", deadline: "15/07/2024", icon: FileText },
    { id: "laudo", title: "Laudo Médico", description: "Laudo de necessidade especial (se houver)", category: "saude", status: "pendente", icon: Heart },
    { id: "denuncia", title: "Comprovante de Denúncia", description: "Laudo de violência doméstica ou similar", category: "protecao", status: "pendente", icon: Shield },
    { id: "holerite", title: "Holerites (3 últimos meses)", description: "Comprovação de rendimentos formais", category: "renda", status: "enviado", icon: ClipboardList },
    { id: "residencia", title: "Contas de Água/Luz", description: "Comprovante emitido nos últimos 90 dias", category: "residencia", status: "validado", icon: Home },
    { id: "distrato", title: "Termo de Distrato", description: "Documentação referente a vínculo habitacional anterior", category: "outras", status: "pendente", icon: Layers }
  ]);

  const [notification, setNotification] = useState<string | null>(null);
  const [showFullHistory, setShowFullHistory] = useState(false);

  // Calcula itens completos (validados ou enviados contam como preenchidos para a meta do dossiê)
  // Mockup original: 9 / 12 concluídos = 75%
  // Mapeamos os 7 principais. Vamos calcular a porcentagem a partir de 9 concluídos base mais os interativos.
  const pendingDocsCount = docList.filter(d => d.status === "pendente").length;
  const totalMockDocs = 12;
  const completedDocsCount = totalMockDocs - pendingDocsCount;
  const progressPercentage = Math.round((completedDocsCount / totalMockDocs) * 100);

  // Simula upload do documento
  const handleUploadDocument = (id: string, name: string) => {
    setDocList(prev => prev.map(doc => {
      if (doc.id === id) {
        return { ...doc, status: "enviado" };
      }
      return doc;
    }));
    setNotification(`Documento "${name}" enviado com sucesso e aguardando validação técnica.`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Exportar Dossiê como arquivo de texto
  const handleExportDossie = () => {
    const content = `==================================================
SIGAH - DOSSIÊ DE HABITAÇÃO COMPLETO
==================================================
ID do Candidato: ${candidatoId}
Programa Habitacional: ${config.name}
Status Geral: ${progressPercentage}% Concluído

DOCUMENTOS ANALISADOS:
${docList.map(doc => `- [${doc.status.toUpperCase()}] ${doc.title}: ${doc.description}`).join("\n")}

CONSULTAS FEDERAIS CONSOLIDADAS:
- CADIN: NADA CONSTA
- CADMUT: REGULAR
- SIACI: REGULAR

Histórico gerado em: ${new Date().toLocaleDateString("pt-BR")}
==================================================`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `dossie_${candidatoId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleOpenTicket = () => {
    setNotification("Um chamado de suporte foi aberto para a equipe de habitação. Retorno em até 24h.");
    setTimeout(() => setNotification(null), 4000);
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
          
          <main className="w-full max-w-5xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-8">
            
            {/* Feedback Notification */}
            {notification && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30">
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{notification}</span>
              </div>
            )}

            {/* Cabeçalho do Dossiê */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div className="space-y-2">
                <nav className="flex items-center gap-2 text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest select-none">
                  <span>Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>Habitação</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-primary font-black">{candidatoId}</span>
                </nav>
                <h2 className="text-3xl font-heading font-black text-primary tracking-tight">
                  Dossiê de Habitação
                </h2>
              </div>
              <button 
                onClick={handleExportDossie}
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary hover:bg-primary-container text-white font-bold text-xs shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <Download className="w-4 h-4 text-white" />
                Exportar Dossiê Completo
              </button>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Coluna Esquerda (Alertas & Métricas & Consultas) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Alerta de CadÚnico Vencido */}
                <div className="bg-error-container border-l-4 border-error p-6 rounded-xl flex flex-col sm:flex-row items-start gap-4 shadow-sm select-none">
                  <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                    <AlertTriangle className="text-error w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-on-error-container">
                      CadÚnico Desatualizado (Atualizar no CRAS)
                    </h3>
                    <p className="text-[#93000a] text-xs leading-relaxed font-medium">
                      Seus dados do Cadastro Único estão vencidos há mais de 24 meses. Isso impede a validação final da sua proposta habitacional.
                    </p>
                  </div>
                </div>

                {/* Grade Operacional de Métricas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card: Prazo de Regularização */}
                  <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                    <div className="absolute top-0 left-0 w-1 h-full bg-secondary"></div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        Prazo de Regularização
                      </span>
                      <Clock className="text-secondary w-5 h-5 shrink-0" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-4">
                      <span className="text-4xl font-bold text-primary">45</span>
                      <span className="text-on-surface-variant font-bold text-xs">dias restantes</span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant/70 mt-2 font-medium">
                      Data limite: 15 de Agosto de 2024
                    </p>
                  </div>

                  {/* Card: Progresso de Conclusão do Dossiê */}
                  <div className="bg-surface-container-lowest border border-outline-variant/15 p-6 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-600"></div>
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
                        Conclusão do Dossiê
                      </span>
                      <span className="text-green-600 font-bold text-sm">{progressPercentage}%</span>
                    </div>
                    
                    <div className="mt-4">
                      <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden mb-2">
                        <div 
                          className="bg-green-600 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-on-surface-variant/70 font-semibold mt-1">
                        {pendingDocsCount > 0 
                          ? `Faltam apenas ${pendingDocsCount} documentos pendentes.` 
                          : "Todos os documentos enviados com sucesso!"}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Consultas Federais (RF062) */}
                <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/15 flex justify-between items-center select-none">
                    <h3 className="font-bold text-sm text-primary flex items-center gap-2">
                      <ShieldCheck className="text-secondary w-5 h-5" />
                      Consultas Federais
                    </h3>
                    <span className="text-[10px] text-on-surface-variant/60 font-semibold italic">
                      Atualizado hoje às 09:12
                    </span>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* CADIN */}
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-outline-variant/10">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider">CADIN</span>
                        <span className="text-[10px] text-on-surface-variant/70 font-medium">Restrições Federais</span>
                      </div>
                      <span className="bg-green-50 text-green-700 font-bold text-[9px] px-2.5 py-1 rounded-full border border-green-200">
                        NADA CONSTA
                      </span>
                    </div>

                    {/* CADMUT */}
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-outline-variant/10">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider">CADMUT</span>
                        <span className="text-[10px] text-on-surface-variant/70 font-medium">Cadastro Mutuários</span>
                      </div>
                      <span className="bg-green-50 text-green-700 font-bold text-[9px] px-2.5 py-1 rounded-full border border-green-200">
                        REGULAR
                      </span>
                    </div>

                    {/* SIACI */}
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-outline-variant/10">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider">SIACI</span>
                        <span className="text-[10px] text-on-surface-variant/70 font-medium">Sist. Imóveis Caixa</span>
                      </div>
                      <span className="bg-green-50 text-green-700 font-bold text-[9px] px-2.5 py-1 rounded-full border border-green-200">
                        REGULAR
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Coluna Direita (Suporte & Histórico) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Suporte Institucional (Estilo Gradiente Marinho) */}
                <div className="bg-primary text-on-primary p-6 rounded-xl shadow-xl relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-secondary opacity-25 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <HelpCircle className="text-secondary-fixed w-12 h-12 mb-4 opacity-80" />
                  
                  <h3 className="text-base font-bold text-white mb-2">Suporte Institucional</h3>
                  <p className="text-xs text-white/70 leading-relaxed mb-6 font-medium">
                    Precisa de ajuda com a documentação ou encontrou algum erro nos seus dados federais?
                  </p>
                  
                  <button 
                    onClick={handleOpenTicket}
                    className="w-full bg-white hover:bg-secondary-fixed text-primary font-bold text-[10px] uppercase py-3 rounded-lg shadow-lg active:scale-95 transition-all cursor-pointer border-none tracking-widest"
                  >
                    Abrir Chamado
                  </button>
                </div>

                {/* Histórico do Cadastro (Timeline) */}
                <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                  <div className="px-6 py-4 border-b border-outline-variant/15 select-none">
                    <h3 className="font-bold text-sm text-primary">Histórico de Cadastro</h3>
                  </div>

                  <div className="p-6 space-y-6 text-xs">
                    
                    {/* Evento 1 */}
                    <div className="flex gap-4 relative">
                      <div className="w-[2px] bg-outline-variant/50 absolute left-[15px] top-8 bottom-[-24px]"></div>
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed border-4 border-surface flex items-center justify-center shrink-0 z-10 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      </div>
                      <div>
                        <p className="font-bold text-primary">Documentos Pessoais Validados</p>
                        <p className="text-[10px] text-on-surface-variant/60 font-semibold mt-0.5">
                          Ontem às 14:20 • Sistema Automático
                        </p>
                      </div>
                    </div>

                    {/* Evento 2 */}
                    <div className="flex gap-4 relative">
                      {showFullHistory && <div className="w-[2px] bg-outline-variant/50 absolute left-[15px] top-8 bottom-[-24px]"></div>}
                      <div className="w-8 h-8 rounded-full bg-secondary-fixed border-4 border-surface flex items-center justify-center shrink-0 z-10 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      </div>
                      <div>
                        <p className="font-bold text-primary">Upload de Holerites</p>
                        <p className="text-[10px] text-on-surface-variant/60 font-semibold mt-0.5">
                          05/06/2024 • Portal do Cidadão
                        </p>
                      </div>
                    </div>

                    {/* Eventos expandidos */}
                    {showFullHistory ? (
                      <>
                        {/* Evento 3 */}
                        <div className="flex gap-4 relative">
                          <div className="w-[2px] bg-outline-variant/50 absolute left-[15px] top-8 bottom-[-24px]"></div>
                          <div className="w-8 h-8 rounded-full bg-secondary-fixed border-4 border-surface flex items-center justify-center shrink-0 z-10 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          </div>
                          <div>
                            <p className="font-bold text-primary">Agendamento de Vistoria Concluído</p>
                            <p className="text-[10px] text-on-surface-variant/60 font-semibold mt-0.5">
                              03/06/2024 • Sistema Habitacional
                            </p>
                          </div>
                        </div>

                        {/* Evento 4 */}
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-outline-variant border-4 border-surface flex items-center justify-center shrink-0 z-10 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-on-surface-variant/40"></span>
                          </div>
                          <div>
                            <p className="font-bold text-on-surface-variant">Início do Processo</p>
                            <p className="text-[10px] text-on-surface-variant/40 font-semibold mt-0.5">
                              01/06/2024 • Presencial CRAS
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Evento 3 resumido */
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-outline-variant border-4 border-surface flex items-center justify-center shrink-0 z-10 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-on-surface-variant/40"></span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface-variant/60">Início do Processo</p>
                          <p className="text-[10px] text-on-surface-variant/40 font-semibold mt-0.5">
                            01/06/2024 • Presencial CRAS
                          </p>
                        </div>
                      </div>
                    )}

                  </div>

                  <button 
                    onClick={() => setShowFullHistory(!showFullHistory)}
                    className="w-full py-4 text-secondary hover:bg-slate-50 font-bold text-[10px] uppercase border-t border-outline-variant/10 tracking-widest cursor-pointer border-none bg-transparent mt-auto"
                  >
                    {showFullHistory ? "Recolher Histórico" : "Ver Histórico Completo"}
                  </button>
                </div>

              </div>

            </div>

            {/* Seção 3: Lista Unificada de Documentos */}
            <div className="space-y-6 pt-6">
              <div className="flex items-center justify-between select-none">
                <h3 className="text-xl font-heading font-black text-primary">Lista Unificada de Documentos</h3>
                <span className="text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant/20 font-bold">
                  Total: {totalMockDocs} itens
                </span>
              </div>

              {/* Categorias dos Documentos */}
              <div className="space-y-6">
                
                {/* 3.1 Categoria: Documentos Pessoais */}
                <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-3 bg-surface-container-low/50 border-b border-outline-variant/10 select-none">
                    <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                      Documentos Pessoais
                    </span>
                  </div>

                  <div className="divide-y divide-outline-variant/10">
                    {docList.filter(d => d.category === "pessoais").map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors duration-300">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                            doc.status === "validado" 
                              ? "bg-secondary/5 text-secondary" 
                              : "bg-amber-50 text-warning-amber"
                          }`}>
                            <doc.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-primary">{doc.title}</h4>
                            {doc.status === "pendente" && doc.deadline ? (
                              <p className="text-xs text-red-600 font-bold mt-0.5">Prazo: {doc.deadline}</p>
                            ) : (
                              <p className="text-xs text-on-surface-variant/70 mt-0.5">{doc.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          {doc.status === "validado" ? (
                            <span className="flex items-center gap-1 text-green-600 font-bold text-[9px] tracking-wider select-none">
                              <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                              VALIDADO
                            </span>
                          ) : doc.status === "enviado" ? (
                            <span className="bg-secondary-fixed text-secondary font-bold text-[9px] px-3 py-1 rounded-full border border-secondary/20 select-none">
                              ENVIADO
                            </span>
                          ) : (
                            <span className="bg-amber-50 text-warning-amber font-bold text-[9px] px-3 py-1 rounded-full border border-warning-amber/20 select-none">
                              PENDENTE
                            </span>
                          )}

                          {doc.status === "pendente" ? (
                            <button 
                              onClick={() => handleUploadDocument(doc.id, doc.title)}
                              className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded font-bold text-[9px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5 text-white" />
                              Enviar
                            </button>
                          ) : (
                            <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3.2 Grade Dupla de Categorias */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Saúde */}
                  <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="px-6 py-3 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center select-none">
                      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                        Documentos de Saúde
                      </span>
                      <Activity className="text-on-surface-variant/40 w-4 h-4" />
                    </div>
                    {docList.filter(d => d.category === "saude").map((doc) => (
                      <div key={doc.id} className="p-6 flex items-center justify-between flex-grow hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                            <doc.icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-xs text-primary">{doc.title}</span>
                        </div>
                        
                        {doc.status === "pendente" ? (
                          <button 
                            onClick={() => handleUploadDocument(doc.id, doc.title)}
                            className="bg-surface-container text-on-surface-variant hover:bg-secondary/10 hover:text-secondary font-bold text-[9px] px-3 py-1.5 rounded-full border border-outline-variant/20 cursor-pointer uppercase transition-all tracking-wider"
                          >
                            Enviar
                          </button>
                        ) : (
                          <span className="bg-secondary-fixed text-secondary font-bold text-[9px] px-3 py-1 rounded-full border border-secondary/20 select-none">
                            ENVIADO
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Proteção Social */}
                  <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="px-6 py-3 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center select-none">
                      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                        Proteção Social
                      </span>
                      <Shield className="text-on-surface-variant/40 w-4 h-4" />
                    </div>
                    {docList.filter(d => d.category === "protecao").map((doc) => (
                      <div key={doc.id} className="p-6 flex items-center justify-between flex-grow hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                            <doc.icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-xs text-primary">{doc.title}</span>
                        </div>
                        
                        {doc.status === "pendente" ? (
                          <button 
                            onClick={() => handleUploadDocument(doc.id, doc.title)}
                            className="bg-surface-container text-on-surface-variant hover:bg-secondary/10 hover:text-secondary font-bold text-[9px] px-3 py-1.5 rounded-full border border-outline-variant/20 cursor-pointer uppercase transition-all tracking-wider"
                          >
                            Enviar
                          </button>
                        ) : (
                          <span className="bg-secondary-fixed text-secondary font-bold text-[9px] px-3 py-1 rounded-full border border-secondary/20 select-none">
                            ENVIADO
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Renda */}
                  <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="px-6 py-3 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center select-none">
                      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                        Comprovantes de Renda
                      </span>
                      <Building className="text-on-surface-variant/40 w-4 h-4" />
                    </div>
                    {docList.filter(d => d.category === "renda").map((doc) => (
                      <div key={doc.id} className="p-6 flex items-center justify-between flex-grow hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary/5 flex items-center justify-center text-secondary shrink-0">
                            <doc.icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-xs text-primary">{doc.title}</span>
                        </div>
                        <span className="bg-secondary-fixed text-secondary font-bold text-[9px] px-3 py-1 rounded-full border border-secondary/20 select-none">
                          ENVIADO
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Residência */}
                  <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="px-6 py-3 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center select-none">
                      <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                        Comprovantes de Residência
                      </span>
                      <Home className="text-on-surface-variant/40 w-4 h-4" />
                    </div>
                    {docList.filter(d => d.category === "residencia").map((doc) => (
                      <div key={doc.id} className="p-6 flex items-center justify-between flex-grow hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-success-green/5 flex items-center justify-center text-green-600 shrink-0">
                            <doc.icon className="w-5 h-5" />
                          </div>
                          <span className="font-semibold text-xs text-primary">{doc.title}</span>
                        </div>
                        <span className="bg-green-50 text-green-700 font-bold text-[9px] px-3 py-1 rounded-full border border-green-200 select-none">
                          VALIDADO
                        </span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* 3.3 Outras Comprovações */}
                <div className="bg-surface-container-lowest border border-outline-variant/15 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-6 py-3 bg-surface-container-low/50 border-b border-outline-variant/10 select-none">
                    <span className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                      Outras Comprovações
                    </span>
                  </div>

                  {docList.filter(d => d.category === "outras").map((doc) => (
                    <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0">
                          <doc.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-primary">{doc.title}</h4>
                          <p className="text-xs text-on-surface-variant/70 mt-0.5">{doc.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        {doc.status === "pendente" ? (
                          <>
                            <span className="bg-surface-container text-on-surface-variant font-bold text-[9px] px-3 py-1 rounded-full border border-outline-variant/20 select-none">
                              PENDENTE
                            </span>
                            <button 
                              onClick={() => handleUploadDocument(doc.id, doc.title)}
                              className="bg-primary hover:bg-primary-container text-white px-4 py-2 rounded font-bold text-[9px] uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5 text-white" />
                              Enviar
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="bg-secondary-fixed text-secondary font-bold text-[9px] px-3 py-1 rounded-full border border-secondary/20 select-none">
                              ENVIADO
                            </span>
                            <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer border-none bg-transparent">
                              <Eye className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
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
          href={`/${programId}/${candidatoId}`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <FileText className="w-5 h-5 text-secondary" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Dossiê</span>
        </a>
        <a 
          href={`/${programId}/vagas`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Percent className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cotas</span>
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
