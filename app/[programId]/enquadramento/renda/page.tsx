// =============================================================================
// app/[programId]/enquadramento/renda/page.tsx
// Validação de Renda - Padronização Final (Passo 22.2).
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
  RefreshCw,
  Award,
  CheckCircle,
  AlertTriangle,
  Coins,
  ShieldCheck,
  Shield,
  Eye,
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Heart,
  Activity,
  Users,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  Home,
  Sun,
  X,
  Loader2,
  Bell,
  ArrowUpRight
} from "lucide-react";

interface MemberIncome {
  id: string;
  name: string;
  initials: string;
  cpf: string;
  cnisIncome: number;
  declaredIncome: number;
  status: "convergente" | "divergente";
}

export default function ValidacaoRendaPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Modais
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberIncome | null>(null);
  const [resolvedIncome, setResolvedIncome] = useState("2138");
  const [showMemberDetails, setShowMemberDetails] = useState<MemberIncome | null>(null);

  // Lista de Rendas
  const [members, setMembers] = useState<MemberIncome[]>([
    {
      id: "m-maria",
      name: "Maria Oliveira Santos",
      initials: "MS",
      cpf: "055.***.***-01",
      cnisIncome: 1412.00,
      declaredIncome: 1412.00,
      status: "convergente"
    },
    {
      id: "m-ricardo",
      name: "Ricardo Santos",
      initials: "RS",
      cpf: "122.***.***-45",
      cnisIncome: 2138.00,
      declaredIncome: 0.00,
      status: "divergente"
    }
  ]);

  // Calcula Renda Total Familiar
  const totalFamilyIncome = members.reduce((sum, m) => sum + m.cnisIncome, 0);

  // Simular verificação de bases externas
  const handleVerifyBases = () => {
    setIsProcessing(true);
    setToastMessage("Sincronizando com as bases do CNIS, CadÚnico e Receita Federal...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Sincronização concluída! Dados atualizados.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  // Simular reprocessamento de enquadramento
  const handleReprocess = () => {
    setIsProcessing(true);
    setToastMessage("Recalculando faixa de enquadramento socioeconômico...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Reprocessamento concluído! Família enquadrada na Faixa 1 - Urbano.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  // Simular validação final da proposta
  const handleValidate = () => {
    setIsProcessing(true);
    setToastMessage("Homologando proposta de enquadramento habitacional...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Renda validada com sucesso! Proposta enviada para análise final.");
      setTimeout(() => {
        setToastMessage(null);
        router.push(`/${programId}/enquadramento`);
      }, 2000);
    }, 1500);
  };

  // Resolver divergência de renda
  const handleResolveDivergence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    const parsedIncome = parseFloat(resolvedIncome) || 0;

    setMembers(prev => prev.map(m => {
      if (m.id === selectedMember.id) {
        return {
          ...m,
          declaredIncome: parsedIncome,
          status: Math.abs(m.cnisIncome - parsedIncome) < 10 ? "convergente" : "divergente"
        };
      }
      return m;
    }));

    setShowResolveModal(false);
    setSelectedMember(null);
    setToastMessage("Renda declarada atualizada e divergência sanada!");
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
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-8">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-35 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho Executivo */}
            <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 select-none">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-secondary font-black text-[9px] uppercase tracking-wider">Protocolo #SH-2024-0891</span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[9px] font-black tracking-wider border border-emerald-250">
                    EM ANÁLISE FINAL
                  </span>
                </div>
                <h2 className="text-2xl font-black text-[#001e40] tracking-tight">Família Santos</h2>
                <p className="text-slate-500 text-[10px] font-bold mt-1">Inscrição realizada em 12/01/2024 • Responsável: Maria Oliveira Santos</p>
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <button 
                  onClick={handleVerifyBases}
                  disabled={isProcessing}
                  className="flex-grow md:flex-none px-4 py-3.5 border border-slate-250 bg-white hover:bg-slate-50 text-[#001e40] font-black text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500 shrink-0" />
                  Verificar bases externas
                </button>
                <button 
                  onClick={handleReprocess}
                  disabled={isProcessing}
                  className="flex-grow md:flex-none px-4 py-3.5 border border-slate-250 bg-white hover:bg-slate-50 text-[#001e40] font-black text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-500 shrink-0" />
                  Reprocessar
                </button>
                <button 
                  onClick={handleValidate}
                  disabled={isProcessing}
                  className="flex-grow md:flex-none px-6 py-3.5 bg-secondary text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg hover:bg-secondary-container transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                >
                  <Award className="w-4 h-4 text-white shrink-0" />
                  Validar
                </button>
              </div>
            </section>

            {/* Layout Bento: Alertas & Sumário Financeiro */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Divergência Detectada Card (1 col) */}
              <div className="lg:col-span-1 bg-white border-l-4 border-red-600 rounded-2xl shadow-sm p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-red-50 text-red-700 rounded-xl shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-650 shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-black text-[#001e40] text-xs uppercase tracking-wider select-none">
                      Divergência Detectada
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold mt-1">
                      Ricardo Santos: Renda declarada difere do CNIS (Diferença &gt; 30%).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 select-none">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-black text-[9px] text-[#5c3e00] uppercase tracking-wider">60 dias para regularização</span>
                </div>
              </div>

              {/* Renda Familiar Card (2 cols) */}
              <div className="lg:col-span-2 bg-[#001e40] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5 select-none pointer-events-none">
                  <Coins className="w-48 h-48 text-white" />
                </div>
                <div className="z-10 select-none">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-350">Renda Total Familiar</p>
                  <h3 className="text-3xl font-black text-white mt-1">
                    R$ {totalFamilyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-300 mt-2">
                    <CheckCircle className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-[10px] font-semibold">Base: Autodeclaração Validada</span>
                  </div>
                </div>

                <div className="h-px md:h-12 w-full md:w-px bg-white/10 select-none"></div>

                <div className="z-10 text-center md:text-right select-none">
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-350">Enquadramento Automático</p>
                  <div className="bg-secondary text-white px-4 py-2 rounded-lg inline-block mt-2 text-xs font-black uppercase tracking-wider shadow">
                    Faixa 1 - Urbano
                  </div>
                </div>
              </div>

            </div>

            {/* Perfis e Critérios de Prioridade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Critérios de Prioridade (Portaria) */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 select-none">
                  <Sparkles className="w-5 h-5 text-secondary shrink-0" />
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                    Perfis e Critérios de Prioridade
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 select-none">
                  {["Mulher Responsável", "Bolsa Família", "Crianças/Adolescentes"].map(tag => (
                    <span 
                      key={tag} 
                      className="px-3 py-1.5 bg-white border border-slate-200 text-[#0059bb] text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1"
                    >
                      <Users className="w-3.5 h-3.5 text-secondary" />
                      {tag}
                    </span>
                  ))}
                  <span className="px-3 py-1.5 bg-white border border-slate-200 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    Área de Risco
                  </span>
                </div>

                <div className="p-4 bg-indigo-50/50 border-l-4 border-secondary rounded-r-xl select-none">
                  <p className="text-[11px] text-secondary italic font-semibold leading-relaxed">
                    "Atende a 4/6 critérios definidos na Portaria MC nº 2.450/2022, conferindo prioridade alta na fila de espera."
                  </p>
                </div>
              </div>

              {/* Isenção Validada (Custo Zero) */}
              <div className="bg-[#e7f0ff] border border-blue-200 rounded-2xl p-6 flex flex-col justify-between space-y-6">
                <div className="select-none">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#0059bb] shrink-0" />
                      <h3 className="font-black text-[#001a40] text-xs uppercase tracking-wider">Isenção Validada</h3>
                    </div>
                    <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      CUSTO ZERO
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-[#001a40]">Contrato Isento</h4>
                  <p className="text-[11px] text-[#001a40]/70 mt-1 font-semibold leading-relaxed">
                    Dispensa financeira por enquadramento em benefícios continuados e condições especiais.
                  </p>
                </div>

                <div className="space-y-2 select-none">
                  <p className="text-[9px] font-black text-[#001a40]/55 uppercase tracking-widest">Motivos da Isenção</p>
                  <div className="flex flex-wrap gap-2">
                    {["Bolsa Família", "BPC", "Microcefalia"].map(reason => (
                      <span key={reason} className="text-[10px] bg-white/70 px-2 py-1 rounded-md border border-[#0059bb]/10 font-bold text-slate-800">
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Tabela de Rendas Individuais */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center select-none">
                <h3 className="font-black text-sm text-[#001e40] uppercase tracking-wide">
                  Rendas Individuais Detalhadas
                </h3>
                <button 
                  onClick={() => {
                    setToastMessage("Gerando planilha Excel de conciliação de rendas...");
                    setTimeout(() => setToastMessage(null), 3000);
                  }}
                  className="text-secondary hover:underline border-none bg-transparent cursor-pointer font-black text-xs uppercase tracking-wider"
                >
                  Exportar Relatório
                </button>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-200/50 select-none">
                    <tr className="text-[9px] font-black uppercase tracking-wider text-slate-455">
                      <th className="px-6 py-4">Membro do Grupo</th>
                      <th className="px-6 py-4">CPF</th>
                      <th className="px-6 py-4">Renda (CNIS)</th>
                      <th className="px-6 py-4">Renda (Declarada)</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-secondary flex items-center justify-center font-black text-xs select-none">
                            {member.initials}
                          </div>
                          <span className="text-xs font-black text-[#001e40]">{member.name}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs text-slate-500 font-semibold select-none">{member.cpf}</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-black text-[#001e40]">
                            R$ {member.cnisIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-black text-[#001e40]">
                            R$ {member.declaredIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="px-6 py-5 select-none">
                          {member.status === "convergente" ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-black text-[9px] uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-250">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> CONVERGENTE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-red-700 font-black text-[9px] uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-250 animate-pulse">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> DIVERGENTE
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-right">
                          {member.status === "divergente" ? (
                            <button 
                              onClick={() => {
                                setSelectedMember(member);
                                setResolvedIncome(String(member.cnisIncome));
                                setShowResolveModal(true);
                              }}
                              className="text-[#0059bb] hover:bg-blue-50 p-2 rounded-full border-none bg-transparent cursor-pointer"
                              title="Resolver Divergência"
                            >
                              <Edit2 className="w-4.5 h-4.5" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => setShowMemberDetails(member)}
                              className="text-slate-450 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer"
                              title="Visualizar Detalhes"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Social Benefits Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Bolsa Família */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0059bb] flex items-center justify-center shrink-0 select-none">
                  <Sparkles className="w-6 h-6 text-secondary" />
                </div>
                <div className="select-none">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bolsa Família</p>
                  <h4 className="font-heading font-black text-slate-905 text-sm mt-0.5">R$ 750,00</h4>
                  <span className="text-[9px] text-emerald-700 font-black tracking-wider uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-250 mt-1 inline-block">
                    ATIVO
                  </span>
                </div>
              </div>

              {/* Auxílio Gás */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 select-none">
                  <Coins className="w-6 h-6 text-amber-600" />
                </div>
                <div className="select-none">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Auxílio Gás</p>
                  <h4 className="font-heading font-black text-slate-905 text-sm mt-0.5">R$ 102,00</h4>
                  <span className="text-[9px] text-emerald-700 font-black tracking-wider uppercase bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-250 mt-1 inline-block">
                    ATIVO
                  </span>
                </div>
              </div>

            </section>

          </main>

          {/* 4. Footer Reutilizável com Integridade das Bases */}
          <footer className="w-full bg-slate-50 border-t border-slate-200 py-6 px-6 select-none mt-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CNIS: ATUALIZADO (14:20)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CADÚNICO: SINCRONIZADO</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RECEITA FEDERAL: OK</span>
                </div>
              </div>
              <p className="text-[9px] font-semibold text-slate-400">© 2024 SIGAH - Sistema Integrado de Gestão de Apoio Habitacional</p>
            </div>
          </footer>

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
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Listas</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <FileText className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cotas</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: RESOLVER DIVERGÊNCIA DE RENDA
          ========================================== */}
      {showResolveModal && selectedMember && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowResolveModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Regularizar Renda</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowResolveModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleResolveDivergence} className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 select-none space-y-1">
                <span className="text-[8px] font-black text-red-700 bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit block">
                  CNIS Encontrado
                </span>
                <p className="text-xs font-black text-[#001e40]">{selectedMember.name}</p>
                <p className="text-sm font-black text-slate-700">R$ {selectedMember.cnisIncome.toLocaleString("pt-BR")}</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-505 uppercase tracking-wider">Ajustar Declarada (R$)</label>
                <input 
                  type="number"
                  required
                  value={resolvedIncome}
                  onChange={(e) => setResolvedIncome(e.target.value)}
                  placeholder="Ex: 2138"
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-primary font-bold focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-505 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setShowResolveModal(false)}
                >
                  CANCELAR
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#001e40] text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  SALVAR AJUSTE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: DETALHES DO MEMBRO CONVERGENTE
          ========================================== */}
      {showMemberDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setShowMemberDetails(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Detalhes da Renda</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowMemberDetails(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 select-none">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Nome do Membro</span>
                  <p className="text-xs font-black text-[#001e40] mt-0.5">{showMemberDetails.name}</p>
                </div>
                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">CPF</span>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{showMemberDetails.cpf}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Renda CNIS</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">R$ {showMemberDetails.cnisIncome.toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Renda Declarada</span>
                    <p className="text-xs font-black text-slate-800 mt-0.5">R$ {showMemberDetails.declaredIncome.toLocaleString("pt-BR")}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setShowMemberDetails(null)}
                  className="w-full py-3 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
                >
                  FECHAR DETALHES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
