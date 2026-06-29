// =============================================================================
// app/[programId]/excecao/indicacao/page.tsx
// Indicação Direta com Cadastro de Membros (Passo 22.12).
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
  Menu,
  ChevronRight,
  BadgeAlert,
  Users,
  PlusCircle,
  User,
  Trash2,
  AlertOctagon,
  Upload,
  CheckCircle2,
  X,
  Loader2,
  FileCheck,
  ShieldAlert,
  HelpCircle,
  Home,
  GitFork,
  ArrowLeft
} from "lucide-react";

interface Member {
  id: string;
  nome: string;
  parentesco: string;
  idade: number;
  renda: number;
  isChild: boolean;
}

export default function IndicacaoDiretaMembrosPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Formulários
  const [nomeResponsavel, setNomeResponsavel] = useState("Ricardo Alcantara Mendes");
  const [cpfResponsavel, setCpfResponsavel] = useState("123.456.789-00");
  const [motivo, setMotivo] = useState("calamidade");
  const [justificativa, setJustificativa] = useState(
    "Família residente em área de preservação permanente afetada por enchente severa conforme laudo da Defesa Civil anexo."
  );

  // Membros da Família
  const [membros, setMembros] = useState<Member[]>([
    {
      id: "maria-mendes",
      nome: "Maria Silva Mendes",
      parentesco: "Cônjuge",
      idade: 34,
      renda: 1450,
      isChild: false
    },
    {
      id: "pedro-mendes",
      nome: "Pedro Silva Mendes",
      parentesco: "Filho(a)",
      idade: 8,
      renda: 0,
      isChild: true
    }
  ]);

  // Modal de Adicionar Membro
  const [memberModal, setMemberModal] = useState(false);
  const [newNome, setNewNome] = useState("");
  const [newParentesco, setNewParentesco] = useState("Cônjuge");
  const [newIdade, setNewIdade] = useState("");
  const [newRenda, setNewRenda] = useState("");

  // Feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // Deletar dependente
  const handleDeleteMember = (id: string) => {
    setMembros((prev) => prev.filter((m) => m.id !== id));
    setToastMessage("Dependente removido da lista temporária.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Salvar dependente no modal
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNome.trim()) return;

    const idadeNum = parseInt(newIdade) || 0;
    const newMember: Member = {
      id: `member-${Math.random()}`,
      nome: newNome,
      parentesco: newParentesco,
      idade: idadeNum,
      renda: parseFloat(newRenda) || 0,
      isChild: idadeNum < 12
    };

    setMembros((prev) => [...prev, newMember]);
    setMemberModal(false);
    setNewNome("");
    setNewParentesco("Cônjuge");
    setNewIdade("");
    setNewRenda("");
    setToastMessage(`Membro "${newNome}" adicionado.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Upload simulado
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFiles((prev) => [...prev, file.name]);
      setToastMessage(`Documento "${file.name}" anexado.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Confirmar Indicação
  const handleConfirmSubmit = () => {
    setIsSubmitting(true);
    setToastMessage("Processando regras da indicação excepcional...");
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage("Indicação registrada e homologada no SIGAH!");
      setTimeout(() => {
        setToastMessage(null);
        router.push(`/${programId}/excecao`);
      }, 1500);
    }, 1800);
  };

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-7xl mx-auto px-6 pt-24 pb-32">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Breadcrumb & Title */}
            <div className="mb-8 select-none">
              <nav className="flex items-center gap-2 text-[10px] md:text-xs text-on-surface-variant mb-4 uppercase tracking-wider">
                <span>Candidatos</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span className="font-bold text-secondary">Indicação Direta</span>
              </nav>
              <h2 className="text-2xl md:text-3xl font-black font-headline text-primary tracking-tight">
                Indicação Direta - Situação Excepcional
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base mt-2 max-w-2xl font-medium">
                Formulário técnico para o registro de famílias em situações de excepcionalidade conforme regramento vigente.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: Formulário (8 Colunas) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Identificação do Responsável */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60">
                  <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-50 pb-3">
                    <BadgeAlert className="text-secondary w-5 h-5 shrink-0" />
                    <h3 className="text-base font-black font-headline text-primary uppercase tracking-wide">
                      Identificação do Responsável
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
                        Nome do Responsável
                      </label>
                      <input 
                        type="text" 
                        value={nomeResponsavel}
                        onChange={(e) => setNomeResponsavel(e.target.value)}
                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-250 focus:border-primary focus:ring-0 px-4 py-3 rounded-t-xl text-xs font-semibold text-primary transition-all"
                        placeholder="Nome completo"
                      />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2">
                        CPF
                      </label>
                      <input 
                        type="text" 
                        value={cpfResponsavel}
                        onChange={(e) => setCpfResponsavel(e.target.value)}
                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-250 focus:border-primary focus:ring-0 px-4 py-3 rounded-t-xl text-xs font-semibold text-primary transition-all"
                        placeholder="000.000.000-00"
                      />
                    </div>
                  </div>
                </section>

                {/* Membros da Família */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60">
                  <div className="flex items-center justify-between mb-6 select-none border-b border-slate-50 pb-3">
                    <div className="flex items-center gap-3">
                      <Users className="text-secondary w-5 h-5 shrink-0" />
                      <h3 className="text-base font-black font-headline text-primary uppercase tracking-wide">
                        Membros da Família
                      </h3>
                    </div>
                    <button 
                      onClick={() => setMemberModal(true)}
                      className="flex items-center gap-1 text-secondary hover:text-primary transition-colors text-[10px] font-black uppercase tracking-wider border-none bg-transparent cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Adicionar</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {membros.map((mb) => (
                      <div 
                        key={mb.id}
                        className="flex items-center justify-between p-4 bg-[#f3f4f5] rounded-2xl border border-slate-200/50 hover:bg-slate-100/55 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#003366]/5 text-[#003366] flex items-center justify-center shrink-0 shadow-sm select-none font-bold">
                            {mb.nome[0]}
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-primary leading-tight">{mb.nome}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5 text-[9px] text-on-surface-variant font-bold uppercase tracking-wider select-none">
                              <span>{mb.parentesco}</span>
                              <span>{mb.idade} anos</span>
                              <span className="text-secondary font-black">
                                {mb.renda > 0 ? `R$ ${mb.renda.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Sem Renda"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteMember(mb.id)}
                          className="text-slate-400 hover:text-error transition-colors p-2 rounded-full hover:bg-slate-200/50 border-none cursor-pointer bg-transparent flex items-center"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}

                    {/* Novo Dependente Button placeholder */}
                    <button 
                      onClick={() => setMemberModal(true)}
                      className="w-full border-2 border-dashed border-slate-250 rounded-2xl p-4 flex items-center justify-center gap-3 text-slate-400 hover:bg-slate-50 transition-colors group cursor-pointer bg-transparent"
                    >
                      <User className="w-4.5 h-4.5 text-slate-400 group-hover:text-primary transition-colors" />
                      <span className="text-xs font-black uppercase tracking-wider group-hover:text-primary transition-colors">
                        Novo dependente
                      </span>
                    </button>
                  </div>
                </section>

                {/* Detalhes da Excepcionalidade */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60">
                  <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-50 pb-3">
                    <AlertOctagon className="text-secondary w-5 h-5 shrink-0" />
                    <h3 className="text-base font-black font-headline text-primary uppercase tracking-wide">
                      Detalhes da Excepcionalidade
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2 select-none">
                        Motivo da Excepcionalidade
                      </label>
                      <select 
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-250 focus:border-primary focus:ring-0 px-4 py-3 rounded-t-xl text-xs font-bold text-primary appearance-none"
                      >
                        <option value="">Selecione o motivo oficial...</option>
                        <option value="calamidade">Calamidade Pública (Decreto Municipal)</option>
                        <option value="remocao">Remoção por Obras de Interesse Público</option>
                        <option value="risco">Área de Risco Geo-hidrológico</option>
                        <option value="judicial">Determinação Judicial Transitada em Julgado</option>
                      </select>
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-wider mb-2 select-none">
                        Justificativa Detalhada <span className="text-error font-black">*</span>
                      </label>
                      <textarea 
                        value={justificativa}
                        onChange={(e) => setJustificativa(e.target.value)}
                        rows={4}
                        className="w-full bg-slate-50 border-0 border-b-2 border-slate-250 focus:border-primary focus:ring-0 px-4 py-3 rounded-t-xl text-xs font-semibold text-primary"
                        placeholder="Descreva os fatos que justificam a indicação direta desta família..."
                      />
                    </div>
                  </div>
                </section>

                {/* Documentos Comprobatórios */}
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200/60">
                  <div className="flex items-center gap-3 mb-6 select-none border-b border-slate-50 pb-3">
                    <Upload className="text-secondary w-5 h-5 shrink-0" />
                    <h3 className="text-base font-black font-headline text-primary uppercase tracking-wide">
                      Documentos Comprobatórios
                    </h3>
                  </div>

                  <div className="border-2 border-dashed border-slate-250 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group relative">
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-10 h-10 text-slate-400 group-hover:text-secondary transition-colors mb-3 shrink-0" />
                    <p className="text-xs font-bold text-primary text-center">Clique para fazer upload ou arraste os arquivos</p>
                    <p className="text-[10px] text-slate-400 mt-1 text-center font-medium">Laudos, notificações oficiais e termos de remoção (PDF, JPG até 10MB)</p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2 select-none">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Arquivos Anexados</p>
                      <div className="flex flex-wrap gap-2">
                        {uploadedFiles.map((fn, idx) => (
                          <span 
                            key={idx}
                            className="bg-slate-100 text-primary border border-slate-200 px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center gap-1.5"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-secondary shrink-0" />
                            <span>{fn}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                {/* Botões de Ação */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 select-none">
                  <button 
                    onClick={handleConfirmSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] bg-gradient-to-br from-[#001e40] to-[#003366] text-white py-4 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:brightness-115 transition-all active:scale-[0.99] cursor-pointer border-none"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span>Confirmar Indicação</span>
                        <CheckCircle2 className="w-4.5 h-4.5 text-white shrink-0" />
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => router.push(`/${programId}/excecao`)}
                    className="flex-1 bg-white border border-slate-250 text-slate-500 hover:text-primary py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    Cancelar Operação
                  </button>
                </div>

                {/* Audit Footer */}
                <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-100 select-none font-bold">
                  <span>Registrado por: Gestor Habitacional ID #8291 em 24/05/2024 às 14:32</span>
                </div>

              </div>

              {/* Coluna Direita: Informações Contextuais (4 Colunas) */}
              <aside className="lg:col-span-4 space-y-6 select-none text-white">
                
                {/* Informative Rules */}
                <div className="bg-[#001e40] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-6">
                  <div className="space-y-1">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-[#799dd6]">
                      Informativo de Regras
                    </h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Users className="text-[#adc7ff] w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black">Faixas de Renda 1 e 2</p>
                        <p className="text-[11px] text-blue-100/70 mt-1 leading-relaxed font-semibold">
                          O limite de renda para este caso abrange as faixas iniciais, permitindo maior flexibilidade no atendimento.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <FileCheck className="text-[#adc7ff] w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black">Dispensa de Déficit</p>
                        <p className="text-[11px] text-blue-100/70 mt-1 leading-relaxed font-semibold">
                          Fica dispensada a comprovação de déficit habitacional prévio devido à urgência da situação.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quota Alert */}
                <div className="bg-[#381300] rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col gap-4 text-white">
                  <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-[#ffdbca]">
                      Alerta de Cota Operacional
                    </h4>
                    <span className="bg-[#592300] text-[#ffdbca] border border-[#ffb690]/25 px-2 py-0.5 rounded text-[8px] font-black tracking-widest">
                      NÍVEL CRÍTICO
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase text-[#ffdbca]">
                      <span>Ocupação da Cota (Risco)</span>
                      <span>18% / 20%</span>
                    </div>
                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                      <div className="bg-[#ffb690] h-full w-[90%] rounded-full transition-all duration-1000"></div>
                    </div>
                  </div>

                  <p className="text-[11px] text-orange-100/80 leading-relaxed italic border-t border-white/5 pt-4 font-semibold">
                    O limite padrão é de 20% para áreas de risco. Caso o município possua PMRR (Plano Municipal de Redução de Riscos) vigente, o teto operacional pode ser estendido para 30%.
                  </p>
                </div>

                {/* Support Card */}
                <div className="bg-[#e7e8e9]/55 rounded-2xl p-6 border border-slate-200 text-[#001e40] flex flex-col gap-3">
                  <h4 className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4.5 h-4.5 text-secondary shrink-0" />
                    <span>Precisa de ajuda?</span>
                  </h4>
                  <p className="text-[11px] text-[#43474f] leading-relaxed font-semibold">
                    Consulte a base de conhecimento sobre o Decreto Municipal 12.445/2023 para diretrizes de remoção.
                  </p>
                  <button 
                    onClick={() => setToastMessage("Abrindo guia do Decreto Municipal 12.445/2023...")}
                    className="w-full py-2.5 text-[9px] font-black text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/5 transition-colors uppercase tracking-widest cursor-pointer bg-transparent"
                  >
                    Ver Documentação
                  </button>
                </div>

              </aside>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL DE ADICIONAR DEPENDENTE / MEMBRO
          ========================================== */}
      {memberModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <form 
            onSubmit={handleAddMemberSubmit}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 border border-outline-variant/10"
          >
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 select-none">
              <div>
                <h3 className="text-base font-black text-primary uppercase tracking-wide">Novo Dependente</h3>
                <p className="text-[10px] text-on-surface-variant font-bold mt-1 uppercase">
                  Adicionar membro à composição familiar
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setMemberModal(false)}
                className="text-slate-400 hover:text-primary p-1 rounded-full hover:bg-slate-100 transition-colors border-none cursor-pointer bg-transparent flex items-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs font-semibold text-primary">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">
                  Nome Completo
                </label>
                <input 
                  type="text" 
                  required
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                  placeholder="Nome completo do membro"
                  className="bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 px-3 py-2 text-xs font-semibold text-primary rounded-t-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">
                    Parentesco
                  </label>
                  <select 
                    value={newParentesco}
                    onChange={(e) => setNewParentesco(e.target.value)}
                    className="bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 px-3 py-2 text-xs font-semibold text-primary rounded-t-lg"
                  >
                    <option value="Cônjuge">Cônjuge</option>
                    <option value="Filho(a)">Filho(a)</option>
                    <option value="Enteado(a)">Enteado(a)</option>
                    <option value="Pai/Mãe">Pai/Mãe</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">
                    Idade
                  </label>
                  <input 
                    type="number" 
                    required
                    value={newIdade}
                    onChange={(e) => setNewIdade(e.target.value)}
                    placeholder="Ex: 10"
                    className="bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 px-3 py-2 text-xs font-semibold text-primary rounded-t-lg"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider">
                  Renda Mensal (R$)
                </label>
                <input 
                  type="number" 
                  value={newRenda}
                  onChange={(e) => setNewRenda(e.target.value)}
                  placeholder="Ex: 1200 (deixe em branco se for 0)"
                  className="bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 px-3 py-2 text-xs font-semibold text-primary rounded-t-lg"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 select-none pt-2">
              <button
                type="submit"
                className="flex-grow py-3.5 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all cursor-pointer border-none shadow-md"
              >
                Adicionar Membro
              </button>
              <button
                type="button"
                onClick={() => setMemberModal(false)}
                className="px-6 py-3.5 border-2 border-slate-250 text-slate-500 hover:text-primary font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-all cursor-pointer bg-transparent"
              >
                Cancelar
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ==========================================
          MOBILE BOTTOM NAV BAR (Simulado do Stitch)
          ========================================== */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-16 px-2 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.05)] rounded-t-xl select-none">
        <button className="flex flex-col items-center justify-center text-on-surface-variant/70 border-none bg-transparent cursor-pointer">
          <Home className="w-5 h-5 text-slate-400" />
          <span className="text-[9px] font-headline uppercase tracking-widest mt-1">Início</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-xl px-4 py-1 border-none cursor-pointer">
          <GitFork className="w-5 h-5 text-[#0070ea]" />
          <span className="text-[9px] font-headline uppercase tracking-widest mt-1">Fila</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant/70 border-none bg-transparent cursor-pointer">
          <Users className="w-5 h-5 text-slate-400" />
          <span className="text-[9px] font-headline uppercase tracking-widest mt-1">Histórico</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant/70 border-none bg-transparent cursor-pointer">
          <User className="w-5 h-5 text-slate-400" />
          <span className="text-[9px] font-headline uppercase tracking-widest mt-1">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
