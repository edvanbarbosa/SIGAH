// =============================================================================
// app/[programId]/[candidatoId]/adaptacao/page.tsx
// Solicitação de Adaptação - Padronização Definitiva (Passo 15.1).
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
  User,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Trash2,
  FileText,
  BookOpen,
  ArrowRight,
  Loader2,
  X,
  Home,
  Users,
  MessageSquare,
  Bell
} from "lucide-react";

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
}

export default function SolicitacaoAdaptacaoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;
  const candidatoId = params.candidatoId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingFile, setIsDeletingFile] = useState(false);

  // Modal manual
  const [showManualModal, setShowManualModal] = useState(false);

  // Membros da Família
  const members: FamilyMember[] = [
    { id: "m-1", name: "Lucas S. Oliveira", relation: "Filho", age: 12 },
    { id: "m-2", name: "Maria Clara S. Oliveira", relation: "Cônjuge", age: 38 }
  ];
  const [selectedMemberId, setSelectedMemberId] = useState("m-1");

  // Natureza do Impedimento (Tags)
  const [impediments, setImpediments] = useState<string[]>([
    "Cadeirante"
  ]);

  const toggleImpediment = (tag: string) => {
    setImpediments(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Detalhamento Técnico
  const [techDetails, setTechDetails] = useState("");

  // Modificações Requeridas (Checkboxes)
  const [modifications, setModifications] = useState({
    barras: false,
    portas: false,
    piso: true, // Pré-marcado conforme especificação do mockup
    bancadas: false
  });

  const toggleModification = (key: keyof typeof modifications) => {
    setModifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Laudo Médico Anexado
  const [attachedFile, setAttachedFile] = useState<string | null>("laudo_medico_lucas_2.pdf");

  // Deletar arquivo
  const handleDeleteFile = () => {
    setIsDeletingFile(true);
    setTimeout(() => {
      setAttachedFile(null);
      setIsDeletingFile(false);
      setToastMessage("Laudo médico removido. Por favor, anexe um novo arquivo!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 800);
  };

  // Simular upload de arquivo
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setToastMessage(`Carregando arquivo: ${file.name}...`);
    setTimeout(() => {
      setAttachedFile(file.name);
      setToastMessage("Laudo médico anexado com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Enviar Solicitação
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attachedFile) {
      alert("Atenção: É obrigatório anexar o laudo médico comprobatório.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage("Solicitação de adaptação enviada para análise técnica!");
      
      setTimeout(() => {
        setToastMessage(null);
        router.push(`/${programId}/${candidatoId}`);
      }, 2000);
    }, 1500);
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
          
          <main className="pt-24 px-4 max-w-[480px] mx-auto w-full space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <header className="select-none">
              <h1 className="text-2xl font-black text-[#001e40] tracking-tight mb-2">
                Solicitar Adaptação de Unidade
              </h1>
              <p className="text-slate-500 text-xs font-semibold flex items-center gap-1">
                Candidato: Lucas S. Oliveira — Solicitação de Acessibilidade
              </p>
              <div className="mt-3 flex">
                <span className="bg-[#075bbd] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                  Em Preenchimento
                </span>
              </div>
            </header>

            {/* Seção 1: Membro da Família */}
            <section className="space-y-4">
              <div className="border-l-4 border-[#075bbd] pl-3 -ml-1 select-none">
                <h2 className="text-base font-black text-slate-900">Membro da Família</h2>
              </div>
              
              <div className="space-y-3">
                {members.map(member => {
                  const isSelected = selectedMemberId === member.id;
                  return (
                    <div 
                      key={member.id}
                      onClick={() => setSelectedMemberId(member.id)}
                      className={`p-5 rounded-2xl bg-white border flex items-center justify-between shadow-sm relative overflow-hidden transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? "border-secondary ring-2 ring-secondary/15" 
                          : "border-slate-200 opacity-60 hover:opacity-80"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-indigo-50 text-secondary" : "bg-slate-100 text-slate-400"
                        }`}>
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{member.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{member.relation} • {member.age} anos</p>
                        </div>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Seção 2: Necessidades Específicas */}
            <section className="space-y-6">
              <div className="border-l-4 border-[#075bbd] pl-3 -ml-1 select-none">
                <h2 className="text-base font-black text-slate-900">Necessidades Específicas</h2>
              </div>

              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 select-none">
                  Natureza do Impedimento
                </p>
                <div className="flex flex-wrap gap-2 select-none">
                  {["Cadeirante", "Ostomizado", "Visão Subnormal"].map(tag => {
                    const isSelected = impediments.includes(tag);
                    return (
                      <button 
                        key={tag}
                        type="button"
                        onClick={() => toggleImpediment(tag)}
                        className={`px-4 py-2 rounded-full text-xs font-black transition-all border cursor-pointer ${
                          isSelected 
                            ? "bg-secondary text-white border-transparent" 
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                  <span className="px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold select-none cursor-default shadow-sm">
                    + Outros
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 select-none">
                  Detalhamento Técnico
                </p>
                <textarea 
                  value={techDetails}
                  onChange={(e) => setTechDetails(e.target.value)}
                  className="w-full bg-white border border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-sm p-4 min-h-[100px] rounded-2xl shadow-sm transition-all text-primary font-semibold"
                  placeholder="Descreva as limitações funcionais e as dificuldades de uso do espaço atual..."
                  rows={4}
                ></textarea>
              </div>
            </section>

            {/* Seção 3: Modificações Requeridas */}
            <section className="space-y-4">
              <div className="border-l-4 border-[#075bbd] pl-3 -ml-1 select-none">
                <h2 className="text-base font-black text-slate-900">Modificações Requeridas</h2>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm space-y-1 select-none">
                <label className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={modifications.barras}
                    onChange={() => toggleModification("barras")}
                    className="w-5 h-5 rounded border-slate-350 text-secondary focus:ring-secondary cursor-pointer" 
                  />
                  <span className="ml-4 text-xs font-black text-slate-700">Barras de apoio (Banheiro)</span>
                </label>

                <label className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={modifications.portas}
                    onChange={() => toggleModification("portas")}
                    className="w-5 h-5 rounded border-slate-350 text-secondary focus:ring-secondary cursor-pointer" 
                  />
                  <span className="ml-4 text-xs font-black text-slate-700">Ampliação de portas</span>
                </label>

                <label className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={modifications.piso}
                    onChange={() => toggleModification("piso")}
                    className="w-5 h-5 rounded border-slate-350 text-secondary focus:ring-secondary cursor-pointer" 
                  />
                  <span className="ml-4 text-xs font-black text-slate-700">Piso tátil direcional</span>
                </label>

                <label className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                  <input 
                    type="checkbox"
                    checked={modifications.bancadas}
                    onChange={() => toggleModification("bancadas")}
                    className="w-5 h-5 rounded border-slate-350 text-secondary focus:ring-secondary cursor-pointer" 
                  />
                  <span className="ml-4 text-xs font-black text-slate-700">Rebaixamento de bancadas</span>
                </label>
              </div>
            </section>

            {/* Seção 4: Laudo Médico Obrigatório */}
            <section className="space-y-4">
              <div className="border-l-4 border-[#075bbd] pl-3 -ml-1 select-none">
                <h2 className="text-base font-black text-slate-900">Laudo Médico Obrigatório</h2>
              </div>

              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center shadow-sm">
                <div className="flex flex-col items-center select-none">
                  <div className="w-14 h-14 bg-indigo-50 text-secondary rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-secondary shrink-0" />
                  </div>
                  <label className="text-xs font-black text-slate-800 cursor-pointer hover:underline">
                    Clique para enviar ou arraste o arquivo
                    <input 
                      type="file"
                      className="hidden"
                      onChange={handleUploadFile}
                      accept=".pdf,.jpg,.png"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">Formatos aceitos: PDF, JPG (Máx 10MB)</p>
                </div>

                {attachedFile && (
                  <div className="mt-6 p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200/60 animate-fade-in">
                    <div className="flex items-center gap-3 overflow-hidden select-none">
                      <FileText className="w-5 h-5 text-red-500 shrink-0" />
                      <span className="text-xs font-black text-slate-700 underline truncate max-w-[180px]">
                        {attachedFile}
                      </span>
                    </div>
                    <button 
                      onClick={handleDeleteFile}
                      disabled={isDeletingFile}
                      className="text-slate-400 hover:text-red-500 border-none bg-transparent cursor-pointer"
                    >
                      {isDeletingFile ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Aviso Importante (Stitch Yellow Card) */}
            <section className="select-none">
              <div className="bg-[#fff9ef] border border-[#ffecb3]/60 rounded-3xl p-6 relative overflow-hidden shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-[#bf7100] shrink-0" />
                  <h4 className="font-black text-sm text-[#5c3e00] uppercase tracking-wider">Aviso Importante</h4>
                </div>
                <p className="text-xs text-[#7a5a00] leading-relaxed font-semibold">
                  Alterações estruturais sem autorização prévia podem acarretar multas e perda da garantia da unidade, conforme o contrato de aquisição.
                </p>
              </div>
            </section>

            {/* Guia Visual Card */}
            <section>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="relative h-40 bg-slate-200 select-none">
                  <img 
                    alt="Guia Visual" 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZV7udSYctVZvmDxG3bh5-O-5vvWQqhGpvAmaAikGWMnEngZNkSzAQgG0xYeo1gigXM-VFmoATD6UyfB7cxoz0QiYvSlkx0CzJzDo5QGo4A5hSH8RVkU3IFES0MOFivze5CQ9xgEqffB4jJuZ1bKlGCSj--MMiJEIUj3Q8ki4_gXf5fL7PjDWQ-tyxvfPcUZAtpmnEKDfF5yKy9mQ_HbUvy6-xgr5RIrCBBg2ZNbGwVy7-0gpl2PDt0zQE4yC2bTahTvZ1E-91cp4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-left">
                    <p className="text-[8px] font-black text-white/80 uppercase tracking-widest mb-1">Guia Visual</p>
                    <p className="text-sm font-black text-white">Manual Técnico de Adaptações</p>
                  </div>
                </div>
                <div className="p-5 select-none">
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed font-semibold">
                    Confira os padrões técnicos exigidos para cada tipo de modificação estrutural.
                  </p>
                  <button 
                    onClick={() => setShowManualModal(true)}
                    className="w-full py-3.5 border border-slate-200 rounded-xl text-xs font-black text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 border-none bg-transparent cursor-pointer uppercase tracking-wider"
                  >
                    <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                    Visualizar Manual (PDF)
                  </button>
                </div>
              </div>
            </section>

            {/* Ações do Formulário */}
            <section className="space-y-3 pt-4 select-none">
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 bg-[#075bbd] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:bg-[#004eab] active:scale-[0.98] transition-all border-none cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Enviar Solicitação</span>
                    <ArrowRight className="w-4 h-4 text-white shrink-0" />
                  </>
                )}
              </button>
              
              <button 
                onClick={() => router.push(`/${programId}/${candidatoId}`)}
                className="w-full py-4 bg-white text-slate-650 rounded-2xl font-black text-xs uppercase tracking-widest border border-slate-250 hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
              >
                Cancelar
              </button>
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
          href={`/${programId}/${candidatoId}`}
          className="flex flex-col items-center justify-center text-[#075bbd] font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <CheckCircle2 className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Dossiê</span>
        </a>
        <a 
          href={`/${programId}/social`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Chat</span>
        </a>
        <a 
          href="#"
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Bell className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Alertas</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: MANUAL TÉCNICO
          ========================================== */}
      {showManualModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowManualModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Manual Técnico NBR</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowManualModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-mono text-[10px] text-slate-600 leading-relaxed">
                <span className="text-blue-600 font-bold block mb-1">SIGAH // NBR_9050 // ACESSIBILIDADE</span>
                ----------------------------------------<br />
                - PORTAS: LARGURA MÍNIMA DE 80CM ÚTEIS<br />
                - BARRAS: SUPORTE COMPATÍVEL COM 150KG<br />
                - PISO TÁTIL: CONFORME DIRETRIZES DE SINALIZAÇÃO<br />
                - BANHEIRO: ROTA DE GIRO DE 1.50M LIVRE<br />
                ----------------------------------------<br />
                Manual homologado para entrega habitacional SIGAH.
              </div>

              <div className="pt-2 select-none">
                <button 
                  onClick={() => setShowManualModal(false)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  FECHAR MANUAL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
