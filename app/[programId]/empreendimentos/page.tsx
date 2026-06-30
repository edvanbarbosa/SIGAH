// =============================================================================
// app/[programId]/empreendimentos/page.tsx
// Gestão de Empreendimentos - Padronizada (Passo 6.5).
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
  Plus,
  Home,
  FileText,
  MapPin,
  CheckCircle,
  Building,
  TrendingUp,
  Activity,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Sliders,
  Sparkles,
  ExternalLink
} from "lucide-react";

interface DevProject {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  approvedUnits: number;
  stage: "urban" | "infra" | "registry" | "finalized";
  stageLabel: string;
  progressPercent: number;
  statusText: string;
  statusBg: string;
  imageUrl: string;
}

export default function EmpreendimentosPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados locais
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lista de Empreendimentos
  const [projects] = useState<DevProject[]>([
    {
      id: "portal-alvorada",
      name: "Residencial Portal da Alvorada",
      location: "Setor Norte - Quadra 12",
      totalUnits: 240,
      approvedUnits: 156,
      stage: "urban",
      stageLabel: "Análise Urbanística",
      progressPercent: 65,
      statusText: "Atenção Necessária",
      statusBg: "bg-amber-50 text-amber-800 border-amber-200",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCbX1GiwAwHWM4mu35eEBLUnzhj_QCaoNxK1Ngt09XpK5d42IFnKQt4rqhDV4Jk1bQQPK9bKhWmkSdklsQcRT-mRx3PQfSGPXn6swNGrgVPng7Imo4PVct15IDM69eG4z2nmeQC1tH04S56969997nsvpW_RjAmyOGnX34p05ePbc2_YzROngf3yUInXDti3jy4Q7GxzxCcK39OcmV-oodjouAsOtROJyAQUlNGoeXba5GXWBTmsiCH09IvbfLOj8ssjiaKoCWpenI"
    },
    {
      id: "brisas-serra",
      name: "Condomínio Brisas da Serra",
      location: "Área de Expansão Sul - Lote 4B",
      totalUnits: 180,
      approvedUnits: 180,
      stage: "finalized",
      stageLabel: "Aprovado Final",
      progressPercent: 100,
      statusText: "Pronto",
      statusBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      imageUrl: "https://lh3.googleusercontent.com/aida/AP1WRLtbWT3_4u1rzLoQTUItWjV1AhrWu2g1kFPqeevViREZYxdafG6WmZtoYvrr77CKUNwFTTdOTSf-P7bT1ZvvhkVJuOAUQzOArh-U8JM8wkA3o6rnRBSAVDQp-LEOyvrU6yk8o3wIXYy-gvGaXUE2djLNmPPUT5GTLY_KgzqADfu7eJ2QK0y9SfcWS-eZ0Lu0xmM8Bno7IJTR15XuWT-cFINWnDQh3ag0ognURKCUIibkVT_TMXZPVCDhVW0"
    },
    {
      id: "vila-verde",
      name: "Residencial Vila Verde",
      location: "Bairro Novo Horizonte - Quadra C",
      totalUnits: 320,
      approvedUnits: 0,
      stage: "infra",
      stageLabel: "Infraestrutura Básica",
      progressPercent: 12,
      statusText: "Em Elaboração",
      statusBg: "bg-slate-50 text-slate-550 border-slate-200",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_ENcyksHD_Vy8t6eMmGJK02RyWaVATJcitm19I3xI8hvV574cF8Oyt80QuydSO84nT8t1QON26qHv0bxsxpSFmSL55nWBZ746beJowRrlTp5l0RRyCaT0VVhSaytu-Nr_zpqzfFlqvDO0x6tZ0xeHPUFnA5J1RNK08TRH3IyMeeTk7zzAHacCfABLERiQ_bpdxDVp6BZxCiQBMcYLnjkedxRwJnJzmfNyCS6pol2KxR8_76AnoL6UcHEfGqLhSDO9H2rSXUt1Ts4"
    }
  ]);

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

            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                  <span>Planejamento</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                  <span className="text-secondary font-black">Empreendimentos</span>
                </nav>
                <h1 className="text-3xl font-black text-primary tracking-tight mt-2 select-none">
                  Gestão de {config.labels.empreendimento}s
                </h1>
                <p className="text-slate-500 text-xs mt-1 font-semibold select-none leading-relaxed">
                  Acompanhamento técnico, regularidade de glebas e controle de conformidade urbanística de empreendimentos habitacionais.
                </p>
              </div>

              <button 
                onClick={() => {
                  setToastMessage("Abrindo formulário de cadastro de novo empreendimento...");
                  setTimeout(() => setToastMessage(null), 3000);
                }}
                className="bg-secondary hover:brightness-110 text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 border-none cursor-pointer select-none"
              >
                <Plus className="w-4 h-4 text-white" />
                Novo {config.labels.empreendimento}
              </button>
            </div>

            {/* Bento Grid Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total de Glebas</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-primary">03</span>
                  <span className="text-xs text-slate-400 font-bold">Residenciais</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Unidades Habitacionais</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-primary">740</span>
                  <span className="text-xs text-emerald-600 font-black">336 Aprovadas</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Prazos de Certidões</span>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-700">01</span>
                  <span className="text-xs text-amber-700 font-black">Atenção Crítica</span>
                </div>
              </div>
            </section>

            {/* Lista de Empreendimentos */}
            <section className="space-y-6">
              <h2 className="text-lg font-black text-[#001e40] uppercase tracking-wide select-none">Glebas em Processo</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(proj => (
                  <div 
                    key={proj.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image / Banner */}
                      <div className="h-44 relative overflow-hidden bg-slate-100 select-none">
                        <img 
                          alt={proj.name} 
                          className="w-full h-full object-cover" 
                          src={proj.imageUrl} 
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`px-2.5 py-1 text-[8px] font-black uppercase rounded-lg tracking-wider border bg-white/95 backdrop-blur ${proj.statusBg}`}>
                            {proj.statusText}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-heading font-black text-primary text-base leading-tight">
                            {proj.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {proj.location}
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2 select-none">
                          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-500">
                            <span>{proj.stageLabel}</span>
                            <span>{proj.progressPercent}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-secondary" style={{ width: `${proj.progressPercent}%` }}></div>
                          </div>
                        </div>

                        {/* Units count */}
                        <div className="pt-2 grid grid-cols-2 gap-4 border-t border-slate-100/80 text-xs font-bold text-slate-650">
                          <div>
                            <span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Unidades Planejadas</span>
                            <span className="text-sm font-black text-primary">{proj.totalUnits}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 block font-black uppercase tracking-wider">Unidades Aprovadas</span>
                            <span className="text-sm font-black text-emerald-600">{proj.approvedUnits}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions button */}
                    <div className="p-6 pt-0 select-none flex gap-3">
                      <button 
                        onClick={() => router.push(`/${programId}/empreendimentos/validacao`)}
                        className="flex-1 bg-white hover:bg-slate-50 text-primary py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1 border border-slate-250 cursor-pointer shadow-sm active:scale-[0.98]"
                      >
                        <span>Validar</span>
                      </button>
                      <button 
                        onClick={() => router.push(`/${programId}/empreendimentos/parametrizacao`)}
                        className="flex-1 bg-[#001e40] hover:bg-[#003366] text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border-none cursor-pointer shadow-sm active:scale-[0.98]"
                      >
                        <span>Parametrizar</span>
                        <Sliders className="w-3.5 h-3.5 text-white shrink-0" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

    </div>
  );
}
