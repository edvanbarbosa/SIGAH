// =============================================================================
// app/[programId]/enquadramento/georreferenciamento/page.tsx
// Validação de Renda com Georreferenciamento (Passo 22.5).
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
  MapPin,
  AlertTriangle,
  CheckCircle,
  FileText,
  RefreshCw,
  Verified,
  Coins,
  ShieldCheck,
  Eye,
  Edit2,
  Calendar,
  Layers,
  Heart,
  Users,
  CheckCircle2,
  Loader2,
  Map,
  X
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

export default function ValidaRendaGeoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLocationDetail, setShowLocationDetail] = useState(false);

  // Lista de Rendas (Família Oliveira)
  const [members, setMembers] = useState<MemberIncome[]>([
    {
      id: "m-maria",
      name: "Maria Oliveira Silva",
      initials: "MS",
      cpf: "055.***.***-89",
      cnisIncome: 1412.00,
      declaredIncome: 1412.00,
      status: "convergente"
    },
    {
      id: "m-ricardo",
      name: "Ricardo Oliveira Silva",
      initials: "RS",
      cpf: "122.***.***-77",
      cnisIncome: 600.00,
      declaredIncome: 600.00,
      status: "convergente"
    }
  ]);

  // Calcula Renda Total Familiar
  const totalFamilyIncome = members.reduce((sum, m) => sum + m.cnisIncome, 0);

  // Ações
  const handleVerifyBases = () => {
    setIsProcessing(true);
    setToastMessage("Sincronizando com as bases georreferenciadas do SIGAH...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Pontos de geolocalização e área de risco revalidados!");
      setTimeout(() => setToastMessage(null), 3500);
    }, 1500);
  };

  const handleValidate = () => {
    setIsProcessing(true);
    setToastMessage("Validando renda e georreferenciamento da Família Oliveira...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Cadastro de enquadramento homologado com sucesso!");
      setTimeout(() => {
        setToastMessage(null);
        router.push(`/${programId}/enquadramento`);
      }, 1500);
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
              <div className="fixed top-24 right-4 bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-[100] select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Executive Header */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 select-none">
                  <span className="text-secondary text-[10px] font-black uppercase tracking-wider">Protocolo #SH-2024-0994</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-250 rounded-full text-[9px] font-black uppercase tracking-wider">
                    Em Análise Final
                  </span>
                </div>
                <h1 className="font-headline text-3xl font-black text-primary leading-tight">Família Oliveira</h1>
                <p className="text-slate-400 text-xs font-semibold mt-1 select-none">
                  Inscrição realizada em 24/02/2024 • Responsável: Maria Oliveira Silva
                </p>
              </div>

              <div className="flex flex-wrap gap-3 select-none">
                <button
                  onClick={handleVerifyBases}
                  disabled={isProcessing}
                  className="px-5 py-3 border-2 border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-primary font-sans font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all flex items-center gap-2 bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  Sincronizar Bases
                </button>
                <button
                  onClick={handleValidate}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-secondary text-white font-black text-[10px] uppercase tracking-wider rounded-xl shadow-lg shadow-secondary/15 hover:brightness-110 cursor-pointer active:scale-95 transition-all flex items-center gap-2 border-none"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Verified className="w-4.5 h-4.5 text-white shrink-0" />
                      <span>Validar Dossiê</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Alerts & Priority Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Divergence Card */}
              <div className="lg:col-span-1 bg-white border-l-4 border-l-emerald-600 rounded-2xl shadow-sm p-6 relative overflow-hidden flex flex-col justify-between select-none">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-headline font-black text-sm text-emerald-800 uppercase tracking-wide">Renda Validada</h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      Maria & Ricardo: Rendas individuais batem com os registros ativos do CNIS.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200/50 mt-4">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Cadastro Homologado</span>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="lg:col-span-2 bg-[#001e40] text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden select-none">
                <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
                  <Coins className="w-40 h-40 text-white shrink-0" />
                </div>
                <div className="z-10 space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-350">Renda Total Familiar</p>
                  <h3 className="text-4xl font-extrabold tracking-tight">R$ {totalFamilyIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Cálculo Autodeclarado e Validado</span>
                  </div>
                </div>
                <div className="h-px md:h-12 w-full md:w-px bg-white/10"></div>
                <div className="z-10 text-center md:text-right space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-350 font-sans">Enquadramento Automático</p>
                  <div className="bg-secondary px-4 py-2 rounded-xl inline-block shadow border-none">
                    <span className="text-xs font-black uppercase tracking-wider text-white">Faixa 1 - Urbano</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bento Priorities & Exemption */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Criteria */}
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 select-none">
                  <Heart className="text-secondary w-5 h-5 shrink-0" />
                  <h3 className="font-headline font-black text-sm text-[#001e40] uppercase tracking-wide">
                    Critérios de Prioridade
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2.5 select-none">
                  <span className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-[#0059bb] text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5">
                    Mulher Responsável
                  </span>
                  <span className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-[#0059bb] text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5">
                    Bolsa Família
                  </span>
                  <span className="px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 animate-pulse">
                    Georreferenciado: Área de Risco
                  </span>
                </div>

                <div className="p-4 bg-blue-50/40 border-l-4 border-l-secondary rounded-r-xl select-none">
                  <p className="text-[11px] text-secondary font-semibold leading-relaxed">
                    "Atende a 3/6 critérios definidos na Portaria MC nº 2.450/2022. O georreferenciamento aponta localização no polígono crítico de enchentes."
                  </p>
                </div>
              </div>

              {/* Exemption card */}
              <div className="bg-[#e7f0ff]/50 rounded-2xl p-6 md:p-8 border border-[#0059bb]/20 flex flex-col justify-between gap-6">
                <div className="select-none">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-secondary w-5 h-5 shrink-0" />
                      <h3 className="font-headline font-black text-sm text-[#001a40] uppercase tracking-wide">Isenção Validada</h3>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider">
                      Custo Zero
                    </span>
                  </div>
                  <h4 className="text-3xl font-black text-[#001a40] tracking-tight">Contrato Isento</h4>
                  <p className="text-slate-500 text-[11px] font-semibold leading-relaxed mt-2">
                    Dispensa financeira por enquadramento em benefícios continuados e condições especiais.
                  </p>
                </div>

                <div className="space-y-2 select-none">
                  <p className="text-[9px] font-black text-[#001a40]/60 uppercase tracking-widest">Motivos da Isenção</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] bg-white border border-slate-200 text-[#001a40] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider">Bolsa Família</span>
                    <span className="text-[10px] bg-white border border-slate-200 text-[#001a40] px-2.5 py-1.5 rounded-lg font-black uppercase tracking-wider">Microcefalia</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Asymmetric layout: Tables & Map (Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Tabela de Rendas (Esquerda - 7 cols) */}
              <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center select-none">
                  <h3 className="font-headline font-black text-[#001e40] text-sm uppercase tracking-wide">
                    Rendas Individuais Detalhadas
                  </h3>
                  <button className="text-secondary text-[10px] font-black uppercase tracking-wider hover:underline border-none bg-transparent cursor-pointer">
                    Exportar Relatório
                  </button>
                </div>

                <div className="overflow-x-auto select-none">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 font-sans text-[10px] font-black uppercase tracking-wider">
                        <th className="px-6 py-4">Membro do Grupo</th>
                        <th className="px-6 py-4">CPF</th>
                        <th className="px-6 py-4">Renda (CNIS)</th>
                        <th className="px-6 py-4">Renda (Declarada)</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-primary">
                      {members.map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary-container/10 text-secondary flex items-center justify-center font-black text-xs">
                              {m.initials}
                            </div>
                            <span className="font-black">{m.name}</span>
                          </td>
                          <td className="px-6 py-4 font-sans text-slate-500">{m.cpf}</td>
                          <td className="px-6 py-4 font-black">R$ {m.cnisIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 font-black">R$ {m.declaredIncome.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-1 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              Convergente
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Mapa de Georreferenciamento (Direita - 5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2 select-none">
                    <Map className="w-5 h-5 text-secondary shrink-0" />
                    <h3 className="font-headline font-black text-[#001e40] text-sm uppercase tracking-wide">
                      Georreferenciamento da Família
                    </h3>
                  </div>

                  {/* Satellite Map Mockup Container */}
                  <div 
                    onClick={() => setShowLocationDetail(true)}
                    className="h-64 bg-slate-200 relative overflow-hidden group cursor-pointer border-b border-slate-100"
                  >
                    <img 
                      alt="Mapa da Gleba" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbX1GiwAwHWM4mu35eEBLUnzhj_QCaoNxK1Ngt09XpK5d42IFnKQt4rqhDV4Jk1bQQPK9bKhWmkSdklsQcRT-mRx3PQfSGPXn6swNGrgVPng7Imo4PVct15IDM69eG4z2nmeQC1tH04S56969997nsvpW_RjAmyOGnX34p05ePbc2_YzROngf3yUInXDti3jy4Q7GxzxCcK39OcmV-oodjouAsOtROJyAQUlNGoeXba5GXWBTmsiCH09IvbfLOj8ssjiaKoCWpenI" 
                    />
                    
                    {/* Shaded risk polygon (Simulado) */}
                    <div className="absolute top-[35%] left-[40%] w-24 h-20 bg-amber-500/25 border-2 border-dashed border-amber-600 rounded-xl pointer-events-none select-none flex items-center justify-center">
                      <span className="text-[8px] font-black text-amber-950 uppercase tracking-widest text-center">Zona de Inundação</span>
                    </div>

                    {/* Flashing Red Dot of the Family's Home */}
                    <div className="absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 pointer-events-none">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-650 shadow"></span>
                    </div>

                    {/* Location Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 bg-[#001e40]/90 backdrop-blur-sm px-4 py-3 rounded-xl flex items-center justify-between text-white select-none">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-300">Coordenadas Domiciliares</p>
                        <p className="text-xs font-black text-white mt-0.5">Lat: -23.5505, Long: -46.6333</p>
                      </div>
                      <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider">
                        Grau IV - Crítico
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 text-xs font-semibold text-primary">
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-400 font-bold select-none">Setor Censitário IBGE</span>
                      <span className="font-black text-right">#3550308 (Crítico)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                      <span className="text-slate-400 font-bold select-none">Bairro / Zona</span>
                      <span className="font-black text-right">Setor Norte - Quadra 12</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5">
                      <span className="text-slate-400 font-bold select-none">Laudo Defesa Civil</span>
                      <span className="font-black text-right text-[#0059bb] hover:underline cursor-pointer select-none">VISUALIZAR LAUDO</span>
                    </div>
                  </div>
                </section>

              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

      {/* ==========================================
          MODAL: DETALHES DE LOCALIZAÇÃO DO EIXO
          ========================================== */}
      {showLocationDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#001e40]/70 backdrop-blur-sm transition-opacity" onClick={() => setShowLocationDetail(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 select-none">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-heading text-sm font-black text-[#001e40] uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" />
                <span>Georreferenciamento - Família Oliveira</span>
              </h3>
              <button 
                className="text-slate-400 hover:bg-slate-100 p-2 rounded-full border-none bg-transparent cursor-pointer" 
                onClick={() => setShowLocationDetail(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-black block uppercase tracking-wider text-amber-800">Confrontação da Área de Risco</span>
                  <p className="text-slate-500 font-semibold mt-0.5">O endereço fornecido está situado dentro da poligonal de área de preservação permanente (APP) e encosta de risco Grau IV.</p>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 font-mono text-[10px] text-slate-600 space-y-1.5 leading-relaxed">
                <span className="text-secondary font-black block mb-1">METADADOS DE GEOLOCALIZAÇÃO // SIGAH</span>
                ----------------------------------------<br />
                - ESTADO: SERGIPE (SE)<br />
                - MUNICÍPIO: ARACAJU<br />
                - LOGRADOURO: RUA DAS COQUEIRAS, S/N • INDUSTRIAL<br />
                - HASH COORDENADAS: APP_ZONA_CRITICA_#08992<br />
                - SISTEMA DE PROJEÇÃO: SIRGAS 2000
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowLocationDetail(false)}
                  className="w-full py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all border-none cursor-pointer"
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
