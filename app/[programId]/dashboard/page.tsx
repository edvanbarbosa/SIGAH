// =============================================================================
// app/[programId]/dashboard/page.tsx
// Painel Executivo de Governança (Passo 6.4 / Etapa 62).
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
  TrendingUp,
  Users,
  Coins,
  Building,
  AlertTriangle,
  Gavel,
  RefreshCw,
  MapPin,
  Bell,
  CheckCircle2,
  X,
  Loader2,
  Lock,
  ChevronRight,
  ArrowRight,
  TrendingDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Building2,
  ExternalLink
} from "lucide-react";

interface AlertItem {
  id: string;
  category: string;
  text: string;
  type: "error" | "warning" | "info";
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export default function ExecutiveDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados locais interativos
  const [filterPeriod, setFilterPeriod] = useState<"mensal" | "anual">("anual");
  const [mapMode, setMapMode] = useState<"ativos" | "risco">("ativos");
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Alertas Críticos
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: "alert-compliance",
      category: "Compliance",
      text: "Prazo de auditoria expira em 48 horas para o setor Norte.",
      type: "error",
      borderColor: "border-l-error",
      icon: Gavel,
      iconColor: "text-error"
    },
    {
      id: "alert-delay",
      category: "Atraso em Loteamento",
      text: "Desvio de 15% no cronograma físico da Obra Solar-B.",
      type: "warning",
      borderColor: "border-l-tertiary",
      icon: TrendingDown,
      iconColor: "text-tertiary"
    },
    {
      id: "alert-sync",
      category: "Sincronização de Dados",
      text: "Aguardando validação do Tesouro Estadual (D-1).",
      type: "info",
      borderColor: "border-l-secondary",
      icon: RefreshCw,
      iconColor: "text-secondary"
    }
  ]);

  // Donut Chart Percentages based on Annual vs Monthly
  const distributionData = filterPeriod === "anual" 
    ? { aquisicao: 62, melhoria: 24, regularizacao: 14 }
    : { aquisicao: 54, melhoria: 31, regularizacao: 15 };

  // KPI Metrics based on Period
  const kpis = filterPeriod === "anual"
    ? { units: "12.480", families: "45.210", investment: "R$ 2.45B", progress: 74 }
    : { units: "1.040", families: "3.760", investment: "R$ 204M", progress: 78 };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setToastMessage("Alerta arquivado com sucesso!");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen pb-24 md:pb-0 flex flex-col selection:bg-[#0059bb]/20">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-[1600px] mx-auto px-6 pt-24 pb-32 space-y-8">
            
            {/* Toast Notification */}
            {toastMessage && (
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Banner Executivo com Mix-Blend */}
            <section className="relative overflow-hidden rounded-2xl h-64 bg-primary-container flex items-center px-10 shadow-lg select-none">
              <div className="absolute inset-0 z-0">
                <img 
                  className="w-full h-full object-cover opacity-25 mix-blend-overlay" 
                  alt="Aéreo Loteamento"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQE9ijzCmfkujAK9sR0dncVdtSwXQqVQaa6r9ybd6Y9Pd_UNmIV36gu4Sz-6RWtaipu0J_8P2CmHBr7cNNQfq5JLRS6Fjk42WuPH6v11LOj3LewsSo-DKYJbRwRpv-e5xQP-niz2B7bhdLO88X2z98Hh5bXzzD5Z3FXqEIJkvp94G_WIg2Q74aNXhAMLGCmpr7QEcXLotH1-1yqFn10ph0EwJSEyPWbZnsvqLgIpPL6mQvb3JzGivIjjdHZGZt9eX4j27ytmB3_0c" 
                />
              </div>
              <div className="relative z-10 max-w-2xl space-y-2">
                <h2 className="font-headline text-4xl font-black text-white tracking-tight">
                  Visão Geral Institucional
                </h2>
                <p className="text-[#a7c8ff] font-semibold text-base sm:text-lg leading-relaxed">
                  Acompanhamento em tempo real das metas habitacionais e investimentos estratégicos do sistema SIGAH.
                </p>
              </div>
            </section>

            {/* Bento Grid KPIs */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
              
              {/* KPI 1: Unidades */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total de Unidades</span>
                  <div className="text-4xl font-black text-primary font-headline tracking-tight">{kpis.units}</div>
                </div>
                <div className="mt-6 flex items-center text-secondary font-black gap-1 text-xs">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>+12% vs. Ano Anterior</span>
                </div>
              </div>

              {/* KPI 2: Famílias */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Famílias Beneficiadas</span>
                  <div className="text-4xl font-black text-primary font-headline tracking-tight">{kpis.families}</div>
                </div>
                <div className="mt-6 flex items-center text-secondary font-black gap-1 text-xs">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Meta de 50k até Dez/2024</span>
                </div>
              </div>

              {/* KPI 3: Orçamento */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 flex flex-col justify-between hover:translate-y-[-2px] hover:shadow-md transition-all duration-300">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Investimento Global</span>
                  <div className="text-3xl font-black text-primary font-headline tracking-tight">{kpis.investment}</div>
                </div>
                <div className="mt-6 flex items-center text-[#723610] font-black gap-1 text-xs">
                  <Coins className="w-4 h-4 shrink-0" />
                  <span>88% do Orçamento Executado</span>
                </div>
              </div>

              {/* KPI 4: Obras (Colorido) */}
              <div className="bg-secondary p-6 rounded-2xl flex flex-col justify-between shadow-lg shadow-secondary/15 hover:translate-y-[-2px] transition-all duration-300 text-white">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d5e3ff]">Progresso de Obras</span>
                  <div className="text-4xl font-black font-headline tracking-tight">{kpis.progress}%</div>
                </div>
                <div className="mt-6 w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-white h-full transition-all duration-500" style={{ width: `${kpis.progress}%` }}></div>
                </div>
              </div>

            </section>

            {/* Asymmetric Layout: Distribuição e Alertas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Donut Chart (8 Colunas) */}
              <section className="lg:col-span-8 bg-[#f3f4f5] p-8 rounded-2xl border border-slate-200/40 flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 select-none">
                  <div>
                    <h3 className="font-headline text-2xl font-black text-primary">Distribuição de Benefícios</h3>
                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mt-1">
                      Análise por modalidade de atendimento habitacional
                    </p>
                  </div>
                  <div className="flex bg-white/60 p-1.5 rounded-xl border border-slate-250 select-none">
                    <button 
                      onClick={() => setFilterPeriod("mensal")}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer border-none transition-all ${
                        filterPeriod === "mensal" 
                          ? "bg-primary text-white shadow-sm" 
                          : "text-slate-500 hover:text-primary bg-transparent"
                      }`}
                    >
                      Mensal
                    </button>
                    <button 
                      onClick={() => setFilterPeriod("anual")}
                      className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer border-none transition-all ${
                        filterPeriod === "anual" 
                          ? "bg-primary text-white shadow-sm" 
                          : "text-slate-500 hover:text-primary bg-transparent"
                      }`}
                    >
                      Anual
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  
                  {/* SVG Donut Chart */}
                  <div className="relative aspect-square flex items-center justify-center max-w-[280px] mx-auto w-full select-none">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                      <circle cx="128" cy="128" fill="transparent" r="110" stroke="#edeeef" strokeWidth="24"></circle>
                      
                      {/* Aquisição Unidade */}
                      <circle 
                        cx="128" 
                        cy="128" 
                        fill="transparent" 
                        r="110" 
                        stroke="#003366" 
                        strokeWidth="24"
                        strokeDasharray="691"
                        strokeDashoffset={691 - (691 * distributionData.aquisicao) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      ></circle>
                      
                      {/* Melhoria Habitacional */}
                      <circle 
                        cx="128" 
                        cy="128" 
                        fill="transparent" 
                        r="110" 
                        stroke="#0059bb" 
                        strokeWidth="24"
                        strokeDasharray="691"
                        strokeDashoffset={691 - (691 * distributionData.melhoria) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out origin-center"
                        style={{ transform: `rotate(${(distributionData.aquisicao * 360) / 100}deg)` }}
                      ></circle>
                      
                      {/* Regularização Fundiária */}
                      <circle 
                        cx="128" 
                        cy="128" 
                        fill="transparent" 
                        r="110" 
                        stroke="#ffb690" 
                        strokeWidth="24"
                        strokeDasharray="691"
                        strokeDashoffset={691 - (691 * distributionData.regularizacao) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out origin-center"
                        style={{ transform: `rotate(${((distributionData.aquisicao + distributionData.melhoria) * 360) / 100}deg)` }}
                      ></circle>
                    </svg>

                    <div className="absolute text-center">
                      <span className="block text-3xl font-black text-primary leading-none">100%</span>
                      <span className="block text-[9px] text-slate-400 uppercase font-black tracking-widest mt-1">Compilado</span>
                    </div>
                  </div>

                  {/* Legenda detalhada */}
                  <div className="space-y-6 select-none">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#003366] shrink-0 shadow-sm"></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-baseline text-xs font-bold text-primary">
                          <span>Aquisição Unidade</span>
                          <span className="text-sm font-black">{distributionData.aquisicao}%</span>
                        </div>
                        <div className="w-full bg-[#e1e3e4] h-1.5 mt-2 rounded-full overflow-hidden">
                          <div className="bg-[#003366] h-full transition-all duration-500" style={{ width: `${distributionData.aquisicao}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-3.5 h-3.5 rounded-full bg-secondary shrink-0 shadow-sm"></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-baseline text-xs font-bold text-primary">
                          <span>Melhoria Habitacional</span>
                          <span className="text-sm font-black">{distributionData.melhoria}%</span>
                        </div>
                        <div className="w-full bg-[#e1e3e4] h-1.5 mt-2 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full transition-all duration-500" style={{ width: `${distributionData.melhoria}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-3.5 h-3.5 rounded-full bg-[#ffb690] shrink-0 shadow-sm"></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-baseline text-xs font-bold text-primary">
                          <span>Regularização Fundiária</span>
                          <span className="text-sm font-black">{distributionData.regularizacao}%</span>
                        </div>
                        <div className="w-full bg-[#e1e3e4] h-1.5 mt-2 rounded-full overflow-hidden">
                          <div className="bg-[#ffb690] h-full transition-all duration-500" style={{ width: `${distributionData.regularizacao}%` }}></div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              </section>

              {/* Alertas Críticos (4 Colunas) */}
              <section className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between min-h-[380px]">
                <div className="space-y-6">
                  
                  <div className="flex items-center gap-2.5 select-none">
                    <AlertTriangle className="text-error w-6 h-6 shrink-0" />
                    <h3 className="font-headline text-lg font-black text-primary">Alertas Críticos</h3>
                  </div>

                  <div className="space-y-4">
                    {alerts.map((al) => {
                      const IconComponent = al.icon;
                      
                      return (
                        <div 
                          key={al.id}
                          className={`p-4 bg-slate-50 rounded-xl border-l-4 ${al.borderColor} border-y border-r border-slate-100 flex gap-3 shadow-sm hover:translate-x-1 transition-all group relative`}
                        >
                          <div className={`shrink-0 mt-0.5 ${al.iconColor}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 select-none">{al.category}</p>
                            <p className="text-xs font-semibold text-primary mt-0.5 leading-relaxed">{al.text}</p>
                          </div>
                          
                          <button 
                            onClick={() => handleDismissAlert(al.id)}
                            className="absolute top-2 right-2 text-slate-350 hover:text-slate-500 transition-colors p-1 rounded-full hover:bg-slate-200/50 border-none cursor-pointer bg-transparent hidden group-hover:flex items-center justify-center"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}

                    {alerts.length === 0 && (
                      <div className="text-center py-10 space-y-2 select-none">
                        <span className="text-3xl">✨</span>
                        <p className="text-xs font-bold text-slate-400">Todos os alertas críticos resolvidos!</p>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setToastMessage("Carregando painel completo de auditoria e compliance...")}
                  className="mt-6 w-full py-4 rounded-xl font-black text-xs uppercase tracking-wider text-primary border border-slate-250 hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer bg-transparent"
                >
                  Ver Todos os Alertas
                </button>
              </section>

            </div>

            {/* Georreferenciamento de Ativos (Mapa) */}
            <section className="bg-white rounded-2xl border border-slate-200/60 p-6 md:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
                <div>
                  <h3 className="font-headline text-2xl font-black text-primary">Georreferenciamento de Ativos</h3>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-wider mt-1">
                    Localização estratégica de canteiros e núcleos habitacionais
                  </p>
                </div>
                
                <div className="flex bg-[#f3f4f5] rounded-full p-1.5 border border-slate-200">
                  <button 
                    onClick={() => {
                      setMapMode("ativos");
                      setToastMessage("Filtro alterado para canteiros ativos.");
                    }}
                    className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer border-none transition-all ${
                      mapMode === "ativos" 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-slate-500 hover:text-primary bg-transparent"
                    }`}
                  >
                    Ativos
                  </button>
                  <button 
                    onClick={() => {
                      setMapMode("risco");
                      setToastMessage("Filtro alterado para áreas de risco geológico.");
                    }}
                    className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-wider cursor-pointer border-none transition-all ${
                      mapMode === "risco" 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-slate-500 hover:text-primary bg-transparent"
                    }`}
                  >
                    Risco
                  </button>
                </div>
              </div>

              {/* Working Google Map Embed */}
              <div className="h-96 w-full rounded-2xl overflow-hidden relative shadow-inner border border-slate-200/40 select-none">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122822.4284643323!2d-48.0163351!3d-15.7751314!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3d18ec9af22b%3A0x88f504e908990117!2sBras%C3%ADlia%2C%20DF!5e0!3m2!1spt-BR!2sbr!4v1716578000000!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200/40 shadow-xl space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-secondary shrink-0"></span>
                    <span className="text-xs font-bold text-primary">Zonas de Expansão</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#001e40] shrink-0"></span>
                    <span className="text-xs font-bold text-primary">Canteiros Ativos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-tertiary shrink-0"></span>
                    <span className="text-xs font-bold text-primary">Áreas em Risco</span>
                  </div>
                </div>
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
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-45 bg-white/95 backdrop-blur-md border-t border-slate-200/50 rounded-t-xl select-none flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center justify-center text-secondary bg-secondary-fixed/30 rounded-full px-5 py-1.5 active:scale-90 duration-200 border-none cursor-pointer">
          <span className="text-xl">📊</span>
          <span className="text-[10px] font-bold tracking-wide">Painel</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">🛡</span>
          <span className="text-[10px] font-bold tracking-wide">Auditoria</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">📤</span>
          <span className="text-[10px] font-bold tracking-wide">Exportar</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity border-none bg-transparent cursor-pointer">
          <span className="text-xl">👤</span>
          <span className="text-[10px] font-bold tracking-wide">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
