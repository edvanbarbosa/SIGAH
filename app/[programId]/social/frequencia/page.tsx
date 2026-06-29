// =============================================================================
// app/[programId]/social/frequencia/page.tsx
// Controle de Frequência - Padronização Final (Passo 27.2).
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
  Search,
  Filter,
  CheckSquare,
  AlertTriangle,
  Award,
  CheckCircle,
  HelpCircle,
  Clock,
  Calendar,
  Home,
  MessageSquare,
  Users,
  Settings,
  ChevronLeft,
  X,
  Loader2,
  CheckSquare2,
  FileText
} from "lucide-react";

interface BeneficiaryItem {
  id: string;
  name: string;
  initials: string;
  initialsBg: string;
  unit: string;
  nis: string;
  habitationalStatus: "Pós-Ocupação" | "Em transição";
  present: boolean;
}

export default function ControleFrequenciaPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista de Beneficiários
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryItem[]>([
    {
      id: "b-maria",
      name: "Maria Cavalcanti",
      initials: "MC",
      initialsBg: "bg-blue-100 text-[#0059bb]",
      unit: "Unidade: Bloco A, Apt 104",
      nis: "123.45678.90-1",
      habitationalStatus: "Pós-Ocupação",
      present: true
    },
    {
      id: "b-joao",
      name: "João dos Santos",
      initials: "JS",
      initialsBg: "bg-slate-200 text-[#001e40]",
      unit: "Unidade: Bloco C, Apt 302",
      nis: "234.56789.01-2",
      habitationalStatus: "Pós-Ocupação",
      present: true
    },
    {
      id: "b-antonia",
      name: "Antônia de Lima",
      initials: "AL",
      initialsBg: "bg-amber-100 text-amber-900",
      unit: "Unidade: Bloco B, Apt 005",
      nis: "345.67890.12-3",
      habitationalStatus: "Em transição",
      present: false
    },
    {
      id: "b-francisco",
      name: "Francisco Rocha",
      initials: "FR",
      initialsBg: "bg-slate-100 text-slate-500",
      unit: "Unidade: Bloco A, Apt 201",
      nis: "456.78901.23-4",
      habitationalStatus: "Pós-Ocupação",
      present: true
    }
  ]);

  // Filtrar Lista
  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.nis.includes(searchQuery)
  );

  // Métricas
  const totalCount = beneficiaries.length;
  const presentCount = beneficiaries.filter(b => b.present).length;
  const presencePercentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // Toggle Presença
  const handleTogglePresence = (id: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === id) {
        return { ...b, present: !b.present };
      }
      return b;
    }));
  };

  // Marcar Todos
  const handleMarkAllPresent = () => {
    setBeneficiaries(prev => prev.map(b => ({ ...b, present: true })));
    setToastMessage("Todos os beneficiários marcados como presentes.");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cancelar Chamada
  const handleCancel = () => {
    router.push(`/${programId}/social`);
  };

  // Finalizar Chamada
  const handleFinalize = () => {
    setIsSubmitting(true);
    setToastMessage("Salvando controle de frequência na folha do PTS...");
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage("Folha de presença homologada com sucesso!");
      setTimeout(() => {
        setToastMessage(null);
        router.push(`/${programId}/social`);
      }, 1500);
    }, 1200);
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
                <CheckCircle className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Breadcrumbs & Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 select-none">
              <div className="space-y-2">
                <nav className="flex items-center gap-2 text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-3">
                  <span>Projetos Sociais</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>PTS Vila Esperança</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[#001e40] font-black">Chamada</span>
                </nav>

                <h2 className="font-heading text-3xl font-black text-primary tracking-tight">
                  Oficina de Capacitação em Gestão Doméstica
                </h2>
                <div className="flex items-center gap-3 text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1 rounded-full text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>24 de Outubro, 2024</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3.5 py-1 rounded-full text-xs font-bold">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>14:30 - 16:30</span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-[#001e40] text-white p-6 rounded-2xl flex items-center gap-6 shadow-sm border-t border-white/10 shrink-0">
                <div className="text-left">
                  <p className="text-[8px] uppercase font-black tracking-widest text-slate-300">Presentes</p>
                  <p className="text-2xl font-black text-white mt-1">
                    {presentCount}<span className="text-base font-normal opacity-50">/{totalCount}</span>
                  </p>
                </div>
                <div className="h-12 w-px bg-white/10"></div>
                <div className="flex flex-col items-center">
                  <div className="relative h-12 w-12 flex items-center justify-center">
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0059bb" strokeWidth="3" strokeDasharray={`${presencePercentage} 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute text-[10px] font-black">{presencePercentage}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* List Table Section */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              
              {/* Toolbar */}
              <div className="p-4 md:p-6 bg-slate-50 border-b border-slate-200/60 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 select-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 shrink-0" />
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar beneficiário por nome ou NIS..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-xs font-bold text-slate-700 transition-all"
                  />
                </div>

                <div className="flex gap-3 w-full md:w-auto select-none">
                  <button 
                    onClick={() => {
                      setToastMessage("Aplicando filtros de presença...");
                      setTimeout(() => setToastMessage(null), 3000);
                    }}
                    className="flex-grow md:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-250 hover:bg-slate-50 text-[#001e40] font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span>Filtrar</span>
                  </button>
                  <button 
                    onClick={handleMarkAllPresent}
                    className="flex-grow md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary text-white font-black text-[10px] uppercase tracking-wider rounded-xl hover:bg-secondary-container transition-colors border-none cursor-pointer"
                  >
                    <CheckSquare2 className="w-4 h-4 text-white" />
                    <span>Marcar Todos</span>
                  </button>
                </div>
              </div>

              {/* Table List */}
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-200/50 select-none">
                    <tr className="text-[9px] font-black uppercase tracking-wider text-slate-455">
                      <th className="px-6 py-4">Beneficiário</th>
                      <th className="px-6 py-4">NIS</th>
                      <th className="px-6 py-4">Status Habitacional</th>
                      <th className="px-6 py-4 text-center">Presença</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredBeneficiaries.map(beneficiary => (
                      <tr key={beneficiary.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs select-none shrink-0 ${beneficiary.initialsBg}`}>
                              {beneficiary.initials}
                            </div>
                            <div>
                              <p className="font-black text-[#001e40] text-xs">{beneficiary.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5 select-none">{beneficiary.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="font-mono text-xs text-slate-550 font-bold select-none">{beneficiary.nis}</span>
                        </td>
                        <td className="px-6 py-5 select-none">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-wider uppercase ${
                            beneficiary.habitationalStatus === "Pós-Ocupação"
                              ? "bg-blue-100 text-secondary border border-blue-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            {beneficiary.habitationalStatus}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <input 
                            type="checkbox"
                            checked={beneficiary.present}
                            onChange={() => handleTogglePresence(beneficiary.id)}
                            className="h-5 w-5 rounded border-slate-350 text-secondary focus:ring-secondary/20 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* List Actions Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6 select-none">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-bold flex-wrap">
                  <p>Mostrando <span className="text-[#001e40] font-black">1-{filteredBeneficiaries.length}</span> de {beneficiaries.length} beneficiários</p>
                  
                  <div className="flex gap-1.5">
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 cursor-not-allowed">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#001e40] text-white font-black">1</button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-all cursor-pointer">2</button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={handleCancel}
                    className="flex-1 md:flex-none px-6 py-3.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-650 font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Cancelar Chamada
                  </button>
                  <button 
                    onClick={handleFinalize}
                    disabled={isSubmitting}
                    className="flex-1 md:flex-none px-8 py-3.5 bg-secondary hover:bg-secondary-container text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg hover:shadow-secondary/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <span>Finalizar Chamada</span>
                    )}
                  </button>
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
          href={`/${programId}/social`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Users className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Projetos</span>
        </a>
        <a 
          href={`/${programId}/relatorios`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <FileText className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cotas</span>
        </a>
      </nav>

    </div>
  );
}
