// =============================================================================
// app/[programId]/vistorias/checklist-nbr/page.tsx
// Checklist de Conformidade Técnica - Padronizado (Passo 13.1).
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
  ClipboardCheck,
  Accessibility,
  Activity,
  Wifi,
  Save,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  Loader2,
  FileText
} from "lucide-react";

interface NbrItem {
  id: string;
  category: "acessibilidade" | "desempenho" | "sustentabilidade";
  code: string;
  title: string;
  desc: string;
  status: "conforme" | "defeito" | null;
  observation: string;
}

export default function ChecklistConformidadeTecnicaPadronizadoPage() {
  const params = useParams();
  const router = useRouter();
  const config = useProgram();
  const programId = params.programId as string;

  // Estados
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Itens do Checklist NBR
  const [items, setItems] = useState<NbrItem[]>([
    {
      id: "nbr-1.1",
      category: "acessibilidade",
      code: "Item 1.1",
      title: "Rampas de Acesso",
      desc: "Rampas de acesso: inclinação máxima de 8,33% conforme NBR 9050.",
      status: "conforme",
      observation: ""
    },
    {
      id: "nbr-1.2",
      category: "acessibilidade",
      code: "Item 1.2",
      title: "Sinalização Tátil",
      desc: "Sinalização tátil de alerta e direcional nos percursos principais.",
      status: "conforme",
      observation: ""
    },
    {
      id: "nbr-2.1",
      category: "desempenho",
      code: "Item 2.1",
      title: "Desempenho Térmico",
      desc: "Desempenho térmico: Avaliação das vedações externas e coberturas.",
      status: "defeito",
      observation: "Isolamento inadequado na cobertura da torre B."
    },
    {
      id: "nbr-2.2",
      category: "desempenho",
      code: "Item 2.2",
      title: "Vida Útil de Projeto (VUP)",
      desc: "Vida Útil de Projeto (VUP): Conformidade com prazos mínimos de sistema.",
      status: "defeito",
      observation: "Impermeabilização do subsolo abaixo do limite normativo."
    },
    {
      id: "nbr-3.1",
      category: "sustentabilidade",
      code: "Item 3.1",
      title: "Infraestrutura Tecnológica",
      desc: "Infraestrutura para fibra óptica e dispositivos IoT de medição.",
      status: "conforme",
      observation: ""
    },
    {
      id: "nbr-3.2",
      category: "sustentabilidade",
      code: "Item 3.2",
      title: "Eficiência Hídrica e Energética",
      desc: "Reuso de águas cinzas e previsão de painéis fotovoltaicos.",
      status: "conforme",
      observation: ""
    }
  ]);

  // Alterar status
  const handleStatusChange = (id: string, newStatus: "conforme" | "defeito") => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          // Limpa observação se mudar para conforme
          observation: newStatus === "conforme" ? "" : item.observation
        };
      }
      return item;
    }));
  };

  // Alterar observação
  const handleObservationChange = (id: string, text: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          observation: text
        };
      }
      return item;
    }));
  };

  // Finalizar validação
  const handleFinalizeValidation = () => {
    const hasEmptyDefectObs = items.some(item => item.status === "defeito" && !item.observation.trim());
    if (hasEmptyDefectObs) {
      setToastMessage("Por favor, preencha as observações técnicas para os itens não conformes.");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    setIsProcessing(true);
    setToastMessage("Transmitindo relatório técnico de auditoria NBR...");
    setTimeout(() => {
      setIsProcessing(false);
      setToastMessage("Relatório de validação de conformidade técnica transmitido com sucesso!");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  // Métricas
  const totalChecked = items.length; // 6 itens na tela
  const compliantCount = items.filter(i => i.status === "conforme").length;
  const nonCompliantCount = items.filter(i => i.status === "defeito").length;

  const acessibilidadeItems = items.filter(i => i.category === "acessibilidade");
  const desempenhoItems = items.filter(i => i.category === "desempenho");
  const sustentabilidadeItems = items.filter(i => i.category === "sustentabilidade");

  return (
    <div className="bg-surface text-primary min-h-screen pb-24 md:pb-0 flex flex-col font-sans">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="pt-24 px-4 md:p-10 max-w-7xl mx-auto w-full space-y-10">
            
            {/* Mensagem Toast */}
            {toastMessage && (
              <div className="bg-[#001e40] text-white p-4 rounded-xl flex items-center gap-3 shadow-md animate-fade-in z-30 select-none max-w-md">
                <CheckCircle2 className="w-5 h-5 text-secondary shrink-0" />
                <span className="text-xs font-semibold">{toastMessage}</span>
              </div>
            )}

            {/* Cabeçalho da Rota */}
            <div className="space-y-1">
              <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
                <span>Vistorias Técnicas</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-350" />
                <span className="text-secondary font-black">Conformidade NBR</span>
              </nav>
              <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight mt-2 select-none">
                Checklist de Auditoria Técnica
              </h1>
              <p className="text-slate-500 text-xs font-semibold select-none leading-relaxed max-w-2xl">
                Relatório de conformidade arquitetônica para certificação de torres residenciais e habitabilidade institucional.
              </p>
            </div>

            {/* Layout em Bento Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: Itens do Checklist */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Acessibilidade (NBR 9050) */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-secondary rounded-lg">
                        <Accessibility className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-[#001e40] uppercase tracking-wide">Acessibilidade (NBR 9050)</h2>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Parâmetros antropométricos e requisitos de projeto</p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-secondary text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider">RF084</span>
                  </div>

                  <div className="divide-y divide-slate-100/80 space-y-6">
                    {acessibilidadeItems.map((item, idx) => (
                      <div key={item.id} className={`grid grid-cols-1 md:grid-cols-[1fr_200px_300px] gap-4 items-start py-4 ${idx > 0 ? "pt-6 border-t border-slate-100" : "pt-2"}`}>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.code}</span>
                          <p className="text-xs text-[#001e40] font-black">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="flex gap-2 select-none">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "conforme")}
                            className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider border-2 rounded-lg cursor-pointer transition-all ${
                              item.status === "conforme"
                                ? "bg-blue-50 border-secondary text-secondary"
                                : "bg-transparent border-slate-200 text-slate-500 hover:border-secondary hover:text-secondary"
                            }`}
                          >
                            Conforme
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "defeito")}
                            className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider border-2 rounded-lg cursor-pointer transition-all ${
                              item.status === "defeito"
                                ? "bg-red-50 border-red-650 text-red-700"
                                : "bg-transparent border-slate-200 text-slate-500 hover:border-red-650 hover:text-red-700"
                            }`}
                          >
                            Não Conf.
                          </button>
                        </div>
                        <textarea
                          value={item.observation}
                          onChange={(e) => handleObservationChange(item.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-[11px] p-3 min-h-[80px] rounded-xl transition-all font-bold text-slate-700 resize-none"
                          placeholder="Observações técnicas..."
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Desempenho (NBR 15575) */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-secondary rounded-lg">
                        <Activity className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-[#001e40] uppercase tracking-wide">Desempenho (NBR 15575)</h2>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Requisitos técnicos para edificações habitacionais</p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-secondary text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider">RF085</span>
                  </div>

                  <div className="divide-y divide-slate-100/80 space-y-6">
                    {desempenhoItems.map((item, idx) => (
                      <div key={item.id} className={`grid grid-cols-1 md:grid-cols-[1fr_200px_300px] gap-4 items-start py-4 ${idx > 0 ? "pt-6 border-t border-slate-100" : "pt-2"}`}>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.code}</span>
                          <p className="text-xs text-[#001e40] font-black">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="flex gap-2 select-none">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "conforme")}
                            className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider border-2 rounded-lg cursor-pointer transition-all ${
                              item.status === "conforme"
                                ? "bg-blue-50 border-secondary text-secondary"
                                : "bg-transparent border-slate-200 text-slate-500 hover:border-secondary hover:text-secondary"
                            }`}
                          >
                            Conforme
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "defeito")}
                            className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider border-2 rounded-lg cursor-pointer transition-all ${
                              item.status === "defeito"
                                ? "bg-red-50 border-red-650 text-red-700"
                                : "bg-transparent border-slate-200 text-slate-500 hover:border-red-650 hover:text-red-700"
                            }`}
                          >
                            Não Conf.
                          </button>
                        </div>
                        <textarea
                          value={item.observation}
                          onChange={(e) => handleObservationChange(item.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-[11px] p-3 min-h-[80px] rounded-xl transition-all font-bold text-slate-700 resize-none"
                          placeholder="Observações técnicas..."
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Conectividade e Sustentabilidade */}
                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-secondary rounded-lg">
                        <Wifi className="w-5 h-5 shrink-0" />
                      </div>
                      <div>
                        <h2 className="text-sm font-black text-[#001e40] uppercase tracking-wide">Conectividade e Sustentabilidade</h2>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Inovação e eficiência de recursos</p>
                      </div>
                    </div>
                    <span className="bg-blue-50 text-secondary text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider">RF086</span>
                  </div>

                  <div className="divide-y divide-slate-100/80 space-y-6">
                    {sustentabilidadeItems.map((item, idx) => (
                      <div key={item.id} className={`grid grid-cols-1 md:grid-cols-[1fr_200px_300px] gap-4 items-start py-4 ${idx > 0 ? "pt-6 border-t border-slate-100" : "pt-2"}`}>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.code}</span>
                          <p className="text-xs text-[#001e40] font-black">{item.title}</p>
                          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="flex gap-2 select-none">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "conforme")}
                            className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider border-2 rounded-lg cursor-pointer transition-all ${
                              item.status === "conforme"
                                ? "bg-blue-50 border-secondary text-secondary"
                                : "bg-transparent border-slate-200 text-slate-500 hover:border-secondary hover:text-secondary"
                            }`}
                          >
                            Conforme
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(item.id, "defeito")}
                            className={`flex-1 py-2 px-3 text-[10px] font-black uppercase tracking-wider border-2 rounded-lg cursor-pointer transition-all ${
                              item.status === "defeito"
                                ? "bg-red-50 border-red-650 text-red-700"
                                : "bg-transparent border-slate-200 text-slate-500 hover:border-red-650 hover:text-red-700"
                            }`}
                          >
                            Não Conf.
                          </button>
                        </div>
                        <textarea
                          value={item.observation}
                          onChange={(e) => handleObservationChange(item.id, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-[11px] p-3 min-h-[80px] rounded-xl transition-all font-bold text-slate-700 resize-none"
                          placeholder="Observações técnicas..."
                        ></textarea>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

              {/* Coluna Direita: Resumo da Auditoria */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-8 select-none">
                
                <section className="p-8 rounded-2xl bg-primary text-white shadow-sm flex flex-col justify-between">
                  <h3 className="text-base font-black mb-8 flex items-center gap-3 text-white">
                    <ClipboardCheck className="w-5 h-5 text-white shrink-0" />
                    Sumário da Inspeção
                  </h3>

                  <div className="space-y-6 mb-10 text-sm">
                    <div className="flex justify-between items-center pb-4 border-b border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-350">Itens Avaliados</span>
                      <span className="font-black text-white">06 / 24</span>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                      <div className="bg-secondary h-full w-[25%] transition-all"></div>
                    </div>
                    <div className="pt-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{compliantCount} Itens em Conformidade</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-350">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{nonCompliantCount} Não Conformidades Detectadas</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleFinalizeValidation}
                    disabled={isProcessing}
                    className="w-full bg-secondary text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all border-none cursor-pointer text-xs uppercase tracking-widest"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 text-white shrink-0" />
                        <span>FINALIZAR VALIDAÇÃO</span>
                      </>
                    )}
                  </button>
                </section>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/50 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-500">Metadados da Unidade</h4>
                  <div className="space-y-4 text-xs font-bold">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">ID do Empreendimento</p>
                      <p className="text-primary font-black">ED-JARDIM-PRIMAVERA-04</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">Endereço</p>
                      <p className="text-slate-500 font-semibold leading-relaxed">Av. das Palmeiras, 1024 - Centro</p>
                    </div>
                    <div className="pt-2 rounded-xl overflow-hidden shadow-sm">
                      <img 
                        alt="Canteiro de Obra" 
                        className="w-full h-40 object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8AkV3we4IjoP6l9bRBgHtmroeEp6oJcTf0lY5Evzq6DdYP3vSAhQbImi4i9CfCh6jPZ_X7nM6EhXR75IO7fdLepMgu3xDKlt0p4m91eIrZRKDAh5EBfur6XsiHXQN6LR0IEzhdXXlOa_G35KOzdKjZGVz-iPUTo-GvpEOA4d7QAUKO7quSAS040wV_bPdaoQc9zq0zaKtUJKH5IcX2-8emn7iGfgua0ANzZwgDYi65nCub0CsoGj3cfQAj1o6dstfKCl7vfkAgW8" 
                      />
                    </div>
                  </div>
                </div>

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
