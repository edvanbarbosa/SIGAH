// =============================================================================
// app/[programId]/enquadramento/duplicidade/page.tsx
// Validação de Renda - Beneficiário Anterior Detectado (Refinado) (Passo 22.4).
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
  AlertTriangle,
  AlertCircle,
  Database,
  FileText,
  Eye,
  Scale,
  X,
  CheckCircle2,
  Loader2,
  Ban,
  Calendar,
  MailWarning
} from "lucide-react";

export default function BeneficiarioAnteriorPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados dos Controles
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessingDetail, setIsProcessingDetail] = useState(false);
  const [isRegisteringAppeal, setIsRegisteringAppeal] = useState(false);

  // Ações
  const handleViewDetail = () => {
    setIsProcessingDetail(true);
    setToastMessage("Consultando chaves de concessão CADMUT históricas...");
    setTimeout(() => {
      setIsProcessingDetail(false);
      setToastMessage("Registro CADMUT consolidado em tela.");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1200);
  };

  const handleRegisterAppeal = () => {
    setIsRegisteringAppeal(true);
    setToastMessage("Iniciando fluxo de recurso administrativo para duplicidade...");
    setTimeout(() => {
      setIsRegisteringAppeal(false);
      setToastMessage("Recurso para duplicidade registrado com sucesso!");
      setTimeout(() => setToastMessage(null), 3500);
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

            {/* Breadcrumb & Main Title */}
            <div className="space-y-1 select-none">
              <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Gestão</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span>Candidatos</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span className="text-secondary font-black">Família Silva</span>
              </nav>
              <h2 className="text-3xl font-extrabold text-primary tracking-tight mt-2">
                Situação do Candidato: Desclassificado
              </h2>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: Detalhes do Caso */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Family Identity Card */}
                <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 border-l-4 border-l-[#003366] shadow-sm space-y-6">
                  <div className="flex justify-between items-start flex-wrap gap-4 select-none">
                    <div>
                      <h3 className="font-headline text-xl font-black text-primary mb-2">Família Silva</h3>
                      <p className="text-slate-400 text-[10px] font-black uppercase mt-1 tracking-wider">
                        Protocolo: #SIGAH-2024-1102-FT
                      </p>
                    </div>
                    <span className="bg-slate-100 px-3 py-1.5 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest border border-slate-250/20">
                      Lote 01 - Geral
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100 font-sans text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">Responsável</p>
                      <p className="font-black text-primary">José Ricardo Silva</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">CPF</p>
                      <p className="font-black text-primary">***.921.448-**</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">Data Inscrição</p>
                      <p className="font-black text-primary">15/02/2024</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 select-none">Pontuação Anterior</p>
                      <p className="font-black text-primary">92 pts</p>
                    </div>
                  </div>
                </section>

                {/* Disqualification Alert Card */}
                <section className="bg-error-container/10 border-2 border-error rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-error p-5 flex items-center gap-3 text-on-error select-none">
                    <AlertCircle className="w-5 h-5 text-on-error shrink-0" />
                    <h4 className="font-headline text-on-error font-black text-xs uppercase tracking-widest">
                      Desclassificação Definitiva
                    </h4>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    <p className="font-headline text-xl font-black text-error">
                      DESCLASSIFICADO: Beneficiário Anterior Detectado
                    </p>
                    <p className="text-on-surface-variant text-xs font-semibold leading-relaxed">
                      Identificamos que o titular ou um dos membros do grupo familiar já foi beneficiário de programas habitacionais do Governo Federal (ex: Minha Casa Minha Vida). De acordo com as normas vigentes, a duplicidade impede a continuidade no sistema SIGAH.
                    </p>
                  </div>
                </section>

                {/* Evidence Section */}
                <section className="bg-slate-100 p-6 rounded-2xl border border-slate-200/50 space-y-4">
                  <div className="flex items-center gap-2 select-none">
                    <Database className="w-5 h-5 text-secondary shrink-0" />
                    <h3 className="text-[10px] font-black text-secondary uppercase tracking-widest">
                      Evidência
                    </h3>
                  </div>
                  
                  <div className="bg-white p-5 rounded-xl border border-slate-200/50 flex items-start gap-4">
                    <FileText className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <p className="font-black text-primary">Cadastro Nacional de Mutuários (CADMUT)</p>
                      <p className="text-slate-400 font-semibold leading-relaxed mt-1">
                        Registro encontrado na base histórica de concessões habitacionais vinculadas ao CPF do titular.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2 select-none">
                  <button
                    onClick={handleViewDetail}
                    disabled={isProcessingDetail}
                    className="flex-1 bg-primary text-white py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all border-none cursor-pointer"
                  >
                    {isProcessingDetail ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                    ) : (
                      <>
                        <Eye className="w-4.5 h-4.5 text-white shrink-0" />
                        <span>Ver Detalhes do Registro</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleRegisterAppeal}
                    disabled={isRegisteringAppeal}
                    className="flex-1 border-2 border-slate-200 text-slate-550 hover:bg-slate-50 py-4 px-6 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all bg-transparent cursor-pointer font-sans"
                  >
                    {isRegisteringAppeal ? (
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-550" />
                    ) : (
                      <>
                        <Scale className="w-4.5 h-4.5 text-slate-550 shrink-0" />
                        <span>Registrar Recurso</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

              {/* Coluna Direita: Contextual Sidebar */}
              <div className="lg:col-span-4 space-y-6 select-none">
                
                {/* Sidebar Card: Próximos Passos */}
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <h3 className="font-headline text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Próximos Passos
                  </h3>
                  
                  <ul className="space-y-5">
                    <li className="flex gap-3">
                      <MailWarning className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-black text-primary">Notificação Oficial</p>
                        <p className="text-slate-400 font-semibold mt-0.5">Enviado para o e-mail e app do candidato.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-black text-primary">Prazo de Recurso</p>
                        <p className="text-slate-400 font-semibold mt-0.5">Encerra-se em 48 horas úteis.</p>
                      </div>
                    </li>
                  </ul>
                </section>

              </div>

            </div>

          </main>

          {/* 4. Footer Reutilizável */}
          <Footer />

        </div>

      </div>

    </div>
  );
}
