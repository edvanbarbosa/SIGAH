// =============================================================================
// app/[programId]/unidades/acessivel/page.tsx
// Designação e Vinculação Acessível (Passo 25.1).
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
  Accessibility,
  CheckCircle2,
  AlertTriangle,
  Map,
  Lock,
  Search,
  Filter,
  Check,
  X,
  Building,
  Loader2,
  Home,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Maximize2
} from "lucide-react";

interface SuggestedUnit {
  id: string;
  name: string;
  residencial: string;
  floor: string;
  isPisoTerreo: boolean;
  features: string[];
  status: "disponivel" | "bloqueado";
}

export default function DesignacaoAcessivelPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados Interativos
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modais
  const [selectedUnit, setSelectedUnit] = useState<SuggestedUnit | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);

  // Lista de Unidades Sugeridas
  const [suggestedUnits, setSuggestedUnits] = useState<SuggestedUnit[]>([
    {
      id: "u-102",
      name: "Unidade 102 - Bloco A",
      residencial: "Residencial Aurora Borealis",
      floor: "PISO TÉRREO",
      isPisoTerreo: true,
      features: ["Acessibilidade Total", "Portas Largas", "Elevador Próximo"],
      status: "disponivel"
    },
    {
      id: "u-105",
      name: "Unidade 105 - Bloco B",
      residencial: "Residencial Aurora Borealis",
      floor: "PISO TÉRREO",
      isPisoTerreo: true,
      features: ["Acessibilidade Total", "Portas Largas"],
      status: "disponivel"
    }
  ]);

  // Designar Unidade
  const handleDesignateUnit = (unit: SuggestedUnit) => {
    setIsProcessing(true);
    setTimeout(() => {
      // Remove a unidade selecionada pois ela foi designada
      setSuggestedUnits(prev => prev.filter(u => u.id !== unit.id));
      setIsProcessing(false);
      setSelectedUnit(null);

      setToastMessage(`Unidade ${unit.name} vinculada com sucesso ao candidato Carlos Eduardo Silveira!`);
      setTimeout(() => setToastMessage(null), 4000);
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

            {/* Cabeçalho de Contexto */}
            <header className="flex flex-col lg:flex-row justify-between items-start gap-6 select-none">
              <div>
                <nav className="flex text-on-surface-variant text-xs gap-2 mb-4 uppercase tracking-widest font-bold">
                  <span>Módulo de Acessibilidade</span>
                  <ChevronRight className="w-3.5 h-3.5 text-on-surface-variant/40" />
                  <span className="text-secondary font-black">Unidades Acessíveis</span>
                </nav>
                <h2 className="text-3xl font-extrabold text-[#001e40] tracking-tight mb-2">
                  Designação de Unidade
                </h2>
                <p className="text-slate-500 text-xs font-semibold">
                  Candidato: <strong>Carlos Eduardo Silveira</strong> — Adaptação de Acessibilidade <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider border border-emerald-250 ml-1 inline-block">APROVADA</span>
                </p>
              </div>

              <div className="flex gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => {
                    setToastMessage("Abrindo filtros avançados de busca...");
                    setTimeout(() => setToastMessage(null), 2500);
                  }}
                  className="flex-grow lg:flex-none bg-slate-100 hover:bg-slate-200 px-6 py-3.5 rounded-xl font-sans text-xs font-black text-primary flex items-center justify-center gap-2 border-none cursor-pointer uppercase tracking-widest"
                >
                  <Filter className="w-4 h-4 text-primary shrink-0" />
                  Filtros
                </button>
                <button 
                  onClick={() => setShowMapModal(true)}
                  className="flex-grow lg:flex-none bg-primary-container text-white px-6 py-3.5 rounded-xl font-sans text-xs font-black flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-md border-none cursor-pointer uppercase tracking-widest"
                >
                  <Map className="w-4 h-4 text-white shrink-0" />
                  Ver Mapa
                </button>
              </div>
            </header>

            {/* Layout Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Coluna Esquerda: Perfil e Protocolo de Bloqueio (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Perfil de Necessidade */}
                <div className="bg-white p-6 rounded-2xl border border-outline-variant/15 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 select-none">
                    <Accessibility className="w-6 h-6 text-secondary shrink-0" />
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                      Perfil de Necessidade
                    </h3>
                  </div>

                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-slate-900 text-xs uppercase tracking-wide">Piso Térreo Mandatório</p>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Candidato com mobilidade reduzida severa.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-slate-900 text-xs uppercase tracking-wide">Portas Alargadas (90cm)</p>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Necessidade de giro para cadeira de rodas.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <p className="font-black text-slate-900 text-xs uppercase tracking-wide">Banheiro Adaptado</p>
                        <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Barras de apoio e bacia elevada solicitadas.</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Protocolo de Bloqueio (Laranja/Amarelo) */}
                <div className="bg-[#592300] p-6 rounded-2xl text-white relative overflow-hidden shadow-sm select-none">
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-200 shrink-0" />
                      <h3 className="font-black text-xs uppercase tracking-wider text-orange-100">
                        Protocolo de Bloqueio
                      </h3>
                    </div>
                    <p className="text-[11px] text-orange-200 leading-relaxed font-semibold">
                      O sistema restringiu a seleção a apenas unidades marcadas como <strong>"Acessível"</strong>. A designação de unidades convencionais para este perfil requer auditoria especial de nível 3.
                    </p>
                  </div>
                  <Lock className="absolute -bottom-4 -right-4 w-24 h-24 text-white opacity-5 select-none" />
                </div>

              </div>

              {/* Coluna Direita: Unidades Sugeridas e Mapa Visual (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Unidades Sugeridas pelo Sistema */}
                <div className="bg-slate-50 rounded-2xl p-1 overflow-hidden border border-slate-200 shadow-sm">
                  
                  <div className="bg-white p-6 rounded-t-xl flex justify-between items-center select-none border-b border-slate-100">
                    <h3 className="font-black text-sm text-[#001e40] flex items-center gap-2 uppercase tracking-wide">
                      <Check className="w-5 h-5 text-secondary shrink-0" />
                      Unidades Sugeridas pelo Sistema
                    </h3>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                      {suggestedUnits.length} Correspondências
                    </span>
                  </div>

                  <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead className="bg-slate-100 border-b border-slate-200/50 select-none">
                        <tr>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-450">Unidade / Bloco</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-450">Andar</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-450">Status Acessibilidade</th>
                          <th className="px-6 py-4 text-[9px] font-black uppercase tracking-wider text-slate-450">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {suggestedUnits.map(unit => (
                          <tr key={unit.id} className="bg-white hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-50 text-secondary rounded-xl flex items-center justify-center shrink-0 select-none">
                                  <Building className="w-5 h-5 text-secondary" />
                                </div>
                                <div>
                                  <p className="text-xs font-black text-[#001e40]">{unit.name}</p>
                                  <p className="text-[10px] text-slate-450 font-bold select-none">{unit.residencial}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6 select-none">
                              <span className="bg-slate-100 px-2.5 py-1 rounded-md text-[9px] font-black text-primary">
                                {unit.floor}
                              </span>
                            </td>
                            <td className="px-6 py-6 select-none">
                              <div className="flex gap-2">
                                {unit.features.map((feat, fIdx) => (
                                  <span 
                                    key={fIdx} 
                                    className="bg-blue-50/50 text-[#0059bb] border border-blue-200 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider"
                                    title={feat}
                                  >
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <button 
                                onClick={() => setSelectedUnit(unit)}
                                className="bg-primary hover:bg-[#003366] text-white px-4 py-2 rounded-xl text-[9px] font-black shadow-md border-none cursor-pointer uppercase tracking-wider transition-all"
                              >
                                Designar
                              </button>
                            </td>
                          </tr>
                        ))}

                        {/* Linha de Unidade Convencional (Bloqueada) */}
                        <tr className="bg-slate-50/40 opacity-60 select-none">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                                <Building className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-500">Unidade 402 - Bloco C</p>
                                <p className="text-[10px] text-slate-450 font-bold">Unidade Convencional</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <span className="bg-slate-100 px-2.5 py-1 rounded-md text-[9px] font-black text-slate-500">
                              4º ANDAR
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <span className="text-red-600 flex items-center gap-1 font-black text-[9px] uppercase tracking-wider">
                              <X className="w-3.5 h-3.5 text-red-500" />
                              INCOMPATÍVEL
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <button 
                              disabled 
                              className="bg-slate-300 text-white px-4 py-2 rounded-xl text-[9px] font-black border-none cursor-not-allowed uppercase tracking-wider"
                            >
                              Bloqueado
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Visual do Mapa com Pins */}
                <div className="relative rounded-3xl overflow-hidden h-64 shadow-md group">
                  <img 
                    alt="Loteamento SIGAH" 
                    className="w-full h-full object-cover grayscale opacity-55 group-hover:grayscale-0 transition-all duration-700 select-none" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7wetEWnYs7E6Tferqg2vSbSguaG-3GSwLHj5w1D_rzZ2LleRKJYLLb9J0eVVMaMRnvWuSfarf_1Zed-hWIwFvNmEWcly8bSC8ysHTaGqYYPAjNHD7GzwXbOmykDiayS0npUVe9vxu_26mfxvcKrnqD6tAWp81gtFyHuaW2gIMA7GZCHd2Z8BzEnKAbvYqC2lNPeiQtaGuSqXiBQtv-g_QfvffuRsmCHJ1dEEK_sH2YvUAxZnl9PVws9fcu3ER0LCZQzBVgR7fiaY" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 to-transparent flex flex-col justify-end p-8">
                    <div className="flex items-end justify-between select-none">
                      <div>
                        <h4 className="text-white font-black text-base">Visualização do Loteamento</h4>
                        <p className="text-white/80 text-[10px] font-semibold mt-1">Pins azuis indicam unidades adaptadas no térreo.</p>
                      </div>
                      <button 
                        onClick={() => setShowMapModal(true)}
                        className="bg-secondary-container text-white px-5 py-3 rounded-full font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-1.5 border-none cursor-pointer text-[10px] uppercase tracking-widest"
                      >
                        <Compass className="w-4 h-4 text-white shrink-0 animate-spin-slow" />
                        Explorar Mapa
                      </button>
                    </div>
                  </div>

                  {/* Pins Simulado (Acessível vs Bloqueado) */}
                  <div className="absolute top-1/2 left-1/3 w-7 h-7 bg-secondary rounded-full border-4 border-white shadow-xl flex items-center justify-center select-none animate-pulse">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="absolute top-1/3 right-1/4 w-7 h-7 bg-red-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center select-none">
                    <X className="w-3.5 h-3.5 text-white" />
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
          href={`/${programId}/unidades`}
          className="flex flex-col items-center justify-center text-secondary font-bold active:scale-90 transition-transform duration-150 scale-110"
        >
          <Building className="w-5 h-5 text-secondary animate-pulse" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Unidades</span>
        </a>
        <a 
          href={`/${programId}/cadastro`}
          className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant/70 active:scale-90 transition-transform duration-150"
        >
          <Users className="w-5 h-5" />
          <span className="font-sans text-[10px] font-semibold uppercase tracking-wider mt-0.5">Famílias</span>
        </a>
      </nav>

      {/* ==========================================
          MODAL: CONFIRMAR DESIGNAÇÃO
          ========================================== */}
      {selectedUnit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedUnit(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Confirmar Vinculação</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setSelectedUnit(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 select-none">
                <span className="text-[8px] font-black text-secondary bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit block">
                  Candidato Destinatário
                </span>
                <p className="text-xs font-black text-[#001e40]">Carlos Eduardo Silveira</p>
                <p className="text-[10px] text-slate-500 font-semibold">Portador de Necessidades Especiais (Mobilidade Reduzida)</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 select-none">
                <span className="text-[8px] font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider w-fit block">
                  Imóvel de Destino
                </span>
                <p className="text-xs font-black text-[#001e40]">{selectedUnit.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{selectedUnit.residencial} • {selectedUnit.floor}</p>
              </div>

              <div className="flex gap-4 pt-4 select-none">
                <button 
                  type="button" 
                  className="flex-1 py-3 text-slate-500 font-black text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer bg-transparent" 
                  onClick={() => setSelectedUnit(null)}
                >
                  CANCELAR
                </button>
                <button 
                  onClick={() => handleDesignateUnit(selectedUnit)}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-[#001e40] text-white font-black text-xs rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer border-none"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>DESIGNAR AGORA</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL: MAPA INTERATIVO AMPLIADO
          ========================================== */}
      {showMapModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/70 backdrop-blur-sm transition-opacity" onClick={() => setShowMapModal(false)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center select-none">
              <h3 className="font-heading text-lg font-black text-[#001e40]">Mapa de Implantação Acessível</h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowMapModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative p-6 select-none bg-slate-100 flex justify-center items-center">
              <div className="relative w-full max-w-2xl h-96 rounded-2xl overflow-hidden shadow-md">
                <img 
                  alt="Mapa Completo" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7wetEWnYs7E6Tferqg2vSbSguaG-3GSwLHj5w1D_rzZ2LleRKJYLLb9J0eVVMaMRnvWuSfarf_1Zed-hWIwFvNmEWcly8bSC8ysHTaGqYYPAjNHD7GzwXbOmykDiayS0npUVe9vxu_26mfxvcKrnqD6tAWp81gtFyHuaW2gIMA7GZCHd2Z8BzEnKAbvYqC2lNPeiQtaGuSqXiBQtv-g_QfvffuRsmCHJ1dEEK_sH2YvUAxZnl9PVws9fcu3ER0LCZQzBVgR7fiaY"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                {/* Pins expandidos */}
                <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-secondary rounded-full border-4 border-white shadow-xl flex items-center justify-center cursor-pointer hover:scale-115 transition-transform" title="Unidade 102 (Acessível)">
                  <span className="text-[10px] text-white font-black">102</span>
                </div>
                <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center" title="Unidade 402 (Incompatível)">
                  <span className="text-[10px] text-white font-black">402</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-center select-none">
              <button 
                onClick={() => setShowMapModal(false)}
                className="py-3 px-8 bg-[#001e40] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
              >
                FECHAR MAPA
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
