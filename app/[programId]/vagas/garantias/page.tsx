// =============================================================================
// app/[programId]/vagas/garantias/page.tsx
// Gestão de Garantias e Responsabilidade Técnica (Passo 31.1).
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
  ShieldAlert,
  ShieldCheck,
  FileText,
  Download,
  Plus,
  ArrowRight,
  CheckCircle2,
  X,
  Loader2,
  Building,
  Key,
  Calendar,
  AlertTriangle,
  History,
  PenTool,
  Grid,
  Users
} from "lucide-react";

interface WarrantyPolicy {
  policyNumber: string;
  insuranceCompany: string;
  startDate: string;
  endDate: string;
  status: "Conformidade" | "Pendente" | "Vencido";
  type: string;
}

export default function GestaoGarantiasPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados interativos
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Modais
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showNewWarrantyModal, setShowNewWarrantyModal] = useState(false);

  // Assinatura de Responsabilidade Pública
  const [signatureStatus, setSignatureStatus] = useState<"not_signed" | "signed">("not_signed");
  const [signatureHash, setSignatureHash] = useState<string | null>(null);

  // Lista de Apólices/Garantias
  const [warranties, setWarranties] = useState<WarrantyPolicy[]>([
    {
      policyNumber: "SG-2023-8849-BR01",
      insuranceCompany: "Institucional Seguros S.A.",
      startDate: "12 Out 2023",
      endDate: "12 Out 2025",
      status: "Conformidade",
      type: "Seguro Garantia"
    }
  ]);

  // Formulario Nova Garantia
  const [newPolicyNum, setNewPolicyNum] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");
  const [newType, setNewType] = useState("Seguro Garantia");

  // Assinar Documento de Responsabilidade Técnica
  const handleSignDocument = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignatureStatus("signed");
      const hash = Array.from({ length: 16 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join("").toUpperCase();
      setSignatureHash(hash);
      
      setToastMessage("Atestado de Responsabilidade assinado digitalmente com sucesso!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1500);
  };

  // Cadastrar Nova Garantia/Apólice
  const handleCreateWarranty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyNum.trim() || !newCompany.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsCreating(true);
    setTimeout(() => {
      const newPolicy: WarrantyPolicy = {
        policyNumber: newPolicyNum,
        insuranceCompany: newCompany,
        startDate: newStartDate || "Hoje",
        endDate: newEndDate || "12 Out 2026",
        status: "Conformidade",
        type: newType
      };

      setWarranties(prev => [newPolicy, ...prev]);
      setIsCreating(false);
      setShowNewWarrantyModal(false);

      // Limpar formulário
      setNewPolicyNum("");
      setNewCompany("");
      setNewStartDate("");
      setNewEndDate("");

      setToastMessage(`Garantia ${newPolicyNum} registrada com sucesso!`);
      setTimeout(() => setToastMessage(null), 3500);
    }, 1200);
  };

  // Simular download de relatórios
  const handleDownloadReports = () => {
    setToastMessage("Compilando histórico de responsabilidades técnicas...");
    setTimeout(() => {
      setToastMessage("Relatório de Garantias baixado com sucesso!");
      setTimeout(() => setToastMessage(null), 3000);
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
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <header className="select-none">
              <nav className="flex text-on-surface-variant text-xs gap-2 mb-4 uppercase tracking-widest font-bold">
                <span>Módulo de Integridade</span>
                <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                <span className="text-secondary font-black">Gestão de Garantias</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#001e40] tracking-tight">
                    Gestão de Garantias e<br />Responsabilidade Técnica
                  </h1>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleDownloadReports}
                    className="bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-xl font-sans text-xs font-black text-primary flex items-center gap-2 transition-colors border-none cursor-pointer uppercase tracking-widest"
                  >
                    <Download className="w-4 h-4 text-primary shrink-0" />
                    Relatórios
                  </button>
                  <button 
                    onClick={() => setShowNewWarrantyModal(true)}
                    className="bg-primary-container text-white px-6 py-3 rounded-xl font-sans text-xs font-black flex items-center gap-2 hover:bg-primary transition-all hover:scale-102 shadow-md border-none cursor-pointer uppercase tracking-widest"
                  >
                    <Plus className="w-4 h-4 text-white shrink-0" />
                    Nova Garantia
                  </button>
                </div>
              </div>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Seguro Garantia Card (Foco Principal) */}
              <section className="lg:col-span-7 bg-white rounded-2xl p-8 flex flex-col justify-between border border-outline-variant/15 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start mb-8 relative z-10 select-none">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldCheck className="w-5 h-5 text-secondary shrink-0" />
                      <h3 className="text-xs font-black text-primary uppercase tracking-wider">
                        Seguro Garantia
                      </h3>
                    </div>
                    <p className="text-slate-400 text-xs font-semibold">Monitoramento de apólices e conformidade contratual</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-200 shrink-0">
                    ATIVO
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-6">
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider select-none">
                        Número da Apólice
                      </span>
                      <p className="text-base font-mono font-bold text-primary tracking-wide">
                        SG-2023-8849-BR01
                      </p>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider select-none">
                        Status Executável
                      </span>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs select-none">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        <span>Plena Conformidade</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider select-none">
                        Período de Validade
                      </span>
                      <p className="text-base font-bold text-[#001e40]">
                        12 Out 2023 <span className="text-slate-300 mx-1">→</span> 12 Out 2025
                      </p>
                    </div>
                    <div>
                      <span className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider select-none">
                        Seguradora Emissora
                      </span>
                      <p className="text-sm font-semibold text-slate-600">
                        Institucional Seguros S.A.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center relative z-10 select-none">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Última validação: Há 14 minutos via API Susep
                  </span>
                  <button 
                    onClick={() => setShowCertificateModal(true)}
                    className="text-secondary hover:underline font-black text-xs flex items-center gap-1 border-none bg-transparent cursor-pointer uppercase tracking-wider"
                  >
                    Visualizar Certificado
                    <ArrowRight className="w-3.5 h-3.5 text-secondary shrink-0" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              </section>

              {/* Prazos e Alertas (Bento Vermelho/Laranja) */}
              <section className="lg:col-span-5 bg-[#592300] text-white rounded-2xl p-8 flex flex-col justify-center border-none shadow-md overflow-hidden relative">
                <div className="absolute top-4 right-4 opacity-10 select-none">
                  <Calendar className="w-24 h-24 text-white" />
                </div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10 select-none">
                  <div className="bg-white/20 p-2.5 rounded-xl">
                    <ShieldAlert className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-black font-headline">Prazos e Alertas</h3>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="relative">
                    <div className="flex mb-2 items-center justify-between text-xs font-bold uppercase tracking-wider select-none">
                      <span className="text-orange-200">Vencimento do Seguro</span>
                      <span>82%</span>
                    </div>
                    <div className="h-2 w-full bg-[#381300] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-400 w-[82%] rounded-full"></div>
                    </div>
                    <p className="text-xs font-semibold mt-3 text-orange-200 select-none">
                      Restam 42 dias para renovação da apólice principal.
                    </p>
                  </div>

                  <div className="bg-white/10 p-4 rounded-xl border border-white/10 flex items-start gap-3 select-none">
                    <AlertTriangle className="w-5 h-5 text-orange-450 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <span className="font-black block text-white mb-1 uppercase tracking-wider">Ação Necessária</span>
                      <p className="text-orange-100 font-medium">Notificar construtora para envio do aditivo contratual.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Informações da Construtora */}
              <section className="lg:col-span-6 bg-slate-50 rounded-2xl p-8 border border-outline-variant/15 shadow-sm space-y-8">
                <div className="flex items-center gap-3 select-none">
                  <Building className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="text-lg font-black text-[#001e40]">Informações da Construtora</h3>
                </div>

                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl overflow-hidden shadow-sm bg-white p-3 border border-slate-200 shrink-0 select-none">
                    <img 
                      alt="Logo Construtora" 
                      className="h-full w-full object-contain" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCov1C1eHFnRRS8glquke59GGrZm7SG1NpIJEKsBdrcex7UdyOMKajAnAuVGbA9qpBz0UGYlnP-w27yYfGaq-6oPBs2L68ITEWX5Qp8fn-cGhhJM3resUOXzcHNkzS0uy8apZQAjjnYfnPA2_c14zvT2d1BHcLlNR8qDoK1dH2dNKSd1bqeQsCpQCztt2l9Qam8HAkw5nXJCxr7tJBlOUYsXca5mFKXu5bZND7oUYXGl4VxW7inzIe9Hbn1Mr7VxcT3YSAILg-UB2U"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-[#001e40] tracking-tight">
                      Vanguarda Infraestruturas Ltda
                    </h4>
                    <p className="text-slate-500 font-bold text-xs">CNPJ: 12.345.678/0001-90</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                    Contratos Ativos
                  </span>
                  <div className="space-y-2 select-none">
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs font-black text-[#001e40]">Residencial Porto das Águas</span>
                      <span className="text-[9px] bg-primary text-white px-2.5 py-1 rounded font-black uppercase">
                        88% Concluído
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs font-black text-[#001e40]">Terminal Logístico Sul</span>
                      <span className="text-[9px] bg-primary text-white px-2.5 py-1 rounded font-black uppercase">
                        24% Concluído
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Responsabilidade Pública (Atestado) */}
              <section className="lg:col-span-6 bg-white rounded-2xl p-8 border border-outline-variant/15 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 relative z-10 select-none">
                  <PenTool className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="text-lg font-black text-primary">Responsabilidade Pública</h3>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl mb-6 flex-grow border-l-4 border-[#001e40] relative z-10 select-none">
                  <p className="text-slate-700 italic font-semibold leading-relaxed mb-6 text-xs">
                    "Fica formalmente atestado que o Município assume a plena responsabilidade pelas áreas públicas do loteamento SIGAH-North, garantindo a manutenção de vias e saneamento básico a partir da data de entrega definitiva."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-0.5 bg-slate-350"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Atestado de Responsabilidade Local
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex -space-x-2 select-none">
                    <div className="w-9 h-9 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[9px] text-white font-black">GP</div>
                    <div className="w-9 h-9 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-[9px] text-white font-black">SEC</div>
                  </div>

                  {signatureStatus === "signed" ? (
                    <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl flex items-center gap-2 select-none">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="text-left">
                        <span className="text-[8px] font-black text-emerald-700 block uppercase tracking-wider">Assinado Digitalmente</span>
                        <span className="text-[9px] text-slate-400 font-mono font-bold leading-none">{signatureHash}</span>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleSignDocument}
                      disabled={isSigning}
                      className="bg-primary hover:bg-[#003366] text-white text-xs font-black px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 border-none cursor-pointer uppercase tracking-widest"
                    >
                      {isSigning ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <>
                          <span>Assinar Documento</span>
                          <PenTool className="w-4 h-4 text-white shrink-0" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </section>

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
          <Grid className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/vagas`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <ShieldCheck className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Garantia</span>
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
          MODAL: CERTIFICADO DE APÓLICE (SEGURO)
          ========================================== */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowCertificateModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Certificado de Apólice</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowCertificateModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-mono text-[10px] text-slate-600 leading-relaxed">
                <span className="text-blue-600 font-bold block mb-1">SUSEP // CERTIFICADO DIGITAL // Nº 48102-A</span>
                ----------------------------------------<br />
                APÓLICE: SG-2023-8849-BR01<br />
                SEGURADO: Município de SIGAH-North<br />
                GARANTIDO: Vanguarda Infraestruturas Ltda<br />
                EMISSOR: Institucional Seguros S.A.<br />
                VALOR SEGURADO: R$ 3.500.000,00<br />
                STATUS: VALIDAÇÃO EM CONFORMIDADE (SUSEP API)<br />
                VALIDADE: 12/10/2023 A 12/10/2025
              </div>

              <div className="pt-2 select-none">
                <button 
                  onClick={() => setShowCertificateModal(false)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  FECHAR CERTIFICADO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REGISTRO DE NOVA GARANTIA
          ========================================== */}
      {showNewWarrantyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowNewWarrantyModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Registrar Nova Garantia</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowNewWarrantyModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateWarranty} className="p-6 space-y-4">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Número da Apólice
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  placeholder="SG-2023-XXXX-BRXX"
                  value={newPolicyNum}
                  onChange={(e) => setNewPolicyNum(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Seguradora Emissora
                </label>
                <input 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  placeholder="Ex: Seguradora Habitacional S.A."
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                    Data Inicial
                  </label>
                  <input 
                    type="text"
                    placeholder="12 Out 2023"
                    className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                    Data de Vencimento
                  </label>
                  <input 
                    type="text"
                    placeholder="12 Out 2025"
                    className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-slate-500 block mb-2 tracking-widest select-none">
                  Tipo de Garantia
                </label>
                <select 
                  className="w-full bg-slate-50 border-none border-b-2 border-[#001e40] focus:ring-0 focus:border-secondary p-3.5 text-xs rounded-t-lg text-primary font-bold"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                >
                  <option value="Seguro Garantia">Seguro Garantia</option>
                  <option value="Fiança Bancária">Fiança Bancária</option>
                  <option value="Caução de Títulos">Caução de Títulos</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setShowNewWarrantyModal(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="flex-1 py-3 bg-[#001e40] text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>REGISTRAR</span>
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
