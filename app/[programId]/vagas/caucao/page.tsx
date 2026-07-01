// =============================================================================
// app/[programId]/vagas/caucao/page.tsx
// Tela de Gestão de Conta Caução - Padronizada Final (Passo 26.1).
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
  ArrowLeft,
  AlertTriangle,
  Wallet,
  Receipt,
  History,
  Wrench,
  CheckCircle2,
  Plus,
  X,
  Info,
  Layers,
  Loader2,
  Home,
  Users,
  FileText
} from "lucide-react";

interface DebitItem {
  id: string;
  title: string;
  value: number;
  date: string;
  status: "Justificado" | "Pendente";
  iconType: "engineering" | "bolt";
}

interface InspectionItem {
  id: string;
  type: string;
  date: string;
  company: string;
  responsible: string;
  status: "Concluído" | "Em Andamento";
}

export default function ContaCaucaoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estado Geral
  const [balance, setBalance] = useState(45200.00);
  const [debits, setDebits] = useState<DebitItem[]>([
    {
      id: "4429",
      title: "Manutenção Emergencial Elevador Sul",
      value: 3450.00,
      date: "12 OUT 2023",
      status: "Justificado",
      iconType: "engineering"
    },
    {
      id: "3910",
      title: "Troca de Cabos de Tração - Bloco C",
      value: 12800.00,
      date: "25 AGO 2023",
      status: "Justificado",
      iconType: "bolt"
    }
  ]);

  const [inspections, setInspections] = useState<InspectionItem[]>([
    {
      id: "insp-1",
      type: "Preventiva Mensal",
      date: "14/11/2023",
      company: "Elevadores Atlas",
      responsible: "Ricardo Fontes",
      status: "Concluído"
    },
    {
      id: "insp-2",
      type: "Corretiva - Sensor Porta",
      date: "09/11/2023",
      company: "OTIS Brasil",
      responsible: "Amanda L.",
      status: "Em Andamento"
    }
  ]);

  // Estados dos Modais
  const [isDebitModalOpen, setIsDebitModalOpen] = useState(false);
  const [debitValue, setDebitValue] = useState("");
  const [debitReason, setDebitReason] = useState("");

  const [isInspectionModalOpen, setIsInspectionModalOpen] = useState(false);
  const [newInspectionType, setNewInspectionType] = useState("Preventiva Mensal");
  const [newInspectionCompany, setNewInspectionCompany] = useState("");
  const [newInspectionResp, setNewInspectionResp] = useState("");

  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Formata moeda BRL
  const formatCurrency = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  // Autorizar Débito
  const handleConfirmDebit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = parseFloat(debitValue.replace(",", "."));
    
    if (isNaN(numericValue) || numericValue <= 0) {
      alert("Por favor, insira um valor válido.");
      return;
    }
    if (!debitReason.trim()) {
      alert("A justificativa técnica é obrigatória.");
      return;
    }

    setBalance(prev => prev - numericValue);
    
    const newDebit: DebitItem = {
      id: Math.floor(1000 + Math.random() * 9000).toString(),
      title: debitReason,
      value: numericValue,
      date: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase(),
      status: "Justificado",
      iconType: "engineering"
    };

    setDebits(prev => [newDebit, ...prev]);
    setIsDebitModalOpen(false);
    setDebitValue("");
    setDebitReason("");
    
    setToastMessage(`Débito de ${formatCurrency(numericValue)} autorizado e justificado com sucesso.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Cadastrar Fiscalização
  const handleConfirmInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInspectionCompany.trim() || !newInspectionResp.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const newInsp: InspectionItem = {
      id: `insp-${Date.now()}`,
      type: newInspectionType,
      date: new Date().toLocaleDateString("pt-BR"),
      company: newInspectionCompany,
      responsible: newInspectionResp,
      status: "Concluído"
    };

    setInspections(prev => [newInsp, ...prev]);
    setIsInspectionModalOpen(false);
    setNewInspectionCompany("");
    setNewInspectionResp("");

    setToastMessage("Fiscalização/Manutenção técnica registrada com sucesso.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Exportar Extrato Completo (Gera TXT client-side)
  const handleExportStatement = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setToastMessage("Extrato da Conta Caução exportado!");

      const dataText = `==================================================
SIGAH - EXTRATO DE MOVIMENTAÇÃO DE CONTA CAUÇÃO
==================================================
Programa Habitacional: ${programId.toUpperCase()}
Saldo Atual da Conta: ${formatCurrency(balance)}
Status Legal: ${balance < 60000 ? "ABAIXO DO LIMITE LEGAL DE SEGURANÇA" : "REGULAR"}

HISTÓRICO DE DEBITOS LANÇADOS:
${debits.map(d => `- ID #${d.id} | ${d.date}\n  Motivo: ${d.title}\n  Valor: - ${formatCurrency(d.value)}\n  Status: ${d.status}`).join("\n\n")}

REGISTROS DE FISCALIZAÇÃO E INSPEÇÕES TÉCNICAS:
${inspections.map(i => `- ${i.date} | ${i.type}\n  Empresa: ${i.company}\n  Responsável: ${i.responsible}\n  Status: ${i.status}`).join("\n\n")}

Exportado em: ${new Date().toLocaleTimeString("pt-BR")} - ${new Date().toLocaleDateString("pt-BR")}
==================================================`;

      const blob = new Blob([dataText], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `extrato_caucao_${programId}_${Date.now()}.txt`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
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
          
          <main className="w-full max-w-3xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-primary-container text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho com botão Voltar */}
            <div className="space-y-4">
              <button 
                onClick={() => router.back()}
                className="flex items-center gap-1.5 text-xs font-black text-secondary hover:underline cursor-pointer border-none bg-transparent p-0 uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 text-secondary" />
                Voltar
              </button>
              
              <div className="space-y-2">
                <nav className="flex items-center gap-2 text-[10px] font-black text-on-surface-variant uppercase tracking-widest select-none">
                  <span>Administração</span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                  <span className="text-primary font-black">Conta Caução e Elevadores</span>
                </nav>
                <h2 className="text-3xl font-extrabold text-primary tracking-tight">Gestão de Conta Caução</h2>
              </div>
            </div>

            {/* Alerta de Saldo */}
            <div className="bg-[#ffdbca] p-4 rounded-xl flex items-center gap-4 border-l-4 border-[#6a3a20] shadow-sm select-none">
              <div className="bg-[#6a3a20] text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white shrink-0" />
              </div>
              <div>
                <p className="text-[10px] font-black text-[#341100] uppercase tracking-widest mb-0.5">Alerta de Saldo</p>
                <p className="text-[#6a3a20] font-bold text-sm">Reposição de Numerário solicitada</p>
              </div>
            </div>

            {/* Bento Métricas Card */}
            <section className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white shadow-xl shadow-primary/20 select-none">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-sans text-primary-fixed-dim uppercase tracking-widest text-[10px] font-black mb-1">
                      Saldo Atual
                    </p>
                    <h2 className="font-heading font-black text-4xl">{formatCurrency(balance)}</h2>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-error shrink-0 animate-pulse"></span>
                      <p className="text-on-primary-container text-[10px] font-bold uppercase tracking-tight">
                        Abaixo do limite legal
                      </p>
                    </div>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-sm">
                    <Wallet className="text-primary-fixed-dim w-6 h-6 shrink-0" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="font-heading font-black text-lg text-secondary-fixed-dim">20%</h3>
                    <p className="text-on-primary-container text-[9px] font-black uppercase mt-1 leading-tight">
                      Mínimo<br />Obrigatório
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <h3 className="font-heading font-black text-lg text-error-container">R$ 60k</h3>
                    <p className="text-on-primary-container text-[9px] font-black uppercase mt-1 leading-tight">
                      Meta de<br />Reposição
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12">
                <Receipt className="w-[140px] h-[140px] text-white shrink-0" />
              </div>
            </section>

            {/* Ações Principais */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setIsDebitModalOpen(true)}
                className="w-full py-4 bg-secondary text-white rounded-xl font-heading font-bold text-xs uppercase tracking-widest shadow-lg shadow-secondary/15 hover:brightness-110 active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                <span>AUTORIZAR DÉBITO</span>
                <Wallet className="w-4.5 h-4.5 text-white" />
              </button>
              <button 
                onClick={handleExportStatement}
                disabled={isExporting}
                className="w-full py-4 bg-surface-container-high text-primary hover:bg-slate-200 rounded-xl font-heading font-bold text-xs uppercase tracking-widest active:scale-[0.99] transition-transform flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span>EXPORTANDO EXTRATO...</span>
                  </>
                ) : (
                  <>
                    <span>VER EXTRATO COMPLETO</span>
                    <Receipt className="w-4.5 h-4.5 text-primary" />
                  </>
                )}
              </button>
            </div>

            {/* Histórico de Débitos */}
            <section className="space-y-5">
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-bold text-xl text-primary">Histórico de Débitos</h3>
                <div className="flex gap-2">
                  <div className="p-2 rounded-lg bg-surface-container-high text-on-surface-variant">
                    <History className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {debits.map(item => (
                  <div 
                    key={item.id}
                    className="bg-surface-container-lowest p-5 rounded-2xl flex flex-col gap-4 shadow-sm border-b-2 border-transparent hover:border-secondary-fixed transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 shrink-0 bg-surface-container-low rounded-full flex items-center justify-center text-primary select-none">
                        <Wrench className="w-5 h-5 shrink-0 text-primary" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-black text-on-surface text-sm">{item.title}</h4>
                          <p className="font-heading font-black text-error text-sm">- {formatCurrency(item.value)}</p>
                        </div>
                        <p className="text-on-surface-variant text-[10px] uppercase font-black mt-1 select-none">
                          {item.date} • ID #{item.id}
                        </p>
                        <div className="mt-2.5 select-none">
                          <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full tracking-wider">
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Manutenção e Fiscalização */}
            <section className="space-y-5">
              <div className="flex items-center justify-between select-none">
                <h3 className="font-heading font-bold text-xl text-primary">Manutenção e Fiscalização</h3>
                <button className="text-secondary font-black text-[10px] uppercase tracking-widest hover:underline border-none bg-transparent cursor-pointer">
                  Ver Todas
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {inspections.map(item => (
                  <div 
                    key={item.id}
                    className={`bg-surface-container-lowest p-5 rounded-2xl border-l-4 shadow-sm transition-all ${
                      item.status === "Concluído" ? "border-emerald-500" : "border-amber-500"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center select-none ${
                        item.status === "Concluído" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}>
                        <Wrench className="w-5 h-5 shrink-0" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-heading font-black text-on-surface text-sm">{item.type}</h4>
                          <p className="text-on-surface-variant text-[10px] font-bold select-none">{item.date}</p>
                        </div>
                        <p className="text-on-surface-variant text-xs mt-0.5 font-medium">
                          {item.company} • {item.responsible}
                        </p>
                        <div className="mt-2.5 select-none">
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                            item.status === "Concluído" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-amber-100 text-amber-750"
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 select-none">
                <button 
                  onClick={() => setIsInspectionModalOpen(true)}
                  className="w-full py-4 border-2 border-dashed border-outline-variant hover:bg-slate-50 text-on-surface-variant font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer bg-transparent rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4 shrink-0 text-on-surface-variant" />
                  Registrar Fiscalização
                </button>
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

      {/* ==========================================
          MODAL: AUTORIZAR DÉBITO
          ========================================== */}
      {isDebitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={() => setIsDebitModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-primary">Autorização de Débito</h3>
              <button 
                className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsDebitModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleConfirmDebit} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Valor Solicitado
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary text-lg select-none">R$</span>
                  <input 
                    className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary pl-11 py-3.5 text-lg font-bold rounded-t-lg text-primary" 
                    placeholder="0,00" 
                    type="text"
                    value={debitValue}
                    onChange={(e) => setDebitValue(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Justificativa Técnica
                </label>
                <textarea 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 rounded-t-lg text-sm text-primary" 
                  placeholder="Descreva o motivo da movimentação de numerário..." 
                  rows={4}
                  value={debitReason}
                  onChange={(e) => setDebitReason(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-secondary-fixed/20 rounded-xl border border-secondary-fixed/50 select-none">
                <Info className="w-5 h-5 text-secondary shrink-0" />
                <p className="text-[10px] font-black text-on-secondary-fixed-variant uppercase tracking-wider">
                  Assinatura digital requerida.
                </p>
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-on-surface-variant font-black text-xs border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsDebitModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  CONFIRMAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: REGISTRAR FISCALIZAÇÃO
          ========================================== */}
      {isInspectionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm transition-opacity" onClick={() => setIsInspectionModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-primary">Registrar Fiscalização</h3>
              <button 
                className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setIsInspectionModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleConfirmInspection} className="p-6 space-y-5">
              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Natureza do Serviço
                </label>
                <select 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 rounded-t-lg text-sm text-primary font-bold"
                  value={newInspectionType}
                  onChange={(e) => setNewInspectionType(e.target.value)}
                >
                  <option value="Preventiva Mensal">Preventiva Mensal</option>
                  <option value="Corretiva - Reparo Geral">Corretiva - Reparo Geral</option>
                  <option value="Vistoria Técnica de Órgão Público">Vistoria Técnica de Órgão Público</option>
                  <option value="Laudo de Segurança NBR">Laudo de Segurança NBR</option>
                </select>
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Empresa Prestadora
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary" 
                  placeholder="Ex: Elevadores Atlas, OTIS..." 
                  type="text"
                  value={newInspectionCompany}
                  onChange={(e) => setNewInspectionCompany(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-sans text-[10px] uppercase font-black text-on-surface-variant block mb-2 tracking-widest select-none">
                  Técnico Responsável
                </label>
                <input 
                  className="w-full bg-surface-container-low border-none border-b-2 border-primary focus:ring-0 focus:border-secondary p-3.5 text-sm rounded-t-lg text-primary" 
                  placeholder="Ex: Ricardo Fontes, Amanda L..." 
                  type="text"
                  value={newInspectionResp}
                  onChange={(e) => setNewInspectionResp(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-on-surface-variant font-black text-xs border border-outline-variant rounded-xl hover:bg-surface-container-low transition-all cursor-pointer bg-transparent" 
                  onClick={() => setIsInspectionModalOpen(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  SALVAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
