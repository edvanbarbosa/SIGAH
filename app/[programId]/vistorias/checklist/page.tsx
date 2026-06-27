// =============================================================================
// app/[programId]/vistorias/checklist/page.tsx
// Tela de Checklist de Vistoria (Passo 13.1)
// Baseada fielmente na tela correspondente do projeto "DESIGN SIGAH" no Stitch.
// =============================================================================

"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useProgram } from "@/lib/hooks/useProgram";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";
import { 
  Zap, 
  Droplet, 
  Paintbrush, 
  Grid as GridIcon, 
  ClipboardCheck, 
  Send, 
  Info,
  CheckCircle,
  Home,
  CheckSquare,
  Calendar,
  Key
} from "lucide-react";

interface ChecklistItemState {
  status: "conforme" | "defeito" | null;
  observation: string;
}

export default function VistoriaChecklistPage() {
  const params = useParams();
  const config = useProgram();
  const programId = params.programId as string;

  // Estado inicial baseado no mockup do Stitch (Quadro de Distribuição inicia com Defeito, outros Conforme)
  const [items, setItems] = useState<Record<string, ChecklistItemState>>({
    tomadas: { status: "conforme", observation: "" },
    quadro: { status: "defeito", observation: "Disjuntor principal apresentando mau contato..." },
    torneiras: { status: "conforme", observation: "" },
    vaso: { status: "conforme", observation: "" },
    paredes: { status: "conforme", observation: "" },
    ceramicas: { status: "conforme", observation: "" },
  });

  const [notification, setNotification] = useState<string | null>(null);

  // Manipulador de status (Conforme / Com Defeito)
  const handleStatusChange = (key: string, status: "conforme" | "defeito") => {
    setItems(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        status,
        // Limpa a observação caso mude para conforme, ou mantém se for defeito
        observation: status === "conforme" ? "" : prev[key].observation
      }
    }));
  };

  // Manipulador de observação
  const handleObservationChange = (key: string, text: string) => {
    setItems(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        observation: text
      }
    }));
  };

  // Envio do formulário
  const handleSubmitChecklist = () => {
    // Validação básica: verificar se algum item com defeito está sem descrição
    const missingDescriptions = Object.entries(items).filter(
      ([_, val]) => val.status === "defeito" && !val.observation.trim()
    );

    if (missingDescriptions.length > 0) {
      setNotification("Por favor, descreva os defeitos encontrados em todos os itens assinalados com irregularidades.");
      return;
    }

    setNotification("Vistoria técnica finalizada e enviada para análise com sucesso!");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Calcula o total de itens respondidos (status não nulo)
  const totalItems = Object.keys(items).length;
  const answeredItemsCount = Object.values(items).filter(item => item.status !== null).length;
  const progressPercentage = (answeredItemsCount / totalItems) * 100;

  return (
    <div className="bg-surface font-sans text-on-surface min-h-screen flex flex-col selection:bg-secondary/10 selection:text-secondary">
      
      {/* 1. Header Reutilizável */}
      <Header programId={programId} />

      <div className="flex flex-grow w-full">
        
        {/* 2. Sidebar Reutilizável */}
        <Sidebar programId={programId} beneficiarioLabel={config.labels.beneficiario + "s"} />

        {/* 3. Área de Conteúdo Principal */}
        <div className="flex-grow w-full xl:pl-72 flex flex-col justify-between">
          
          <main className="w-full max-w-5xl mx-auto px-6 py-10 mb-20 md:mb-8 space-y-8">
            
            {/* Banner de Feedback / Notificação */}
            {notification && (
              <div className={`p-4 rounded-xl flex items-start gap-3 shadow-md border-l-4 animate-fade-in ${
                notification.includes("sucesso")
                  ? "bg-green-50 text-green-800 border-green-600"
                  : "bg-red-50 text-red-800 border-red-600"
              }`}>
                <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  notification.includes("sucesso") ? "text-green-600" : "text-red-600"
                }`} />
                <div>
                  <h4 className="font-bold text-sm">Inspeção Técnica</h4>
                  <p className="text-xs">{notification}</p>
                </div>
              </div>
            )}

            {/* Cabeçalho da Página */}
            <div className="space-y-1">
              <h2 className="text-3xl font-heading font-black text-primary tracking-tight">
                Checklist de Vistoria
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base max-w-2xl">
                Realize a inspeção técnica detalhada do imóvel. Avalie cada sistema e informe irregularidades para garantir a qualidade da entrega.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Coluna Esquerda: Grupos do Checklist */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Categoria: Elétrica */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <Zap className="text-secondary w-6 h-6 shrink-0" />
                    <h3 className="text-lg font-bold text-primary">Elétrica</h3>
                  </div>

                  <div className="space-y-10">
                    
                    {/* Item: Tomadas e Interruptores */}
                    <div className="checklist-item">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          Tomadas e Interruptores
                        </span>
                        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit border border-outline-variant/10">
                          <button 
                            onClick={() => handleStatusChange("tomadas", "conforme")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              items.tomadas.status === "conforme"
                                ? "bg-secondary text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Conforme
                          </button>
                          <button 
                            onClick={() => handleStatusChange("tomadas", "defeito")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              items.tomadas.status === "defeito"
                                ? "bg-[#D32F2F] text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Com Defeito
                          </button>
                        </div>
                      </div>
                      
                      {items.tomadas.status === "defeito" && (
                        <div className="mt-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 animate-fade-in">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                            Descreva o defeito encontrado:
                          </label>
                          <textarea 
                            value={items.tomadas.observation}
                            onChange={(e) => handleObservationChange("tomadas", e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-xs p-4 min-h-[80px] rounded-lg transition-all"
                            placeholder="Descreva as tomadas ou interruptores danificados..."
                          ></textarea>
                        </div>
                      )}
                    </div>

                    {/* Item: Quadro de Distribuição */}
                    <div className="checklist-item">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          Quadro de Distribuição
                        </span>
                        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit border border-outline-variant/10">
                          <button 
                            onClick={() => handleStatusChange("quadro", "conforme")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              items.quadro.status === "conforme"
                                ? "bg-secondary text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Conforme
                          </button>
                          <button 
                            onClick={() => handleStatusChange("quadro", "defeito")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              items.quadro.status === "defeito"
                                ? "bg-[#D32F2F] text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Com Defeito
                          </button>
                        </div>
                      </div>
                      
                      {items.quadro.status === "defeito" && (
                        <div className="mt-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 animate-fade-in">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                            Descreva o defeito encontrado:
                          </label>
                          <textarea 
                            value={items.quadro.observation}
                            onChange={(e) => handleObservationChange("quadro", e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-xs p-4 min-h-[80px] rounded-lg transition-all"
                            placeholder="Ex: Disjuntor principal apresentando mau contato..."
                          ></textarea>
                        </div>
                      )}
                    </div>

                  </div>
                </section>

                {/* Categoria: Hidráulica */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <Droplet className="text-secondary w-6 h-6 shrink-0" />
                    <h3 className="text-lg font-bold text-primary">Hidráulica</h3>
                  </div>

                  <div className="space-y-10">
                    
                    {/* Item: Torneiras e Registros */}
                    <div className="checklist-item">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          Torneiras e Registros
                        </span>
                        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit border border-outline-variant/10">
                          <button 
                            onClick={() => handleStatusChange("torneiras", "conforme")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              items.torneiras.status === "conforme"
                                ? "bg-secondary text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Conforme
                          </button>
                          <button 
                            onClick={() => handleStatusChange("torneiras", "defeito")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              items.torneiras.status === "defeito"
                                ? "bg-[#D32F2F] text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Com Defeito
                          </button>
                        </div>
                      </div>

                      {items.torneiras.status === "defeito" && (
                        <div className="mt-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 animate-fade-in">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                            Descreva o defeito encontrado:
                          </label>
                          <textarea 
                            value={items.torneiras.observation}
                            onChange={(e) => handleObservationChange("torneiras", e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-xs p-4 min-h-[80px] rounded-lg transition-all"
                            placeholder="Descreva problemas com vazamentos ou torneiras..."
                          ></textarea>
                        </div>
                      )}
                    </div>

                    {/* Item: Vaso Sanitário e Descarga */}
                    <div className="checklist-item">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                          Vaso Sanitário e Descarga
                        </span>
                        <div className="flex bg-surface-container-low p-1 rounded-lg w-fit border border-outline-variant/10">
                          <button 
                            onClick={() => handleStatusChange("vaso", "conforme")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                              items.vaso.status === "conforme"
                                ? "bg-secondary text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Conforme
                          </button>
                          <button 
                            onClick={() => handleStatusChange("vaso", "defeito")}
                            className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                              items.vaso.status === "defeito"
                                ? "bg-[#D32F2F] text-white shadow-md border-none"
                                : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                            }`}
                          >
                            Com Defeito
                          </button>
                        </div>
                      </div>

                      {items.vaso.status === "defeito" && (
                        <div className="mt-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 animate-fade-in">
                          <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                            Descreva o defeito encontrado:
                          </label>
                          <textarea 
                            value={items.vaso.observation}
                            onChange={(e) => handleObservationChange("vaso", e.target.value)}
                            className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-xs p-4 min-h-[80px] rounded-lg transition-all"
                            placeholder="Descreva problemas com a bacia, assento ou fluxo de água..."
                          ></textarea>
                        </div>
                      )}
                    </div>

                  </div>
                </section>

                {/* Categoria: Pintura */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <Paintbrush className="text-secondary w-6 h-6 shrink-0" />
                    <h3 className="text-lg font-bold text-primary">Pintura</h3>
                  </div>

                  <div className="checklist-item">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                        Paredes e Teto
                      </span>
                      <div className="flex bg-surface-container-low p-1 rounded-lg w-fit border border-outline-variant/10">
                        <button 
                          onClick={() => handleStatusChange("paredes", "conforme")}
                          className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                            items.paredes.status === "conforme"
                              ? "bg-secondary text-white shadow-md border-none"
                              : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                          }`}
                        >
                          Conforme
                        </button>
                        <button 
                          onClick={() => handleStatusChange("paredes", "defeito")}
                          className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            items.paredes.status === "defeito"
                              ? "bg-[#D32F2F] text-white shadow-md border-none"
                              : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                          }`}
                        >
                          Com Defeito
                        </button>
                      </div>
                    </div>

                    {items.paredes.status === "defeito" && (
                      <div className="mt-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 animate-fade-in">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                          Descreva o defeito encontrado:
                        </label>
                        <textarea 
                          value={items.paredes.observation}
                          onChange={(e) => handleObservationChange("paredes", e.target.value)}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-xs p-4 min-h-[80px] rounded-lg transition-all"
                          placeholder="Descreva manchas, rachaduras ou problemas na pintura..."
                        ></textarea>
                      </div>
                    )}
                  </div>
                </section>

                {/* Categoria: Pisos / Revestimentos */}
                <section className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-3 mb-8">
                    <GridIcon className="text-secondary w-6 h-6 shrink-0" />
                    <h3 className="text-lg font-bold text-primary">Pisos / Revestimentos</h3>
                  </div>

                  <div className="checklist-item">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider">
                        Cerâmicas e Azulejos
                      </span>
                      <div className="flex bg-surface-container-low p-1 rounded-lg w-fit border border-outline-variant/10">
                        <button 
                          onClick={() => handleStatusChange("ceramicas", "conforme")}
                          className={`px-6 py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                            items.ceramicas.status === "conforme"
                              ? "bg-secondary text-white shadow-md border-none"
                              : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                          }`}
                        >
                          Conforme
                        </button>
                        <button 
                          onClick={() => handleStatusChange("ceramicas", "defeito")}
                          className={`px-6 py-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            items.ceramicas.status === "defeito"
                              ? "bg-[#D32F2F] text-white shadow-md border-none"
                              : "text-on-surface-variant hover:bg-surface-container-high border-none bg-transparent"
                          }`}
                        >
                          Com Defeito
                        </button>
                      </div>
                    </div>

                    {items.ceramicas.status === "defeito" && (
                      <div className="mt-4 p-5 bg-surface-container-low rounded-xl border border-outline-variant/20 animate-fade-in">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2 block">
                          Descreva o defeito encontrado:
                        </label>
                        <textarea 
                          value={items.ceramicas.observation}
                          onChange={(e) => handleObservationChange("ceramicas", e.target.value)}
                          className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none text-xs p-4 min-h-[80px] rounded-lg transition-all"
                          placeholder="Descreva cerâmicas rachadas, rejuntes soltos..."
                        ></textarea>
                      </div>
                    )}
                  </div>
                </section>

              </div>

              {/* Coluna Direita: Resumo da Unidade & Instruções */}
              <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-8">
                
                {/* Resumo da Unidade (Design Oficial) */}
                <section className="p-8 rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden bg-primary text-white flex flex-col justify-between">
                  <div className="space-y-8">
                    <h3 className="text-lg font-bold flex items-center gap-3 text-white">
                      <ClipboardCheck className="text-white w-6 h-6 shrink-0" />
                      Resumo da Unidade
                    </h3>

                    <div className="space-y-6 text-sm">
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60">Beneficiário</span>
                        <span className="font-extrabold text-white">Ricardo Mendonça</span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-white/10">
                        <span className="text-xs font-bold uppercase tracking-wider text-white/60">Localização</span>
                        <span className="font-extrabold text-right text-white">Bloco C, Apto 402 — Res. Alvorada</span>
                      </div>
                      <div className="pt-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2 text-white/80">
                          <span>Itens Vistoriados</span>
                          <span>{answeredItemsCount} / {totalItems}</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden bg-white/20">
                          <div 
                            className="bg-secondary h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 space-y-4">
                    <button 
                      onClick={handleSubmitChecklist}
                      className="w-full py-4 text-white font-extrabold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2 bg-secondary border-none cursor-pointer text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Finalizar Vistoria
                    </button>
                    <p className="text-[10px] text-center text-white/60 font-medium italic">
                      Ao finalizar, os dados serão enviados para análise técnica.
                    </p>
                  </div>
                </section>

                {/* Instruções de Apoio */}
                <div className="bg-[#ffdbca]/40 p-6 rounded-xl border border-tertiary-fixed flex items-start gap-3 border-l-4 border-tertiary">
                  <Info className="text-tertiary w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-on-surface text-sm mb-1">Instruções de Apoio</h5>
                    <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed font-medium">
                      Caso identifique um defeito estrutural grave, utilize o campo de observações para detalhar as dimensões e localização exata do problema.
                    </p>
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
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 px-4 md:hidden bg-white/90 dark:bg-[#001e40]/90 backdrop-blur-lg rounded-t-2xl border-t border-[#001e40]/10 shadow-[0_-8px_24px_rgba(0,30,64,0.08)]">
        <a 
          href={`/${programId}/dashboard`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Início</span>
        </a>
        <a 
          href={`/${programId}/vistorias`}
          className="flex flex-col items-center justify-center text-[#0059bb] dark:text-[#0070ea] scale-110"
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5 font-bold">Vistorias</span>
        </a>
        <a 
          href={`/${programId}/vagas`}
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Cotas</span>
        </a>
        <a 
          href="#"
          className="flex flex-col items-center justify-center text-[#001e40]/40 dark:text-white/40"
        >
          <Key className="w-5 h-5" />
          <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">Entregas</span>
        </a>
      </nav>

    </div>
  );
}
